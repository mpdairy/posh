(ns posh.reagent
  (:require [posh.plugin-base :as base :include-macros true]
            [datascript.core :as d]
            [reagent.core :as r]
            [reagent.ratom :as ra]))

(defn derive-reaction [reactions key f & local-mixin]
  (apply ra/make-reaction
    #(apply f (mapv deref reactions))
    local-mixin))

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
              :ratom         r/atom
              :react         deref
              :derive-reaction derive-reaction}]
    (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
