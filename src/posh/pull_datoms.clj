(ns posh.pull-datoms
  (:require [datascript.core :as d]))

(defn reverse-lookup? [attr]
  (= (first (name attr)) '\_))

(defn reverse-lookup [attr]
  (when (= (first (name attr)) '\_)
    (keyword (str (namespace attr) "/" (reduce str (rest (name attr)))))))

(defn dbid-into-vec [v]
  (if (not (some #{'* :db/id} v))
    (cons :db/id v)
    v))

(defn insert-dbid [pull-pattern]
  (cond
   (map? pull-pattern) (zipmap (keys pull-pattern)
                               (map insert-dbid (vals pull-pattern)))

   (vector? pull-pattern)
   (->> (dbid-into-vec pull-pattern)
        (map #(if (coll? %) (insert-dbid %) % ))
        vec)

   :else pull-pattern))

(defn pull-affected-datoms [db pull-pattern eid]
  (d/pull db (insert-dbid pull-pattern) eid))

(defn pull-ref-one? [v]
  (and (map? v) (:db/id v)))

(defn pull-ref-many? [v]
  (and (vector? v) (pull-ref-one? (first v))))

(defn ref? [db attr]
  (= (get (get (:schema db) attr) :db/valueType)
     :db.type/ref))

(defn cardinality-one? [db attr]
  (when-let [e (get (:schema db) attr)]
    (not (= (:db/cardinality e) :db.cardinality/many))))

(defn cardinality-many? [db attr]
  (when-let [e (get (:schema db) attr)]
    (= (:db/cardinality e) :db.cardinality/many)))

(defn tx-datoms-for-pull-map [db entity-id pull-map]
  (if (empty? pull-map)
    []
    (let [[k v] (first pull-map)
          r?    (reverse-lookup? k)
          k     (if r? (reverse-lookup k) k)]
      (cond
       (= k :db/id)
       (tx-datoms-for-pull-map db entity-id (rest pull-map))

       (ref? db k)
       (concat
        (cond
         (and (not r?) (cardinality-one? db k))
         (concat
          [[:db/add entity-id k (:db/id v)]]
          (tx-datoms-for-pull-map db (:db/id v) v))

         (or r? (cardinality-many? db k))
         (concat
          (when (not r?)
            (mapcat #(vector [:db/add entity-id k (:db/id %)]) v))
          (mapcat #(tx-datoms-for-pull-map
                    db
                    (:db/id %)
                    (merge (when r? {k {:db/id entity-id}}) %))
                  v))

         :else [[:db/add entity-id k v]])
        (tx-datoms-for-pull-map db entity-id (rest pull-map)))

       :else
       (concat
        (if (cardinality-many? db k)
          (mapcat #(vector [:db/add entity-id k %]) v)
          [[:db/add entity-id k v]])
        (tx-datoms-for-pull-map db entity-id (rest pull-map)))))))

(defn generate-affected-tx-datoms-for-pull [db affected-pull]
  (tx-datoms-for-pull-map db (:db/id affected-pull) affected-pull))

(defn pull-datoms [db pull-pattern ent-id]
  (generate-affected-tx-datoms-for-pull
   db
   (pull-affected-datoms db pull-pattern (d/entid db ent-id))))

;;;;; pull pattern generator

(defn limit-spec? [x]
  (and (seq? x) (= (first x) 'limit)))

(defn limit-attr [limit-spec]
  (second limit-spec))

(defn recursive-val? [v]
  (or (number? v) (= v '...)))

(defn tx-pattern-for-pull [db pull-pattern affected-pull]
  (let [entity-keys (remove #(or (map? %) (= :db/id %)) pull-pattern)
        val-keys    (remove #(or (reverse-lookup? %) (ref? db %)) entity-keys)
        ref-keys    (->> entity-keys
                         (remove (set val-keys))
                         (map (fn [k] {k [:db/id]})))
        starred?    (some #{'*} val-keys)
        pull-maps   (reduce merge (concat ref-keys (filter map? pull-pattern)))]
    (when (:db/id affected-pull)
      (concat
       (when (not (empty? val-keys))
         [[(:db/id affected-pull) (if starred? '_ (set val-keys)) '_]])
       (mapcat (fn [[ref-key ref-pull]]
                 (let [r? (reverse-lookup? ref-key)
                       unrev-key (if r? (reverse-lookup ref-key) ref-key)]
                   (concat
                    (if r?
                      [['_ unrev-key (:db/id affected-pull)]]
                      [[(:db/id affected-pull) ref-key '_]])
                    (cond
                     (recursive-val? ref-pull)
                     (when (ref-key affected-pull)
                       (mapcat #(tx-pattern-for-pull db pull-pattern %)
                               (ref-key affected-pull)))

                     (or r? (cardinality-many? db unrev-key))
                     (mapcat #(tx-pattern-for-pull db ref-pull %)
                             (ref-key affected-pull))
                     :else
                     (tx-pattern-for-pull db ref-pull (ref-key affected-pull))))))
               pull-maps)))))

(defn pull-tx-pattern [db pull-pattern ent-id]
  (let [prepped-pattern (insert-dbid (remove-limits pull-pattern))]
    (tx-pattern-for-pull
     db
     prepped-pattern
     (pull-affected-datoms db pull-pattern (d/entid db ent-id)))))


(comment
  [[:db/id
    :todo/name
    :todo/numbers
    {:category/_todo [:db/id :category/name], :todo/owner [*]}]

   {:db/id 2,
    :todo/name "Matt's List",
    :todo/numbers [12 20 443],
    :category/_todo
    [{:db/id 3, :category/name "At Home"}
     {:db/id 4, :category/name "Work Stuff"}
     {:db/id 5, :category/name "Hobby"}],
    :todo/owner {:db/id 1, :person/age 14, :person/name "Matt"}}]

  )

