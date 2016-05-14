(ns posh.tree.core
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]
            [posh.tree.update :as u]
            [posh.tree.db :as db]))

(defn add-conn [{:keys [conns conns-by-id] :as posh-tree} conn schema unique-id]
  (merge
   posh-tree
   {:conns (merge {conn {:schema schema
                         :id     unique-id
                         :conn   conn}}
                  conns)
    :conns-by-id (merge {unique-id {:schema schema
                                    :id     unique-id
                                    :conn   conn}}
                        conns-by-id)}))

(defn add-db [{:keys [tree] :as posh-tree} conn]
  (merge
   posh-tree
   {:tree (merge {[:db (db/conn->id posh-tree conn)] {}} tree)}))

(defn add-item [tree poshdb k v]
  (update-in tree
             (db/get-db-path poshdb)
             #(merge {k v} %)))

(defn rm-item [tree poshdb key]
  (update-in tree
             (db/get-db-path poshdb)
             #(dissoc % key)))

(defn add-filter-tx [{:keys [tree cache] :as posh-tree} poshdb tx-patterns]
  (let [storage-key   [:filter-tx poshdb tx-patterns]
        cached-filter (or (get cache storage-key)
                          {:filter-patterns tx-patterns})]
    (merge
     posh-tree
     {:tree (add-item tree poshdb storage-key {})
      :cache (assoc cache storage-key cached-filter)})))

(defn add-filter-pull [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree} poshdb pull-pattern eid]
  (let [storage-key [:filter-pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (merge
       posh-tree
       {:tree (add-item tree poshdb storage-key {})
        :cache (assoc cache storage-key
                      (u/update-filter-pull posh-tree [:patterns]  storage-key))}))))

(defn add-filter-q [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree} query & args]
  (let [storage-key [:filter-q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [{:keys [analysis dbvarmap]} (u/update-q posh-tree retrieve storage-key)]
          (merge
           posh-tree
           {:tree (loop [tree tree
                         poshdbs (vals dbvarmap)]
                    (if (empty? poshdbs)
                      tree
                      (recur (add-item tree (first poshdbs) storage-key :query)
                             (rest poshdbs))))
            :cache (assoc cache storage-key analysis)})))))

(defn rm-filter-tx [posh-tree poshdb tx-patterns]
  (merge posh-tree
         {:tree
          (rm-item (:tree posh-tree) poshdb [:filter-tx poshdb tx-patterns])}))

;;queries

(defn add-pull [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree} retrieve poshdb pull-pattern eid]
  (let [storage-key [:pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (let [retrieve (if (some #{:patterns} retrieve)
                       retrieve
                       (cons :patterns retrieve))
            analysis (merge
                      {:tx-t 0}
                      (u/update-pull posh-tree retrieve storage-key))]
        (merge
         posh-tree
         {:tree (add-item tree poshdb storage-key :query)
          :cache (assoc cache storage-key analysis)})))))

(defn rm-pull [{:keys [tree cache] :as posh-tree} poshdb pull-pattern eid]
  (let [storage-key [:pull poshdb pull-pattern eid]]
    (merge
     posh-tree
     {:tree (rm-item tree poshdb storage-key)
      :cache (dissoc cache storage-key)})))

(defn add-q [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree} retrieve query & args]
  (let [storage-key [:q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [{:keys [analysis dbvarmap]} (u/update-q posh-tree retrieve storage-key)]
          (merge
           posh-tree
           {:tree (loop [tree tree
                         poshdbs (vals dbvarmap)]
                    (if (empty? poshdbs)
                      tree
                      (recur (add-item tree (first poshdbs) storage-key :query)
                             (rest poshdbs))))
            :cache (assoc cache storage-key analysis)})))))

(defn needs-update [tree cache tx]
  "returns first level of things that need updates"
  (loop [treels   tree
         updates []]
    (if (empty? treels)
      updates
      (let [[k v] (first treels)]
        (recur (rest treels)
               (if (dm/any-datoms-match? (:patterns (get cache k)) tx)
                 (cons [k v] updates)
                 updates))))))

(defn update-cache [posh-tree retrieve tree cache tx]
  (if (empty? tree)
    {}
    (merge
     cache
     (update-cache posh-tree retrieve (rest tree) cache tx)
     (let [[k v]        (first tree)
           old-analysis (get cache k)
           dm?          (dm/any-datoms-match? (:patterns old-analysis) tx)
           analysis     (or (when dm?
                              (u/update-posh-item posh-tree (cons :patterns retrieve) k))
                            old-analysis)]
       (if (not= v :query)
         (let [prop-tx  (filter #(dm/datom-match? (:filter-patterns analysis) %) tx)]
           (merge (when (not (empty? prop-tx))
                    (update-cache posh-tree retrieve v cache prop-tx))
                  (when dm? {k analysis})))
         {k analysis})))))

(defn cache-delta [posh-tree retrieve tree cache tx]
  (if (empty? tree)
    {}
    (merge
     cache
     (update-cache posh-tree retrieve (rest tree) cache tx)
     (let [[k v]        (first tree)
           old-analysis (get cache k)
           dm?          (dm/any-datoms-match? (:patterns old-analysis) tx)
           analysis     (or (when dm?
                              (u/update-posh-item posh-tree (cons :patterns retrieve) k))
                            old-analysis)]
       (if (not= v :query)
         (let [prop-tx  (filter #(dm/datom-match? (:filter-patterns analysis) %) tx)]
           (merge (when (not (empty? prop-tx))
                    (update-cache posh-tree retrieve v cache prop-tx))
                  (when dm? {k analysis})))
         {k analysis})))))

(defn conn-calc-tx [{:keys [cache tree] :as posh-tree} conn-id retrieve tx]
  
  )

