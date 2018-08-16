(ns posh.rum
  (:require 
    [posh.plugin-base :as base]
    [rum.core :as rum]
    [datascript.core :as d]))

(defn make-reaction [f & {:as local-mixin :keys [on-dispose]}]
  ;; TODO: handle at least the on-dispose method of the local mixin
  (rum/derived-atom [] ::no-refs-anyways f))

(def dcfg
  (let [dcfg {:db            d/db
              :pull*         d/pull
              :q             d/q
              :filter        d/filter
              :with          d/with
              :entid         d/entid
              :transact!     d/transact!
              :listen!       d/listen!
              :conn?         d/conn?
              :ratom         atom
              :react         rum/react
              :make-reaction make-reaction}]
    (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
