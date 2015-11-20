(ns scratch
  (:require [datascript.core :as d]))

(def conn (d/create-conn))

(def posh-conn (atom nil))

(def last-tx-report (atom []))

(d/transact! conn
             [{:db/id -1 :group/name "Pine Club" :group/sort-by :person/name}
              {:db/id -2 :group/name "Oak Club" :group/sort-by :person/age}])

(let [groups (d/q '[:find [?g ...] :where [?g :group/name _]] @conn)]
  (d/transact!
   conn
   [{:db/id -3 :person/name "Bob" :person/age 30 :person/group (rand-nth groups)}
    {:db/id -4 :person/name "Sally" :person/age 25 :person/group (rand-nth groups)}
    {:db/id -5 :person/name "Lodock" :person/age 45 :person/group (rand-nth groups)}
    {:db/id -6 :person/name "Janis" :person/age 22 :person/group (rand-nth groups)}
    {:db/id -7 :person/name "Angel-Bad" :person/age 14 :person/group (rand-nth groups)}
    {:db/id -8 :person/name "Shomo" :person/age 16 :person/group (rand-nth groups)}
    {:db/id -9 :person/name "Miagianna" :person/age 33 :person/group (rand-nth groups)}
    {:db/id -10 :person/name "Macy" :person/age 4 :person/group (rand-nth groups)}
    {:db/id -11 :person/name "Ojoto" :person/age 20 :person/group (rand-nth groups)}]))

(namespace :jimmy/hogan)

(d/q '[:find [?p]
       :where
       [?p :person/name "Bob"]
       [?p :person/group 1]
       [?p :person/group ?g]
       [?g :group/sort-by :person/name]]
     @conn)

(d/entity @conn [:person/name "Bob"])

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

(d/listen! conn :history
           (fn [tx-report]
             (swap! history #(cons (first %1) %2) tx-report)))

(d/listen! conn :history
           (fn [tx-report]
             (reset! history tx-report)))

(d/transact! conn [[:db/add 8 :age (rand-int 10)]
                   [:db/add 7 :age (rand-int 10)]])

(first @history)

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

(tx-patterns-match-q? (d/db conn) [{['?p :person/name "Bob"]
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

