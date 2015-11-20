(ns posh.example
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
  (let [db (db-tx [['_ :person/age #(>= % 21)]])
        drunkards (ents @db (d/q '[:find [?p ...] :where
                                   [?p :person/age ?a]
                                   [(>= ?a 21)]]
                                 @db))]
    [:div "^^^^^  Drunkard Club  ^^^^^^"
     [:ul
      (for [p drunkards] ^{:key (:db/id p)} [:li (:person/name p)])]]))

(defn person [id]
  (let [db (db-tx [[id]])]
    (fn [id]
      (let [p (d/entity @db id)]
        [:div
         {:on-click #(transact [[:db/add id :person/age (rand-int 30)]])}
         (pr-str (d/touch p))]))))

(defn group [group-id]
  (let [db (db-tx [[group-id]
                   ['_ :person/group group-id]
                   {'[?p :person/name _ _ true]
                    [['?p :person/group group-id]
                     '[?p :person/group ?g]
                     '[?g :group/sort-by :person/name]]}
                   {'[?p :person/age _ _ true]
                    [['?p :person/group group-id]
                     '[?p :person/group ?g]
                     '[?g :group/sort-by :person/age]]}])]
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




