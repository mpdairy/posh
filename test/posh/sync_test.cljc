(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]))

#?(:clj
(deftest local-sync:datomic<->datascript
  ; A little sync test between Datomic and Clojure DataScript (i.e. ignoring websocket transport for
  ; now, but focusing on sync itself) showing that the DataScript DB really only gets the subset
  ; of the Datomic DB that it needs, and at that, only the authorized portions of that subset.
  ))
