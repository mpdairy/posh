(ns posh.clj.datomic-test
  (:require [clojure.test          :as test
              :refer [is deftest testing]]
            [datomic.api           :as d]
            [posh.clj.datomic      :as db]
            [posh.lib.datomic      :as ldb]
            [posh.lib.ratom        :as r]
            [posh.lib.util         :as u
              :refer [debug prl]]
            [posh.clj.common-tests :as common]))

(deftest basic-test
  (ldb/with-posh-conn db/dcfg [:results] "datomic:mem://test"
    {:test/attr {:db/valueType   :db.type/string
                 :db/cardinality :db.cardinality/one}}
    (fn [poshed conn]
      (common/basic-test conn
        {:db        ldb/db*
         :q         db/q
         :q*        d/q
         :tempid    ldb/tempid
         :transact! db/transact!}))))
