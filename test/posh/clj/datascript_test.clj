(ns posh.clj.datascript-test
  (:require [clojure.test        :as test
              :refer [is deftest testing]]
            [datascript.core     :as d]
            [posh.clj.datascript :as db]
            [posh.lib.ratom      :as r]
            [posh.lib.util       :as u
              :refer [debug prl]]))

(def default-partition :db.part/default)
(defn tempid [] (d/tempid default-partition))

(deftest basic-test
  (let [conn (d/create-conn {:test/attr
                              {;:db/valueType   :db.type/string
                               :db/cardinality :db.cardinality/one}})
        _    (db/posh! conn)]
    (try (let [sub (db/q [:find '?e
                          :where ['?e :test/attr]]
                         conn)
               _ (prl @sub)
               txn-report (db/transact! conn
                            [{:db/id      (tempid)
                              :test/attr  "Abcde"}])
               _ (is (= @sub
                        @(db/q [:find '?e
                                :where ['?e :test/attr]]
                               conn)
                        (d/q [:find '?e
                              :where ['?e :test/attr]]
                              (d/db conn))))]))))
