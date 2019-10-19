(ns posh.reagent
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [posh.plugin-base :as base
             :include-macros true]
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
              :ratom         r/atom
              :make-reaction ra/make-reaction}]
    (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
