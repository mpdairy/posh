(ns posh.lib.datomic
  "General Datomic utils."
  (:require [datomic.api        :as d]
            [clojure.core.async :as async
              :refer [thread offer! <!! promise-chan]]
            [posh.plugin-base   :as base]
            [posh.lib.util      :as u
              :refer [debug]]))

; TODO import stuartsierra.component ?
; TODO move
(defprotocol Lifecycle
  (start [this])
  (stop  [this]))

; TODO fix
#_(defn datom->seq [^datomic.Datom d] [(.e d) (.a d) (.v d) (.tx d) (.added d)])

(defn datom->seq [db-after ^datomic.Datom d]
  [(.e d) (d/ident db-after (.a d)) (.v d) (.tx d) (.added d)])

#_(extend-type datomic.Datom ; TODO fix
  clojure.core.protocols/CollReduce
  (coll-reduce [datom f  ] (reduce f (f) (datom->seq datom)))
  (coll-reduce [datom f v] (reduce f v   (datom->seq datom))))

(defn normalized-tx-report [{:keys [db-after] :as tx-report}]
  (update tx-report :tx-data
    (fn [datoms] (mapv #(datom->seq db-after %) datoms))))

(defn run-listeners! [pconn tx-report']
  (try (doseq [[_ callback] @(:listeners pconn)] (callback tx-report'))
       (catch Throwable e (debug "WARNING:" e))))

(defrecord PoshableConnection [datomic-conn listeners deduplicate-tx-idents interrupted?]
  Lifecycle
  (start [this]
    (assert (instance? datomic.Connection datomic-conn))
    (assert (instance? clojure.lang.IAtom listeners))
    (assert (instance? clojure.lang.IAtom interrupted?))
    ; See `transact!*` as to why the below schema+entity is required.
    ; TODO use `posh.lib.datomic/transact-schemas!`?
    @(d/transact datomic-conn
       [{:db/id                 (d/tempid :db.part/db)
         :db.install/_attribute :db.part/db
         :db/ident              :posh.clj.datomic.tx-notifier/value
         :db/cardinality        :db.cardinality/one
         :db/valueType          :db.type/uuid}
        {:db/id    (d/tempid :db.part/db)
         :db/ident ::tx-notifier}])
    (thread
      (loop []
        (when-not @interrupted?
                     ; `poll` because if `take`, still won't be nil or stop waiting when conn is released
                     ; the poll time is how long it will take to shut down when that time comes
          (when-let [{:keys [db-after] :as tx-report}
                       (.poll ^java.util.concurrent.BlockingQueue
                              (d/tx-report-queue datomic-conn)
                              1
                              java.util.concurrent.TimeUnit/SECONDS)]
            (try (let [{:keys [tx-data] :as tx-report'} (normalized-tx-report tx-report)
                       last-tx-item (last tx-data)
                       tx-ident (when (and last-tx-item
                                           (= (d/ident db-after (get last-tx-item 0)) ::tx-notifier)
                                           (= (d/ident db-after (get last-tx-item 1)) :posh.clj.datomic.tx-notifier/value))
                                  (get last-tx-item 2))]
                   (try (debug "tx-report received in PoshableConnection")
                        (when-not (get @deduplicate-tx-idents tx-ident)
                          (run-listeners! this tx-report'))
                     (finally
                       (swap! deduplicate-tx-idents #(disj % tx-ident)))))
              (catch Throwable e (debug "WARNING:" e)))
            (recur)))))
    this)
  (stop [this]
    (reset! interrupted? true)
    (swap! deduplicate-tx-idents empty)
    this))

(defn conn? [x] (instance? PoshableConnection x))

(defn ->conn [x] (if (conn? x) (:datomic-conn x) x))

(defn ->poshable-conn [datomic-conn]
  {:pre [(instance? datomic.Connection datomic-conn)]}
  (let [listeners (atom nil)]
    (with-meta (start (PoshableConnection. datomic-conn listeners (atom #{}) (atom false)))
               {:listeners listeners})))

(def system-ns #{"db" "db.type" "db.install" "db.part" "db.sys" "db.alter"
                 "db.lang" "fressian" "db.unique" "db.excise" "db.bootstrap"
                 "db.cardinality" "db.fn"})

(defn conn->schema [conn]
  {:pre [(instance? datomic.Connection conn)]}
  (let [db (d/db conn)
        es (d/q '[:find [?e ...]
                  :in $ ?system-ns
                  :where
                  [?e :db/ident ?ident]
                  [(namespace ?ident) ?ns]
                  [((comp not contains?) ?system-ns ?ns)]]
                db system-ns)]
    (->> es
         (map (fn [e] (let [m (d/touch (d/entity db e))]
                        [(:db/ident m) m])))
         (into {}))))

(defn listen!
  ([conn callback] (listen! conn (gensym) callback))
  ([conn key callback]
    {:pre [(conn? conn)]}
    (swap! (:listeners (meta conn)) assoc key callback)
    key))

(def default-partition :db.part/default)

(defn tempid [] (d/tempid default-partition))

(defn install-partition [part]
  (let [id (d/tempid :db.part/db)]
    [{:db/id    id
      :db/ident part}
     [:db/add               :db.part/db
      :db.install/partition id]]))

(defn transact!*
  "The main point of the additions onto Datomic's base `transact` fn is to wait for related
   listeners to be run before returning."
  [conn tx]
  {:pre [(conn? conn)]}
  (let [; In order to ensure listeners are run only once (i.e. deduplicate them),
        ; we have to transmit to the report queue in a race-condition-free way
        ; some sort of unique ID we know ahead of time. I'd like to just use the
        ; txn ID, but this is not given ahead of time. Thus we must pass a squuid
        ; to the transaction.
        ; This is cleaner than e.g. using channels because they introduce race
        ; conditions in this situation.
        tx-ident   (d/squuid)
        _          (swap! (:deduplicate-tx-idents conn) conj tx-ident)
        tx-report  @(d/transact (->conn conn)
                      (conj (vec tx) [:db/add ::tx-notifier :posh.clj.datomic.tx-notifier/value tx-ident]))
        tx-report' (normalized-tx-report tx-report)
        _          (run-listeners! conn tx-report')]
    tx-report'))

(defn transact-schemas!
  "This is used because, perhaps very strangely, schema changes to Datomic happen
   asynchronously."
  {:todo #{"Make more robust"}}
  [conn schemas]
  (let [txn-report @(d/transact conn
                      (->> schemas
                           (map (fn [[ident v]] (assoc v :db/ident ident
                                                         :db/id    (d/tempid :db.part/db)
                                                         :db.install/_attribute :db.part/db)))))
        txn-id     (-> txn-report :tx-data ^datomic.Datom first (.tx))
        _ #_(deref (d/sync (->conn conn) (java.util.Date. (System/currentTimeMillis))) 500 nil)
            (deref (d/sync-schema (->conn conn) (inc txn-id)) 500 nil)] ; frustratingly, doesn't even work with un-`inc`ed txn-id
    txn-report))

(defn db* [x]
  (cond (instance? datomic.Database x)
        x
        (conn? x)
        (-> x :datomic-conn d/db)
        (instance? datomic.Connection x)
        (d/db x)
        :else x #_(throw (ex-info "Object cannot be converted into DB" {:obj x}))))

(defn q* [q x & args]
  (apply d/q q (db* x) args))

(defn with-conn [uri f]
  (try (d/create-database uri)
       (let [conn (d/connect uri)]
         (try (f conn)
           (finally (d/release conn))))
    (finally (d/delete-database uri))))

(defn with-posh-conn [dcfg retrieve uri schemas f]
  (with-conn uri
    (fn [conn*]
      (let [_      @(d/transact conn* (install-partition default-partition))
            _      (transact-schemas! conn* schemas)
            poshed (base/posh-one! dcfg conn* retrieve) ; This performs a `with-meta` so the result is needed
            conn   (-> poshed deref :conns :conn0) ; Has the necessary meta ; TODO simplify this
            _      (assert (instance? PoshableConnection conn))]
        (try (f poshed conn)
          (finally (stop conn))))))) ; TODO `unposh!`
