(ns scratch
  (:require [datascript.core :as d]))

(def conn (d/create-conn))


(def posh-conns (atom {}))
(defn init! [conn]
  ;;(reset! tx-listeners @newly-registered-tx-listeners)
  ;;(reset! newly-registered-tx-listeners [])
  (swap! posh-conns merge {conn {:last-tx-report (atom [])
                                 :conn           (atom conn)}})
  
  #_(d/listen! @(:conn (@posh-conns conn)) :history
             (fn [tx-report]
               (do
                 ;;(println (pr-str (:tx-data tx-report)))
                 ;;(doall (map (partial try-tx-listener tx-report) @tx-listeners))
                 (reset! (:last-tx-report (@posh-conns conn)) tx-report)))))

(init! conn)

@(:conn (@posh-conns conn))

(def bill {conn 5})


(def posh-conn (atom nil))

(def last-tx-report (atom []))

(def schema {:person/group {:db/valueType :db.type/ref}})
(def conn (d/create-conn schema))

(d/transact! conn
             [{:db/id -1 :group/name "Pine Club" :group/sort-by :person/name}
              {:db/id -2 :group/name "Oak Club" :group/sort-by :person/age}])

(let [groups (d/q '[:find [?g ...] :where [?g :group/name _]] @conn)]
  (d/transact!
   conn
   [{:db/id -3 :person/name "Bob" :person/age 30 :person/group (rand-nth groups) :person/dog "Mojo"}
    {:db/id -4 :person/name "Sally" :person/age 25 :person/group (rand-nth groups)}
    {:db/id -5 :person/name "Lodock" :person/age 45 :person/group (rand-nth groups)}
    {:db/id -6 :person/name "Janis" :person/age 22 :person/group (rand-nth groups)}
    {:db/id -7 :person/name "Angel-Bad" :person/age 14 :person/group (rand-nth groups)}
    {:db/id -8 :person/name "Shomo" :person/age 16 :person/group (rand-nth groups)}
    {:db/id -9 :person/name "Miagianna" :person/age 33 :person/group (rand-nth groups)}
    {:db/id -10 :person/name "Macy" :person/age 4 :person/group (rand-nth groups)}
    {:db/id -11 :person/name "Ojoto" :person/age 20 :person/group (rand-nth groups)}]))

(def bob (d/entity (d/db conn) 3))

(:group/name (:person/group (d/pull @conn '[*] 3)))

(defn person [id]
  (let [p (pull-tx conn '[[id]] `[*] id)]
    ...))

(def bob-db (d/db conn))
(:person/name (d/entity bob-db 3))
(d/transact! conn [[:db/add 3 :person/name "Bobby"]])
(:person/name (d/entity @conn 3))

(:person/_group (:person/group bob))



(d/transact! conn [[:db.fn/call ]])

(namespace :jimmy/hogan)

(d/q '[:find [?p]
       :where
       [?p :person/name "Bob"]
       [?p :person/group 1]
       [?p :person/group ?g]
       [?g :group/sort-by :person/name]]
     @conn)


@last-tx-report

(d/listen! @posh-conn :history
           (fn [tx-report]
             (reset! last-tx-report tx-report)))

(defn setup [conn]
  (reset! posh-conn conn)
  (d/listen! @posh-conn :history
             (fn [tx-report]
               (reset! last-tx-report tx-report))))

(setup conn)

(defn person-sortable [a]
  (when (some #{a} [:person/name :person/age :person/money :person/religion])
    {'?sort-attr a}))

(person-sortable :person/name)


(def db (d/db conn))

(d/touch (d/entity db 1))

;; txalt txorcist re-tx glorytx megatx oktx
;; okaytx poshtx


(d/q '[:find ?age
       :where
       [?p :age ?age]]
     @conn)

(d/q '[:find [?n ?a]
                 :where
                 [?e :name ?n]
                 [?e :age ?a]]
     @conn)

(def vcons (comp vec cons))

(let [p (d/q '[:find ?n ?a
               :where
               [?e :name ?n]
               [?e :age ?a]]
             @conn)]
  (vcons :div
         (map (fn [[n a]] [:div "Person: " n ", Age: " a]) p)))

(def history (atom []))

(defn jim [n] (+ 3 n))

(first (remove nil? (filter  [1 2 3 4 5])))

(some (fn [n] (when (= 3 n) :good)) [1 2 3 4 5])

(d/listen! conn :history
           (fn [tx-report]
             (swap! history #(cons (first %1) %2) tx-report)))

(defn build-query [db q & args]
  (apply (partial d/q q)
         (cons db (or args []))))

(build-q @conn '[:find ?age .
                 :in $ ?name
                 :where
                 [?p :person/name ?name]
                 [?p :person/age ?age]]
         "Bob")

(d/listen! conn :history
           (fn [tx-report]
             (reset! history tx-report)))

(d/transact! conn [[:db/add 8 :age (rand-int 10)]
                   [:db/add 7 :age (rand-int 10)]])

(first @history)

(map #(* % %) [1 2 3])


(map #(or ({2 :hey} %) %) [1 2 3])
(let [{:keys [e a v added]} (first (:tx-data (first @history)))]
  [e a v added])

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

(defn tx-patterns-match? [patterns tx-datoms]
  (->> (for [p patterns
             d tx-datoms]
         (when (tx-pattern-match? p d) d))
       (filter (fn [b] b))
       first))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

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

(tx-pattern-match-q? ['?id (fn [a] {'?a a}) '?n]
                  [123 :person/name "Jones"])

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

(tx-patterns-match-q? (d/db conn) [{['?p (fn [a] {`?a :person/}) "Bob"]
                                     [['?p :person/age 30]]}]

                      [[3 :person/name "Bob"]])

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

(defn tx-match? [db patterns query tx-datoms]
  (when-let [vars (tx-patterns-match-q? db patterns tx-datoms)]
    (if (and query (not (empty? query)))
      (query-unifies? db vars query)
      true)))


(defn datom-pattern-match [db pattern datom vars queries]
  (when-let [ret-vars (tx-pattern-match-q? pattern datom)]
    (let [all-vars (merge vars ret-vars)]
      (cond
       (empty? ret-vars) vars
       (empty? queries) all-vars
       :else (when (query-unifies? db all-vars queries) all-vars)))))

(datom-pattern-match @conn '[?p :person/name ?name] '[3 :person/name "Bob"]
                     {'?age 31}
                     '[[?p :person/age ?age]])


(defn datom-match?
  ([db patterns datom] (datom-match? db patterns datom {} []))
  ([db patterns datom vars] (datom-match? db patterns datom vars []))
  ([db patterns datom vars queries]
     (if (map? patterns)
       (datom-match? db (first (keys patterns))
                     datom vars
                     (vec (concat (first (vals patterns)) queries)))
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

;; (datom-match? db patterns d vars queries)

(any-datoms-match? @conn
                   {['[?p :person/name ?name]
                     {'[[?p :person/group]]
                      '[[?p :person/dog "Mojo"]]}]
                    '[[?p :person/age 30]]}
                   
                   '[[3 :person/name "Bob"]
                     [3 :person/group "Bob"]])

(datom-match? @conn
              {['[?p :person/name ?name]
                {'[[?p :person/group]]
                 '[[?p :person/dog ?dog]]}]
               '[[?p :person/age 30]]}
              
              '[3 :person/group "Bob"]

              {'?dog "Mojo"})

(datom-match? @conn
              ['[?p :person/name ?name]]
              '[3 :person/name "Bob"]
              {}
              '[[?p :person/age 30]])

(def c "hey")

(defn update-persons [persons]
  (for [p persons]
    [:db/add p :update (rand-int 99999)]))

(update-persons (range 10))

(first {:a 3})
(symbol? (second '[a 3]))

(let [[e a v t added] '[23433 :jim "hello"]]
  [e a v t added])

(def sample
  (let [x (atom 5)]
    (fn [a]
      (swap! x inc)
      (+ a @x)
      )))

(sample 3)


(comment


  [[group-id]
   ['_ :person/group group-id]
   {'[?p :person/name _ _ true] [['?p :person/group group-id]]}
   '[?p :person/age _ _ true]]


  (d/q '[:find [?p]
       :where
       [?p :person/name "Bob"]
       [?p :person/group 1]
       [1 :group/sort-by :person/named]]
       @conn)
  
  )


(defn replace-query-var [vars item]
  (if (list? item)
    (map (partial replace-query-var vars) item)
    (if-let [r (and (symbol? item) (vars item))] r item)))

(defn replace-query-vars [vars query]
  (vec
   (for [q query]
     (vec (map (partial replace-query-var vars) q)))))


(defn query-vals-to-vars [vars query]
  
  )

(replace-query-vars {'?a 43 '?n "jimmy"} '[[?id :person/age ?a]
                                           [?id :person/name ?n]
                                           [(> ?a 32)]])



(d/q '[:find [?n ?a]
       :in $ ?n ?a
       :where
       [?p :name ?n]
       [?p :age ?a]]
     (d/db conn) "Bob" 31)





(query-unifies?
 (d/db conn)
 {'?a 30 '?n "Bob"}
 '[[?p :age ?a]
   [?p :name ?n]])

(vals {'?a 43 '?n "jimmy"})
(build-query {'?a 43 '?n "jimmy"} '[[?id :person/age ?a]
                                   [?id :person/name ?n]
                                   [(> ?a 32)]])

(let [patterns '[[_ [:age :bob]]
                 [?p :person/name ?n]]
      tx-datoms '[[1 :person/name "jimmy"]
                  [2 :person/age 21]]]
  (tx-patterns-match-q? patterns tx-datoms))


(defn tx-patterns-match? [patterns tx-datoms]
  (->> (for [p patterns
             d tx-datoms]
         (when (tx-pattern-match? p d) d))
       (filter (fn [b] b))
       first))


(defn tx-patterns-match-with-q? [patterns tx-datoms q conn]
  
  )

(let [patterns '[[_ [:age :bob]]
                 [_ :name]]
      tx-datoms '[[8 :bob 34]
                  [8 :bigzon 230]]]
  (tx-patterns-match? patterns tx-datoms))

(def db-at-tx
  (let [saved-db (atom (d/db conn))]
    (fn [patterns]
      (let [tx-report (last @history)]
        (if (tx-patterns-match? patterns (:tx-data tx-report))
          (reset! saved-db (:db-after tx-report))
          saved-db)))))

(d/q '[:find [?name ?age]
       :in $ ?id
       :where
       [?id :name ?name]
       [?id :age ?age]]
     (:db-after @history) 1)

(pr-str
 (:db-before @history))

(let [patterns '[[_ [:age :bob]]
                 [_ :name]]
      tx-datoms '[[8 :bob 34]
                  [8 :bigzon 230]]]
  (tx-patterns-match? patterns tx-datoms))

(tx-patterns-match? [['_ :age #(< % 20) '_ true]]
                    (:tx-data (last @history)))


(d/transact! conn [[:db/add 8 :age 5]
                   [:db/add 7 :age 6]])

(d/transact! conn [{:db/id -1 :name "Lazy Angel" :age 4}])

