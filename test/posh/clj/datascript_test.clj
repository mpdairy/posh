(ns posh.clj.datascript-test
  (:require [clojure.test          :as test
              :refer [is deftest testing]]
            [datascript.core       :as d]
            [posh.clj.datascript   :as db]
            [posh.lib.datascript   :as l]
            [posh.lib.ratom        :as r]
            [posh.lib.util         :as u
              :refer [debug prl]]
            [posh.clj.common-tests :as common]))

(def default-partition :db.part/default)

(defn tempid [] (d/tempid default-partition))

(deftest basic-test
  (let [conn (d/create-conn (l/->schema {:test/attr
                                          {:db/valueType   :db.type/string
                                           :db/cardinality :db.cardinality/one}}))
        _    (db/posh! conn)]
    (common/basic-test conn
      {:q         db/q
       :q*        d/q
       :db        d/db
       :tempid    tempid
       :transact! db/transact!})))
