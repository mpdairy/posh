(ns posh.reagent-test
  (:require [cljs.analyzer :as analyzer]
            #?(:clj  [clojure.test   :as t :refer        [is deftest testing]]
               :cljs [cljs.test      :as t :refer-macros [is deftest testing]])
            #?(:clj  [posh.reagent :as r]
               :cljs [posh.reagent :as r :include-macros true])))

(deftest basic-reagent-test
  (is (map? r/dcfg)))
