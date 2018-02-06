(ns scratch
  (:require [datascript.core :as d]
            [posh.lib.q-analyze :as qa]
            [posh.lib.pull-analyze :as pa]
            [posh.lib.util :as util]
            [posh.lib.datom-matcher :as dm]
            [posh.core :as pt]
            [posh.lib.db :as db]
            [clojure.core.match :refer [match]]
            [posh.lib.update :as u]
            [posh.stateful :as p]))


;; ============= setting up the test databases ============

(def schema {:todo/name             {:db/unique :db.unique/identity}
             :todo/owner            {:db/valueType :db.type/ref
                                     :db/cardinality :db.cardinality/one}
             :task/category         {:db/valueType :db.type/ref}
             :category/todo         {:db/valueType :db.type/ref}
             :task/name             {:db/unique :db.unique/identity}
             :category/name         {:db/unique :db.unique/identity}
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

(try
  (+ 3 "a")
  (catch Exception e (+ 3 0)))

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

;;; dcfg is the database config. You have to supply all these
;;; functions to it. Hopefully, if you just switch it to datomic
;;; functions, everything in posh will still work.
(def dcfg
  {:db d/db
   :pull d/pull
   :q d/q
   :filter d/filter
   :with d/with
   :entid d/entid
   :transact! d/transact!})

;; a small posh tree with just one DB named :hux
(def smalltree
  (-> (pt/empty-tree dcfg [:results :datoms])
      (pt/add-db :hux conn (:schema @conn))
      (pt/add-pull [:db :hux] '[*] 3)
      (pt/add-q '[:find ?e
                  :in $
                  :where
                  [?e :category/name _]]
                [:db :hux])
      (pt/add-pull [:db :hux] '[:category/name] 3)))



;; a bigger tree with a second, permissions DB named :perm
;; and a filtered db named :tasks

(defn no-task-names-filter [_ datom] (not= (second datom) :task/name))

(def fulltree
  (-> (pt/empty-tree dcfg [:results])
      (pt/add-db :hux conn (:schema @conn))
      (pt/add-db :perm conn2 (:schema @conn2))

      ;; same db as :hux but without any :task/name datoms
      (pt/add-db :tasks conn (:schema @conn) {:filter 'scratch/no-task-names-filter})

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

(keys (:cache fulltree))
(get (:cache fulltree) '[:filter-tx [:db :hux] [[_ #{:category/name}]]])
;;(d/pull @conn '[*] [:task/name "jim"])

(def conn3 (d/create-conn))

(d/transact!
 conn3
 [{:db/id -1
   :name "joe"}

  {:db/id -2
   :name "sally"}

  {:db/id -3
   :name "bob"}])

(comment

  (qa/q-analyze dcfg
                [:results]
                '[:find ?name
                  :where [_ :name ?name]]
                [{:conn conn3
                  :db   @conn3
                  :db-id :hux
                  :schema (:schema @conn3)
                  :key :hux}])


  )


;; =========== testing adding tx to poshtree to see what changes =====
(comment

  (def newtree
    (-> fulltree
        (pt/add-tx [:db :hux] [[:db/add 34 :person/name "jimmy who"]])
        (pt/add-tx [:db :hux] [[:db/add 3 :category/name "angel face"]])
        (pt/add-tx [:db :perm] [[:db/add 3 :permission/level 18]])
        (pt/process-tx!)))

  (:changed newtree)
  (:cache newtree)
  )


(comment

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
                [:results :simple-patterns :datoms]
                '[:find ?task ?task-name ?list-name ?todo-name
                  :in $ ?true [?owner-name ...]
                  :where
                  [?p :person/name ?owner-name]
                  [?todo :todo/owner ?p]
                  [(get-else $ ?todo :todo/nickname "nothing") ?todo-name]
                  [?todo :todo/name ?list-name]
                  [?cat  :category/todo ?todo]
                  [?task :task/category ?cat]
                  [(> ?task 8)]
                  [?task :task/done ?true]
                  [?task :task/name ?task-name]]
                [{:conn conn
                  :db   @conn
                  :db-id :hux
                  :schema (:schema @conn)
                  :key :hux}
                 true ["Matt" "Jim"]])

  (qa/q-analyze dcfg
                [:results :simple-patterns]
                '[:find ?task ?task-name ?done
                  :in $
                  :where
                  [?task :task/name ?task-name]
                  [?task :task/done ?done]]
                [{:conn conn
                  :db   @conn
                  :db-id :hux
                  :schema (:schema @conn)
                  :key :hux}])

  (qa/get-eavs '[[?p :person/name ?owner-name ?t]
                 [(> ?t 3423)]
                 [?todo :todo/owner ?p]
                 [?todo :todo/name ?list-name]
                 [?cat  :category/todo ?todo]
                 [(get-else $ ?todo :todo/nickname "nothing") ?todo-name]
                 [?task :task/category ?cat]
                 [(> ?task 8)]
                 [?task :task/done ?true]
                 [?task :task/name ?task-name]])

  (d/q '[:find ?task ?task-name ?list-name ?todo-name
         :in $ ?true [?owner-name ...]
         :where
         [?p :person/name ?owner-name]
         [?todo :todo/owner ?p]
         [(get-else $ ?todo :todo/nickname "nothing") ?todo-name]
         [?todo :todo/name ?list-name]
         [?cat  :category/todo ?todo]
         [?task :task/category ?cat]
         [(> ?task 7)]
         [?task :task/done ?true]
         [?task :task/name ?task-name]]
       @conn
       true ["Matt" "Jim"])


  (qa/q-analyze dcfg
                [:simple-patterns]
                '[:find ?task
                  :in $ ?todo
                  :where
                  [?cat :category/todo ?todo]
                  [?task :task/category ?cat]]
                [{:conn conn
                  :db   @conn
                  :db-id :hux
                  :schema (:schema @conn)
                  :key :hux}
                 [:todo/name "Matt's List"]])

  (qa/q-analyze dcfg
                 [:patterns :results]
                 '[:find ?c .
                   :in $ ?t
                   :where
                   [?t :todo/display-category ?c]]
                 [{:conn conn
                   :db   @conn
                   :db-id :hux
                   :schema (:schema @conn)
                   :key :hux}
                  [:todo/name "Matt's List"]])

  (d/q '[:find ?task ?todo
         :in $ $2 ?todo
         :where
         [$2 ?cat :category/todo ?todo]
         [$2 ?task :task/category ?cat]]
       @conn2
       @conn
       [:todo/name "Matt's List"])


  )



;;;; ======== testing convenient stateful posh ======
;;; still brainstorming about what features it should have...
(comment

  (d/transact! conn '[[:db/add 5 :yoyo/ma "bingo"] [:db/add 8 :youou "hey"]])

  (def poshtree (p/new-posh dcfg [:results]))

  (def hux (p/add-db poshtree :hux conn schema nil))

  (def pull1 (p/add-pull hux '[*] 3))

  (def q1 (p/add-q '[:find ?e
                     :in $
                     :where
                     [?e :category/name _]]
                   filtq))

  (def filtq (p/add-filter-q '[:find ?t
                               :in $ ?cat
                               :where
                               [?t :task/category ?cat]]
                             hux
                             [:category/name "Hobby"]))

  (def filtp (p/add-filter-pull hux
                                '[{:task/_category [:task/name]}]
                                [:category/name "Hobby"]))

  (p/poshdb->conn filtp)
  (p/cache filtp)

  (db/poshdb->db @poshtree filtp)

  (def f (d/filter @conn (fn [db datom] (do (println datom)
                                           (odd? (first datom))))))
  f

  (:pass-patterns (p/cache filtq))
  (p/results q1)
  (p/results pull1)


  (def testconn (d/create-conn))

  (qa/q-analyze
   dcfg
   [:results :patterns]
   '[:find ?e ?pfn ?pln ?pf ?pda
     :where
     [?e :participant/firstName ?pfn]
     [?e :participant/lastName ?pln]
     [?e :participant/photo ?pf]
     [?e :participant/dateAdded ?pda]]
   [{:conn testconn :db @testconn :schema nil :db-id :debug}])


  )

; @alexandergunnarson Sync testing

#_(try #_(clojure.main/repl
           :print  clojure.pprint/pprint
           :caught clojure.pprint/pprint)
       (require '[clojure.tools.namespace.repl :refer [refresh]])
       (let [x (refresh)] (when (instance? Throwable x) (throw x)))
       (set! *warn-on-reflection* true)
       (eval `(do (reset! posh.lib.util/debug? true)
                  (clojure.test/run-tests 'posh.lib.ratom-test)
                  (clojure.test/run-tests 'posh.clj.datascript-test)
                  (clojure.test/run-tests 'posh.clj.datomic-test)
                  (clojure.test/run-tests 'posh.sync-test)))
    (catch Throwable t (println t)))
