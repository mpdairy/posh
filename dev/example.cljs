(ns example
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [reagent.core :as r]
            [posh.core :refer [db-tx when-tx transact] :as posh]
            [datascript.core :as d]))


(enable-console-print!)

;;; setup
(def conn (d/create-conn))

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

(posh/setup conn)

;;; TX Listeners

;; congratulates anyone who turns 21
(when-tx '[[_ :person/age 21 _ true]]
         (fn [[e a v] db]
           (js/alert (str "You have come of age, " (:person/name (d/entity db e)) "."))))


;;; Components

(defn ents [db ids]
  (map (partial d/entity db) ids))

(defn drunkard-club []
  (let [db (db-tx [['_ :person/age #(>= % 21)]])]
    (fn []
      (let [drunkards (ents @db (d/q '[:find [?p ...] :where
                                      [?p :person/age ?a]
                                      [(>= ?a 21)]]
                                    @db))]
          [:div "^^^^^  Drunkard Club  ^^^^^^"
           [:ul
            (for [p drunkards] ^{:key (:db/id p)} [:li (:person/name p)])]]))))

(comment

  (db-tx [[]])     ;; matches every tx

  (db-tx [[453]])  ;; matches every tx with entity id of 435

  ;; matches to any title changes for this book's id
  (defn book [id]
    (let [db (db-tx [[id :book/title]])]
      ...))

  ;; tx datoms are [entity attribute value time added?]
  ;; this matches only those persons who just join a group
  (db-tx '[[_ :person/group _ _ true]]) ;; remember to quote '

  ;; if you have external variables you'll have to unquote the form
  ;; and quote each _
  (let [color "red"]
    (db-tx [['_ :car/color color]]))
  
  ;; multiple patterns. If it matches one of them it updates
  (db-tx '[[_ :person/name]
           [_ :person/age]
           [_ :person/group]])

  ;; You can use predicate functions in the match.
  ;; The function will get passed the datom's value
  
  ;; this will match any person older than 20
  (db-tx [['_ :person/age #(> % 20)]])

  ;; but it's bad to use anonymous functions in the pattern like this
  ;; because db-tx memoizes and ClojureScript doesn't know that
  ;; #(+ 3 %) equals #(+ 3 %) so it gobbles up memory

  ;; So you either need to define your functions or, if you do use
  ;; anonymous functions, at least do it in the outer binding of
  ;; a form-2 component.

  ;; same thing, but nice for memoizing
  (defn >20? [n] (> n 20))
  (db-tx [['_ :person/age >20?]])

  ;; match on any attrib change for a person
  (defn person-attrib? [a] (= (namespace a) "person"))
  (db-tx [['_ person-attrib?]])

  ;; you can also group together possibilities in a vector.

  ;; matches on the actions "drink" "burp" "sleep"
  (db-tx [['_ :person/action ["drink" "burp" "sleep"]]])

  ;; matches either of two people with id's 123 or 234, if either
  ;; their name or age changes:
  (db-tx [[[123 234] [:person/name :person/age]]])

  


  )

(defn ten-year-olds []
  (let [db   (db-tx '[[_ :person/age 10]])
        kids (map (partial d/entity @db)
                  (d/q '[:find [?p ...] :where
                         [?p :person/age ?a]
                         [(= ?a 21)]]
                       @db))]
    [:ul "These kids are ten years old:"
     (for [k kids]
       ^{:key (:db/id k)} [:li (:person/name k)])]))

(defn person [id]
  (let [db (db-tx [[id]])]
    (fn [id]
      (let [p (d/entity @db id)]
        [:div
         {:on-click #(transact [[:db/add id :person/age (rand-int 30)]])}
         (pr-str (d/touch p))]))))

(defn bookshelf [bookshelf-id]
  (let [db    (db-tx [[bookshelf-id]
                      ['_ :book/bookshelf bookshelf-id]
                      '[?b :book/name]]
                     [['?b :book/bookshelf bookshelf-id]])
        b     (d/entity @db bookshelf-id)
        books (map (partial d/entity @db)
                   (d/q '[:find [?b ...]
                          :in $ ?bs
                          :where
                          [?b :book/bookshelf ?bs]]
                        @db bookshelf-id))]
    [:ul "Books on bookshelf: " (:bookshelf/name b)
     (for [b (sort-by :book/name books)]
       ^{:key (:db/id b)} [:li (:book/name b)])]))

(comment (db-tx [[group-id]
                 ['_ :person/group group-id]
                 {'[?p :person/name _ _ true]
                  [['?p :person/group group-id]
                   '[?p :person/group ?g]
                   '[?g :group/sort-by :person/name]]}
                 {'[?p :person/age _ _ true]
                  [['?p :person/group group-id]
                   '[?p :person/group ?g]
                   '[?g :group/sort-by :person/age]]}]))

(defn person-sortable [a]
  (if (some #{a} [:person/name :person/age :person/money :person/religion])
    {`?sort-attr a}))


(defn group [group-id]
  (let [db (db-tx [[group-id]
                   ['_ :person/group group-id]
                   {['?p person-sortable '_ '_ true]
                    [['?p :person/group group-id]
                     '[?p :person/group ?g]
                     '[?g :group/sort-by ?sort-attr]]}])]
    (fn []
      (let [g       (d/entity @db group-id)
            members (->> (d/q '[:find [?p ...]
                                :in $ ?g
                                :where
                                [?p :person/group ?g]]
                              @db group-id)
                         (map #(d/entity @db %)))]
        [:div
         [:div " +++++ " (g :group/name) " +++++ " ]
         [:ul
          [:div (pr-str (map :person/age (sort-by :person/age members)))]
          (->> members
               (sort-by (g :group/sort-by))
               (map (fn [p] ^{:key p} [:div [person (:db/id p)]])))]]))))

(defn groups []
  (let [db (db-tx '[[_ :group/name]])]
    (fn []
      (let [group-ids (d/q '[:find [?id ...]
                             :where
                             [?id :group/name _]]
                           @db)]
        [:div "-----------------GROUPS----------------"
         (map (fn [g] ^{:key g} [group g]) group-ids)]))))


(defn app []
  [:div
   [drunkard-club]
   [groups]])


(defn start []
  (r/render-component 
   [app]
   (.getElementById js/document "app")))

(start)




