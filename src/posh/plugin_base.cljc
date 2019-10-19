(ns posh.plugin-base
  (:require [posh.core :as p]
            [posh.stateful :as ps]
            [posh.lib.db :as db]
            [posh.lib.update :as u]))

(defn missing-pull-result
  [dcfg pull-expr]
  (when (some #{:db/id} pull-expr)
    {:db/id nil}))

(defn safe-pull
  [dcfg db query id]
  (cond
    (integer? id)
    ((:pull* dcfg) db query id)
    (vector? id)
    (if-let [eid ((:entid dcfg) db id)]
      ((:pull* dcfg) db query eid)
      (missing-pull-result dcfg query))
    (nil? id)
    (missing-pull-result dcfg query)))

;; need to set last-tx-t in conn so that it doesn't try the same tx twice
(defn set-conn-listener! [dcfg posh-atom conn db-id]
  (let [posh-vars {:posh-atom posh-atom
                   :db-id db-id}]
    (do
      ((:listen! dcfg) conn :posh-dispenser
        (fn [var]
          (when (keyword? var)
            (get posh-vars var))))
      (add-watch conn :posh-schema-listener
        (fn [_ _ old-state new-state]
          (when (not= (:schema old-state) (:schema new-state))
            (swap! posh-atom assoc-in [:schema db-id] (:schema new-state)))))
            ;; Update posh conn
      ((:listen! dcfg) conn :posh-listener
        (fn [tx-report]
          ;;(println "CHANGED: " (keys (:changed (p/after-transact @posh-atom {conn tx-report}))))
          (let [{:keys [ratoms changed]}
                (swap! posh-atom p/after-transact {conn tx-report})]
            (doseq [[k v] changed]
              (reset! (get ratoms k) (:results v))))))
      conn)))

(defn posh! [dcfg & conns]
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
                                   (set-conn-listener! dcfg posh-atom (first conns) db-id)
                                   (:schema @(first conns))))))))))


;; Posh's state atoms are stored inside a listener in the meta data of
;; the datascript conn
(defn get-conn-var [dcfg conn var]
  ((:posh-dispenser @(:listeners (meta conn))) var))

(defn get-posh-atom [dcfg poshdb-or-conn]
  (if ((:conn? dcfg) poshdb-or-conn)
    (get-conn-var dcfg poshdb-or-conn :posh-atom)
    (ps/get-posh-atom poshdb-or-conn)))

(defn get-db [dcfg poshdb-or-conn]
  (if ((:conn? dcfg) poshdb-or-conn)
    (with-meta
      [:db (get-conn-var dcfg poshdb-or-conn :db-id)]
      {:posh (get-conn-var dcfg poshdb-or-conn :posh-atom)})
    poshdb-or-conn))

(defn rm-posh-item [dcfg posh-atom storage-key]
  (swap! posh-atom
         (fn [posh-atom-val]
           (assoc (p/remove-item posh-atom-val storage-key)
             :ratoms (dissoc (:ratoms posh-atom-val) storage-key)
             :reactions (dissoc (:reactions posh-atom-val) storage-key)))))

(defn make-query-reaction
  ([dcfg posh-atom storage-key add-query-fn options]
   (if-let [r (get-in @posh-atom [:reactions storage-key])]
     r
     (->
      (swap!
       posh-atom
       (fn [posh-atom-val]
         (let [posh-atom-with-query (add-query-fn posh-atom-val)
               query-result         (:results (get (:cache posh-atom-with-query) storage-key))
               query-ratom          (or (get (:ratoms posh-atom-with-query) storage-key)
                                        ((:ratom dcfg) query-result))
               query-reaction       ((:make-reaction dcfg)
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
  ([dcfg posh-atom storage-key add-query-fn]
   (make-query-reaction dcfg posh-atom storage-key add-query-fn {})))

(defn pull
  "Returns a reaction of a pull expression. The options argument may specify `:cache :forever`, which keeps query results
  cached indefinitely, even if the reaction is disposed."
  ([dcfg poshdb pull-pattern eid options]
   (let [true-poshdb (get-db dcfg poshdb)
         storage-key [:pull true-poshdb pull-pattern eid]
         posh-atom   (get-posh-atom dcfg poshdb)]
     (make-query-reaction dcfg
                          posh-atom
                          storage-key
                          #(p/add-pull % true-poshdb pull-pattern eid)
                          options)))
  ([dcfg poshdb pull-pattern eid]
   (pull dcfg poshdb pull-pattern eid {})))

(defn pull-info [dcfg poshdb pull-pattern eid]
  (let [true-poshdb (get-db dcfg poshdb)
        storage-key [:pull true-poshdb pull-pattern eid]
        posh-atom   (get-posh-atom dcfg poshdb)]
    (dissoc
     (u/update-pull @posh-atom storage-key)
     :reload-fn)))

(defn pull-many
  ([dcfg poshdb pull-pattern eids options]
   (let [true-poshdb (get-db dcfg poshdb)
         storage-key [:pull-many true-poshdb pull-pattern eids]
         posh-atom   (get-posh-atom dcfg poshdb)]
     (make-query-reaction dcfg
                          posh-atom
                          storage-key
                          #(p/add-pull-many % true-poshdb pull-pattern eids)
                          options)))
  ([dcfg poshdb pull-pattern eids]
   (pull-many dcfg poshdb pull-pattern eids {})))

(defn pull-tx [dcfg tx-patterns poshdb pull-pattern eid]
  (println "pull-tx is deprecated. Calling pull without your tx-patterns.")
  (pull dcfg poshdb pull-pattern eid))

;;; q needs to find the posh-atom, go through args and convert any
;;; conn's to true-poshdb's, generate the storage-key with true dbs

(defn parse-q-query
  [dcfg query]
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
  [dcfg query]
  (let [parsed-query (parse-q-query dcfg query)]
    (if-let [in-clause (:in parsed-query)]
      (count in-clause)
      1)))

(defn q
  "Returns a datalog query reaction. If args count doens't match the query's input count, a final options map argument
  is accepted. This options map may specify `:cache :forever`, which keeps query results cached even if the reaction is
  disposed."
  [dcfg query & args]
  (let [n-query-args     (q-args-count dcfg query)
        [args options]   (cond
                           (= n-query-args (count args))
                           [args {}]
                           (= (inc n-query-args) (count args))
                           [(butlast args) (last args)]
                           :else
                           (throw "Incorrect number of args passed to posh query"))
        true-poshdb-args (map #(if ((:conn? dcfg) %) (get-db dcfg %) %) args)
        posh-atom        (first (remove nil? (map #(get-posh-atom dcfg %) args)))
        storage-key      [:q query true-poshdb-args]]
    (make-query-reaction dcfg
                         posh-atom
                         storage-key
                         #(apply (partial p/add-q % query) true-poshdb-args)
                         options)))

(defn q-info [dcfg query & args]
  (let [true-poshdb-args (map #(if ((:conn? dcfg) %) (get-db dcfg %) %) args)
        posh-atom        (first (remove nil? (map #(get-posh-atom dcfg %) args)))
        storage-key      [:q query true-poshdb-args]]
    (dissoc
     (u/update-q @posh-atom storage-key)
     :reload-fn)))

(defn q-tx [dcfg tx-patterns query & args]
  (println "q-tx is deprecated. Calling q without your tx-patterns.")
  (apply q dcfg query args))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn filter-tx [dcfg poshdb tx-patterns]
  (ps/add-filter-tx (get-db dcfg poshdb) tx-patterns))

(defn filter-pull [dcfg poshdb pull-pattern eid]
  (ps/add-filter-pull (get-db dcfg poshdb) pull-pattern eid))

(defn filter-q [dcfg query & args]
  (let [true-poshdb-args (map #(if ((:conn? dcfg) %) (get-db dcfg %) %) args)]
    (apply ps/add-filter-q query true-poshdb-args)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn transact! [dcfg poshdb-or-conn txs]
  ((:transact! dcfg)
   (if ((:conn? dcfg) poshdb-or-conn)
     poshdb-or-conn
     (ps/poshdb->conn poshdb-or-conn))
   txs))

#?(:clj
(defmacro add-plugin [dcfg]
  `(do (def ~'missing-pull-result (partial posh.plugin-base/missing-pull-result ~dcfg))
       (def ~'safe-pull           (partial posh.plugin-base/safe-pull           ~dcfg))
       (def ~'set-conn-listener!  (partial posh.plugin-base/set-conn-listener!  ~dcfg))
       (def ~'posh!               (partial posh.plugin-base/posh!               ~dcfg))
       (def ~'get-conn-var        (partial posh.plugin-base/get-conn-var        ~dcfg))
       (def ~'get-posh-atom       (partial posh.plugin-base/get-posh-atom       ~dcfg))
       (def ~'get-db              (partial posh.plugin-base/get-db              ~dcfg))
       (def ~'rm-posh-item        (partial posh.plugin-base/rm-posh-item        ~dcfg))
       (def ~'make-query-reaction (partial posh.plugin-base/make-query-reaction ~dcfg))
       (def ~'pull                (partial posh.plugin-base/pull                ~dcfg))
       (def ~'pull-info           (partial posh.plugin-base/pull-info           ~dcfg))
       (def ~'pull-tx             (partial posh.plugin-base/pull-tx             ~dcfg))
       (def ~'pull-many           (partial posh.plugin-base/pull-many           ~dcfg))
       (def ~'parse-q-query       (partial posh.plugin-base/parse-q-query       ~dcfg))
       (def ~'q-args-count        (partial posh.plugin-base/q-args-count        ~dcfg))
       (def ~'q                   (partial posh.plugin-base/q                   ~dcfg))
       (def ~'q-info              (partial posh.plugin-base/q-info              ~dcfg))
       (def ~'q-tx                (partial posh.plugin-base/q-tx                ~dcfg))

       ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

       (def ~'filter-tx           (partial posh.plugin-base/filter-tx           ~dcfg))
       (def ~'filter-pull         (partial posh.plugin-base/filter-pull         ~dcfg))
       (def ~'filter-q            (partial posh.plugin-base/filter-q            ~dcfg))

       ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

       (def ~'transact!           (partial posh.plugin-base/transact!           ~dcfg)))))
