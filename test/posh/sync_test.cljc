(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]
            [posh.core           :as p]
    #?(:clj [datascript.core     :as ds])
    #?(:clj [posh.clj.datascript :as pds]) ; TODO CLJC
            [posh.lib.datascript :as lds]
    #?(:clj [datomic.api         :as dat])
    #?(:clj [posh.clj.datomic    :as pdat])
    #?(:clj [posh.lib.datomic    :as ldat])
            [posh.lib.ratom      :as r]
            [posh.lib.util       :as u
              #?(:clj  :refer
                 :cljs :refer-macros) [debug prl]]))

(def schema
  {:todo/name             {:db/valueType   :db.type/string
                           :db/unique      :db.unique/identity
                           :db/cardinality :db.cardinality/one}
   :todo/owner            {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :task/category         {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :category/todo         {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :task/name             {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity}
   :category/name         {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity}
   :todo/display-category {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :todo/numbers          {:db/valueType   :db.type/long
                           :db/cardinality :db.cardinality/many}})

(defn no-task-names-filter [_ datom] (not= (second datom) :task/name))

(defn populate! [conn {:keys [tempid transact!] :as dcfg}]
  (let [matt       {:db/id (tempid) :person/name "Matt" :person/age 14}
        todos      {:db/id (tempid)
                    :todo/name "Matt's List" :todo/listing :all
                    :todo/owner (:db/id matt)}
        at-home    {:db/id (tempid) :category/name "At Home"    :category/todo (:db/id todos)}
        work-stuff {:db/id (tempid) :category/name "Work Stuff" :category/todo (:db/id todos)}
        hobby      {:db/id (tempid) :category/name "Hobby"      :category/todo (:db/id todos)}]
    (transact!
     conn
     [matt
      todos
      at-home
      work-stuff
      hobby
      [:db/add (:db/id todos) :todo/numbers 12]
      [:db/add (:db/id todos) :todo/numbers 20]
      [:db/add (:db/id todos) :todo/numbers 443]
      {:db/id (tempid)
       :task/name "Clean Dishes"
       :task/done true
       :permission/uuid "uktdkafojea"
       :task/category (:db/id at-home)}
      {:db/id (tempid)
       :task/name "Mop Floors"
       :task/done true
       :task/pinned true
       :permission/uuid "sieojeiofja"
       :task/category (:db/id at-home)}
      {:db/id (tempid)
       :task/name "Draw a picture of a cat"
       :task/done false
       :permission/uuid "sieojeiofja"
       :task/category (:db/id hobby)}
      {:db/id (tempid)
       :task/name "Compose opera"
       :task/done true
       :permission/uuid "bmmsmsdlfds"
       :task/category (:db/id hobby)}
      {:db/id (tempid)
       :task/name "Stock market library"
       :task/done false
       :permission/uuid "uktdkafojea"
       :task/pinned true
       :task/category (:db/id work-stuff)}
      {:db/id (tempid)
       :permission/level 34
       :permission/uuid "uktdkafojea"}
      {:db/id (tempid)
       :permission/level 54
       :permission/uuid "sieojeiofja"}
      {:db/id (tempid)
       :permission/level 10
       :permission/uuid "bmmsmsdlfds"}])))

(defn tree [conn dcfg]
  (-> (p/empty-tree dcfg [:datoms-t])
      (p/add-db :hux conn schema)

      ;; same db as :hux but without any :task/name datoms
      (p/add-db :tasks conn schema {:filter 'no-task-names-filter}) ; TODO make so it doesn't call `resolve`

      (p/add-pull [:db :hux] '[*] 3)
      (p/add-filter-tx [:db :hux] '[[_ #{:category/name}]])
      (p/add-filter-pull
       [:db :hux]
       '[{:todo/_owner [{:category/_todo [:category/name]}]}] 1)
      (p/add-pull
       '[:filter-pull
         [:db :hux]
         [{:todo/_owner [{:category/_todo [:category/name]}]}]
         1]
       '[*] 3)
      (p/add-pull '[:filter-tx [:db :hux] [[_ #{:category/name}]]]
                  '[*] 3)
      (p/add-q '[:find ?tname ?t ?uuid ?p ?level
                 :in $hux ?level
                 :where
                 [?t :task/name ?tname]
                 [?t :permission/uuid ?uuid]
                 [$hux ?p :permission/uuid ?uuid]
                 [$hux ?p :permission/level ?level]]
               [:db :hux]
               54)))

; A little sync test between Datomic and Clojure DataScript (i.e. ignoring websocket transport for
; now, but focusing on sync itself) showing that the DataScript DB really only gets the subset
; of the Datomic DB that it needs, and at that, only the authorized portions of that subset.
#?(:clj
(deftest local-sync:datomic<->datascript
  (ldat/with-posh-conn pdat/dcfg [:datoms-t] "datomic:mem://test"
    schema
    #_[{:db/ident       :test/attr
      :db/valueType   :db.type/string
      :db/cardinality :db.cardinality/one}]
    (fn [dat-poshed dat]
      tree
      (let [;dat-tree  (tree dat pdat/dcfg)
            dat-tree  (-> (p/empty-tree pdat/dcfg [:datoms-t])
                          (p/add-db :dat dat schema)
                          )
            ds        (ds/create-conn (lds/->schema schema))
            ds-poshed (pds/posh-one! ds [:datoms-t])
            ;ds-tree   (tree ds pds/dcfg)
            ;_ (populate! dat {:tempid lds/tempid :transact! pds/transact!})
            ;_ (populate! ds  {:tempid lds/tempid :transact! pds/transact!})
            ;ds-sub  (pds/q  [:find '?e :where ['?e :test/attr]] ds)
            ;_       (r/add-eager-watch ds-sub  :ds  (fn [k a oldv newv] (prl "DS"  a oldv newv)))
            ;dat-sub (pdat/q [:find '?e :where ['?e :test/attr]] dat)
            ;_       (r/add-eager-watch dat-sub :dat (fn [k a oldv newv] (prl "DAT" a oldv newv)))
            ]
        ;(prl (meta dat-sub) dat-poshed ds-poshed)

        )))

  ))
