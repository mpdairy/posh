(ns posh.tree.core
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]
            [posh.tree.update :as u]
            [posh.tree.db :as db]
            [posh.tree.graph :as graph]
            [clojure.core.match :refer [match]]))

;; cache - {storage-key {analysis-info...}} stores info about components
;; graph - {storage-key {:outputs [keys...] :inputs [keys ...]}}
;;         used to pass tx around tree
;; dcfg - map of datascript/datomic functions
;; retrieve - vector of what you want from the queries
;;            :results - query results
;;            :datoms  - datoms needed in empty db to get the same results
;;            :datoms-t - ditto but with transaction t for each datom
;; conns - {db-id conn ...}
;; schemas - {db-id schema ..}
;; txs - {conn tx ...} stores any txs waiting to really transact!
;; filter-preds - {db-id filter-pred-symbol}
;;                resolves filter-pred-symbol to make base db filter
;; dbs - {db-id db ...} these get updated every process-tx! and are built
;;       using filter-preds if they are there


(defn empty-tree [{:keys [q pull filter entid db] :as dcfg} retrieve]
  {:cache {}
   :graph {}
   :dcfg dcfg
   :retrieve retrieve
   :conns {}
   :schemas {}
   :txs {}
   :filter-preds {}
   :dbs {}})

(defn add-db [{:keys [conns schemas dbs cache graph] :as posh-tree} db-id conn schema db]
  (let [storage-key [:db db-id]]
    (merge
     posh-tree
     {:conns (assoc conns db-id conn)
      :schemas (assoc schemas db-id schema)
      :return storage-key
      :dbs (assoc dbs db-id db)
      :cache (merge cache {storage-key {:pass-patterns [[]]}})
      :graph (graph/add-item-full graph storage-key [] [])})))

(defn set-db [{:keys [dbs graph cache] :as posh-tree} db-id db]
  (let [storage-key [:db db-id]]
    (merge
     posh-tree
     {:dbs (assoc dbs db-id db)
      :cache (merge cache {storage-key {:pass-patterns [[]]}})
      :graph (graph/add-item-full graph storage-key [] [])})))

(defn set-filter-pred)

(defn add-filter-tx [{:keys [cache graph] :as posh-tree} poshdb tx-patterns]
  (let [storage-key   [:filter-tx poshdb tx-patterns]
        cached-filter (or (get cache storage-key)
                          {:pass-patterns tx-patterns})]
    (merge
     posh-tree
     {:graph (graph/add-item-connect graph storage-key [poshdb])
      :cache (assoc cache storage-key cached-filter)})))

(defn add-filter-pull [{:keys [cache graph dcfg conns conns-by-id] :as posh-tree}
                       poshdb pull-pattern eid]
  (let [storage-key [:filter-pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (merge
       posh-tree
       {:graph (graph/add-item-connect graph storage-key [poshdb])
        :cache (assoc cache storage-key
                      (u/update-filter-pull posh-tree storage-key))}))))

(defn add-filter-q [{:keys [graph cache dcfg retrieve conns conns-by-id] :as posh-tree} query & args]
  (let [storage-key [:filter-q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [{:keys [analysis dbvarmap]} (u/update-q-with-dbvarmap posh-tree storage-key)]
          (merge
           posh-tree
           {:graph (graph/add-item-connect graph storage-key (vals dbvarmap))
            :cache (assoc cache storage-key
                          (u/filter-q-transform-analysis analysis))})))))


;; ==================  queries ====================

(defn add-pull [{:keys [graph cache dcfg conns conns-by-id retrieve] :as posh-tree} poshdb pull-pattern eid]
  (let [storage-key [:pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (let [analysis (merge
                      {:tx-t 0}
                      (u/update-pull posh-tree storage-key))]
        (merge
         posh-tree
         {:graph (graph/add-item-connect graph storage-key [poshdb])
          :cache (assoc cache storage-key analysis)})))))

(defn add-q [{:keys [cache graph dcfg conns conns-by-id retrieve] :as posh-tree} query & args]
  (let [storage-key [:q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [{:keys [analysis dbvarmap]} (u/update-q-with-dbvarmap posh-tree storage-key)]
          (merge
           posh-tree
           {:graph (graph/add-item-connect graph storage-key (vals dbvarmap))
            :cache (assoc cache storage-key analysis)})))))



;; ======================= updating tree when there are TX's ======================

(declare cache-changes)
(defn cache-changes-across [posh-tree db-id tx new-cache storage-keys]
  (if (empty? storage-keys)
    new-cache
    (recur posh-tree db-id tx
           (merge new-cache
                  (cache-changes posh-tree db-id tx new-cache (first storage-keys)))
           (rest storage-keys))))

(defn cache-changes [{:keys [graph cache] :as posh-tree} db-id tx new-cache storage-key]
  (if (get new-cache storage-key)
    {}
    (let [current-analysis  (get cache storage-key)
          reloaded          (when (dm/any-datoms-match?
                                   (get (:reload-patterns current-analysis) db-id)
                                   tx)
                              ((resolve (:reload-fn current-analysis)) posh-tree storage-key))
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

(defn process-tx! [{:keys [txs conns dcfg] :as posh-tree}]
  (let [transact-results       (map (fn [conn tx]
                                      {:conn conn
                                       :results ((:transact! dcfg) conn tx)}) txs)
        db-ids-by-conn         (group-db-ids-by-conn conns)
        posh-tree-with-new-dbs (reduce (fn [new-posh-tree
                                           {:keys [results conn]}]
                                         ))]


    )
  )

