(ns posh.clj.datomic
  "The public API of Posh's Datomic implementation (for Clojure)."
  (:require [posh.plugin-base   :as base]
            [posh.lib.ratom     :as rx]
            [datomic.api        :as d]
            [posh.lib.datomic   :as l]))

(def dcfg
  (let [dcfg {:db            l/db*
              :pull*         d/pull
              :q             l/q*
              :filter        d/filter
              :with          d/with
              :entid         d/entid
              :transact!     l/transact!*
              :listen!       l/listen!
              :conn?         l/conn?
              :->poshable-conn l/->poshable-conn
              :ratom         rx/atom
              :make-reaction rx/make-reaction}]
   (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
