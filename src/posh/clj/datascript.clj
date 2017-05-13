(ns posh.clj.datascript
  (:require [posh.plugin-base :as base]
            [posh.lib.ratom :as rx]
            [posh.lib.datascript :as ldb]
            [datascript.core :as d]))

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
              :ratom         rx/atom
              :make-reaction rx/make-reaction
              :conn->schema  ldb/conn->schema
              :additional-listeners ldb/add-schema-listener!}]
   (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
