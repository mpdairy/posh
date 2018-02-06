(ns posh.clj.common-tests
  "Test fns shared between Datomic and DataScript (at very least in CLJ, but probably cross-platform)."
  (:require [clojure.test        :as test
              :refer [is deftest testing]]
            [posh.lib.ratom      :as r]
            [posh.lib.util       :as u
              :refer [debug prl]]))

(defn basic-test [conn dcfg]
  (let [sub          ((:q dcfg) [:find '?e :where ['?e :test/attr]] conn)
        sub-no-deref ((:q dcfg) [:find '?e :where ['?e :test/attr]] conn)
        _ (is (= @sub #{}))
        notified (atom 0)
        _ (r/add-eager-watch sub :k (fn [_ _ _ _] (swap! notified inc)))
        notified-no-deref (atom 0)
        _ (r/add-eager-watch sub-no-deref :k-no-deref (fn [_ _ _ _] (swap! notified-no-deref inc)))]
    (testing "Listeners are notified correctly"
      ((:transact! dcfg) conn
        [{:db/id     ((:tempid dcfg))
          :test/attr "Abcde"}])
      (do @sub @sub @sub @sub)
      (is (= @sub
             @((:q dcfg) [:find '?e
                          :where ['?e :test/attr]]
                         conn)
             ((:q* dcfg) [:find '?e
                          :where ['?e :test/attr]]
                         ((:db dcfg) conn))))
      (is (= @notified 1))
      (is (= @notified-no-deref 1))
      ((:transact! dcfg) conn
        [{:db/id     ((:tempid dcfg))
          :test/attr "Fghijk"}])
      (do @sub @sub @sub @sub @sub)
      (is (= @notified 2))
      (is (= @notified-no-deref 2)))
    (testing "Remove-watch happens correctly"
      (remove-watch sub :k)
      (remove-watch sub :k-no-deref)
      ((:transact! dcfg) conn
        [{:db/id     ((:tempid dcfg))
          :test/attr "Lmnop"}])
      (do @sub @sub @sub @sub @sub @sub)
      (is (= @notified 2))
      (is (= @notified-no-deref 2)))))
