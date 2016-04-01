(ns scratch
  (:require [datascript.core :as d]
            [posh.q-analyze :as qa]
            [posh.pull-analyze :as pa]
            [posh.util :as util]
            [posh.datom-matcher :as dmatch]
            ))

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

(def filly
  (d/filter @conn (fn [_ datom]
                    (println "filly " (first datom))
                    (even? (first datom)))))

(def bobo
  (d/filter filly (fn [_ datom]
                    (println "bobo " (first datom))
                    (= (mod (first datom) 4) 0))))



(d/pull bobo '[*] 4)



(comment

  (pa/pull-analyze d/pull d/q d/entid
                   [:datoms :results :patterns]
                   (:schema @conn)
                   (d/db conn)
                   '[:todo/name :todo/numbers {:category/_todo [:category/name]
                                               :todo/owner [*]}]
                   2)

  (d/pull @conn '[{:todo/_owner ...}] 1)

  (d/pull-many @conn '[:todo/name :todo/numbers {:category/_todo [:category/name]
                                                 :todo/owner [*]}]
               [2])

  (d/pull-many @conn '[:task/name] [7 10 6 9 8])

  (let
      [an
       (pa/pull-many-analyze d/pull d/q d/entid
                             [:patterns :datoms]
                             (:schema @conn)
                             (d/db conn)
                             '[:task/name :task/done {:task/category [*]}]
                             [7 10 6 9 8])]
    (pa/combine-entids #{} [#{:task/name :task/done} '_] (:patterns an) [] [])
    (pa/reduce-patterns (:patterns an)))

  (d/q '[:find [?t ...]
         :in $
         :where
         [?t :task/name _]]
       @conn)

  
  
  )

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

(comment

  (d/q '[:find [?tname ...]
         :in $ $perm ?level
         :where
         [?t :task/name ?tname]
         [?t :permission/uuid ?uuid]
         [$perm ?p :permission/uuid ?uuid]
         [$perm ?p :permission/level ?level]]
       @conn
       @conn2
       54)

  (d/q '[:find ?tname (pull ?t [*]) ?uuid (pull ?p [*]) ?level
         :in $ $perm ?level
         :where
         [?t :task/name ?tname]
         [?t :permission/uuid ?uuid]
         [$perm ?p :permission/uuid ?uuid]
         [$perm ?p :permission/level ?level]]
       @conn
       @conn2
       54)

  (d/q '[:find ?tname ?t ?uuid ?p ?level
         :in $ $perm ?level
         :where
         [?t :task/name ?tname]
         [?t :permission/uuid ?uuid]
         [$perm ?p :permission/uuid ?uuid]
         [$perm ?p :permission/level ?level]]
       @conn
       @conn2
       54)

  (qa/q-analyze d/q
                [:patterns :results :datoms-t]
                '[:find ?tname ?t ?uuid ?p ?level
                  :in $ $perm ?level
                  :where
                  [?t :task/name ?tname]
                  [?t :permission/uuid ?uuid]
                  [$perm ?p :permission/uuid ?uuid]
                  [$perm ?p :permission/level ?level]]
                {:conn conn :db @conn}
                {:conn conn2 :db @conn2}
                54)

  '{:find  [?tname ?t ?uuid ?p ?level]
    :in    [$ $perm ?level]
    :where [[?t :task/name ?tname]
            [?t :permission/uuid ?uuid]
            [$perm ?p :permission/uuid ?uuid]
            [$perm ?p :permission/level ?level]]}

  (qa/get-eavs
   (qa/normalize-all-eavs '[[?t :task/name ?tname]
                            [?t :permission/uuid ?uuid]
                            [$perm ?p :permission/uuid ?uuid]
                            [$perm ?p :permission/level ?level]]))
  

  (qa/normalize-all-eavs '[[?t :task/name ?tname]
                           [?t :permission/uuid ?uuid]
                           [$perm ?p :permission/uuid ?uuid]
                           [$perm ?p :permission/level ?level]])
    
  (:rschema @conn)

  )


(comment

  
  (qa/q-analyze d/q
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
                @conn true ["Matt" "Jim"])


  (d/q '[:find ?p ?d ?j
         :in [[?p ?d] ...] ?j]
       [[1 2] [3 4]]
       :hey)

  (qa/q-analyze d/q
                [:results :datoms :patterns]
                '[:find ?task ?task-name ?list-name
                  :in $ ?true ?owner-name
                  :where
                  [?p :person/name ?owner-name]
                  [?todo :todo/owner ?p]
                  [?todo :todo/name ?list-name]
                  [?cat  :category/todo ?todo]
                  [?task :task/category ?cat]
                  [?task :task/done ?true]
                  [?task :task/name ?task-name]]
                @conn true "Matt")

  (def conn2 (d/create-conn schema))
  (d/transact! conn2 qd)

  ;; filter db
  
  )





