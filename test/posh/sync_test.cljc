(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]
            [posh.core           :as p]
            [posh.stateful       :as st]
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
  {:category/name         {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity}
   :category/todo         {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :task/category         {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :task/done             {:db/valueType   :db.type/boolean
                           :db/cardinality :db.cardinality/one}
   :task/name             {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity}
   :task/pinned           {:db/valueType   :db.type/boolean
                           :db/cardinality :db.cardinality/one}
   :todo/display-category {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :todo/listing          {:db/valueType   :db.type/keyword
                           :db/cardinality :db.cardinality/one}
   :todo/name             {:db/valueType   :db.type/string
                           :db/unique      :db.unique/identity
                           :db/cardinality :db.cardinality/one}
   :todo/numbers          {:db/valueType   :db.type/long
                           :db/cardinality :db.cardinality/many}
   :todo/owner            {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :permission/level      {:db/valueType   :db.type/long
                           :db/cardinality :db.cardinality/one}
   :permission/uuid       {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one}
   :person/age            {:db/valueType   :db.type/long
                           :db/cardinality :db.cardinality/one}
   :person/name           {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one}})

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

; TODO it seems this requires the datom matcher to call `seq` on a Datomic datom
; TODO use posh.stateful for all this
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

; TODO use filtered DB
#?(:clj
(deftest local-sync:datomic<->datascript
  (ldat/with-posh-conn pdat/dcfg [:datoms-t] "datomic:mem://test"
    schema
    (fn [dat-poshed dat]
      (let [q '[:find ?tname ?t ?uuid ?p ?level
                :in $ ?level
                :where
                  [?t :task/name        ?tname]
                  [?t :permission/uuid  ?uuid]
                  [?p :permission/uuid  ?uuid]
                  [?p :permission/level ?level]]
            ; DATOMIC
            _ (populate! dat {:tempid ldat/tempid :transact! pdat/transact!})
            ;dat-tree  (tree dat pdat/dcfg)
            dat-tree (-> (st/new-posh pdat/dcfg [:datoms-t])
                         (st/add-db :dat dat schema)
                         (#(st/add-q q % 54))
                         meta :posh)
            ; TODO simplify the below using `st/datoms-t`
            necessary-datoms-dat (-> dat-tree deref :cache (get [:q q [[:db :dat] 54]]) :datoms-t :dat)
            _ (is (= necessary-datoms-dat
                     #{[285873023222770 :permission/uuid  "sieojeiofja"             13194139534315]
                       [285873023222770 :task/name        "Mop Floors"              13194139534315]
                       [285873023222771 :task/name        "Draw a picture of a cat" 13194139534315]
                       [285873023222771 :permission/uuid  "sieojeiofja"             13194139534315]
                       [285873023222775 :permission/uuid  "sieojeiofja"             13194139534315]
                       [285873023222775 :permission/level 54                        13194139534315]}))
            _ (is (= @(pdat/q q dat 54)
                     #{["Draw a picture of a cat" 285873023222771 "sieojeiofja" 285873023222775 54]
                       ["Mop Floors"              285873023222770 "sieojeiofja" 285873023222775 54]}))
            ; DATASCRIPT
            ds        (ds/create-conn (lds/->schema schema))
            ds-poshed (pds/posh-one! ds [:datoms-t])
            _         (populate! ds {:tempid lds/tempid :transact! pds/transact!})
            ;ds-tree   (tree ds pds/dcfg)
            ds-tree (-> (st/new-posh pds/dcfg [:datoms-t])
                        (st/add-db :dat ds schema)
                        (#(st/add-q q % 54))
                        meta :posh)
            necessary-datoms-ds (-> ds-tree deref :cache (get [:q q [[:db :dat] 54]]) :datoms-t :dat)
            _ (is (= necessary-datoms-ds
                     #{[7  :permission/uuid  "sieojeiofja"             536870913]
                       [7  :task/name        "Mop Floors"              536870913]
                       [8  :task/name        "Draw a picture of a cat" 536870913]
                       [8  :permission/uuid  "sieojeiofja"             536870913]
                       [12 :permission/uuid  "sieojeiofja"             536870913]
                       [12 :permission/level 54                        536870913]}))
            _ (is (= @(pds/q q ds 54)
                     #{["Mop Floors"              7 "sieojeiofja" 12 54]
                       ["Draw a picture of a cat" 8 "sieojeiofja" 12 54]}))
            ;_       (r/add-eager-watch ds-sub  :ds  (fn [k a oldv newv] (prl "DS"  a oldv newv)))
            ;_       (r/add-eager-watch dat-sub :dat (fn [k a oldv newv] (prl "DAT" a oldv newv)))
            ]
        )))))
