(ns posh.q-datoms
  (:require [datascript.core :as d]))


;;;;;;;;; Q-datoms  -- gets datoms for a query


(defn take-until [stop-at? ls]
  (if (or
       (empty? ls)
       (stop-at? (first ls)))
    []
    (cons (first ls) (take-until stop-at? (rest ls)))))

(defn rest-at [rest-at? ls]
  (if (or (empty? ls) (rest-at? (first ls)))
    ls
    (recur rest-at? (rest ls))))

(defn split-list-at [split-at? ls]
  (if (empty? ls)
    {}
    (merge {(first ls) (take-until split-at? (take-until split-at? (rest ls)))}
           (split-list-at split-at? (rest-at split-at? (rest ls))))))

(defn query-to-map [query]
  (split-list-at keyword? query))


(defn qvar? [x] (and (symbol? x) (= (first (str x)) \?)))

(defn get-all-vars [query]
  (cond
   (empty? query) #{}
   (coll? (first query)) (clojure.set/union (get-all-vars (first query))
                                            (get-all-vars (rest query)))
   (qvar? (first query)) (conj (get-all-vars (rest query)) (first query))
   :else (get-all-vars (rest query))))

(def qvar-gen
  (let [qvar-count (atom 3284832)]
    (fn [] (symbol (str "?var" (swap! qvar-count inc))))))

(defn eav? [v]
  (and (vector? v)
       (not (some coll? v))))

(defn wildcard? [s] (= s '_))

(defn normalize-eav-helper [eav n neweav vars]
  (if (= n 0)
    {:eav neweav :vars vars}
    (if (and (first eav) (not (wildcard? (first eav))))
      (normalize-eav-helper (rest eav) (dec n)
                            (conj neweav (first eav))
                            vars)
      (let [var (qvar-gen)]
        (normalize-eav-helper (rest eav) (dec n)
                              (conj neweav var)
                              (conj vars var))))))

(defn normalize-eav [eav]
  (vec (:eav (normalize-eav-helper eav 3 [] []))))

(defn normalize-all-eavs [where]
  (cond
   (empty? where) []

   (list? where)
   (if (some #{(first where)} ['or-join 'not-join]) ;; skip first vector
     (concat [(first where) (second where)] (normalize-all-eavs (vec (drop 2 where))))
     (cons (first where) (normalize-all-eavs (vec (rest where)))))

   (eav? where)
   (normalize-eav where)

   (and (vector? where) (list? (first where)))
   where

   (coll? where)
   (vec (map normalize-all-eavs where))

   :else where))

(defn get-eavs [where]
  (if (empty? where)
    []
    (let [item (first where)]
      (cond
       (seq? item)
       (if (some #{(first item)} ['or-join 'not-join]) ;; skip first vector
         (concat (get-eavs (vec (rest where))) (get-eavs (vec (drop 2 item))))
         (concat (get-eavs (vec (rest where))) (get-eavs (vec (rest item)))))

       (eav? item)
       (cons item (get-eavs (rest where)))

       (and (vector? item) (seq? (first item)))
       (get-eavs (vec (rest where)))


       :else (get-eavs (vec (rest where)))))))

(defn qm-to-query [qm]
  (reduce (fn [xs [k v]]
            (concat xs [k] v))
          []
          qm))

(defn create-q-datoms [results eavs vars]
  (set
   (mapcat (fn [r] (let [vs (zipmap vars r)]
                    (map (fn [eav]
                           (vec (map #(if (qvar? %) (get vs %) %) eav)))
                         eavs)
                    )) results)))

(defn q-datoms [query & args]
  (let [qm    (query-to-map query)
        where (normalize-all-eavs (:where qm))
        eavs  (get-eavs where)
        vars  (get-all-vars eavs)
        newqm (merge qm {:find vars :where where})
        newq  (qm-to-query newqm)
        r     (apply (partial d/q newq) args)]
    (map #(vec (cons :db/add %))
         (create-q-datoms r eavs vars))))


;;; q pattern gen ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn count-qvars [xs]
  (cond
   (empty? xs) {}
   (coll? (first xs)) (merge-with + (count-qvars (first xs)) (count-qvars (rest xs)))
   :else (merge-with +
                     (when (qvar? (first xs)) {(first xs) 1})
                     (count-qvars (rest xs)))))

(defn fill-qvar-set [qvar results where]
  (for [r results]
    (let [vars (zipmap where r)]
      (get vars qvar))))

(defn q-pattern [query & args]
  (let [qm    (query-to-map query)
        where (normalize-all-eavs (:where qm))
        eavs  (get-eavs where)
        vars  (vec (get-all-vars eavs))
        newqm (merge qm {:find vars :where where})
        newq  (qm-to-query newqm)
        r     (apply (partial d/q newq) args)]
    eavs))
