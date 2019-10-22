(ns posh.lib.update
  (:require [posh.lib.util :as util]
            [posh.lib.datom-matcher :as dm]
            [posh.lib.pull-analyze :as pa]
            [posh.lib.q-analyze :as qa]
            [posh.lib.db :as db]))

(defn update-pull [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  ;;(println "updated pull: " storage-key)
  (let [[_ poshdb pull-pattern eid] storage-key]
    (let [analysis (pa/pull-analyze dcfg
                                    (cons :patterns retrieve)
                                    (db/poshdb->analyze-db posh-tree poshdb)
                                    pull-pattern
                                    eid)]
      (dissoc
       (merge analysis
              {:reload-patterns (:patterns analysis)
               :reload-fn posh.lib.update/update-pull})
       :patterns))))

(defn update-filter-pull [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  ;;(println "updated filter-pull: " storage-key)
  (let [[_ poshdb pull-pattern eid] storage-key]
    (let [analysis (pa/pull-analyze dcfg
                                    (concat [:patterns :ref-patterns] retrieve)
                                    (db/poshdb->analyze-db posh-tree poshdb)
                                    pull-pattern
                                    eid)]
      (dissoc
       (merge analysis
              {:pass-patterns (first (vals (:patterns analysis)))
               :reload-patterns (:ref-patterns analysis)
               :reload-fn posh.lib.update/update-filter-pull})
       :patterns :ref-patterns))))

(defn update-pull-many [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  ;;(println "updated pull-many: " storage-key)
  (let [[_ poshdb pull-pattern eids] storage-key]
    (let [analysis (pa/pull-many-analyze dcfg
                                         (cons :patterns retrieve)
                                         (db/poshdb->analyze-db posh-tree poshdb)
                                         pull-pattern
                                         eids)]
      (dissoc
       (merge analysis
              {:reload-patterns (:patterns analysis)
               :reload-fn posh.lib.update/update-pull-many})
       :patterns))))

(declare update-q)

(defn update-q-with-dbvarmap [{:keys [dcfg retrieve] :as posh-tree} storage-key]
  "Returns {:dbvarmap .. :analysis ..}"
  (let [[_ query args] storage-key
        retrieve       (concat [:results :simple-patterns] (remove #{:patterns} retrieve))
        qm             (merge {:in '[$]} (qa/query-to-map query))
        dbvarmap       (qa/make-dbarg-map (:in qm) args)
        ;; no longer using
        ;poshdbs        (vals dbvarmap)
        poshdbmap      (->> dbvarmap
                            (map (fn [[db-sym poshdb]]
                                   {db-sym
                                    (db/poshdb->analyze-db posh-tree poshdb)}))
                            (apply merge))
        fixed-args     (->> (zipmap (:in qm) args)
                            (map (fn [[sym arg]]
                                   (or (get poshdbmap sym) arg))))
        analysis       (qa/q-analyze dcfg retrieve query fixed-args)]
    {:dbvarmap dbvarmap
     :analysis (dissoc
                (merge analysis
                       {:reload-patterns (:patterns analysis)
                        :reload-fn posh.lib.update/update-q})
                :patterns)}))

(defn update-q [posh-tree storage-key]
  ;;(println "updated q: " storage-key)
  (:analysis (update-q-with-dbvarmap posh-tree storage-key)))

(defn reduce-entities [r]
    (reduce (fn [acc xs] (reduce (fn [acc x] (conj acc x)) acc xs)) #{} r))

(declare update-filter-q)

(defn filter-q-transform-analysis [analysis]
  (dissoc
   (merge analysis
          {:pass-patterns [[(reduce-entities (:results analysis))]]
           :reload-patterns (:patterns analysis)
           :reload-fn posh.lib.update/update-filter-q})
   :results :patterns))

(defn update-filter-q [posh-tree storage-key]
  ;;(println "update-filter-q" storage-key)
  (filter-q-transform-analysis (:analysis (update-q-with-dbvarmap posh-tree storage-key))))

(defn update-posh-item [posh-tree storage-key]
  (case (first storage-key)
    :pull (update-pull posh-tree storage-key)
    :q    (:analysis (update-q posh-tree storage-key))
    :filter-pull (update-filter-pull posh-tree storage-key)))
