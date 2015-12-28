(ns posh.core
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [goog.dom :as gdom]
            [reagent.core :as r]
            [datascript.core :as d]
            [posh.datom-match :refer [datom-match? any-datoms-match? query-symbol?]]
            [posh.pull-pattern-gen :as pull-gen]
            [posh.q-pattern-gen :as q-gen]))

(def posh-conn (atom (d/create-conn)))

(def posh-conns (atom {}))

(declare try-after-tx)

(defn posh! [conn]
  (swap! posh-conns merge {conn {:last-tx-report (r/atom [])
                                 :conn           (atom conn)
                                 :after-tx       (atom [])
                                 :before-tx      (atom [])}})
  (d/listen! @(:conn (@posh-conns conn)) :history
             (fn [tx-report]
               (do
                 ;;(println (pr-str (:tx-data tx-report)))
                 (doall
                  (for [tx-datom (:tx-data tx-report)
                        after-tx @(:after-tx (@posh-conns conn))]
                    (try-after-tx (:db-before tx-report)
                                  (:db-after tx-report)
                                  tx-datom after-tx)))
                 (reset! (:last-tx-report (@posh-conns conn)) tx-report)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transact

;; might have to make this something that combines the tx's or adds
;; filters or something. For now it's sort of pointless.

(def transactions-buffer (r/atom {}))

(defn split-tx-map [tx-map]
  (if (map? tx-map)
    (let [id (:db/id tx-map)]
      (map (fn [[k v]] [:db/add id k v]) (dissoc tx-map :db/id)))
    [tx-map]))

(defn clean-tx [tx]
  (apply concat (map split-tx-map tx)))

(defn transact! [conn tx]
  (swap! transactions-buffer
         #(update % conn (comp vec (partial concat (clean-tx tx)))))
  [:span])

(declare try-all-before-tx!)

(defn do-transaction! [conn]
  (let [tx (@transactions-buffer conn)]
    (when tx
      (let [_  (try-all-before-tx! conn tx)
            tx (@transactions-buffer conn)]
        (swap! transactions-buffer #(dissoc % conn))
        (d/transact! conn tx)))))

(defn update-transactions! []
  (doall (map (fn [[conn]] (do-transaction! conn)) @transactions-buffer)))

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
  (if-let [r (@established-reactions [:pull-tx conn patterns pull-pattern entity-id])]
    r
    (let [patterns (or patterns
                       (pull-gen/pull-pattern-gen pull-pattern entity-id))
          new-reaction
          (let [saved-pull (atom (when (not (or (query-symbol? entity-id)
                                                (deep-find query-symbol? pull-pattern)))
                                   (d/pull (d/db conn) pull-pattern entity-id)))]
            (reaction
             (if-let [vars (any-datoms-match?
                            (:db-before @(:last-tx-report (@posh-conns conn)))
                            patterns
                            (:tx-data @(:last-tx-report (@posh-conns conn))))]
               (let [new-pull (build-pull (:db-after @(:last-tx-report (@posh-conns conn)))
                                          pull-pattern entity-id vars)]
                 (if (not= @saved-pull new-pull)
                   (reset! saved-pull new-pull)
                   @saved-pull))
               @saved-pull)))]
      (swap! established-reactions merge
             {[:pull-tx conn patterns pull-pattern entity-id] new-reaction})
      new-reaction)))

(defn pull [conn pull-pattern entity-id]
  (pull-tx conn
           (pull-gen/pull-pattern-gen pull-pattern entity-id)
           pull-pattern entity-id))

(defn build-query [db q args]
  (apply (partial d/q q)
         (cons db (or args []))))

;; in the future this will return some restricing tx patterns

(defn q-tx [conn patterns query & args]
  (if-let [r (@established-reactions [:q-tx conn patterns query args])]
    r
    (let [patterns (or patterns
                       (q-gen/q-pattern-gen query args))
          new-reaction
          (let [saved-q    (atom (if (empty? (filter query-symbol? args))
                                   (build-query (d/db conn) query args)
                                   #{}))]
            (reaction
             (if-let [vars (any-datoms-match?
                            (:db-before @(:last-tx-report (@posh-conns conn)))
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

(defn try-before-tx [conn tx-datom [patterns handler-fn]]
  (if (datom-match? (d/db conn) patterns tx-datom)
    (handler-fn tx-datom (d/db conn))))

;;;; ADD FILTER-BEFORE-TX

(defn try-all-before-tx! [conn txs]
  (concat
   (remove
    nil?
    (doall
     (for [tx-datom txs
           before-tx @(:before-tx (@posh-conns conn))]
       (try-before-tx conn tx-datom before-tx))))
   txs))

(defn after-tx! [conn patterns handler-fn]
  (swap! (:after-tx (@posh-conns conn)) conj [patterns handler-fn]))

(defn before-tx! [conn patterns handler-fn]
  (swap! (:before-tx (@posh-conns conn)) conj [patterns handler-fn]))



;;;;; eventually this will be replaced with reagent's do-render:
(js/setInterval update-transactions! 17)


