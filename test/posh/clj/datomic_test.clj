(ns posh.clj.datomic-test
  (:require [clojure.test          :as test
              :refer [is deftest testing]]
            [datomic.api           :as d]
            [posh.clj.datomic      :as db]
            [posh.lib.ratom        :as r]
            [posh.lib.util         :as u
              :refer [debug prl]]
            [posh.clj.common-tests :as common])
  (:import posh.clj.datomic.PoshableConnection))

#_(do (require '[clojure.tools.namespace.repl :refer [refresh]])
      (reset! posh.lib.util/debug? true)
      (refresh)
      (set! *warn-on-reflection* true)
      (eval `(do (clojure.test/run-tests 'posh.lib.ratom-test)
                 (clojure.test/run-tests 'posh.clj.datascript-test)
                 (clojure.test/run-tests 'posh.clj.datomic-test))))

(def default-partition :db.part/default)

(defn tempid [] (d/tempid default-partition))

(defn install-partition [part]
  (let [id (d/tempid :db.part/db)]
    [{:db/id    id
      :db/ident part}
     [:db/add               :db.part/db
      :db.install/partition id]]))

(defmacro with-conn [sym & body]
  `(let [uri# "datomic:mem://test"]
     (try (d/create-database uri#)
          (let [~sym (d/connect uri#)]
            (try ~@body
              (finally (d/release ~sym))))
          (finally (d/delete-database uri#)))))

(defn transact-schemas!
  "This is used because, perhaps very strangely, schema changes to Datomic happen
   asynchronously."
  [conn schemas]
  (let [txn-report (db/transact! conn
                     (->> schemas
                          (map #(assoc % :db/id (d/tempid :db.part/db)
                                         :db.install/_attribute :db.part/db))))
        txn-id     (-> txn-report :tx-data first (get 3))
        _ #_(deref (d/sync (db/->conn conn) (java.util.Date. (System/currentTimeMillis))) 500 nil)
            (deref (d/sync-schema (db/->conn conn) (inc txn-id)) 500 nil)] ; frustratingly, doesn't even work with un-`inc`ed txn-id
    txn-report))

(defn with-setup [schemas f]
  (with-conn conn*
    (let [poshed (db/posh! conn*) ; This performs a `with-meta` so the result is needed
          conn   (-> poshed :conns :conn0) ; Has the necessary meta ; TODO simplify this
          _      (is (instance? PoshableConnection conn))]
      (try (let [txn-report (db/transact! conn (install-partition default-partition))
                 txn-report (transact-schemas! conn schemas)]
             (f conn))
        (finally (db/stop conn)))))) ; TODO `unposh!`

(deftest basic-test
  (with-setup
    [{:db/ident       :test/attr
      :db/valueType   :db.type/string
      :db/cardinality :db.cardinality/one}]
    (fn [conn]
      (common/basic-test conn
        {:db        db/db*
         :q         db/q
         :q*        d/q
         :tempid    tempid
         :transact! db/transact!}))))
