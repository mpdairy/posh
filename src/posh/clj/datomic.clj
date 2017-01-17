(ns posh.clj.datomic
  "The public API of Posh's Datomic implementation (for Clojure)."
  (:require [posh.plugin-base :as base]
            [posh.lib.ratom :as rx]
            [clojure.core.async :as async
              :refer [thread offer! <!! promise-chan]]
            [datomic.api :as d]
            [posh.lib.util :as u
              :refer [debug]]))

(defn datom->seq [db-after ^datomic.Datom d]
  [(.e d) (d/ident db-after (.a d)) (.v d) (.tx d) (.added d)])

; TODO import stuartsierra.component ?
(defprotocol Lifecycle
  (start [this])
  (stop  [this]))

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

(defn ->poshable-conn [datomic-conn]
  {:pre [(instance? datomic.Connection datomic-conn)]}
  (let [listeners (atom nil)]
    (with-meta (start (PoshableConnection. datomic-conn listeners (atom #{}) (atom false)))
               {:listeners listeners})))

(defn conn? [x] (instance? PoshableConnection x))

(defn ->conn [x]
  (if (conn? x)
      (:datomic-conn x)
      x))

(defn assert-pconn [x] (assert (instance? PoshableConnection x)))

(defn listen!
  ([conn callback] (listen! conn (gensym) callback))
  ([conn key callback]
     {:pre [(conn? conn)]}
     (swap! (:listeners (meta conn)) assoc key callback)
     key))

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

(def dcfg
  (let [dcfg {:db            db*
              :pull*         d/pull
              :q             q*
              :filter        d/filter
              :with          d/with
              :entid         d/entid
              :transact!     transact!*
              :listen!       listen!
              :conn?         conn?
              :->poshable-conn ->poshable-conn
              :ratom         rx/atom
              :make-reaction rx/make-reaction}]
   (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
