(ns posh.reagent
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [posh.plugin-base :as base
              :include-macros]
            [posh.lib.datascript :as ldb]
            [datascript.core     :as d]
            [reagent.core        :as r]
            [reagent.ratom       :as ra]))

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
              :make-reaction ra/make-reaction
              :conn->schema  ldb/conn->schema
              :additional-listeners ldb/add-schema-listener!}]
   (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
