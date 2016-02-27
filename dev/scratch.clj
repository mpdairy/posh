(ns scratch
  (:require [datascript.core :as d]))

(def schema {:todo/name             {:db/unique :db.unique/identity}
             :todo/owner            {:db/valueType :db.type/ref
                                     :db/cardinality :db.cardinality/one}
             :task/category         {:db/valueType :db.type/ref}
             :category/todo         {:db/valueType :db.type/ref}
             :task/name             {:db/unique :db.unique/identity}
             :todo/display-category {:db/valueType :db.type/ref}
             :todo/numbers          {:db/cardinality :db.cardinality/many}
             :action/editing        {:db/cardinality :db.cardinality/many}})

(def conn (d/create-conn schema))

(def tempid (let [n (atom 0)] (fn [] (swap! n dec))))

(defn new-entity! [conn varmap]
  ((:tempids (d/transact! conn [(merge varmap {:db/id -1})])) -1))

(defn populate! [conn]
  (let [matt       (new-entity! conn {:person/name "Matt" :person/age 14})
        todo-id    (new-entity! conn {:todo/name "Matt's List" :todo/listing :all
                                      :todo/owner matt})
        at-home    (new-entity! conn {:category/name "At Home" :category/todo todo-id})
        work-stuff (new-entity! conn {:category/name "Work Stuff" :category/todo todo-id})
        hobby      (new-entity! conn {:category/name "Hobby" :category/todo todo-id})]
    (d/transact!
     conn
     [[:db/add todo-id :todo/numbers 12]
      [:db/add todo-id :todo/numbers 20]
      [:db/add todo-id :todo/numbers 443]
      {:db/id (tempid)
       :task/name "Clean Dishes"
       :task/done true
       :task/category at-home}
      {:db/id (tempid)
       :task/name "Mop Floors"
       :task/done true
       :task/pinned true
       :task/category at-home}
      {:db/id (tempid)
       :task/name "Draw a picture of a cat"
       :task/done false
       :task/category hobby}
      {:db/id (tempid)
       :task/name "Compose opera"
       :task/done true
       :task/category hobby}
      {:db/id (tempid)
       :task/name "stock market library"
       :task/done false
       :task/pinned true
       :task/category work-stuff}])))

(d/pull @conn '[*] [:task/name "Mop Floors"])

(populate! conn)

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

(comment
  (generate-affected-tx-datoms-for-pull
   (d/db conn)
   (pull-affected-datoms
    (d/db conn)
    '[:todo/name :todo/numbers {:category/_todo [:category/name]
                  :todo/owner [*]}] 2))

  (cardinality-many? @conn :todo/numbers)

  )


;;;;;;;;; Q

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
                         eavs))) results)))

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

(comment
  (def qd
    (q-datoms '[:find ?task ?task-name ?list-name
                :in $ ?true ?owner-name
                :where
                [?p :person/name ?owner-name]
                [?todo :todo/owner ?p]
                [?todo :todo/name ?list-name]
                [?cat  :category/todo ?todo]
                [?task :task/category ?cat]
                [?task :task/done ?true]
                [?task :task/name ?task-name]]
              @conn true "Matt"))

  (d/q '[:find ?task ?task-name ?list-name
              :in $ ?true ?owner-name
              :where
              [?p :person/name ?owner-name]
              [?todo :todo/owner ?p]
              [?todo :todo/name ?list-name]
              [?cat  :category/todo ?todo]
              [?task :task/category ?cat]
              [?task :task/done ?true]
              [?task :task/name ?task-name]]
            @conn2 true "Matt")

  (def conn2 (d/create-conn schema))
  (d/transact! conn2 qd)
  )


(comment

  (d/q '[:find (pull ?c [:task/name])
         :where
         [?c :task/name]]
       @conn)
  

  (d/q '[:find ?c ?t ?cat-name
         :in $ ?cat-name
         :where
         [?c :category/name ?cat-name]
         [?t :task/category ?c]
         ]
       @conn
       "Hobby")

  (let [query '[:find ?task ?task-name ?list-name
                :in $ ?true ?owner-name
                :where
                [?p :person/name ?owner-name]
                [?todo :todo/owner ?p]
                [?todo :todo/name ?list-name]
                [?cat  :category/todo ?todo]
                [?task :task/category ?cat]
                [?task :task/done ?true]
                [?task :task/name ?task-name]]
        qm    (query-to-map query)
        args  [@conn true "Matt"]
        where (normalize-all-eavs (:where qm))
        eavs  (get-eavs where)
        vars  (get-all-vars eavs)
        newqm (merge qm {:find vars :where where})
        newq  (qm-to-query newqm)
        r     (apply (partial d/q newq) args)]
    (map #(vec (cons :db/add %))
         (create-q-datoms r eavs vars)))

  (d/q '[:find ?task ?task-name ?list-name
         :in $ ?true ?owner-name
         :where
         [?p :person/name ?owner-name]
         [?todo :todo/owner ?p]
         [?todo :todo/name ?list-name]
         [?cat  :category/todo ?todo]
         [?task :task/category ?cat]
         [?task :task/done ?true]
         [?task :task/name ?task-name]]
       @conn
       true
       "Matt")

  (d/q '[:find ?task ?cat ?todo ?p
         :in $ ?true ?owner-name
         :where
         [?p :person/name ?owner-name]
         [?todo :todo/owner ?p]
         [?todo :todo/name ?list-name]
         [?cat  :category/todo ?todo]
         [?task :task/category ?cat]
         [?task :task/done ?true]
         [?task :task/name ?task-name]]
       @conn
       true
       "Matt")

  (d/q '[:find ?e ?a ?v ?t
         :in $ [[?e ?a]]
         :where
         [?e ?a ?v ?t]]
       @conn
       [[:db/add 2 :todo/name]
        [:db/add 2 :todo/numbers]
        [:db/add 3 :category/todo]
        [:db/add 3 :category/name]
        [:db/add 4 :category/todo]])

  (ref? @conn :category/name)

  (d/attribute @conn :category/name)

  (:schema @conn)
  (d/entity @conn 1)

  (d/transact! conn [[:db/add -1 :person/name {:a "hello" :b "ben jones"}]])

  (d/entity @conn [:todo/name "Matt's List"])

  (d/pull @conn '[:todo/name {:category/_todo [:category/name]}] 1)

  )

