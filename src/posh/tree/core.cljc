(ns posh.tree.core
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]
            [posh.tree.update :as u]
            [posh.tree.db :as db]
            [clojure.core.match :refer [match]]))

(defn add-conn [{:keys [conns schemas] :as posh-tree} conn-id conn schema]
  (merge
   posh-tree
   {:conns (assoc conns conn-id conn)
    :schemas (assoc schemas conn-id schema)}))

(defn set-db [{:keys [tree dbs] :as posh-tree} conn-id db]
  (merge
   posh-tree
   {:dbs (assoc dbs conn-id db)
    :tree (merge {[:db conn-id] {}} tree)}))

(defn add-item [tree poshdb k v]
  (println "adding: " k)
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

(defn add-filter-pull [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree}
                       poshdb pull-pattern eid]
  (let [storage-key [:filter-pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (merge
       posh-tree
       {:tree (add-item tree poshdb storage-key {})
        :cache (assoc cache storage-key
                      (u/update-filter-pull posh-tree  storage-key))}))))

(defn add-filter-q [{:keys [tree cache dcfg retrieve conns conns-by-id] :as posh-tree} query & args]
  (let [storage-key [:filter-q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [{:keys [analysis dbvarmap]} (u/update-q posh-tree storage-key)]
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

(defn add-pull [{:keys [tree cache dcfg conns conns-by-id retrieve] :as posh-tree} poshdb pull-pattern eid]
  (let [storage-key [:pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (let [analysis (merge
                      {:tx-t 0}
                      (u/update-pull posh-tree storage-key))]
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

(defn extract-conn-ids [poshdbs]
  (if (empty? poshdbs)
    #{}
    (conj (extract-conn-ids (rest poshdbs)) (db/poshdb->conn-id (first poshdbs)))))

(defn add-q [{:keys [tree cache dcfg conns conns-by-id retrieve] :as posh-tree} query & args]
  (let [storage-key [:q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [{:keys [analysis dbvarmap]} (u/update-q posh-tree storage-key)]
          (merge
           posh-tree
           {
            :tree (loop [tree tree
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

(defn update-cache [{:keys [retrieve] :as posh-tree} tree cache tx]
  (if (empty? tree)
    {}
    (merge
     cache
     (update-cache posh-tree (rest tree) cache tx)
     (let [[k v]        (first tree)
           old-analysis (get cache k)
           dm?          (dm/any-datoms-match? (:patterns old-analysis) tx)
           analysis     (or (when dm?
                              (u/update-posh-item posh-tree k))
                            old-analysis)]
       (if (not= v :query)
         (let [prop-tx  (filter #(dm/datom-match? (:filter-patterns analysis) %) tx)]
           (merge (when (not (empty? prop-tx))
                    (update-cache posh-tree v cache prop-tx))
                  (when dm? {k analysis})))
         {k analysis})))))



;; call after you transact! to a conn
;; tree is a [k v] for the conn like [[:db :conn-id] {...}]

(comment

  {:db1 {:q1 :query
         :pull2 :query
         :db2 {:pull3 :query
               :pull4 :query}}
   :db3 {:q5 :query
         :pull6 :query}}

  [[:db [[:q] [:pull] [:db]]]]

  )

(defn cache-updates [posh-tree ])

(declare cache-updates-for-conn-id)
(defn cache-updates-db [posh-tree db-analysis conn-id tx children siblings new-cache]
  (let [matching-tx    (dm/matching-datoms
                        (:filter-patterns db-analysis)
                        tx)
        children-cache (cache-updates-for-conn-id
                        posh-tree children new-cache conn-id matching-tx)]
    (cache-updates-for-conn-id posh-tree siblings
                               (merge children-cache new-cache)
                               conn-id
                               tx)))


;;; needs to take map of {conn-id tx} and update all,
;; cycling through the tx's for various conns
(defn cache-updates-for-conn-id [posh-tree tree new-cache conn-id tx]
  (println (ffirst tree))
  (match [(vec tree) tx]
         [_ []] {}

         [[] _] {}

         ;; queries
         [[[query-key :query] & siblings] tx]
         (merge
          (match [new-cache (:cache posh-tree)]

                 [{query-key _} _] {}

                 [_ {query-key query-analysis}]
                 (if (dm/any-datoms-match?  (get (:patterns query-analysis) conn-id) tx)
                   {query-key (u/update-posh-item posh-tree query-key)}
                   {}))
          (cache-updates-for-conn-id posh-tree siblings new-cache conn-id tx))

         ;; db's, filters, with, merged filters
         [[[db-key children] & siblings] tx]
         (match [new-cache (:cache posh-tree)]

                [{db-key db-analysis} _]
                (cache-updates-db
                 posh-tree db-analysis conn-id tx children siblings new-cache)

                [_ {db-key db-analysis}]
                (if (dm/any-datoms-match?  (get (:patterns db-analysis) conn-id) tx)
                  (cache-updates-for-conn-id
                   posh-tree
                   tree
                   (merge {db-key (u/update-posh-item posh-tree db-key)})
                   conn-id
                   tx)
                  (cache-updates-db
                   posh-tree db-analysis conn-id tx children siblings new-cache)))))

(comment
  (defn cache-changes [dcfg retrieve tree current-cache new-cache tx]
    (let [[k v]           tree]
      (if (get updated-cache k)
        {}
        (let [old-analysis (get (:cache posh-tree) k)
              dm?          (dm/any-datoms-match? (:patterns old-analysis) tx)
              analysis     (or (when dm?
                                 (u/update-posh-item posh-tree (cons :patterns retrieve) k))
                               old-analysis)]
          (if (not= v :query)
            (let [prop-tx  (filter #(dm/datom-match? (:filter-patterns analysis) %) tx)]
              (merge (when (not (empty? prop-tx))
                       (update-cache posh-tree retrieve v cache prop-tx))
                     (when dm? {k analysis})))
            {k analysis})))
      (comment (apply
                merge
                (map #(update-cache posh-tree retrieve % changed tx)))))
    ))



