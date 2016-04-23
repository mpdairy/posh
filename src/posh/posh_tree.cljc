(ns posh.posh-tree
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]))

(defn get-parent-db [poshdb]
  (if (= (first poshdb) :db)
    nil
    (second poshdb)))

(defn get-db-path [poshdb]
  (loop [path []
         pdb  poshdb]
    (if pdb
      (recur (cons pdb path) (get-parent-db pdb))
      path)))

(defn get-conn-attrs [posh-tree conn]
  (get (:conns posh-tree) conn))

(defn get-conn-id-attrs [posh-tree conn-id]
  (get (:conns-by-id posh-tree) conn-id))

(defn conn->id [posh-tree conn]
  (:id (get (:conns posh-tree) conn)))

(defn id->conn [posh-tree id]
  (:conn (get (:conns-by-id posh-tree) id)))

(defn poshdb->attrs [posh-tree poshdb]
  (->> (poshdb->conn-id poshdb)
       (id->conn posh-tree)
       (get-conn-attrs posh-tree)))

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
   {:tree (merge {[:db (conn->id posh-tree conn)] {}} tree)}))

;;poshdb is just a key of ancestor dbs
;;must navigate through the posh-tree from the inmost poshdb db


;;example:
[:filter-tx [:db] '[[_ #{:task/name :person/name :category/name}]]]

(defn add-item [tree poshdb k v]
  (update-in tree
             (get-db-path poshdb)
             #(merge {k v} %)))

(defn rm-item [tree poshdb key]
  (update-in tree
             (get-db-path poshdb)
             #(dissoc % key)))

(defn add-filter-tx [{:keys [tree cache] :as posh-tree} poshdb tx-patterns]
  (let [storage-key   [:filter-tx poshdb tx-patterns]
        cached-filter (or (get cache storage-key)
                          {:filter-pred
                           (fn [_ datom]
                             (dm/datom-match? tx-patterns datom))})]
    (merge
     posh-tree
     {:tree (add-item tree poshdb storage-key {})
      :cache (assoc cache storage-key cached-filter)})))

(defn rm-filter-tx [posh-tree poshdb tx-patterns]
  (merge posh-tree
         {:tree
          (rm-item (:tree posh-tree) poshdb [:filter-tx poshdb tx-patterns])}))

;;queries

(defn poshdb->conn-id [poshdb]
  (if (= (first poshdb) :db)
    (second poshdb)
    (recur (get-parent-db poshdb))))

(defn poshdb->db [{:keys [dcfg cache] :as posh-tree}  poshdb]
  (if (= (first poshdb) :db)
    ((:db dcfg) (id->conn posh-tree (second poshdb)))
    ((:filter dcfg)
     (poshdb->db posh-tree (get-parent-db poshdb))
     (:filter-pred (get cache poshdb)))))

(defn add-pull [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree} retrieve poshdb pull-pattern eid]
  (let [storage-key [:pull poshdb pull-pattern eid]
        cached      (get cache storage-key)]
    (if cached
      posh-tree
      (let [retrieve (if (some #{:patterns} retrieve)
                       retrieve
                       (cons :patterns retrieve))
            analysis (pa/pull-analyze dcfg
                                      retrieve
                                      (:schema (poshdb->attrs posh-tree poshdb))
                                      (poshdb->db posh-tree poshdb)
                                      pull-pattern
                                      eid)]
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

(comment)

(defn add-q [{:keys [tree cache dcfg conns conns-by-id] :as posh-tree} retrieve query & args]
  (let [storage-key [:q query args]
        cached      (get cache storage-key)]
    (or cached
        (let [retrieve   (if (some #{:patterns} retrieve) retrieve
                             (cons :patterns retrieve))
              qm         (qa/query-to-map query)
              dbvarmap   (qa/make-dbarg-map (:in qm) args)
              poshdbs    (vals dbvarmap)
              poshdbmap  (->> dbvarmap
                              (map (fn [[db-sym poshdb]]
                                     (let [db    (poshdb->db posh-tree poshdb)
                                           attrs (poshdb->attrs posh-tree poshdb)]
                                       {db-sym
                                        {:conn (:conn attrs)
                                         :db db
                                         :key poshdb
                                         :schema (:schema attrs)}})))
                              (apply merge))
              fixed-args (->> (zipmap (:in qm) args)
                              (map (fn [[sym arg]]
                                     (or (get poshdbmap sym) arg))))
              analysis   (apply
                          (partial qa/q-analyze dcfg retrieve query)
                          fixed-args)]
          (merge
           posh-tree
           {:tree (loop [tree tree
                         poshdbs (vals dbvarmap)]
                    (if (empty? poshdbs)
                      tree
                      (recur (add-item tree (first poshdbs) storage-key :query)
                             (rest poshdbs))))
            :cache (assoc cache storage-key analysis)})))))

;; calculating the tree
(defn tree-calc-tx [posh-tree cache tx tx-t]
  
  )

