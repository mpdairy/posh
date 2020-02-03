(ns posh.rum
  (:require 
    [posh.plugin-base :as base :include-macros true]
    [rum.core :as rum]
    [datascript.core :as d]))

(defn derive-reaction [reactions key f & local-mixin]
  (rum/derived-atom reactions key f))

(def dcfg
  (let [dcfg {:db              d/db
              :pull*           d/pull
              :q               d/q
              :filter          d/filter
              :with            d/with
              :entid           d/entid
              :transact!       d/transact!
              :listen!         d/listen!
              :conn?           d/conn?
              :ratom           atom
              :react           rum/react
              :derive-reaction derive-reaction}]
    (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
