(ns posh.lib.db
  (:require [posh.lib.datom-matcher :as dm]))

(defn get-parent-db [poshdb]
  (case (first poshdb)
    :db nil
    :filter-tx (second poshdb)
    :filter-pull (second poshdb)
    :filter-q (first (nth poshdb 2))))

(defn get-db-path [poshdb]
  (loop [path []
         pdb  poshdb]
    (if pdb
      (recur (cons pdb path) (get-parent-db pdb))
      path)))

(defn db-id->conn [posh-tree db-id]
  (get (:conns posh-tree) db-id))

(defn db-id->schema [posh-tree db-id]
  (get (:schemas posh-tree) db-id))

(defn db-id->db [posh-tree db-id]
  (get (:dbs posh-tree) db-id))

(defn poshdb->db-id [poshdb]
  (if (= (first poshdb) :db)
    (second poshdb)
    (recur (get-parent-db poshdb))))

(defn db-id->attrs [posh-tree db-id]
  {:conn    (db-id->conn posh-tree db-id)
   :schema  (db-id->schema posh-tree db-id)
   :db      (db-id->db posh-tree db-id)
   :db-id db-id})

(defn poshdb->attrs [posh-tree poshdb]
  (db-id->attrs posh-tree (poshdb->db-id poshdb)))

(defn make-filter-pred [tx-patterns]
  (fn [_ datom]
    (dm/datom-match? tx-patterns datom)))

(defn generate-initial-db
  ([dcfg conn filters] (generate-initial-db dcfg conn filters nil))
  ([dcfg conn filters db]
     (let [{:keys [filter as-of since with]} filters
           ;; generate db (order matters, or I would use reduce)
           db (or db ((:db dcfg) conn)) ;; create initial db
           db (if since ((:since dcfg) db since) db)  ;; since t
           db (if as-of ((:as-of dcfg) db as-of) db)  ;; as-of t
           db (if with (:db-after ((:with dcfg) db with)) db)  ;; with tx-data
           db (if filter
                ((:filter dcfg) db (if (symbol? filter)
                                     #?(:clj (resolve filter) :cljs nil)
                                     filter))
                db) ;; filter pred-sym
           ]
       db)))

(defn poshdb->db [{:keys [dcfg cache] :as posh-tree}  poshdb]
  (if (= (first poshdb) :db)
    (db-id->db posh-tree (second poshdb))
    ((:filter dcfg)
     (poshdb->db posh-tree (get-parent-db poshdb))
     (make-filter-pred (:pass-patterns (get cache poshdb))))))


(defn poshdb->analyze-db [posh-tree poshdb]
  (let [db-id (poshdb->db-id poshdb)]
    {:db (poshdb->db posh-tree poshdb)
     :conn (db-id->conn posh-tree db-id)
     :schema (db-id->schema posh-tree db-id)
     :db-id db-id}))
