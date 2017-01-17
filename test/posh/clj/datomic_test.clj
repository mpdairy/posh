(ns posh.clj.datomic-test
  (:require [clojure.test     :as test
              :refer [is deftest testing]]
            [datomic.api      :as d]
            [posh.clj.datomic :as db]
            [posh.lib.ratom   :as r]
            [posh.lib.util :as u
              :refer [debug prl]])
  (:import posh.clj.datomic.PoshableConnection))

#_(do (set! *warn-on-reflection* true)
    (reset! posh.lib.util/debug? true)
    #_(load-file "./src/posh/plugin_base.cljc")
    (load-file "./src/posh/clj/datomic.clj")
     (load-file "./test/posh/clj/datomic_test.clj")
     (eval '(clojure.test/run-tests 'posh.clj.datomic-test)))

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
        txn-id     (-> txn-report :tx-data ^datomic.Datom first .tx)
        _ #_(deref (d/sync (db/->conn conn) (java.util.Date. (System/currentTimeMillis))) 500 nil)
            (deref (d/sync-schema (db/->conn conn) (inc txn-id)) 500 nil)] ; frustratingly, doesn't even work with un-`inc`ed txn-id
    txn-report))

(deftest basic-test
  (with-conn conn*
    (let [poshed (db/posh! conn*) ; This performs a `with-meta` so the result is needed
          conn   (-> poshed :conns :conn0) ; Has the necessary meta ; TODO simplify this
          _      (is (instance? PoshableConnection conn))]
      (try (let [txn-report (db/transact! conn (install-partition default-partition))
                 txn-report (transact-schemas! conn
                              [{:db/ident       :test/attr
                                :db/valueType   :db.type/string
                                :db/cardinality :db.cardinality/one}])
                 sub (db/q [:find '?e
                            :where ['?e :test/attr]]
                           conn)
                 _ (is (= @sub #{}))
                 notified-times (atom 0)
                 _ (r/run! @sub (swap! notified-times inc))
                 txn-report (db/transact! conn
                              [{:db/id     (tempid)
                                :test/attr "Abcde"}])
                 _ (Thread/sleep 1000)
                 _ (is (= @sub
                          @(db/q [:find '?e
                                  :where ['?e :test/attr]]
                                 conn)
                          (d/q [:find '?e
                                :where ['?e :test/attr]]
                                (db/db* conn))))
                 _ (is (= @notified-times 2))])
           (finally (db/stop conn)))))) ; TODO `unposh!`
