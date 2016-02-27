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



(defn tx-datoms-for-pull-map [entity-id pull-map]
  (if (empty? pull-map)
    []
    (let [[k v] (first pull-map)
          r?    (reverse-lookup? k)
          k     (if r? (reverse-lookup k) k)]
      (if (= k :db/id)
        (tx-datoms-for-pull-map entity-id (rest pull-map))

        (concat
         (cond
          (ref-one? v)
          (concat
           (when (not r?) [[:db/add entity-id k (:db/id v)]])
           (tx-datoms-for-pull-map
            (:db/id v)
            (merge (when r? {k entity-id}) v)))

          (ref-many? v)
          (concat
           (when (not r?)
             (mapcat #(vector [:db/add entity-id k (:db/id %)]) v))
           (mapcat #(tx-datoms-for-pull-map
                     (:db/id %)
                     (merge (when r? {k entity-id}) %))
                   v))

          :else [[:db/add entity-id k v]])
         (tx-datoms-for-pull-map entity-id (rest pull-map)))))))

(defn generate-affected-tx-datoms-for-pull [affected-pull]
  (tx-datoms-for-pull-map (:db/id affected-pull) affected-pull))

(defn ref? [db attr]
  (= (get (get (:schema db) attr) :db/valueType)
     :db.type/ref))

(defn ref-one? [db attr]
  (when-let [e (get (:schema db) attr)]
    (and
     (= :db.type/ref (:db/valueType e))
     (not (= (:db/cardinality e) :db.cardinality/many)))))

(defn ref-many? [db attr]
  (when-let [e (get (:schema db) attr)]
    (and
     (= :db.type/ref (:db/valueType e))
     (= (:db/cardinality e) :db.cardinality/many))))

(comment
  (generate-affected-tx-datoms-for-pull
   (pull-affected-datoms (d/db conn) '[:todo/name {:category/_todo [:category/name]
                                                   :todo/owner [*]}] 2)))


