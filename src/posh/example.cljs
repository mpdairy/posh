(ns posh.example
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [reagent.core :as r]
            [posh.core :refer [db-tx when-tx transact] :as posh]
            [datascript.core :as d]))


;;; setup
(def conn (d/create-conn))

(d/transact! conn
             [{:db/id -1 :group/name "Pine Club" :group/sort-by :person/name}
              {:db/id -2 :group/name "Oak Club" :group/sort-by :person/age}
              {:db/id -3 :person/name "Bob" :person/age 30 :person/group -1}
              {:db/id -4 :person/name "Sally" :person/age 25 :person/group -2}
              {:db/id -5 :person/name "Lodock" :person/age 45 :person/group -1}
              {:db/id -6 :person/name "Janis" :person/age 22 :person/group -2}
              {:db/id -7 :person/name "Angel-Bad" :person/age 14 :person/group -1}
              {:db/id -8 :person/name "Shomo" :person/age 16 :person/group -2}
              {:db/id -9 :person/name "Miagianna" :person/age 33 :person/group -1}
              {:db/id -10 :person/name "Macy" :person/age 4 :person/group -2}
              {:db/id -11 :person/name "Ojoto" :person/age 20 :person/group -1}])

(posh/setup conn)

;;; TX Listeners

;; congratulates anyone who turns 21
(when-tx '[[_ :person/age 21 _ true]]
         (fn [[e a v] db]
           (js/alert (str "You have come of age, " (:person/name (d/entity db e)) "."))))


;;; Components

(defn person [id]
  (let [db (db-tx [[id]])]
    (fn [id]
      (let [p (d/entity @db id)
            _ (when (= (:person/age p) 11121)
                (js/alert (str "Drink up, " (:person/name p) "!")))]
        [:div
         {:on-click #(transact [[:db/add id :person/age (rand-int 30)]])}
         (pr-str (d/touch p))]))))

#_(db-tx [[group-id]
          [?p :person/dead true]]
         [[?p :person/group group-id]])

#_[:find ?p
   :where
   [234 :person/dead true]
   [234 :person/group 48]]

(defn group [group-id]
  (let [db (db-tx [[group-id]
                   ['_ :person/group group-id]])]
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
         [:div 
          {:on-click #(do
                        (transact
                         [[:db/add (:db/id (second members)) :person/age 21]])
                        (transact
                         [[:db/add (:db/id (first members)) :person/age 221]]))}
          "A GROUP:"]
         [:ul
          (->> members
               (map (fn [p] [:div [person (:db/id p)]])))]]))))

(defn groups []
  (let [db (db-tx '[[_ :group/name]])]
    (fn []
      (let [group-ids (d/q '[:find [?id ...]
                             :where
                             [?id :group/name _]]
                           @db)]
        [:div "-----------------GROUPS----------------"
         (pr-str group-ids)
         (map (fn [g] [group g]) group-ids)]))))

(defn app []
  [:div
   [groups]

   ])


(defn start []
  (r/render-component 
   [app]
   (.getElementById js/document "app")))

(start)




