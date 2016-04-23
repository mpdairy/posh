(ns scratch
  (:require [datascript.core :as d]
            [posh.q-analyze :as qa]
            [posh.pull-analyze :as pa]
            [posh.util :as util]
            [posh.datom-matcher :as dm]
            [posh.posh-tree :as pt]
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

  (qa/replace-find-pulls '[?tname [(pull ?t [*]) ...] ?uuid (pull ?p [*]) ?level])

  (qa/get-pull-var-pairs '[?tname [(pull ?t [*]) ...] ?uuid (pull ?p [*]) ?level])

  (qa/match-vars-to-dbs '[?t ?c] {'$ {:conn conn :db @conn :schema (:schema @conn)}}
                        '[[$ ?t :task/name ?n]
                          [$ ?t :task/category ?c]])


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

  (qa/q-analyze {:q d/q}
                [:results :datoms :patterns]
                '[:find ?tname ?t ?uuid ?p ?level
                  :in $ $perm ?level
                  :where
                  [?t :task/name ?tname]
                  [?t :permission/uuid ?uuid]
                  [$perm ?p :permission/uuid ?uuid]
                  [$perm ?p :permission/level ?level]]
                {:conn conn :db @conn
                 :schema (:schema @conn)
                 :key [:db :conn]}
                {:conn conn2 :db @conn2
                 :schema (:schema @conn2)
                 :key [:db :conn2]}
                54)

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

  (dm/reduce-patterns (map (fn [x] [x :person/name "zandy"]) (range 100)))

  (d/q '[:find ?p
         :in $ ?g
         :where
         [?p :task/category _]]
       @conn 2)

  (d/q '{:find [(min ?a) (max ?a) ?b]
         :in [[[?a ?b] ...]]}
       [[1 2] [3 4] [4 5]])

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

  (qa/get-input-sets )
  
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




;;; posh tree testing :::

(def dcfg
  {:db d/db
   :pull d/pull
   :q d/q
   :filter d/filter
   :entid d/entid})

(def cache
  {[:filter-tx [:db conn] '[[_ #{:task/name :person/name :category/name}]]]
   {:filter-pred (fn [_ datom]
                   (dm/datom-match? '[[_ #{:task/name :person/name :category/name}]]
                                    datom))}})

(def poshdb2
  [:filter-tx [:db conn] '[[_ #{:task/name :person/name :category/name}]]])

(def poshdb1 [:db conn])

(def tree1
  {[:db] {[:pull [:db conn] '[*] 3] :query
          [:pull [:db conn] '[:task/name] 10] :query

          [:filter-tx '[[_ #{:task/name :person/name :category/name}]]]
          {[:pull [:filter-tx '[[_ :task/name]]] '[*] 12] :query}}})


(def poshtree
  {:tree tree1
   :cache cache
   :dcfg dcfg
   :conn conn
   :schema (:schema @conn)})

(def emptytree
  {:tree {}
   :cache {}
   :dcfg dcfg
   :conns {}
   :conns-by-id {}})

(comment

  (-> emptytree
      (pt/add-conn conn (:schema @conn) :hux)
      (pt/add-conn conn2 (:schema @conn2) :perm)
      (pt/add-db conn)
      (pt/add-pull [:patterns :datoms] [:db :hux] '[*] 3)
      (pt/add-filter-tx [:db :hux] '[[_ #{:category/name}]])
      (pt/add-pull [:patterns :datoms]
                   '[:filter-tx [:db :hux] [[_ #{:category/name}]]]
                   '[*] 3)
      (pt/add-q [:results :datoms :patterns]
                '[:find ?tname ?t ?uuid ?p ?level
                  :in $ $perm ?level
                  :where
                  [?t :task/name ?tname]
                  [?t :permission/uuid ?uuid]
                  [$perm ?p :permission/uuid ?uuid]
                  [$perm ?p :permission/level ?level]]
                [:db :hux]
                [:db :perm]
                54)
      :cache)


  [{:keys [tree cache dcfg schema conn] :as posh-tree} retrieve poshdb pull-pattern eid]
  (:cache (pt/add-pull poshtree [:results :datoms-t] poshdb2 '[*] 4))

  (def pt11
    (pt/add-filter-tx pt1 [:db] '[[_ #{:task/name :person/name :category/name}]]))

  (pt/add-filter-tx pt2 [:filter-tx [:db] '[[_ #{:task/name :person/name :category/name}]]]
                    '[[#{1, 2, 3}]])

  (pt/get-conn
   [:filter-tx [:db conn] '[[_ #{:task/name :person/name :category/name}]]])

  (count
   (pt/poshdb->db dcfg cache poshdb1))

  (count
   (pt/poshdb->db dcfg cache poshdb2))


  )




