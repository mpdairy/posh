(ns posh.tree.update
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]
            [posh.tree.db :as db]))

(defn update-pull [{:keys [dcfg] :as posh-tree} retrieve storage-key]
  (let [[_ poshdb pull-pattern eid] storage-key]
    (pa/pull-analyze dcfg
                     (cons :patterns retrieve)
                     (:schema (db/poshdb->attrs posh-tree poshdb))
                     (db/poshdb->db posh-tree poshdb)
                     pull-pattern
                     eid)))

(defn update-filter-pull [posh-tree retrieve storage-key]
  (println "big money, open hand.")
  (let [analysis (update-pull posh-tree retrieve storage-key)]
    (assoc analysis :filter-patterns (:patterns analysis))))

(defn update-q [{:keys [dcfg] :as posh-tree} retrieve storage-key]
  "Returns {:dbvarmap .. :analysis ..}"
  (let [[_ query args] storage-key
        retrieve       (cons :patterns retrieve)
        qm             (qa/query-to-map query)
        dbvarmap       (qa/make-dbarg-map (:in qm) args)
        poshdbs        (vals dbvarmap)
        poshdbmap      (->> dbvarmap
                            (map (fn [[db-sym poshdb]]
                                   (let [db    (db/poshdb->db posh-tree poshdb)
                                         attrs (db/poshdb->attrs posh-tree poshdb)]
                                     {db-sym
                                      {:conn (:conn attrs)
                                       :db db
                                       :key poshdb
                                       :schema (:schema attrs)}})))
                            (apply merge))
        fixed-args     (->> (zipmap (:in qm) args)
                            (map (fn [[sym arg]]
                                   (or (get poshdbmap sym) arg))))]
    {:dvbarmap dbvarmap
     :analysis
     (apply
      (partial qa/q-analyze dcfg retrieve query)
      fixed-args)}))

(defn update-posh-item [posh-tree retrieve storage-key]
  (merge {:upda______________________________________________ted :YES!!!!!!}
         (case (first storage-key)
           :pull (update-pull posh-tree retrieve storage-key)
           :q    (:analysis (update-q posh-tree retrieve storage-key))
           :filter-pull (update-filter-pull posh-tree retrieve storage-key))))
