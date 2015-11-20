(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]
            [posh.tx-match :refer [tx-match? tx-patterns-match?]]))


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
                 ;;(println (pr-str (:tx-data tx-report)))
                 (doall (map (partial try-tx-listener tx-report) @tx-listeners))
                 (reset! last-tx-report tx-report)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transact

;; might have to make this something that combines the tx's or adds
;; filters or something. For now this seems to work

(defn transact [tx]
  ((partial d/transact! @posh-conn) tx))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; db-tx

;; returns :db-after of any new tx that matches pattern
;; memoizes, so it's prbly safe to put in form-1 components

(def established-reactions (atom {}))

(defn db-tx
  ([patterns] (db-tx patterns nil))
  ([patterns query]
     (if-let [r (@established-reactions [patterns query])]
       r
       (let [new-reaction
             (let [saved-db (atom (d/db @posh-conn))]
               (reaction
                (if (tx-match? @saved-db patterns query (:tx-data @last-tx-report))
                  (reset! saved-db (:db-after @last-tx-report))
                  @saved-db)))]
         (swap! established-reactions merge
                {[patterns query] new-reaction})
         new-reaction))))

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

