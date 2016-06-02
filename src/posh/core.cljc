(ns posh.core
  (:require [datascript.core :as d]
            [posh.tree.core :as pt]
            [posh.tree.db :as db]
            [clojure.core.match :refer [match]]
            [posh.tree.update :as u]))

(defrecord Posh [cache
                 graph
                 dcfg
                 retrieve
                 return
                 conns
                 schemas
                 dbs])


(def poshtree (Posh. {} {} [] [] nil {} {} {}))


(defn new-posh [dcfg retrieve]
  (atom (pt/empty-tree dcfg retrieve)))

;;; db-id must be symbol
(defn db [posh-atom db-id conn schema db]
  (with-meta (:return (reset! posh-atom (pt/add-db @posh-atom db-id conn schema db)))
    {:posh posh-atom}))

(defn add-pull [poshdb pull-pattern eid]
  (let [posh-atom (:posh (meta poshdb))]
    (reset! posh-atom (pt/add-pull @posh-atom poshdb pull-pattern eid))))




