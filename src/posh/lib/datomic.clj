(ns posh.lib.datomic
  "General Datomic utils."
  (:require [datomic.api      :as d]
            [posh.clj.datomic :as db])
  (:import posh.clj.datomic.PoshableConnection))

(def default-partition :db.part/default)

(defn tempid [] (d/tempid default-partition))

(defn install-partition [part]
  (let [id (d/tempid :db.part/db)]
    [{:db/id    id
      :db/ident part}
     [:db/add               :db.part/db
      :db.install/partition id]]))

(defn transact-schemas!
  "This is used because, perhaps very strangely, schema changes to Datomic happen
   asynchronously."
  {:todo #{"Make more robust"}}
  [conn schemas]
  (let [txn-report (db/transact! conn
                     (->> schemas
                          (map #(assoc % :db/id (d/tempid :db.part/db)
                                         :db.install/_attribute :db.part/db))))
        txn-id     (-> txn-report :tx-data first (get 3))
        _ #_(deref (d/sync (db/->conn conn) (java.util.Date. (System/currentTimeMillis))) 500 nil)
            (deref (d/sync-schema (db/->conn conn) (inc txn-id)) 500 nil)] ; frustratingly, doesn't even work with un-`inc`ed txn-id
    txn-report))

(defn with-conn [uri f]
  (try (d/create-database uri)
       (let [conn (d/connect uri)]
         (try (f conn)
           (finally (d/release conn))))
    (finally (d/delete-database uri))))

(defn with-posh-conn [uri schemas f]
  (with-conn uri
    (fn [conn*]
      (let [poshed (db/posh! conn*) ; This performs a `with-meta` so the result is needed
            conn   (-> poshed :conns :conn0) ; Has the necessary meta ; TODO simplify this
            _      (assert (instance? PoshableConnection conn))]
        (try (let [txn-report (db/transact! conn (install-partition default-partition))
                   txn-report (transact-schemas! conn schemas)]
               (f conn))
          (finally (db/stop conn))))))) ; TODO `unposh!`
