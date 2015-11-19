(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]]) 
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]))

(enable-console-print!)

(def posh-conn (atom (d/create-conn)))

(defonce last-tx-report (r/atom []))

(def newly-registered-tx-listeners (atom []))

(declare tx-listeners)
(declare try-tx-listener)

(defn setup [uconn]
  (reset! tx-listeners @newly-registered-tx-listeners)
  (reset! newly-registered-tx-listeners [])
  (reset! posh-conn uconn)
  (d/listen! @posh-conn :history
             (fn [tx-report]
               (do
                 (doall (map (partial try-tx-listener tx-report) @tx-listeners))
                 (reset! last-tx-report tx-report)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transact

;; might have to make this something that combines the tx's or adds
;; filters or something. For now this seems to work

(defn transact [tx]
  ((partial d/transact! @posh-conn) tx))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TX Pattern Match

(defn tx-item-match? [pattern-item tx-datom-item]
  (cond
   (= pattern-item '_) true
   (coll? pattern-item) (some #{tx-datom-item} pattern-item)
   (fn? pattern-item) (pattern-item tx-datom-item)
   :else (= pattern-item tx-datom-item)))

(defn tx-pattern-match? [pattern tx-datom]
  (cond
   (empty? pattern) true
   (tx-item-match? (first pattern) (first tx-datom))
     (recur (rest pattern) (rest tx-datom))
   :else false))

(defn tx-patterns-match? [patterns tx-datoms]
  (->> (for [p patterns
             d tx-datoms]
         (when (tx-pattern-match? p d) d))
       (filter (fn [b] b))
       first))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; db-tx 

;; returns :db-after of any new tx that matches pattern

(defn db-tx [patterns]
  (let [saved-db (atom (d/db @posh-conn))]
    (reaction
     (if (tx-patterns-match? patterns (:tx-data @last-tx-report))
       (reset! saved-db (:db-after @last-tx-report))
       @saved-db))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TX Listeners

;; listens for any patterns in the tx-log and runs f
;; f takes the args [matching-tx-datom db]
(def tx-listeners (atom []))

;; there were problems with duplicates being loaded when using figwheel
(reset! tx-listeners (vec (set @tx-listeners)))

(defn try-tx-listener [tx-report [patterns handler-fn]]
  (when-let [matching-datom
             (tx-patterns-match? patterns (:tx-data tx-report))]
    (handler-fn matching-datom (:db-after tx-report))))

(defn when-tx [patterns handler-fn]
  (swap! tx-listeners conj [patterns handler-fn]))

