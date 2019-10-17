(ns posh.lib.datascript-test
  "Created to assist development of 'tuple value' feature
  see https://github.com/mpdairy/posh/issues/37"
  (:require [clojure.test :refer [is deftest testing]]
            [datascript.core :as dt]
            [posh.clj.datascript :as d]))

(deftest test-datascript-conn
  (testing "Basic Datascipt dependency exists"
    (let [conn (dt/create-conn)]
      (is (some? conn) "Datascript connection can be created"))))

(deftest test-simple-query
  (let [conn (dt/create-conn {:a {:db/unique :db.unique/identity}})
        _ (d/posh! conn)
        tran-a (d/transact! conn [{:a "foo"}])
        eid (->> (d/q '[:find ?e
                        :where [?e :a "foo"]] conn)
                 deref
                 ffirst)]
    (is (some? eid) "Entity should be returned from basic matching query")))

;; NOTE: Hardcoding in a lookup-ref in :where isn't supposed to work -- only testing :in here
;;       https://docs.datomic.com/on-prem/identity.html#lookup-refs
(deftest test-lookup-ref-in
  (testing "Lookups refs work within query :in"
    (let [conn (dt/create-conn {:a {:db/unique :db.unique/identity}})
          _ (d/posh! conn)
          tran-a (d/transact! conn [{:a "foo"
                                     :b "bar"
                                     :c "baz"}])
          b (->> (d/q '[:find ?b ?c
                        :in $ ?lookup
                        :where
                        [?lookup :b ?b]
                        [?lookup :c ?c]]
                      conn [:a "foo"])
                 deref
                 first)]
      (is (= b ["bar" "baz"])))))

(deftest test-lookup-ref-transact
  (testing "Lookups refs work via db/transact"
    (let [conn (dt/create-conn {:a {:db/unique :db.unique/identity}})
          _ (d/posh! conn)
          tran-a (d/transact! conn [{:a "foo"
                                     :b "bar"}])
          ent-a (->> (d/q '[:find ?e
                            :where [?e :a "foo"]] conn)
                     deref
                     ffirst
                     (dt/entity (dt/db conn))
                     dt/touch)
          tran-b (d/transact! conn [[:db/add [:a "foo"] :b "zim"]])
          ent-b (->> (d/q '[:find ?e
                            :where [?e :a "foo"]] conn)
                     deref
                     ffirst
                     (dt/entity (dt/db conn))
                     dt/touch)]
      (is (= (:b ent-a) "bar"))
      (is (= (:b ent-b) "zim") "lookup ref overwrote previous value")
      (is (= (:db/id ent-a) (:db/id ent-b)) "lookup ref modified same entity as original tx"))))

(deftest test-tuple-value-in
  (testing "Query for tuple values works via :in"
    (let [conn (dt/create-conn)
          _ (d/posh! conn)
          tran (d/transact! conn [{:a ["foo" "bar"]
                                   :b 42}])
          ent (->> (d/q '[:find ?e
                          :in $ ?v
                          :where [?e :a ?v]] conn ["foo" "bar"])
                   deref
                   ffirst
                   (dt/entity (dt/db conn))
                   dt/touch)]
      (= ["foo" "bar"] (:a ent))
      (= 42 (:b ent)))))

(deftest test-tuple-value-where
  (testing "Query for tuple values works in :where clause"
    (let [conn (dt/create-conn)
          _ (d/posh! conn)
          tran (d/transact! conn [{:a ["foo" "bar"]
                                   :b 42}])
          ent (->> (d/q '[:find ?e
                          :where [?e :a ["foo" "bar"]]] conn)
                   deref
                   ffirst
                   (dt/entity (dt/db conn))
                   dt/touch)]
      (= ["foo" "bar"] (:a ent))
      (= 42 (:b ent)))))

(defn test-all
  []
  (let [names ["test-lookup-ref-in"
               "test-lookup-ref-transact"
               "test-tuple-value-in"
               "test-tuple-value-where"]]
    (for [name names]
      (do (println "Starting" name "...")
          (Thread/sleep 3000)
          ((ns-resolve *ns* (symbol name)))
          (Thread/sleep 25)))))
