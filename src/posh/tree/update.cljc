(ns posh.tree.update
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]
            [posh.tree.db :as db]))

(defn update-pull [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  (let [[_ poshdb pull-pattern eid] storage-key]
    (pa/pull-analyze dcfg
                     (cons :patterns retrieve)
                     (db/poshdb->analyze-db posh-tree poshdb)
                     pull-pattern
                     eid)))

;; should cons :filter-patterns and :patterns into retrieve
(defn update-filter-pull [posh-tree storage-key]
  (println "big money, open hand.")
  (let [analysis (update-pull posh-tree storage-key)]
    (assoc analysis :filter-patterns (:patterns analysis))))

(defn update-q [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  "Returns {:dbvarmap .. :analysis ..}"
  (let [[_ query args] storage-key
        retrieve       (cons :patterns retrieve)
        qm             (qa/query-to-map query)
        dbvarmap       (qa/make-dbarg-map (:in qm) args)
        poshdbs        (vals dbvarmap)
        poshdbmap      (->> dbvarmap
                            (map (fn [[db-sym poshdb]]
                                   {db-sym
                                    (db/poshdb->analyze-db posh-tree poshdb)}))
                            (apply merge))
        fixed-args     (->> (zipmap (:in qm) args)
                            (map (fn [[sym arg]]
                                   (or (get poshdbmap sym) arg))))]
    {:dbvarmap dbvarmap
     :analysis
     (apply
      (partial qa/q-analyze dcfg retrieve query)
      fixed-args)}))

(defn update-posh-item [posh-tree storage-key]
  (case (first storage-key)
    :pull (update-pull posh-tree storage-key)
    :q    (:analysis (update-q posh-tree storage-key))
    :filter-pull (update-filter-pull posh-tree storage-key)))
