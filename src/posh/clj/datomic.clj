(ns posh.clj.datomic
  (:require [posh.plugin-base :as base]
            [posh.lib.ratom :as rx]
            [clojure.core.async :as async
              :refer [thread <!!]]
            [datomic.api :as d]
            [posh.lib.util :as u
              :refer [debug]]))

(defn datom->seq [db-after ^datomic.Datom d]
  [(.e d) (d/ident db-after (.a d)) (.v d) (.tx d) (.added d)])

; TODO import stuartsierra.component ?
(defprotocol Lifecycle
  (start [this])
  (stop  [this]))

(defrecord PoshableConnection [datomic-conn listeners interrupted?]
  Lifecycle
  (start [this]
    (assert (instance? datomic.Connection datomic-conn))
    (assert (instance? clojure.lang.IAtom listeners))
    (assert (instance? clojure.lang.IAtom interrupted?))
    (thread
      (loop []
        (when-not @interrupted?
                     ; `poll` because if `take`, still won't be nil or stop waiting when conn is released
          (when-let [{:keys [db-after] :as txn-report}
                       (.poll ^java.util.concurrent.BlockingQueue
                              (d/tx-report-queue datomic-conn)
                              1
                              java.util.concurrent.TimeUnit/SECONDS)]
            (debug "txn-report received in PoshableConnection")
            (try (let [txn-report' (update txn-report :tx-data
                                     (fn [datoms] (map #(datom->seq db-after %) datoms)))]
                   (doseq [[_ callback] @listeners]
                     (callback txn-report')))
                 (catch Throwable e (debug "WARNING:" e)))
            (recur)))))
    this)
  (stop [this]
    (reset! interrupted? true)
    this))

(defn ->poshable-conn [datomic-conn]
  {:pre [(instance? datomic.Connection datomic-conn)]}
  (let [listeners (atom nil)]
    (with-meta (start (PoshableConnection. datomic-conn listeners (atom false)))
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

(defn transact!* [x txn & args]
  @(apply d/transact (->conn x) txn args)) ; TODO do we want it to block?

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
