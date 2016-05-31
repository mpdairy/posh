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

(defn empty-tree [{:keys [q pull filter entid db] :as dcfg} retrieve]
  {:cache {}
   :graph {}
   :dcfg dcfg
   :retrieve retrieve
   :conns {}
   :schemas {}
   :dbs {}})

(defn add-db [{:keys [conns schemas dbs cache graph] :as posh-tree} db-id conn schema db]
  (let [storage-key [:db db-id]]
    (merge
     posh-tree
     {:conns (assoc conns db-id conn)
      :schemas (assoc schemas db-id schema)
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


