(ns posh.tree.db
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
