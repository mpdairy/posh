(ns posh.clj.datomic
  (:require [posh.plugin-base :as base]
            [posh.lib.ratom :as rx]
            [datomic.api :as d]))

(defn- TODO [& [msg]] (throw (ex-info (str "TODO: " msg) nil)))

(defn- conn? [x] (instance? datomic.Connection x))

; TODO maybe we don't want blocking here?)
(defn- transact!* [& args] @(apply d/transact args))

(defn- listen!
  ([conn callback] (listen! conn (rand) callback))
  ([conn key callback]
     {:pre [(conn? conn)]}
     (TODO "Need to figure out how to listen to Datomic connection in the same way as DataScript")
     key))

(def dcfg
  (let [dcfg {:db            d/db
              :pull*         d/pull
              :pull-many     d/pull-many
              :q             d/q
              :filter        d/filter
              :with          d/with
              :entid         d/entid
              :transact!     transact!*
              :listen!       listen!
              :conn?         conn?
              :ratom         rx/atom
              :make-reaction rx/make-reaction}]
    (assoc dcfg :pull (partial base/safe-pull dcfg))))

(base/add-plugin dcfg)
