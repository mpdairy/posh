(ns posh.reagent
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [posh.core :as p]
            [posh.stateful :as ps]
            [posh.lib.db :as db]
            [posh.lib.update :as u]
            [datascript.core :as d]
            [reagent.core :as r]
            [reagent.ratom :as ra]))

(defn missing-pull-result
  [pull-expr]
  (when (some #{:db/id} pull-expr)
    {:db/id nil}))

(defn safe-pull
  [db query id]
  (cond
    (integer? id)
    (d/pull db query id)
    (vector? id)
    (if-let [eid (d/entid db id)]
      (d/pull db query eid)
      (missing-pull-result query))
    (nil? id)
    (missing-pull-result query)))


(def dcfg
  {:db d/db
   :pull safe-pull
   :q d/q
   :filter d/filter
   :with d/with
   :entid d/entid
   :transact! d/transact!})


;; need to set last-tx-t in conn so that it doesn't try the same tx twice
(defn set-conn-listener! [posh-atom conn db-id]
  (let [posh-vars {:posh-atom posh-atom
                   :db-id db-id}]
    (do
      (d/listen! conn :posh-dispenser
                 (fn [var]
                   (when (keyword? var)
                     (get posh-vars var))))
      (add-watch conn :posh-schema-listener
                 (fn [_ _ old-state new-state]
                   (when (not= (:schema old-state) (:schema new-state))
                     (swap! posh-atom assoc-in [:schema db-id] (:schema new-state)))))
                     ;; Update posh conn
      (d/listen! conn :posh-listener
                 (fn [tx-report]
                   ;;(println "CHANGED: " (keys (:changed (p/after-transact @posh-atom {conn tx-report}))))
                   (let [{:keys [ratoms changed]}
                         (swap! posh-atom p/after-transact {conn tx-report})]
                     (doseq [[k v] changed]
                       (reset! (get ratoms k) (:results v))))))
      conn)))


(defn posh! [& conns]
  (let [posh-atom (atom {})]
    (reset! posh-atom
            (loop [n 0
                   conns conns
                   posh-tree (-> (p/empty-tree dcfg [:results])
                                 (assoc :ratoms {}
                                        :reactions {}))]
              (if (empty? conns)
                posh-tree
                (recur (inc n)
                       (rest conns)
                       (let [db-id (keyword (str "conn" n))]
                         (p/add-db posh-tree 
                                   db-id
                                   (set-conn-listener! posh-atom (first conns) db-id)
                                   (:schema @(first conns))))))))))


;; Posh's state atoms are stored inside a listener in the meta data of
;; the datascript conn
(defn get-conn-var [conn var]
  ((:posh-dispenser @(:listeners (meta conn))) var))

(defn get-posh-atom [poshdb-or-conn]
  (if (d/conn? poshdb-or-conn)
    (get-conn-var poshdb-or-conn :posh-atom)
    (ps/get-posh-atom poshdb-or-conn)))

(defn get-db [poshdb-or-conn]
  (if (d/conn? poshdb-or-conn)
    (with-meta
      [:db (get-conn-var poshdb-or-conn :db-id)]
      {:posh (get-conn-var poshdb-or-conn :posh-atom)})
    poshdb-or-conn))

(defn rm-posh-item [posh-atom storage-key]
  (swap! posh-atom
         (fn [posh-atom-val]
           (assoc (p/remove-item posh-atom-val storage-key)
             :ratoms (dissoc (:ratoms posh-atom-val) storage-key)
             :reactions (dissoc (:reactions posh-atom-val) storage-key)))))

(defn make-query-reaction
  ([posh-atom storage-key add-query-fn options]
   (if-let [r (get-in @posh-atom [:reactions storage-key])]
     r
     (->
       (swap!
         posh-atom
         (fn [posh-atom-val]
           (let [posh-atom-with-query (add-query-fn posh-atom-val)
                 query-result         (:results (get (:cache posh-atom-with-query) storage-key))
                 query-ratom          (or (get (:ratoms posh-atom-with-query) storage-key)
                                          (r/atom query-result))
                 query-reaction       (ra/make-reaction
                                        (fn []
                                          ;;(println "RENDERING: " storage-key)
                                          @query-ratom)
                                        :on-dispose
                                        (fn [_ _]
                                          ;;(println "no DISPOSING: " storage-key)
                                          (when-not (= (:cache options) :forever)
                                            (swap! posh-atom
                                                   (fn [posh-atom-val]
                                                     (assoc (p/remove-item posh-atom-val storage-key)
                                                       :ratoms (dissoc (:ratoms posh-atom-val) storage-key)
                                                       :reactions (dissoc (:reactions posh-atom-val) storage-key)))))))]
             (assoc posh-atom-with-query
               :ratoms (assoc (:ratoms posh-atom-with-query) storage-key query-ratom)
               :reactions (assoc (:reactions posh-atom-with-query) storage-key query-reaction)))))
       :reactions
       (get storage-key))))
  ([posh-atom storage-key add-query-fn]
   (make-query-reaction posh-atom storage-key add-query-fn {})))

(defn pull
  "Returns a reaction of a pull expression. The options argument may specify `:cache :forever`, which keeps query results
  cached indefinitely, even if the reaction is disposed."
  ([poshdb pull-pattern eid options]
   (let [true-poshdb (get-db poshdb)
         storage-key [:pull true-poshdb pull-pattern eid]
         posh-atom   (get-posh-atom poshdb)]
     (make-query-reaction posh-atom
                          storage-key
                          #(p/add-pull % true-poshdb pull-pattern eid)
                          options)))
  ([poshdb pull-pattern eid]
   (pull poshdb pull-pattern eid {})))

(defn pull-info [poshdb pull-pattern eid]
  (let [true-poshdb (get-db poshdb)
        storage-key [:pull true-poshdb pull-pattern eid]
        posh-atom   (get-posh-atom poshdb)]
    (dissoc
     (u/update-pull @posh-atom storage-key)
     :reload-fn)))

(defn pull-tx [tx-patterns poshdb pull-pattern eid]
  (println "pull-tx is deprecated. Calling pull without your tx-patterns.")
  (pull poshdb pull-pattern eid))

;;; q needs to find the posh-atom, go through args and convert any
;;; conn's to true-poshdb's, generate the storage-key with true dbs

(defn parse-q-query
  [query]
  (first
    (reduce
      (fn [[parsed-query last-key] query-item]
        (if (keyword? query-item)
          [(assoc parsed-query query-item [])
           query-item]
          (do
            (assert last-key)
            [(update parsed-query last-key conj query-item)
             last-key])))
      [{} nil]
      query)))

(defn q-args-count
  ;; Really should be conforming to a spec for this... :-/
  [query]
  (let [parsed-query (parse-q-query query)]
    (if-let [in-clause (:in parsed-query)]
      (count in-clause)
      1)))

(defn q
  "Returns a datalog query reaction. If args count doens't match the query's input count, a final options map argument
  is accepted. This options map may specify `:cache :forever`, which keeps query results cached even if the reaction is
  disposed."
  [query & args]
  (let [n-query-args     (q-args-count query)
        [args options]   (cond
                           (= n-query-args (count args))
                           [args {}]
                           (= (inc n-query-args) (count args))
                           [(butlast args) (last args)]
                           :else
                           (throw "Incorrect number of args passed to posh query"))
        true-poshdb-args (map #(if (d/conn? %) (get-db %) %) args)
        posh-atom        (first (remove nil? (map get-posh-atom args)))
        storage-key      [:q query true-poshdb-args]]
    (make-query-reaction posh-atom
                         storage-key
                         #(apply (partial p/add-q % query) true-poshdb-args)
                         options)))

(defn q-info [query & args]
  (let [true-poshdb-args (map #(if (d/conn? %) (get-db %) %) args)
        posh-atom        (first (remove nil? (map get-posh-atom args)))
        storage-key      [:q query true-poshdb-args]]
    (dissoc
     (u/update-q @posh-atom storage-key)
     :reload-fn)))

(defn q-tx [tx-patterns query & args]
  (println "q-tx is deprecated. Calling q without your tx-patterns.")
  (apply q query args))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn filter-tx [poshdb tx-patterns]
  (ps/add-filter-tx (get-db poshdb) tx-patterns))

(defn filter-pull [poshdb pull-pattern eid]
  (ps/add-filter-pull (get-db poshdb) pull-pattern eid))

(defn filter-q [query & args]
  (let [true-poshdb-args (map #(if (d/conn? %) (get-db %) %) args)]
    (apply ps/add-filter-q query true-poshdb-args)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn transact! [poshdb-or-conn txs]
  (d/transact!
   (if (d/conn? poshdb-or-conn)
     poshdb-or-conn
     (ps/poshdb->conn poshdb-or-conn))
   txs))

