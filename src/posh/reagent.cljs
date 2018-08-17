(ns posh.reagent
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [posh.plugin-base :as base
              :include-macros]
            [datascript.core :as d]
            [reagent.core :as r]
            [reagent.ratom :as ra]))

(defn derive-reaction [reactions key f]
  ;; TODO: use key for efficiency
  ; (prn "deriving reaction...")
  (ra/make-reaction
    #(apply f (mapv deref reactions))))

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
              :ratom         r/atom
              :react         deref
              :derive-reaction derive-reaction
              :make-reaction ra/make-reaction}]
   (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
