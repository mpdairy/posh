(ns scratch
  (:require [datascript.core :as d]))

(def conn (d/create-conn))

(def posh-conn (atom nil))

(def last-tx-report (atom []))

(d/transact! conn [{:db/id -1 :name "Bob" :age 30}
                   {:db/id -2 :name "Sally" :age 25}
                   {:db/id -3 :name "Lodock" :age 45}
                   {:db/id -4 :name "Janis" :age 21}
                   {:db/id -5 :name "Angel-Bad" :age 14}])

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

(tx-pattern-match-q? '[?a _ ?n] [232 :person/name "jimmy"])

(defn tx-patterns-match-q? [patterns tx-datoms]
  (->> (for [p patterns
             d tx-datoms]
         (tx-pattern-match-q? p d))
       (remove nil?)
       first))

(symbol? (second '[a 3]))

(let [[e a v t added] '[23433 :jim "hello"]]
  [e a v t added])



(defn replace-query-var [vars item]
  (if (list? item)
    (map (partial replace-query-var vars) item)
    (if-let [r (and (symbol? item) (vars item))] r item)))

(defn replace-query-vars [vars query]
  (vec
   (for [q query]
     (vec (map (partial replace-query-var vars) q)))))


(replace-query-vars {'?a 43 '?n "jimmy"} '[[?id :person/age ?a]
                                           [?id :person/name ?n]
                                           [(> ?a 32)]])

(d/q '[:find [?n ?a]
       :in $ ?n ?a
       :where
       [?p :name ?n]
       [?p :age ?a]]
     (d/db conn) "Bob" 31)


(defn build-query [vars query]
  (let [ks (keys vars)]
    (vec (concat [:find (vec ks)] 
                 [:in '$]
                 ks
                 [:where] query))))

(defn query-finds-something? [db vars query]
  (apply
   (partial d/q (build-query vars query))
   (cons db (vals vars))))

(query-finds-something?
 (d/db conn)
 {'?a 31 '?n "Bob"}
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

