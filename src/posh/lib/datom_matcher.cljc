(ns posh.lib.datom-matcher
  (:require [clojure.set :as cs]))

(defn datom-match-pattern? [pattern datom]
  (if (empty? pattern)
    true
    (when (let [p (first pattern)]
            (or
             (= p '_)
             (and (set? p) (p (first datom)))
             (= p (first datom))))
      (recur (rest pattern) (rest datom)))))

(defn datom-match? [patterns datom]
  (some #(datom-match-pattern? % datom) patterns))

(defn any-datoms-match? [patterns datoms]
  (case patterns
    nil nil
    [] nil
    [[]] true
    (some #(datom-match? patterns %) datoms)))

(defn matching-datoms [patterns datoms]
  (case patterns
    [] datoms
    [[]] datoms
    nil nil
    (filter #(datom-match? patterns %) datoms)))

(defn combine-entids [entids rest-datom patterns new-patterns leftover-patterns]
  (if (empty? patterns)
    {:new-patterns (cons (vec (cons entids rest-datom)) new-patterns)
     :leftover-patterns leftover-patterns}
    (if (= rest-datom (rest (first patterns)))
      (recur (cs/union entids (if (set? (ffirst patterns))
                                (ffirst patterns)
                                (set [(ffirst patterns)])))
             rest-datom
             (rest patterns)
             new-patterns
             leftover-patterns)
      (recur entids rest-datom (rest patterns) new-patterns
             (cons (first patterns) leftover-patterns)))))

(defn reduce-patterns [patterns]
  (loop [new-patterns []
         leftover-patterns patterns]
    (if (empty? leftover-patterns)
      new-patterns
      (if (let [id (ffirst leftover-patterns)]
            (or (set? id) (number? id)))
        (let [r (combine-entids #{} (rest (first leftover-patterns))
                                leftover-patterns
                                new-patterns
                                [])]
          (recur (:new-patterns r) (:leftover-patterns r)))
        (recur (cons (first leftover-patterns) new-patterns) (rest leftover-patterns))))))

(comment
  (datom-match? '[#{123 88 32} :jimmy _] '[123 :jimmy "hey"])

  (datom-match-patterns? '[[88 :deandog]
                           [#{123 88 32} :jimmy _]] '[123 :jimmy "hey"])

  (any-datoms-match? '[[88 :deandog]
                       [#{123 88 32} :jimmy _]]
                     '[[28882 :major "billy"] [123 :jimmy "hey"]])

  
  )
