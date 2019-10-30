(ns posh.reagent
  (:require #?(:clj  [posh.plugin-base :as base]
               :cljs [posh.plugin-base :as base :include-macros true])
            [datascript.core :as d]
            [reagent.core :as r]
            [reagent.ratom :as ra]))

(def dcfg
  (let [dcfg {:db            d/db
              :pull*         d/pull
              :pull-many     d/pull-many
              :q             d/q
              :filter        d/filter
              :with          d/with
              :entid         d/entid
              :transact!     d/transact!
              :listen!       d/listen!
              :conn?         d/conn?
              :ratom         #?(:clj  nil
                                :cljs r/atom)
              :make-reaction #?(:clj  nil
                                :cljs ra/make-reaction)}]
    (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
