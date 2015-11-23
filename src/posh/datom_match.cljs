(ns posh.datom-match
  (:require [datascript.core :as d]))

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

(defn build-query [vars query]
  (let [ks (keys vars)]
    (vec (concat [:find (vec ks)] 
                 [:in '$]
                 ks
                 [:where] query))))

(defn query-unifies? [db vars query]
  (not (empty?
        (apply
         (partial d/q (build-query vars query))
         (cons db (vals vars))))))

(defn datom-pattern-match [db pattern datom vars queries]
  (when-let [ret-vars (tx-pattern-match-q? pattern datom)]
    (let [all-vars (merge vars ret-vars)]
      (cond
       (empty? ret-vars) vars
       (empty? queries) all-vars
       :else (when (query-unifies? db all-vars queries) all-vars)))))

(defn datom-match?
  ([db patterns datom] (datom-match? db patterns datom {} []))
  ([db patterns datom vars] (datom-match? db patterns datom vars []))
  ([db patterns datom vars queries]
     (if (map? patterns)
       (datom-match? db (first (keys patterns))
                     datom vars
                     (vec (concat queries (first (vals patterns)))))
       (->>
        (for [p patterns]
          (if (map? p)
            (datom-match? db p datom vars queries)
            (datom-pattern-match db p datom vars queries)))
        (remove nil?)
        first))))

(defn any-datoms-match?
  ([db patterns datoms] (any-datoms-match? db patterns datoms {} []))
  ([db patterns datoms vars] (any-datoms-match? db patterns datoms vars []))
  ([db patterns datoms vars queries]
     (->>
      (for [d datoms]
        (datom-match? db patterns d vars queries))
      (remove nil?)
      first)))

