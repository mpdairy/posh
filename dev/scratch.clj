(ns scratch
  (:require [datascript.core :as d]
            [posh.q-analyze :as qa]
            [posh.pull-analyze :as pa]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.tree.core :as pt]
            [posh.tree.db :as db]
            [clojure.core.match :refer [match]]
            [posh.tree.update :as u]
            [posh.core :as p]))

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
       :permission/uuid "uktdkafojea"
       :task/category at-home}
      {:db/id (tempid)
       :task/name "Mop Floors"
       :task/done true
       :task/pinned true
       :permission/uuid "sieojeiofja"
       :task/category at-home}
      {:db/id (tempid)
       :task/name "Draw a picture of a cat"
       :task/done false
       :permission/uuid "sieojeiofja"
       :task/category hobby}
      {:db/id (tempid)
       :task/name "Compose opera"
       :task/done true
       :permission/uuid "bmmsmsdlfds"
       :task/category hobby}
      {:db/id (tempid)
       :task/name "stock market library"
       :task/done false
       :permission/uuid "uktdkafojea"
       :task/pinned true
       :task/category work-stuff}])))


(populate! conn)

(def conn2 (d/create-conn))

(d/transact! conn2 [{:db/id -1
                     :permission/level 34
                     :permission/uuid "uktdkafojea"}
                    {:db/id -2
                     :permission/level 54
                     :permission/uuid "sieojeiofja"}
                    {:db/id -3
                     :permission/level 10
                     :permission/uuid "bmmsmsdlfds"}])

;;; ============== posh tree testing ==================

(def dcfg
  {:db d/db
   :pull d/pull
   :q d/q
   :filter d/filter
   :entid d/entid
   :transact! d/transact!})

;; with just one DB named :hux
(def smalltree
  (-> (pt/empty-tree dcfg [:results :datoms])
      (pt/add-db :hux conn (:schema @conn) @conn)
      (pt/add-pull [:db :hux] '[*] 3)
      (pt/add-q '[:find ?e
                  :in $
                  :where
                  [?e :category/name _]]
                [:db :hux])
      (pt/add-pull [:db :hux] '[:category/name] 3)))

;; with second permissions DB named :perm
(def fulltree
  (-> (pt/empty-tree dcfg [:results])
      (pt/add-db :hux conn (:schema @conn) @conn)
      (pt/add-db :perm conn2 (:schema @conn2) @conn2)
      (pt/add-pull [:db :hux] '[*] 3)
      (pt/add-filter-tx [:db :hux] '[[_ #{:category/name}]])
      (pt/add-filter-pull
       [:db :hux]
       '[{:todo/_owner [{:category/_todo [:category/name]}]}] 1)
      (pt/add-pull
       '[:filter-pull
         [:db :hux]
         [{:todo/_owner [{:category/_todo [:category/name]}]}]
         1]
       '[*] 3)
      (pt/add-pull '[:filter-tx [:db :hux] [[_ #{:category/name}]]]
                   '[*] 3)
      (pt/add-q '[:find ?tname ?t ?uuid ?p ?level
                  :in $ $perm ?level
                  :where
                  [?t :task/name ?tname]
                  [?t :permission/uuid ?uuid]
                  [$perm ?p :permission/uuid ?uuid]
                  [$perm ?p :permission/level ?level]]
                [:db :hux]
                [:db :perm]
                54)))

(u/update-filter-q fulltree
                   [:q
                    '[:find ?t
                      :in $ $perm ?level
                      :where
                      [?t :task/name ?tname]
                      [?t :permission/uuid ?uuid]
                      [$perm ?p :permission/uuid ?uuid]
                      [$perm ?p :permission/level ?level]]
                    [[:db :hux]
                     [:db :perm]
                     54]])

(comment

  (pt/cache-changes
   smalltree
   :hux
   [[3 :category/name "jim"]]
   {}
   [:db :hux])

  (pt/cache-changes
   fulltree
   :hux
   [[3 :category/name "jim"]]
   {}
   [:db :hux])

  (-> fulltree
      (pt/add-tx [:db :hux] [[:db/add 34 :person/name "jimmy who"]])
      (pt/add-tx [:db :hux] [[:db/add 3 :category/name "angel face"]]))
  )




;;; ========= q-analyze testing ==========

(comment

  (def r  (d/q '[:find ?t ?c ?o
                 :in $
                 :where
                 [?t :task/name _]
                 [?c :category/name _]
                 [?o :todo/name _]]
               @conn))

  r

  (defn reduce-entity-set [r]
    (reduce (fn [acc xs] (reduce (fn [acc x] (conj acc x)) acc xs)) #{} r))

  (qa/q-analyze {:q d/q}
                [:results :datoms :patterns]
                '[:find ?tname ?t ?uuid ?p ?level
                  :in $ $perm ?level
                  :where
                  [?t :task/name ?tname]
                  [?t :permission/uuid ?uuid]
                  [$perm ?p :permission/uuid ?uuid]
                  [$perm ?p :permission/level ?level]]
                [{:conn :conn :db @conn
                  :db-id :hux
                  :schema (:schema @conn)
                  :key [:db :conn]}
                 {:conn :conn2 :db @conn2
                  :db-id :perm
                  :schema (:schema @conn2)
                  :key [:db :conn2]}
                 54])

;;; not working yet... 
  (qa/q-analyze-with-pulls {:q d/q}
                           [:pulls]
                           '[:find (pull ?tname '[*]) ?t ?uuid ?p ?level
                             :in $ $perm ?level
                             :where
                             [?t :task/name ?tname]
                             [?t :permission/uuid ?uuid]
                             [$perm ?p :permission/uuid ?uuid]
                             [$perm ?p :permission/level ?level]]
                           {:conn conn :db @conn :schema (:schema @conn)}
                           {:conn conn2 :db @conn2 :schema (:schema @conn2)}
                           54)

  (qa/q-analyze dcfg
                [:results :datoms :patterns]
                '[:find ?task ?task-name ?list-name
                  :in $ ?true [?owner-name ...]
                  :where
                  [?p :person/name ?owner-name]
                  [?todo :todo/owner ?p]
                  [?todo :todo/name ?list-name]
                  [?cat  :category/todo ?todo]
                  [?task :task/category ?cat]
                  [?task :task/done ?true]
                  [?task :task/name ?task-name]]
                [{:conn conn
                  :db   @conn
                  :db-id :hux
                  :schema (:schema @conn)
                  :key :hux}
                 true ["Matt" "Jim"]])
  )

(comment
  (def poshtree (p/new-posh dcfg [:results]))

;;; UUUUH Oh, got to remember to update the db whenever there are
;;; changes.
  (def db
    (p/db poshtree 'hux conn (:schema @conn) @conn))

  (p/add-pull db '[*] 3))
