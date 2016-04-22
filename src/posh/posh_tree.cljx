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

;; posh-tree is already associated with some sort of conn
(defn add-db [tree]
  (if (get tree [:db])
    posh-tree
    (merge tree {[:db] {}})))

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

(defn add-filter-tx [posh-tree poshdb tx-patterns]
  (merge posh-tree
         (:tree
          (add-item (:tree posh-tree) poshdb [:filter-tx poshdb tx-patterns] {}))))

(defn rm-filter-tx [posh-tree poshdb tx-patterns]
  (merge posh-tree
         {:tree
          (rm-item (:tree posh-tree) poshdb [:filter-tx poshdb tx-patterns])}))

;;queries

(defn get-conn [poshdb]
  (if (= (first poshdb) :db)
    (second poshdb)
    (recur (get-parent-db poshdb))))

(defn poshdb->db [dcfg cache poshdb]
  (if (= (first poshdb) :db)
    ((:db dcfg) (second poshdb))
    ((:filter dcfg)
     (poshdb->db dcfg cache (get-parent-db poshdb))
     (:filter-pred (get cache poshdb)))))


(defn pull [{:keys [tree cache dcfg schema conn] :as posh-tree} retrieve poshdb pull-pattern eid]
  (let [retrieve    (if (some #{:patterns} retrieve) retrieve (cons :patterns retrieve))
        storage-key [:pull poshdb pull-pattern eid]
        cached-pull (or (get cache storage-key)
                        (pa/pull-analyze dcfg retrieve schema
                                         (poshdb->db dcfg cache poshdb)
                                         pull-pattern
                                         eid))]
    (merge
     posh-tree
     {:tree (add-item tree poshdb [:pull poshdb pull-pattern eid] :query)
      :cache (assoc cache storage-key cached-pull)})))

(defn rm-pull [posh-tree poshdb pull-pattern eid]
  (rm-item posh-tree poshdb [:pull poshdb pull-pattern eid]))


;; calculating the tree
(defn tree-calc-tx [posh-tree cache tx tx-t]
  
  )

