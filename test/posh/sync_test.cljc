(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]
            [clojure.set         :as set]
            [#?(:clj  clojure.core.async
                :cljs cljs.core.async)
              :refer [offer! put! <! >! close! chan #?@(:clj [go go-loop])]]
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
                 :cljs :refer-macros) [debug prl]])
  #?(:cljs (:require-macros
             [cljs.core.async.macros
              :refer [go go-loop]])))

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

(defn ->ident [db x]
  (cond (instance? datascript.db.DB db)
        x
        #?@(:clj [(instance? datomic.db.Db db)
                  (dat/ident db x)])
        :else (throw (ex-info "Unsupported db to look up ident" {:db db :ident x}))))

(defn attribute= [db attr-0 attr-1]
  (let [attr-0 (->ident db attr-0)
        attr-1 (->ident db attr-1)]
    (= attr-0 attr-1)))

(defn no-task-names-filter [db datom]
  (let [attr (if #?(:clj  (instance? datomic.Datom datom)
                    :cljs false)
                 (:a datom)
                 (second datom))]
    (not (attribute= db attr :task/name))))

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

; TODO remove this watch when query is removed from Posh tree
; TODO change Posh internals so datoms are calculated truly incrementally, such that a `set/difference` calculation becomes unnecessary
(defn listen-for-changed-datoms!
  "Given a Posh tree, a lens keysequence to the query to which to listen, and
   a core.async channel, listens for changes in the set of datoms relevant to the
   query in question.
   Whatever `newv` has that `oldv` doesn't is assumed to be adds.
   Whatever `oldv` has that `newv` doesn't is assumed to be retracts.
   Then pipes this 'datom diff' to the provided core.async channel."
  [poshed lens-ks sub]
  (add-watch poshed lens-ks
    (fn [ks a oldv newv]
      (let [oldv (set (get-in oldv ks))
            newv (set (get-in newv ks))]
        (when (not= oldv newv)
          (let [adds     (set/difference newv oldv)
                retracts (set/difference oldv newv)]
            (when (or (seq adds) (seq retracts))
              (offer! sub {:adds adds :retracts retracts}))))))))

(defn with-comms
  "Establishes core.async communications channel for simulated server and client,
   ensuring they are closed in a `finally` statement after calling the provided fn."
  [f]
  (let [server-sub (chan 100)
        client-sub (chan 100)]
    (try (go-loop [] ; Simulates server-side websocket receive (client push)
           (when-let [msg (<! server-sub)]
             (debug "Received server message" msg)
             (recur)))
         (go-loop [] ; Simulates client-side websocket receive (server push)
           (when-let [msg (<! client-sub)]
             (debug "Received client message" msg)
             (recur)))
         (f server-sub client-sub)
      (finally
        (close! server-sub)
        (close! client-sub)))))

(defn test-filtered
  [{:keys [poshed conn q q-filtered lens-ks lens-ks-empty lens-ks-filtered eid-0 eid-1 eid-2 tx-id to-chan]
    {:keys [tempid transact!] :as dcfg} :dcfg}]
  (let [_ (populate! conn dcfg)
        _ (-> poshed
              (#(st/add-q q (with-meta [:db :conn0] {:posh %}) 54))
              (#(-> (st/add-db (-> % meta :posh) :filtered conn schema {:filter no-task-names-filter})
                    (doto ((fn [db] (st/add-q q          db 54)))
                          ((fn [db] (st/add-q q-filtered db 54))))))
              #_(tree pdat/dcfg))
        necessary-datoms (-> poshed deref (get-in lens-ks))
        _ (is (= necessary-datoms
                 #{[eid-0 :permission/uuid  "sieojeiofja"             tx-id]
                   [eid-0 :task/name        "Mop Floors"              tx-id]
                   [eid-1 :task/name        "Draw a picture of a cat" tx-id]
                   [eid-1 :permission/uuid  "sieojeiofja"             tx-id]
                   [eid-2 :permission/uuid  "sieojeiofja"             tx-id]
                   [eid-2 :permission/level 54                        tx-id]}))
        necessary-datoms-empty (-> poshed deref (get-in lens-ks-empty))
        _ (is (= necessary-datoms-empty nil))
        necessary-datoms-filtered (-> poshed deref (get-in lens-ks-filtered))
        _ (is (= necessary-datoms-filtered
                 #{[eid-0 :permission/uuid  "sieojeiofja"             tx-id]
                   [eid-1 :permission/uuid  "sieojeiofja"             tx-id]
                   [eid-2 :permission/uuid  "sieojeiofja"             tx-id]
                   [eid-2 :permission/level 54                        tx-id]}))
        _ (listen-for-changed-datoms! poshed lens-ks-filtered to-chan)
        _ (transact! conn [[:db/add     [:task/name     "Mop Floors"             ] :task/name       "Mop All Floors"]])
        _ (transact! conn [[:db/retract [:task/name     "Draw a picture of a cat"] :task/name       "Draw a picture of a cat"]
                           [:db/add     [:task/name     "Mop All Floors"         ] :task/name       "Mop Some Floors"]])
        _ (transact! conn [[:db/add     [:category/name "At Home"                ] :permission/uuid "sieojeiofja"]])]))

; A little sync test between Datomic and Clojure DataScript (i.e. ignoring websocket transport for
; now, but focusing on sync itself) showing that the DataScript DB really only gets the subset
; of the Datomic DB that it needs, and at that, only the authorized portions of that subset.
#?(:clj
(deftest local-sync:datomic<->datascript
  (ldat/with-posh-conn pdat/dcfg [:datoms-t] "datomic:mem://test"
    schema
    (fn [dat-poshed dat]
      (with-comms
        (fn [server-sub client-sub]
          (let [ds        (ds/create-conn (lds/->schema schema))
                ds-poshed (pds/posh-one! ds [:datoms-t])
                q '[:find ?tname ?t ?uuid ?p ?level
                    :in $ ?level
                    :where
                      [?t :task/name        ?tname]
                      [?t :permission/uuid  ?uuid]
                      [?p :permission/uuid  ?uuid]
                      [?p :permission/level ?level]]
                q-filtered
                  '[:find ?t ?uuid ?p ?level
                    :in $ ?level
                    :where
                      [?t :permission/uuid  ?uuid]
                      [?p :permission/uuid  ?uuid]
                      [?p :permission/level ?level]]
                ; TODO simplify the below using `st/datoms-t`
                lens-ks          [:cache [:q q          [[:db :conn0   ] 54]] :datoms-t :conn0   ]
                ; This query will have empty results because datoms with :task/name are filtered out
                lens-ks-empty    [:cache [:q q          [[:db :filtered] 54]] :datoms-t :filtered]
                lens-ks-filtered [:cache [:q q-filtered [[:db :filtered] 54]] :datoms-t :filtered]]
            ; DATOMIC
            (test-filtered
              {:conn dat :poshed dat-poshed :to-chan client-sub
               :q q :q-filtered q-filtered
               :lens-ks lens-ks :lens-ks-empty lens-ks-empty :lens-ks-filtered lens-ks-filtered
               :eid-0 277076930200562 :eid-1 277076930200563 :eid-2 277076930200567 :tx-id 13194139534315
               :dcfg {:tempid ldat/tempid :transact! pdat/transact!}})
            ; DATASCRIPT
            (test-filtered
              {:conn ds :poshed ds-poshed :to-chan server-sub
               :q q :q-filtered q-filtered
               :lens-ks lens-ks :lens-ks-empty lens-ks-empty :lens-ks-filtered lens-ks-filtered
               :eid-0 7 :eid-1 8 :eid-2 12 :tx-id 536870913
               :dcfg {:tempid lds/tempid :transact! pds/transact!}})
            )))))))
