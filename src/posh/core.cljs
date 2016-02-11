(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]
            [posh.datom-match :refer [datom-match? any-datoms-match? query-symbol?]]
            [posh.pull-pattern-gen :as pull-gen]
            [posh.q-pattern-gen :as q-gen]

            [reagent.ratom :as ra]))

(declare try-after-tx)

(defn posh! [conn]
  (let [posh-vars
        {:last-tx-report (r/atom [])
         :after-tx (atom [])
         :tx-buffer (atom [])
         :reaction-buffers (atom {})
         :active-queries (r/atom #{})}]
    (d/listen! conn :posh-dispenser
             (fn [var]
               (when (keyword? var)
                 (get posh-vars var))))
    (d/listen! conn :posh
               (fn [tx-report]
                 (do
                   (doall
                    (for [tx-datom (:tx-data tx-report)
                          after-tx @(:after-tx posh-vars)]
                      (try-after-tx (:db-before tx-report)
                                    (:db-after tx-report)
                                    tx-datom after-tx)))
                   (reset! (:last-tx-report posh-vars) tx-report))))))

;; Posh's state atoms are stored inside a listener in the meta data of
;; the datascript conn

(defn get-atom [conn var]
  ((:posh-dispenser @(:listeners (meta conn))) var))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transact

;; just calls d/transact! but returns a [:span] so that it doesn't
;; bother your component.

(defn transact! [conn tx]
  (d/transact! conn tx)
  [:span])

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; reactions

;; all of these memoize based on the pattern, so don't use anonymous
;; functions unless you are just going to call the reaction builder once


;; db-tx
;; returns :db-after of any new tx that matches pattern

(defn db-tx [conn patterns]
  (let [reaction-buffers (get-atom conn :reaction-buffers)
        active-queries   (get-atom conn :active-queries)
        last-tx-report   (get-atom conn :last-tx-report)
        query-key        [:db-tx patterns]]
    (if-let [r (@reaction-buffers query-key)]
      r
      (let [new-reaction
            (let [saved-db (atom (d/db conn))]
              (ra/make-reaction
               (fn []
                 (if (any-datoms-match? (:db-before @last-tx-report)
                                        patterns
                                        (:tx-data @last-tx-report))
                   (reset! saved-db (:db-after @last-tx-report))
                   @saved-db))
               :on-dispose (fn [_ _]
                             (swap! active-queries disj query-key)
                             (swap! reaction-buffers dissoc query-key))))]
        (swap! active-queries conj query-key)
        (swap! reaction-buffers merge
               {query-key new-reaction})
        new-reaction))))

(defn deep-find [f x]
  (if (coll? x)
    (if (empty? x)
      false
      (or (deep-find f (first x))
           (deep-find f (rest x))))
    (f x)))

(defn deep-map [f x]
  (cond
   (map? x) (let [r (map (partial deep-map f) x)]
              (zipmap (map first r) (map second r)))
   (coll? x) (vec (map (partial deep-map f) x))
   :else (f x)))

(defn build-pull [db pull-syntax entity vars]
  (d/pull db
          (if (empty? vars)
            pull-syntax
            (deep-map #(or (vars %) %) pull-syntax))
          (or (vars entity) entity)))

(defn pull-tx [conn patterns pull-pattern entity-id]
  (let [reaction-buffers (get-atom conn :reaction-buffers)
        active-queries   (get-atom conn :active-queries)
        last-tx-report   (get-atom conn :last-tx-report)
        storage-key      [:pull patterns pull-pattern entity-id]]
    (if-let [r (@reaction-buffers storage-key)]
      r
      (let [genpatterns     (or patterns
                             (pull-gen/pull-pattern-gen pull-pattern entity-id))
            query-key    [:pull genpatterns pull-pattern entity-id] 
            new-reaction
            (let [saved-pull (atom (when (not (or (query-symbol? entity-id)
                                                  (deep-find query-symbol? pull-pattern)))
                                     (d/pull (d/db conn) pull-pattern entity-id)))]
              (ra/make-reaction
               (fn []
                 (if-let [vars (any-datoms-match?
                                (:db-before @last-tx-report)
                                genpatterns
                                (:tx-data @last-tx-report))]
                   (let [new-pull (build-pull (:db-after @last-tx-report)
                                              pull-pattern entity-id vars)]
                     (if (not= @saved-pull new-pull)
                       (reset! saved-pull new-pull)
                       @saved-pull))
                   @saved-pull))
               :on-dispose (fn [_ _]
                             (swap! active-queries disj query-key)
                             (swap! reaction-buffers dissoc storage-key))))]
        (swap! active-queries conj query-key)
        (swap! reaction-buffers merge {storage-key new-reaction})
        new-reaction))))

(defn pull [posh-conn pull-pattern entity-id]
  (pull-tx posh-conn
           (pull-gen/pull-pattern-gen pull-pattern entity-id)
           pull-pattern entity-id))

(defn build-query [db q args]
  (apply (partial d/q q)
         (cons db (or args []))))

;; in the future this will return some restricing tx patterns

(defn q-tx [conn patterns query & args]
  (let [reaction-buffers (get-atom conn :reaction-buffers)
        active-queries   (get-atom conn :active-queries)
        last-tx-report   (get-atom conn :last-tx-report)
        storage-key      [:q patterns query args]]
    (if-let [r (@reaction-buffers storage-key)]
      r
      (let [genpatterns  (or patterns
                             (q-gen/q-pattern-gen query args))
            query-key    [:q genpatterns query args]
            new-reaction
            (let [saved-q    (atom (if (empty? (filter query-symbol? args))
                                     (build-query (d/db conn) query args)
                                     #{}))]
              (ra/make-reaction
               (fn []
                 (if-let [vars (any-datoms-match?
                                (:db-before @last-tx-report)
                                genpatterns
                                (:tx-data @last-tx-report))]
                   (let [new-q (build-query (:db-after @last-tx-report)
                                            query
                                            (map #(or (vars %) %) args))]
                     (if (not= @saved-q new-q)
                       (reset! saved-q new-q)
                       @saved-q))
                   @saved-q))
               :on-dispose (fn [_ _]
                             (swap! active-queries disj query-key)
                             (swap! reaction-buffers dissoc storage-key))))]
        (swap! active-queries conj query-key)
        (swap! reaction-buffers merge {storage-key new-reaction})
        new-reaction))))

(defn q [posh-conn query & args]
  (apply (partial
          q-tx
          posh-conn
          nil
          query)
         args))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TX Listeners

;; listens for any patterns in the tx-log and runs handler-fn
;; handler-fn takes the args [matching-tx-datom db]

(defn try-after-tx [db-before db-after tx-datom [patterns handler-fn]]
  (when (datom-match? db-before patterns tx-datom)
    (handler-fn tx-datom db-after)))

(defn after-tx! [conn patterns handler-fn]
  (swap! (get-atom conn :after-tx) conj [patterns handler-fn]))

;;;; Active Queries:

(defn active-queries [conn]
  (get-atom conn :active-queries))



