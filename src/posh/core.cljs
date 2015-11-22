(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]
            [posh.tx-match :refer [tx-match? tx-patterns-match?]]))

(def posh-conn (atom (d/create-conn)))

(def posh-conns (atom {}))

(defonce last-tx-report (r/atom []))

(def newly-registered-tx-listeners (atom []))

(declare tx-listeners)
(declare try-tx-listener)

(defn init! [conn]
  ;;(reset! tx-listeners @newly-registered-tx-listeners)
  ;;(reset! newly-registered-tx-listeners [])
  (swap! posh-conns merge {conn {:last-tx-report (r/atom [])
                                 :conn           (atom conn)
                                 :tx-listeners   (atom [])}})
  (d/listen! @(:conn (@posh-conns conn)) :history
             (fn [tx-report]
               (do
                 ;;(println (pr-str (:tx-data tx-report)))
                 (doall
                  (for [tx-datom (:tx-data tx-report)
                        listener @(:tx-listeners (@posh-conns conn))]
                    (try-tx-listener (:db-before tx-report)
                                     (:db-after tx-report)
                                     tx-datom listener)))
                 #_(doall (map (partial try-tx-listener tx-report)
                               @(:tx-listeners (@posh-conns conn))))
                 (reset! (:last-tx-report (@posh-conns conn)) tx-report)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transact

;; might have to make this something that combines the tx's or adds
;; filters or something. For now it's sort of pointless.

(defn transact! [conn tx]
  (d/transact! conn tx))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; db-tx

;; returns :db-after of any new tx that matches pattern
;; memoizes, so it's prbly safe to put in form-1 components

(def established-reactions (atom {}))

(defn db-tx
  ([conn patterns] (db-tx conn patterns nil))
  ([conn patterns query]
     (if-let [r (@established-reactions [conn patterns query])]
       r
       (let [new-reaction
             (let [saved-db (atom (d/db conn))]
               (reaction
                (if (tx-match? @saved-db patterns query
                               (:tx-data @(:last-tx-report (@posh-conns conn))))
                  (reset! saved-db (:db-after @(:last-tx-report (@posh-conns conn))))
                  @saved-db)))]
         (swap! established-reactions merge
                {[conn patterns query] new-reaction})
         new-reaction))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TX Listeners

;; listens for any patterns in the tx-log and runs f
;; f takes the args [matching-tx-datom db]
;;(def tx-listeners (atom []))

;; there were problems with duplicates being loaded when using figwheel
;;(reset! tx-listeners (vec (set @tx-listeners)))

(defn try-tx-listener [db-before db-after tx-datom [patterns query handler-fn]]
  (if (tx-match? db-before patterns query [tx-datom])
    (handler-fn tx-datom db-after)))

(defn when-tx
  ([conn patterns handler-fn] (when-tx conn patterns nil handler-fn))
  ([conn patterns query handler-fn]
   (swap! (:tx-listeners (@posh-conns conn)) conj [patterns query handler-fn])))

