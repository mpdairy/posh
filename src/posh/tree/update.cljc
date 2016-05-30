(ns posh.tree.update
  (:require [datascript.core :as d]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.pull-analyze :as pa]
            [posh.q-analyze :as qa]
            [posh.tree.db :as db]))

(defn update-pull [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  (let [[_ poshdb pull-pattern eid] storage-key]
    (let [analysis (pa/pull-analyze dcfg
                                    (cons :patterns retrieve)
                                    (db/poshdb->analyze-db posh-tree poshdb)
                                    pull-pattern
                                    eid)]
      (dissoc
       (merge analysis
              {:reload-patterns (:patterns analysis)
               :reload-fn 'posh.tree.update/update-filter-pull})
       :patterns))))

;; should cons :filter-patterns and :patterns into retrieve
;; TODO: add real reload and pass patterns
(defn update-filter-pull [posh-tree storage-key]
  (println "updated filter-pull: " storage-key)
  (let [analysis (update-pull (update posh-tree :retrieve (partial cons :ref-patterns))
                              storage-key)]
    (dissoc
     (merge analysis
            {:pass-patterns (:patterns analysis)
             :reload-patterns (:ref-patterns analysis)
             :reload-fn 'posh.tree.update/update-filter-pull})
     :patterns :ref-patterns)))

(defn update-q-with-dbvarmap [{:keys [dcfg retrieve] :as posh-tree} storage-key]
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
     :analysis (let [analysis (qa/q-analyze dcfg retrieve query fixed-args)]
                 (merge analysis
                        {:reload-patterns (:patterns analysis)
                         :reload-fn 'posh.tree.update/update-q}))}))

(defn update-q [posh-tree storage-key]
  (:analysis (update-q-with-dbvarmap posh-tree storage-key)))

(defn update-posh-item [posh-tree storage-key]
  (case (first storage-key)
    :pull (update-pull posh-tree storage-key)
    :q    (:analysis (update-q posh-tree storage-key))
    :filter-pull (update-filter-pull posh-tree storage-key)))
