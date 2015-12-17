(ns posh.pull-pattern-gen)

(defn reverse-lookup? [attr]
  (when (= (first (name attr)) '\_)
    (keyword (str (namespace attr) "/" (reduce str (rest (name attr)))))))

(declare pull-list)

(defn pull-datom [k ent-id]
  (if-let [rk (reverse-lookup? k)]
    ['_ rk ent-id]
    [ent-id k]))

(defn pull-map [m ent-id]
  (if (empty? m)
    []
    (let [[k v] (first m)]
      (concat [(pull-datom k ent-id)]
              (pull-list v '_)
              (pull-map (rest m) ent-id)))))

(defn pull-list [ls ent-id]
  (cond
   (empty? ls) []

   (= (first ls) '*)
   (cons [ent-id] (pull-list (rest ls) ent-id))

   (and (keyword? (first ls)) (not= (first ls) :db/id))
   (cons (pull-datom (first ls) ent-id) (pull-list (rest ls) ent-id))

   (map? (first ls))
   (concat (pull-map (first ls) ent-id)
           (pull-list (rest ls) ent-id))

   :else (pull-list (rest ls) ent-id)))

(defn pull-pattern-gen [ls ent-id]
  (let [p (pull-list ls ent-id)]
    (if (some #{['_]} p)
      '[_]
      p)))


