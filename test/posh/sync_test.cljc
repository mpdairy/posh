(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]
    #?(:clj [datascript.core     :as ds])
    #?(:clj [posh.clj.datascript :as pds]) ; TODO CLJC
            [posh.lib.datascript :as lds]
    #?(:clj [datomic.api         :as dat])
    #?(:clj [posh.clj.datomic    :as pdat])
    #?(:clj [posh.lib.datomic    :as ldat])
            [posh.lib.ratom      :as r]
            [posh.lib.util       :as u
              #?(:clj  :refer
                 :cljs :refer-macros) [debug prl]]))

#_(try #_(clojure.main/repl
           :print  clojure.pprint/pprint
           :caught clojure.pprint/pprint)
       (require '[clojure.tools.namespace.repl :refer [refresh]])
       (let [x (refresh)] (when (instance? Throwable x) (throw x)))
       (set! *warn-on-reflection* true)
       (eval `(do (reset! posh.lib.util/debug? true)
                  (clojure.test/run-tests 'posh.lib.ratom-test)
                  (clojure.test/run-tests 'posh.clj.datascript-test)
                  (clojure.test/run-tests 'posh.clj.datomic-test)
                  (clojure.test/run-tests 'posh.sync-test)))
    (catch Throwable t (println t)))

; A little sync test between Datomic and Clojure DataScript (i.e. ignoring websocket transport for
; now, but focusing on sync itself) showing that the DataScript DB really only gets the subset
; of the Datomic DB that it needs, and at that, only the authorized portions of that subset.
#?(:clj
(deftest local-sync:datomic<->datascript
  (ldat/with-posh-conn [:datoms-t] "datomic:mem://test"
    [{:db/ident       :test/attr
      :db/valueType   :db.type/string
      :db/cardinality :db.cardinality/one}]
    (fn [dat]
      (let [ds (ds/create-conn {:test/attr
                                {;:db/valueType   :db.type/string
                                 :db/cardinality :db.cardinality/one}})
            _  (pds/posh-one! ds [:datoms-t])
            ds-sub  (pds/q  [:find '?e :where ['?e :test/attr]] ds)
            _       (r/add-eager-watch ds-sub  :ds  (fn [_ _ oldv newv] (prl "DS"  oldv newv)))
            dat-sub (pdat/q [:find '?e :where ['?e :test/attr]] dat)
            _       (r/add-eager-watch dat-sub :dat (fn [_ _ oldv newv] (prl "DAT" oldv newv)))]
        (pds/transact! ds
          [{:db/id     (lds/tempid)
            :test/attr "A"}])
        (pdat/transact! dat
          [{:db/id     (ldat/tempid)
            :test/attr "A"}]))))

  ))
