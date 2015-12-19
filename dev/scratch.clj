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
(let [r (d/q '[:find ?n ?g :where [?g :group/name ?n]] @conn)]
  (apply merge (map (fn [[a b]] {a b}) r)))

(defn pairmap [pair] (apply merge (map (fn [[a b]] {a b}) pair)))

(def tempid (let [n (atom 0)] (fn [] (swap! n dec))))

(def category-tag #(= (namespace %) "category"))
(category-tag :categordy/jones)
(tempid)

(pairmap (d/q '[:find ?n ?g :where [?g :group/name ?n]] @conn))

(let [groups (d/q '[:find ?n ?g :where [?g :group/name ?n]] @conn)]
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

(let [tups [[1 :a] [2 :b] [3 :c] [4 :d]]]
  (for [a tups]
    (second a)))




(d/q '[:find ?p2 ?p
       :where
       [?p :person/age ?age]
       [?p2 :person/name "Bob"]
       [?p :person/name ?name]
       [(< ?age 0)]]
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


(db-tx conn
       [[group-id]
        ['_ :person/group group-id]
        {[{'[[?p :person/age _ _ true]]
           '[[?g :group/sort-by :person/age]]}
          {'[[?p :person/age _ _ true]]
           '[[?g :group/sort-by :person/age]]}]
         '[[?p :person/group ?g]]}])

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

(defn replace-if-query-symbol [vars x]
  (or (when (query-symbol? x) (vars x)) x))


(defn deep-map [f x]
  (cond
   (map? x) (let [r (map (partial deep-map f) x)]
              (zipmap (map first r) (map second r)))
   (coll? x) (vec (map (partial deep-map f) x))
   :else (f x)))

(defn deep-find [f x]
  (if (coll? x)
    (if (empty? x)
      false
      (or (deep-find f (first x))
           (deep-find f (rest x))))
    (f x)))

(deep-find query-symbol? '[1 2 3 4 [{:jim "hey" :bob [?a]}]])

(defn build-pull [db pull-syntax entity vars]
  (d/pull db
          (if (empty? vars)
            pull-syntax
            (deep-map #(or (vars %) %) pull-syntax))
          (or (vars entity) entity)))


(let [vars {}
      pull-syntax '[:person/name ]]
  (deep-map #(or (vars %) %) pull-syntax))

(build-pull @conn '[:person/name ?a] '?p {'?p 344 '?a :person/dog})

(namespace :person/jim)

(defn real-q-tx [conn patterns query & args]
  (concat [conn patterns query] args))

(defn q-tx [conn patterns-or-query & args]
  (if (= (first patterns-or-query) :find)   ;; it's a query
    (apply (partial real-q-tx conn '[[]] patterns-or-query) args)
    (apply (partial real-q-tx conn patterns-or-query (first args)) (rest args))))

(q-tx :conn '[:find ?b :where] 3 5)


(defn q-tx
  
  ([conn query & args]
     :hey)
  ([conn patterns query & args]
     :there))

(deep-map #(or ({:hey 3333} %) %)
          [5 {:a 1 :hey 2 :c :hey} [:look :hey {[:hey 34] 8}]])

(let [r (deep-map #(= % :a) {:a 1})]
  (map first r))


(vals (vec {:hey [1 2 3] :jim [[1] [2] [3]]}))

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




;;;;;;;;; example


;;; util
(defn pairmap [pair] (apply merge (map (fn [[a b]] {a b}) pair)))

(defn ents [db ids] (map (partial d/entity db) ids))

;;; setup

(def tempid (let [n (atom 0)] (fn [] (swap! n dec))))

(def schema {:task/category {:db/valueType :db.type/ref}
             :category/user {:db/valueType :db.type/ref}
             :user/display-category {:db/valueType :db.type/ref}
             :action/editing {:db/cardinality :db.cardinality/many}})

(def conn (d/create-conn schema))

(d/transact! conn [{:db/id (tempid) :user/name "Matt"}])
(d/transact! conn
             (let [user-id (d/q '[:find ?u . :where [?u :user/name "Matt"]] @conn)]
               [{:db/id (tempid) :category/name "At Home" :category/user user-id}
                {:db/id (tempid) :category/name "Work Stuff" :category/user user-id}
                {:db/id (tempid) :category/name "Hobby" :category/user user-id}]))
(d/transact!
 conn
 (let [cats (pairmap (d/q '[:find ?n ?c :where [?c :category/name ?n]] @conn))]
   [{:db/id (tempid)
     :task/name "Clean Dishes"
     :task/done true
     :task/category (cats "At Home")}
    {:db/id (tempid)
     :task/name "Mop Floors"
     :task/done true
     :task/pin true
     :task/category (cats "At Home")}
    {:db/id (tempid)
     :task/name "Draw a picture of a cat"
     :task/done false
     :task/category (cats "Hobby")}
    {:db/id (tempid)
     :task/name "Compose opera"
     :task/done true
     :task/category (cats "Hobby")}
    {:db/id (tempid)
     :task/name "stock market library"
     :task/done false
     :task/pinned true
     :task/category (cats "Work Stuff")}]))

(d/pull @conn '[*] 2)

(d/pull @conn '[{:category/_user [:db/id :category/name]}] 1555)

(d/q '[:find ?name .
       :in $ ?id
       :where
       [?id :category/name ?name]]
     @conn 2)

(nth [3 4 5 4] 15)
(def user (d/entity @conn 1))

(merge {:a 1} {:a 4})

(defn new-entity [conn varmap]
  ((:tempids (d/transact! conn [(merge varmap {:db/id -1})])) -1))

(new-entity conn {:person/name "jimmy"})

(-> (d/transact! conn [{:db/id -1 :person/name "jimmy"}])
    :tempids)

(d/transact! conn [{:db/id 3 :person/name "Jimmy"}
                   {:db/id 3 :person/name "Jimmy Dean"}])

(d/pull @conn [:person/name] 3)

(user :category/_user)


(def pre-tx-watchers (atom {}))

(def transactions (atom {}))

(defn split-tx-map [tx-map]
  (if (map? tx-map)
    (let [id (:db/id tx-map)]
      (map (fn [[k v]] [:db/add id k v]) (dissoc tx-map :db/id)))
    [tx-map]))

(defn clean-tx [tx]
  (apply concat (map split-tx-map tx)))

(defn transact! [conn tx]
  (swap! transactions
         #(update % conn (comp vec (partial concat (clean-tx tx))))))

(defn do-transaction! [conn]
  (let [tx (@transactions conn)]
    (when tx
      (swap! transactions #(dissoc % conn))
      (d/transact! conn tx))))

(defn do-all-transactions! []
  (map (fn [[conn]] (do-transaction! conn)) @transactions))


(transact! conn [{:db/id 343 :person/name "jim" :person/age 33}])

(d/transact! conn [[:db/add 3 :person/name "jim"]
                   [:db/add 3 :person/name "bobby"]
                   [:db.fn/retractEntity 3]])

(d/pull @conn [:person/name] 4)
(d/transact! conn [[:db/retract 4 :person/name "Jimmy"]])

((comp vec (partial concat [[1] [2]])) [[3] [4]])

(int 3.44)
(rand-int 999999)
(do-all-transactions!)

@transactions

(swap! transactions #(dissoc % conn))

(update  (partial concat tx))
(read-string "3")
@transactions
(nth [12 2 3] 2)

(sort-by :a
         [{:a 3} {:a 8} {:a 1}])


(comment
  '[:person/name :person/age :db/id {:person/group [:group/name :db/id]}] 432

  ;; ignore :db/id
  '[[432 [:person/name :person/age :person/group] _]
    [_ [:group/name]]]

  '[:group/name {:person/_group [:person/name :person/age]}] 753

  '[[753 [:group/name]]
    [_ :person/group 753]
    [_ [:person/name :person/age]]]

  )

(namespace :jim/hello)
(reduce str (rest "_hogan"))

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


(some #{['_]} [1 2 '[_] 3])

(pull-list '[:person/name :person/age :db/id {:person/group [:group/name :db/id]}]
           43433)

(pull-list '[:group/name :dog/_group {:person/_group [:person/name :person/age]}] 4444)

(pull-pattern-gen '[:group/name :dog/_group {:person/_group [:person/name]}] 4444)

(pull-list '[*] 3443)


(comment

  (d/q conn
       '[:find ?name ?group_name
         :in $ ?p ?club
         :where
         [?p :person/name ?name]
         [?p :person/group ?g]
         [?g :group/name ?group_name]
         [?g :group/club ?club]]
       1234
       "Stone Temple")

  '[[1234 :person/name _]
    [1234 :person/group _]
    [_ :group/name _]
    [_ :group/club "Stone Temple"]]

  )

(defn deep-some [some-fn? ls]
  (for [x ls]
    (if (coll? x)
      (reduce (fn [a b] (or a b)) (deep-some some-fn? x))
      (some-fn? x))))

(defn deep-some [some-fn? x]
  (if (not (coll? x))
    (some-fn? x)
    (if (empty? x)
      false
      (or (deep-some some-fn? (first x))
          (deep-some some-fn? (rest x))))))



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

(defn clause-item [varmap item]
  (if (symbol? item)
    (or (varmap item) '_)
    item))

(defn pattern-from-clause [varmap clause]
  (vec (map (partial clause-item varmap) clause)))

(defn patterns-from-where [varmap where]
  (map (partial pattern-from-clause varmap) where))

(defn deep-list? [x]
  (cond
   (list? x) true
   (coll? x) (if (empty? x) false
                 (or (deep-list? (first x))
                     (deep-list? (vec (rest x)))))))

(defn q-pattern-gen [query vars]
  (let [qm            (query-to-map query)
        simple-query? (not (deep-list? (:where qm)))
        varmap        (if (and (:in qm) (> (count (:in qm)) 1))
                        (zipmap (rest (:in qm)) vars)
                        {})]
    (if simple-query?
      (patterns-from-where varmap (:where qm))
      [[]])))


(q-pattern-gen '[:find ?name ?group_name
                 :in $ ?p ?club
                 :where
                 [?p :person/name ?name]
                 [?p :person/group ?g]
                 [?g :group/name ?group_name]
                 [?g :group/club ?club]]
               [3443 "Bozo Club"])


(defn take-until [ls until?]
  (if (or (empty? ls) (until? (first ls)))
    []
    (cons (first ls) (take-until (rest ls) until?))))

(defn pack [ls]
  (if (empty? ls)
    []
    (let [t (take-until ls #(not= (first ls) %))]
      (cons t (pack (nthrest ls (count t)))))))

(defn encode-packed [ls]
  (if (empty? ls)
    []
    (cons
     (let [c (count (first ls))]
       (if (= c 1)
         (ffirst ls)
         [(count (first ls)) (ffirst ls)]))
     (encode-packed (rest ls)))))

(defn encode [ls]
  (encode-packed (pack ls)))


(decode (encode [1 1 2 2 2 3 3 3 3 3 4 5 5 5]))
(decode (encode "aaabcccccdddeeefffffg"))

(defn decode [ls]
  (if (empty? ls)
    []
    (concat
     (if (coll? (first ls))
         (take (ffirst ls) (repeat (second (first ls))))
         [(first ls)])
     (decode (rest ls)))))



(defn person [conn person-id]
  (let [p @(pull conn `[*] person-id)]
    [:ul
     [:li (:person/name p)]
     [:li (:person/age p)]
     [:li (:person/weight p)]]))
