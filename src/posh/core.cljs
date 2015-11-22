(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]
            [posh.tx-match :refer [tx-match? tx-patterns-match?]]
            [posh.datom-match :refer [datom-match? any-datoms-match?]]))

(def posh-conn (atom (d/create-conn)))

(def posh-conns (atom {}))

(declare try-tx-listener)

(defn posh! [conn]
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
                 (reset! (:last-tx-report (@posh-conns conn)) tx-report)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transact

;; might have to make this something that combines the tx's or adds
;; filters or something. For now it's sort of pointless.

(defn transact! [conn tx]
  (d/transact! conn tx))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; reactions

;; all of these memoize based on the pattern, so don't use anonymous
;; functions unless you are just going to call the reaction builder once

(def established-reactions (atom {}))

;; db-tx
;; returns :db-after of any new tx that matches pattern

(defn db-tx [conn patterns]
  (if-let [r (@established-reactions [:db-tx conn patterns])]
    r
    (let [new-reaction
          (let [saved-db (atom (d/db conn))]
            (reaction
             (if (any-datoms-match? (:db-before @(:last-tx-report (@posh-conns conn)))
                                    patterns 
                                    (:tx-data @(:last-tx-report (@posh-conns conn))))
               (reset! saved-db (:db-after @(:last-tx-report (@posh-conns conn))))
               @saved-db)))]
      (swap! established-reactions merge
             {[:db-tx conn patterns] new-reaction})
      new-reaction)))

(defn pull-tx [conn patterns pull-pattern entity-id]
  (if-let [r (@established-reactions [:pull-tx conn patterns pull-pattern entity-id])]
    r
    (let [new-reaction
          (let [saved-pull (atom (d/pull (d/db conn) pull-pattern entity-id))]
            (reaction
             (if (any-datoms-match? (:db-before @(:last-tx-report (@posh-conns conn)))
                                    patterns
                                    (:tx-data @(:last-tx-report (@posh-conns conn))))
               (let [new-pull (d/pull (:db-after @(:last-tx-report (@posh-conns conn)))
                                      pull-pattern entity-id)]
                 (if (not= @saved-pull new-pull)
                   (reset! saved-pull new-pull)
                   @saved-pull))
               @saved-pull)))]
      (swap! established-reactions merge
             {[:pull-tx conn patterns pull-pattern entity-id] new-reaction})
      new-reaction)))

(defn build-query [db q args]
  (apply (partial d/q q)
         (cons db (or args []))))

(defn q-tx [conn patterns query & args]
  (if-let [r (@established-reactions [:q-tx conn patterns query args])]
    r
    (let [new-reaction
          (let [saved-q    (atom (build-query (d/db conn) query args))]
            (reaction
             (if-let [vars (any-datoms-match? (:db-before @(:last-tx-report (@posh-conns conn)))
                                              patterns
                                              (:tx-data @(:last-tx-report (@posh-conns conn))))]
               (let [new-q (build-query (:db-after @(:last-tx-report (@posh-conns conn)))
                                        query
                                        (map #(or (vars %) %) args))]
                 (if (not= @saved-q new-q)
                   (reset! saved-q new-q)
                   @saved-q))
               @saved-q)))]
      (swap! established-reactions merge
             {[:q-tx conn patterns query args] new-reaction})
      new-reaction)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TX Listeners

;; listens for any patterns in the tx-log and runs handler-fn
;; handler-fn takes the args [matching-tx-datom db]

(defn try-tx-listener [db-before db-after tx-datom [patterns handler-fn]]
  (if (datom-match? db-before patterns tx-datom)
    (handler-fn tx-datom db-after)))

(defn when-tx [conn patterns handler-fn]
  (swap! (:tx-listeners (@posh-conns conn)) conj [patterns handler-fn]))

