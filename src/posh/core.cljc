(ns posh.core
  (:require [posh.lib.util :as util]
            [posh.lib.datom-matcher :as dm]
            [posh.lib.pull-analyze :as pa]
            [posh.lib.q-analyze :as qa]
            [posh.lib.update :as u]
            [posh.lib.db :as db]
            [posh.lib.graph :as graph]))

;; cache - {storage-key {analysis-info...}} stores info about components
;; graph - {storage-key {:outputs #{keys...} :inputs #{keys ...}}}
;;         used to pass tx around tree
;; dcfg - map of datascript/datomic functions
;; retrieve - vector of what you want from the queries
;;            :results - query results
;;            :datoms  - datoms needed in empty db to get the same results
;;            :datoms-t - ditto but with transaction t for each datom
;; conns - {db-id conn ...}
;; schemas - {db-id schema ..}
;; txs - {conn tx ...} stores any txs waiting to really transact!
;; dbs - {db-id db ...} these get updated every process-tx! and are built
;;       using filter-preds if they are there
;; filter, as-of, with, since get added to db

(defn empty-tree [{:keys [q pull filter entid db] :as dcfg} retrieve]
  {:cache {}
   :graph {}
   :dcfg dcfg
   :retrieve retrieve
   :conns {}
   :schemas {}
   :txs {}
   :dbs {}
   :filters {}})
   ;; {db-id {:filter pred :as-of t :with tx-data :since t}}


(defn add-db
  ([posh-tree db-id conn schema] (add-db posh-tree db-id conn schema nil))
  ([{:keys [dcfg conns schemas dbs cache graph] :as posh-tree}
    db-id conn schema base-filters]
   (let [storage-key [:db db-id]]
     (merge
      posh-tree
      {:conns (assoc conns db-id conn)
       :schemas (assoc schemas db-id schema)
       :filters (assoc (:filters posh-tree) db-id base-filters)
       :return storage-key
       :dbs (assoc dbs db-id (db/generate-initial-db dcfg conn base-filters))
       :cache (merge cache {storage-key {:pass-patterns [[]]}})
       :graph (graph/add-item-full graph storage-key [] [])}))))

(defn set-db
  ([posh-tree db-id db] (set-db posh-tree db-id db nil))
  ([{:keys [dbs graph cache] :as posh-tree} db-id db filter-pred]
   (let [storage-key [:db db-id]]
     (merge
      posh-tree
      {:dbs (assoc dbs db-id db)
       :cache (merge cache {storage-key {:pass-patterns [[]]}})
       :graph (graph/add-item-full graph storage-key [] [])}))))

(defn add-filter-tx [{:keys [cache graph] :as posh-tree} poshdb tx-patterns]
  (let [storage-key [:filter-tx poshdb tx-patterns]
        cached      (get cache storage-key)]
    (assoc
        (if cached
          posh-tree
          (merge
           posh-tree
           {:graph (graph/add-item-connect graph storage-key [poshdb])
            :cache (assoc cache storage-key {:pass-patterns tx-patterns})}))
      :return storage-key)))

(defn add-filter-pull [{:keys [cache graph dcfg conns conns-by-id] :as posh-tree}
                       poshdb pull-pattern eid]
  (let [storage-key [:filter-pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (assoc
        (if cached
          posh-tree
          (merge
           posh-tree
           {:graph (graph/add-item-connect graph storage-key [poshdb])
            :cache (assoc cache storage-key
                          (u/update-filter-pull posh-tree storage-key))}))
      :return storage-key)))

(defn add-filter-q [{:keys [graph cache dcfg retrieve conns conns-by-id] :as posh-tree} query & args]
  (let [storage-key [:filter-q query args]
        cached      (get cache storage-key)]
    (assoc
        (if cached
          posh-tree
          (let [{:keys [analysis dbvarmap]} (u/update-q-with-dbvarmap posh-tree storage-key)]
            (merge
             posh-tree
             {:graph (graph/add-item-connect graph storage-key (vals dbvarmap))
              :cache (assoc cache storage-key
                            (u/filter-q-transform-analysis analysis))})))
      :return storage-key)))


;; ==================  queries ====================

(defn add-pull [{:keys [graph cache dcfg conns conns-by-id retrieve] :as posh-tree} poshdb pull-pattern eid]
  (let [storage-key [:pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (assoc
        (if cached
          posh-tree
          (let [analysis (merge
                          {:tx-t 0}
                          (u/update-pull posh-tree storage-key))]
            (merge
             posh-tree
             {:graph (graph/add-item-connect graph storage-key [poshdb])
              :cache (assoc cache storage-key analysis)})))
      :return storage-key)))

(defn add-q [{:keys [cache graph dcfg conns retrieve] :as posh-tree} query & args]
  (let [storage-key [:q query args]
        cached      (get cache storage-key)]
    (assoc
        (or cached
            (let [{:keys [analysis dbvarmap]} (u/update-q-with-dbvarmap posh-tree storage-key)]
              (merge
               posh-tree
               {:graph (graph/add-item-connect graph storage-key (vals dbvarmap))
                :cache (assoc cache storage-key analysis)})))
      :return storage-key)))

;; ======================= remove items ===================

(defn remove-item [{:keys [graph cache] :as posh-tree} storage-key]
  (assoc posh-tree
    :graph (graph/remove-item graph storage-key)
    :cache (dissoc cache storage-key)))


;; ======================= updating tree when there are TX's ======================

(defn cache-changes [{:keys [graph cache] :as posh-tree} db-id tx new-cache storage-key]
  (if (get new-cache storage-key)
    {}
    (let [current-analysis  (get cache storage-key)
          reloaded          (when (dm/any-datoms-match?
                                   (get (:reload-patterns current-analysis) db-id)
                                   tx)
                              ((:reload-fn current-analysis) posh-tree storage-key))
          analysis          (or reloaded current-analysis)
          {:keys [outputs]} (get graph storage-key)
          children-cache    (when-let
                                [pass-tx (and (not (empty? outputs))
                                              (:pass-patterns analysis)
                                              (dm/matching-datoms
                                               (:pass-patterns analysis)
                                               tx))]

                              (reduce
                               (fn [acc k]
                                 (merge acc
                                        (cache-changes posh-tree db-id pass-tx acc k)))
                               new-cache
                               outputs))]
      (merge children-cache
             (when reloaded
               {storage-key reloaded})
             {}))))


;; ======================= transact ======================


;; we store the new transactions in the posh-tree under the db-id.
;; when it comes time to actually transact, we group them by conn,
;; transact! them to the conns, then run them through the tree.

;; add-tx just stores them in the tree; process-tx! actually does the deed

;; later this should reconcile duplicates, break apart maps, etc.
(defn merge-txs [oldtx newtx]
  (concat newtx oldtx))

(defn add-tx [{:keys [txs conns] :as posh-tree} poshdb tx]
  (let [conn (get conns (db/poshdb->db-id poshdb))]
    (assoc posh-tree :txs
           (assoc txs conn
                  (merge-txs (get txs conn) tx)))))

(defn group-db-ids-by-conn [conns]
  (reduce-kv
   (fn [m k v] (assoc m k (map first v)))
   {}
   (group-by second conns)))


(defn after-transact [{:keys [conns dcfg dbs filters cache] :as posh-tree} conns-results]
  (let [new-dbs       (apply merge
                             (for [[db-id conn] conns]
                               (if (get conns-results conn)
                                 {db-id (db/generate-initial-db
                                         dcfg conn (get filters db-id)
                                         (:db-after (get conns-results conn)))}
                                 {db-id (get dbs db-id)})))
        new-posh-tree (assoc posh-tree :dbs new-dbs)
        changed-cache (reduce (fn [changed [db-id conn]]
                                (merge
                                 changed
                                 (cache-changes new-posh-tree
                                                db-id
                                                (:tx-data (get conns-results conn))
                                                changed
                                                [:db db-id])))
                              {} conns)
        really-changed (reduce-kv (fn [m k v]
                                    (if (not= v (get cache k))
                                      (assoc m k v)
                                      m))
                                  {} changed-cache)]
    (merge new-posh-tree
           {:cache (merge cache really-changed)
            :changed really-changed})))

(defn process-tx! [{:keys [dcfg txs] :as posh-tree}]
  (let [conns-results (reduce-kv (fn [m conn tx]
                                   (assoc m conn
                                          ((:transact! dcfg) conn tx)))
                                 {}
                                 txs)]
    (after-transact (assoc posh-tree :txs {}) conns-results)))


