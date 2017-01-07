(ns posh.clj.datomic-test
  (:require [clojure.test     :as test
              :refer [is deftest testing]]
            [datomic.api      :as d]
            [posh.clj.datomic :as db]
            [posh.lib.ratom   :as r])
  (:import posh.clj.datomic.PoshableConnection))

(defonce debug? (atom true))

; TODO move
(defmacro prl
  "'Print labeled'.
   Puts each x in `xs` as vals in a map.
   The keys in the map are the quoted vals. Then prints the map."
  [level & xs]
  `(when @debug?
     (clojure.pprint/pprint ~(->> xs (map #(vector (list 'quote %) %)) (into {})))))

(def ^{:doc "The default partition"} default-partition :db.part/default)

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

(deftest basic-test
  (with-conn conn
    (let [poshed (db/posh! conn) ; This performs a `with-meta` so the result is needed
          conn   (-> poshed :conns :conn0) ; Has the necessary meta ; TODO simplify this
          _      (is (instance? PoshableConnection conn))]
      (try (let [txn-report (db/transact! conn (install-partition default-partition))
                 txn-report (db/transact! conn
                              [{:db/id                 (d/tempid :db.part/db)
                                :db/ident              :attr
                                :db/valueType          :db.type/string
                                :db/cardinality        :db.cardinality/one
                                :db.install/_attribute :db.part/db}])
                 sub (db/q [:find '?e '?v
                            :where ['?e :attr '?v]]
                           conn)]
             (prl @sub))
           (finally (db/stop conn)))))) ; TODO `unposh!`
