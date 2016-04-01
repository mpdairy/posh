(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]
            [posh.datom-match :refer [datom-match? any-datoms-match? query-symbol?]]
            [posh.datom-matcher :as dm]
            [posh.pull-pattern-gen :as pull-gen]
            [posh.q-pattern-gen :as q-gen]
            [posh.pull-analyze :as pa]
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
;;; posh-db

(defn posh-db [conn]
  (let [reaction-buffers (get-atom conn :reaction-buffers)
        active-queries   (get-atom conn :active-queries)
        last-tx-report   (get-atom conn :last-tx-report)
        query-key        [:posh-db]]
    (if-let [r (@reaction-buffers query-key)]
      {:conn conn
       :filters []
       :reaction r}
      (let [new-reaction
            (ra/make-reaction
             (fn []
               {:tx (:tx-data @last-tx-report)
                :db (or (:db-after @last-tx-report) @conn)}))]
        (swap! reaction-buffers merge
               {query-key new-reaction})
        {:conn conn
         :filters []
         :reaction new-reaction}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; filter

(defn filter-pull [poshdb pull-pattern entity-id]
  (let [conn             (:conn poshdb)
        reaction-buffers (get-atom conn :reaction-buffers)
        active-queries   (get-atom conn :active-queries)
        last-tx-report   (get-atom conn :last-tx-report)
        filters          (concat (:filters poshdb) [[:pull pull-pattern entity-id]])
        storage-key      [:filter-pull filters pull-pattern entity-id]]
    (if-let [r (@reaction-buffers storage-key)]
      {:conn conn
       :filters filters
       :reaction r}
      (let [new-reaction
            (let [saved-patterns (atom nil)
                  saved-tx       (atom [])
                  saved-db       (atom nil)
                  saved          (atom {})]
              (ra/make-reaction
               (fn []
                 (let [{:keys [tx db]} @(:reaction poshdb)]
                   (if (or (nil? @saved-patterns)
                           (dm/any-datoms-match? @saved-patterns tx))
                     (let [{:keys [patterns results datoms]}
                           (pa/pull-analyze d/pull d/q d/entid
                                            [:results :datoms :patterns]
                                            (:schema @conn)
                                            db
                                            pull-pattern
                                            entity-id)]
                       (reset! saved-patterns patterns)
                       (swap! saved merge
                              {:tx (filter #(dm/datom-match? @saved-patterns %) tx)
                               :db (d/filter db
                                             (fn [_ datom]
                                               (dm/datom-match? @saved-patterns datom)))}))
                     @saved)))
               :on-dispose (fn [_ _]
                             (swap! active-queries disj storage-key)
                             (swap! reaction-buffers dissoc storage-key))))]
        (swap! active-queries conj storage-key)
        (swap! reaction-buffers merge {storage-key new-reaction})
        {:conn conn
         :filters filters
         :reaction new-reaction}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; reactions

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
                 (if (dm/any-datoms-match? patterns
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

(defn pull-tx [conn tx-patterns pull-pattern entity-id]
  (let [reaction-buffers (get-atom conn :reaction-buffers)
        active-queries   (get-atom conn :active-queries)
        last-tx-report   (get-atom conn :last-tx-report)
        storage-key      [:pull tx-patterns pull-pattern entity-id]]
    (if-let [r (@reaction-buffers storage-key)]
      r
      (let [new-reaction
            (let [{:keys [patterns results]}
                  (pa/pull-analyze d/pull d/q d/entid
                                   (concat [:results]
                                           (when-not tx-patterns [:patterns]))
                                   (:schema @conn)
                                   @conn
                                   pull-pattern
                                   entity-id)
                  saved-results  (atom results)
                  saved-patterns (atom patterns)]
              (ra/make-reaction
               (fn []
                 (if (dm/any-datoms-match? (or tx-patterns @saved-patterns)
                                           (:tx-data @last-tx-report))
                   (let [{:keys [patterns results]}
                         (pa/pull-analyze d/pull d/q d/entid
                                          (concat [:results]
                                                  (when-not tx-patterns [:patterns]))
                                          (:schema @conn)
                                          @conn
                                          pull-pattern
                                          entity-id)]
                     (when-not tx-patterns (reset! saved-patterns patterns))
                     (reset! saved-results results))
                   @saved-results))
               :on-dispose (fn [_ _]
                             (swap! active-queries disj storage-key)
                             (swap! reaction-buffers dissoc storage-key))))]
        (swap! active-queries conj storage-key)
        (swap! reaction-buffers merge {storage-key new-reaction})
        new-reaction))))

(defn pull [conn pull-pattern entity-id]
  (pull-tx conn
           nil
           pull-pattern entity-id))

(defn build-query [db q args]
  (apply (partial d/q q)
         (cons db (or args []))))

(comment (defn newq [query & args]
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
                 new-reaction)))))


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

(defn q [conn query & args]
  (apply (partial
          q-tx
          conn
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



