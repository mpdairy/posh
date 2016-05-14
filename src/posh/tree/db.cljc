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

(defn get-conn-attrs [posh-tree conn]
  (get (:conns posh-tree) conn))

(defn get-conn-id-attrs [posh-tree conn-id]
  (get (:conns-by-id posh-tree) conn-id))

(defn conn->id [posh-tree conn]
  (:id (get (:conns posh-tree) conn)))

(defn id->conn [posh-tree id]
  (:conn (get (:conns-by-id posh-tree) id)))

(defn poshdb->conn-id [poshdb]
  (if (= (first poshdb) :db)
    (second poshdb)
    (recur (get-parent-db poshdb))))

(defn poshdb->attrs [posh-tree poshdb]
  (->> (poshdb->conn-id poshdb)
       (id->conn posh-tree)
       (get-conn-attrs posh-tree)))

(defn make-filter-pred [tx-patterns]
  (fn [_ datom]
    (dm/datom-match? tx-patterns datom)))

(defn poshdb->db [{:keys [dcfg cache] :as posh-tree}  poshdb]
  (if (= (first poshdb) :db)
    ((:db dcfg) (id->conn posh-tree (second poshdb)))
    ((:filter dcfg)
     (poshdb->db posh-tree (get-parent-db poshdb))
     (make-filter-pred (:filter-patterns (get cache poshdb))))))
