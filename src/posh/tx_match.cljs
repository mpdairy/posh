(ns posh.tx-match
  (:require [datascript.core :as d]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TX Pattern Match without Query (returns tx datom)

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
;;; TX Pattern Match with Query

(defn query-symbol? [s]
  (and (symbol? s) (= (first (str s)) \?)))

(defn tx-item-match-q? [pattern-item tx-datom-item]
  (cond
   (= pattern-item '_) true
   (query-symbol? pattern-item) {pattern-item tx-datom-item}
   (coll? pattern-item) (some #{tx-datom-item} pattern-item)
   (fn? pattern-item) (pattern-item tx-datom-item)
   :else (= pattern-item tx-datom-item)))

(defn tx-pattern-match-q? [pattern tx-datom]
  (loop [pattern   pattern
         tx-datom tx-datom
         vars      {}]
    (if (empty? pattern)
      vars
      (when-let [v (tx-item-match-q? (first pattern) (first tx-datom))]
        (recur (rest pattern) (rest tx-datom) (if (map? v) (merge v vars) vars))))))


(declare query-unifies?)

(defn tx-patterns-match-q? [db patterns tx-datoms]
  (->> (for [p patterns
             d tx-datoms]
         (if (map? p)
           (when-let [vars (tx-pattern-match-q? (first (keys p)) d)]
             (when (query-unifies? db vars (first (vals p))) {}))
           (tx-pattern-match-q? p d)))
       (remove nil?)
       first))





(defn build-query [vars query]
  (let [ks (keys vars)]
    (vec (concat [:find (vec ks)] 
                 [:in '$]
                 ks
                 [:where] query))))

(defn query-unifies? [db vars query]
  (println (pr-str vars) "   " (pr-str query)
           "  " (pr-str (apply
         (partial d/q (build-query vars query))
         (cons db (vals vars)))))
  (not (empty?
        (apply
         (partial d/q (build-query vars query))
         (cons db (vals vars))))))

(defn tx-match? [db patterns query tx-datoms]
  (when-let [vars (tx-patterns-match-q? db patterns tx-datoms)]
    (if (and query (not (empty? query)))
      (query-unifies? db vars query)
      vars)))
