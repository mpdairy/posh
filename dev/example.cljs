(ns example
  (:require [reagent.core :as r]
            [posh.core :refer [db-tx pull-tx q-tx when-tx! transact! posh!] :as posh]
            [datascript.core :as d]))


(enable-console-print!)

;;; setup

(def schema {:person/group {:db/valueType :db.type/ref}
             :action/editing {:db/cardinality :db.cardinality/many}})

(def conn (d/create-conn schema))

(d/transact! conn
             [{:db/id -1 :group/name "Pine Club" :group/sort-by :person/name}
              {:db/id -2 :group/name "Oak Club" :group/sort-by :person/age}])

(let [groups (d/q '[:find [?g ...] :where [?g :group/name _]] @conn)]
  (d/transact!
   conn
   [{:db/id -3 :person/name "Bob" :person/age 30 :person/group (rand-nth groups)}
    {:db/id -4 :person/name "Sally" :person/age 25 :person/group (rand-nth groups)}
    {:db/id -5 :person/name "Lodock" :person/age 45 :person/group (rand-nth groups)}
    {:db/id -6 :person/name "Janis" :person/age 19 :person/group (rand-nth groups)}
    {:db/id -7 :person/name "Angel-Bad" :person/age 14 :person/group (rand-nth groups)}
    {:db/id -8 :person/name "Shomo" :person/age 16 :person/group (rand-nth groups)}
    {:db/id -9 :person/name "Miagianna" :person/age 33 :person/group (rand-nth groups)}
    {:db/id -10 :person/name "Macy" :person/age 4 :person/group (rand-nth groups)}
    {:db/id -11 :person/name "Ojoto" :person/age 20 :person/group (rand-nth groups)}]))

(posh! conn)

;;; TX Listeners

;; congratulates anyone who turns 21

(when-tx! conn
          '[[?p :person/age 21 _ true]]
          (fn [[e a v] db]
            (js/alert (str "You have come of age, " (:person/name (d/entity db e)) "."))))

;;; Components

(defn ents [db ids]
  (map (partial d/entity db) ids))

(defn drunkard-club []
  (let [db (db-tx conn [['_ :person/age #(>= % 21)]])]
    (fn []
      (let [drunkards (ents @db (d/q '[:find [?p ...] :where
                                       [?p :person/age ?a]
                                       [(>= ?a 21)]]
                                     @db))]
        [:div "^^^^^  Drunkard Club  ^^^^^^"
         [:ul
          (for [p drunkards] ^{:key (:db/id p)} [:li (:person/name p)])]]))))


(defn ten-year-olds []
  (let [db   (db-tx conn '[[_ :person/age 10]])
        kids (map (partial d/entity @db)
                  (d/q '[:find [?p ...] :where
                         [?p :person/age ?a]
                         [(= ?a 21)]]
                       @db))]
    [:ul "These kids are ten years old:"
     (for [k kids]
       ^{:key (:db/id k)} [:li (:person/name k)])]))

(comment
  (defn person [id]
    (let [db (db-tx conn [[id]])]
      (fn [id]
        (let [p (d/entity @db id)]
          [:div
           {:on-click #(transact! conn [[:db/add id :person/age (rand-int 30)]])}
           (pr-str (d/touch p))])))))

(defn dog [id]
  (let [db                (db-tx conn [[id]])
        d                 (d/entity @db id)
        neighborhood-dogs (:dog/_neighborhood (:dog/neighborhood d))]
    [:div
     (:dog/name d) " -- " (:dog/status d)
     [:button "Bark Once"
      {:on-click #(transact! conn (->> (for [dog neighborhood-dogs]
                                         (when (not= (:db/id d) (:db/id dog))
                                           [:db/add dog :dog/status "barking"]))
                                       (remove nil?)))}]]))

(defn editable [id attr]
  (let [db          (db-tx conn [[id :action/editing attr]])
        input-value (r/atom (attr (d/entity @db id)))]
    (fn [id attr]
      (let [parent   (d/entity @db id)
            text     (attr parent)
            editing? (:action/editing parent)]
        (if editing?
          [:div [:input {:type "text"
                         :value @input-value
                         :onChange #(reset! input-value (-> % .-target .-value))}]
           [:button {:onClick #(transact! conn [[:db/add id attr @input-value]
                                                [:db/retract id :action/editing attr]])} "Done"]]
          [:div text
           [:button {:onClick #(transact! conn [[:db/add id :action/editing attr]])} "Edit"]])))))

(defn person [id]
  (let [db (db-tx conn [[id]])
        p  (d/entity @db id)]
    [:div
     [editable id :person/name]
     [:div
      {:on-click #(transact! conn [[:db/add id :person/age (inc (:person/age p))]])}
      (:person/name p) " -- " (:person/age p)]]))

(defn pull-person [id]
  (let [p (pull-tx conn [[id]] '[*] id)]
    (println "Person: " (:person/name @p))
    [:div
     {:on-click #(transact! conn [[:db/add id :person/age (inc (:person/age @p))]])}
     (:person/name @p) ": " (:person/age @p)]))

(comment

  [['_ :person/age]]

  [['_ :person/age old-age _ true]]
  )

(defn people-younger-than [old-age]
  (let [young (q-tx conn [['_ :person/age]] '[:find [?name ...]
                                              :in $ ?old
                                              :where
                                              [?p :person/age ?age]
                                              [(< ?age ?old)]
                                              [?p :person/name ?name]]
                    old-age)]
    (println "People Younger Than " old-age)
    [:ul "People younger than 30:"
     (for [n @young] ^{:key n} [:li n])]))


(defn all-people-older-than-birthday-person []
  (let [r (q-tx conn '[[?birthday-boy :person/age ?birthday-age _ true]]
                    '[:find ?birthday-name ?name
                      :in $ ?birthday-boy ?birthday-age
                      :where
                      [?p :person/age ?age]
                      [(> ?age ?birthday-age)]
                      [?p :person/name ?name]
                      [?birthday-boy :person/name ?birthday-name]]
                    '?birthday-boy
                    '?birthday-age)]
    (println "People Older than birthday person ")
    (if (empty? @r)
      [:div "Wiating for a birthday..."]
      [:ul "Happy Birthday, " (ffirst @r) "! These people are still older than you:"
       (for [n (map second @r)] ^{:key n} [:li n])])))

(defn bookshelf [bookshelf-id]
  (let [db    (db-tx conn
                     {[[bookshelf-id]
                       ['_ :book/bookshelf bookshelf-id]
                       '[?b :book/name]]
                      [['?b :book/bookshelf bookshelf-id]]})
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


(def person-sortables [:person/name :person/age :person/height :person/weight])

(defn person-sortable [a]
  (when (some #{a} person-sortables)
    {'?sort-attr a}))

(defn group [group-id]
  (let [db (db-tx conn
                  [[group-id]
                   ['_ :person/group group-id]
                   {[['?p person-sortable '_ '_ true]]
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
        (println "GROUP: " (g :group/name))
        [:div
         [:div " +++++ " (g :group/name) " +++++ " ]
         [:ul
          [:div (pr-str (map :person/age (sort-by :person/age members)))]
          (->> members
               (sort-by (g :group/sort-by))
               (map (fn [p]
                      ^{:key p} [:div [pull-person (:db/id p)]])))]]))))

(defn groups []
  (let [db (db-tx conn '[[_ :group/name]])]
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
   [people-younger-than 30]
   [all-people-older-than-birthday-person]
   [groups]])


(defn start []
  (r/render-component 
   [app]
   (.getElementById js/document "app")))

(start)
