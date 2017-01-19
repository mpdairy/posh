(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]
            [clojure.set         :as set]
            [#?(:clj  clojure.core.async
                :cljs cljs.core.async)
              :refer [offer! put! <! >! close! chan #?@(:clj [go go-loop <!!])]]
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

(defn ->ident [db x]
  (cond (instance? datascript.db.DB db)
        x
        #?@(:clj [(instance? datomic.db.Db db)
                  (dat/ident db x)])
        :else (throw (ex-info "Unsupported db to look up ident" {:db db :ident x}))))

(defn ->e [datom]
  (if (vector? datom)
      (get datom 0)
      (:e datom)))

(defn ->a [datom]
  (if (vector? datom)
      (get datom 1)
      (:a datom)))

(defn ->v [datom]
  (if (vector? datom)
      (get datom 2)
      (:v datom)))

(defn ->t [datom]
  (if (vector? datom)
      (get datom 3)
      (:t datom)))

(defn ident= [db attr-0 attr-1]
  (let [attr-0 (->ident db attr-0)
        attr-1 (->ident db attr-1)]
    (= attr-0 attr-1)))

; GitHub repositories schema
(def schema
  {:repo/name             {:db/valueType   :db.type/keyword
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity} ; really, unique by :user/username, enforced via tx fn
   :repo/owner            {:db/valueType   :db.type/ref
                           :db/cardinality :db.cardinality/one}
   :repo/private?         {:db/valueType   :db.type/boolean
                           :db/cardinality :db.cardinality/one}
   ; Commits are ordered by their ids
   :repo.commit/to        {:db/valueType   :db.type/ref ; really, ref to :repo enforced via tx fn
                           :db/cardinality :db.cardinality/one}
   :repo.commit/id        {:db/valueType   :db.type/keyword
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity} ; really, unique by :repo.commit/to, enforced via tx fn
   :repo.commit/content   {:db/valueType   :db.type/string ; the text of the commit
                           :db/cardinality :db.cardinality/one}
   :user/username         {:db/valueType   :db.type/keyword
                           :db/cardinality :db.cardinality/one
                           :db/unique      :db.unique/identity}
   :user/name             {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one}
   :user/location         {:db/valueType   :db.type/keyword
                           :db/cardinality :db.cardinality/one}
   :user/password-hash    {:db/valueType   :db.type/string
                           :db/cardinality :db.cardinality/one}})

(defn admin-filter
  "A non-admin is not allowed to see a user's password hash."
  [db datom] (not (ident= db (->a datom) :user/password-hash)))

(defn user-filter
  "A user is not allowed to see another user's location, nor their private repos."
  [{:as dcfg :keys [q* entity]} username]
  (fn [db datom]
    (and (admin-filter db datom)
         (let [e (->e datom)
               a (->ident db (->a datom))
               [user*] (q* [:find ['?user] :where ['?user :user/username username]] db)
               other-users-location? (and (= a :user/location) (not= e user*))
               part-of-repo?   (= (namespace a) "repo")
               part-of-commit? (= (namespace a) "repo.commit")
               other-users-private-repo?
                 (fn [repo-e] (let [repo (entity db repo-e)]
                                (and (-> repo :repo/owner :db/id (not= user*))
                                     (-> repo :repo/private?))))
               part-of-other-users-private-repo?
                 (cond part-of-repo?   (other-users-private-repo? e)
                       part-of-commit? (let [commit (entity db e)] (-> commit :repo.commit/to other-users-private-repo? :db/id))
                       :else false)]
           (not (or other-users-location? part-of-other-users-private-repo?))))))

(defn ->git-commit
  "Creates, but does not transact, a GitHub commit."
  [{:as dcfg :keys [tempid]} to id]
  (let [k-id (keyword (name to) (str id))]
    {:db/id (tempid) :repo.commit/to [:repo/name to] :repo.commit/content (str k-id) :repo.commit/id k-id}))

(defn populate! [conn {:as dcfg :keys [tempid transact!]}]
  (let [mpdairy-id                    (tempid)
        alexandergunnarson-id         (tempid)

        mpdairy                    {:db/id         mpdairy-id
                                    :user/username :mpdairy
                                    :user/password-hash "mpdairy/hash"
                                    :user/name     "Matt Parker"
                                    :user/location :usa}
        posh                       {:db/id         (tempid)
                                    :repo/name     :posh
                                    :repo/owner    mpdairy-id}
        mpdairy-private            {:db/id         (tempid)
                                    :repo/name     :mpdairy-private
                                    :repo/owner    mpdairy-id :repo/private? true}

        alexandergunnarson         {:db/id         alexandergunnarson-id
                                    :user/username :alexandergunnarson
                                    :user/password-hash "alexandergunnarson/hash"
                                    :user/name     "Alex Gunnarson"
                                    :user/location :utah}
        quantum                    {:db/id         (tempid)
                                    :repo/name     :quantum
                                    :repo/owner    alexandergunnarson-id}
        alexandergunnarson-private {:db/id         (tempid)
                                    :repo/name     :alexandergunnarson-private
                                    :repo/owner    alexandergunnarson-id :repo/private? true}]
    (transact! conn
      [mpdairy
       posh
       mpdairy-private
       alexandergunnarson
       quantum
       alexandergunnarson-private])
    (transact! conn
      [(->git-commit dcfg :posh 0)
       (->git-commit dcfg :posh 1)
       (->git-commit dcfg :mpdairy-private 0)
       (->git-commit dcfg :mpdairy-private 1)
       (->git-commit dcfg :quantum 0)
       (->git-commit dcfg :quantum 1)
       (->git-commit dcfg :alexandergunnarson-private 0)
       (->git-commit dcfg :alexandergunnarson-private 1)])))

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
  ;(prl lens-ks)
  (add-watch poshed lens-ks
    (fn [ks a oldv newv]
      (let [oldv (set (get-in oldv ks))
            newv (set (get-in newv ks))]
        (when (not= oldv newv) (println "diff!")
          (let [adds     (set/difference newv oldv)
                retracts (set/difference oldv newv)]
            (when (or (seq adds) (seq retracts))
              (offer! sub {:adds adds :retracts retracts}))))))))

(defn sub-datoms!
  "Registers a query to be cached and listens for changes to datoms affecting it,
   piping datom changes to `to-chan`."
  {:example `(sub-datoms! poshed :conn0 (chan 100) q 54)}
  [poshed db-name to-chan q & in]
  (apply st/add-q q (with-meta [:db db-name] {:posh poshed}) in)
  (listen-for-changed-datoms! poshed
    [:cache [:q q (into [[:db db-name]] in)] :datoms-t db-name]
    to-chan))

(defn with-channels
  "Establishes core.async communications channel for simulated server and client
   (with two logged in users and an admin, with server and client channels for each),
   ensuring they are all closed in a `finally` statement after calling the provided fn."
  [f]
  (let [admin-server-sub              (chan 100)
        mpdairy-server-sub            (chan 100)
        alexandergunnarson-server-sub (chan 100)

        admin-client-sub              (chan 100)
        mpdairy-client-sub            (chan 100)
        alexandergunnarson-client-sub (chan 100)

        chans {:ads admin-server-sub
               :mps mpdairy-server-sub
               :ags alexandergunnarson-server-sub

               :adc admin-client-sub
               :mpc mpdairy-client-sub
               :agc alexandergunnarson-client-sub}]
    (try (f chans)
      (finally (doseq [c (vals chans)] (close! c))))))

(def user-public-q
  '[:find ?username ?name
    :where
      [?u :user/username      ?username]
      [?u :user/name          ?name]])

(def user-private-q
  '[:find ?username ?name ?location
    :where
      [?u :user/username      ?username]
      [?u :user/name          ?name]
      [?u :user/location      ?location]])

(def user-admin-q
  '[:find ?username ?name ?location ?password-hash
    :where
      [?u :user/username      ?username]
      [?u :user/name          ?name]
      [?u :user/location      ?location]
      [?u :user/password-hash ?password-hash]])

(def repo-q ; public/private depending on the db passed in
  '[:find ?name ?r ?id ?content
    :where
      [?r :repo/name           ?name]
      [?c :repo.commit/to      ?r]
      [?c :repo.commit/id      ?id]
      [?c :repo.commit/content ?content]])

(defn init-db! [{:keys [conn poshed dcfg admin mpdairy alexandergunnarson]}]
  (populate! conn dcfg)
  (st/add-db poshed :mpdairy            conn schema {:filter (user-filter dcfg :mpdairy)})
  (st/add-db poshed :alexandergunnarson conn schema {:filter (user-filter dcfg :alexandergunnarson)})
  (sub-datoms! poshed :conn0                      admin              user-admin-q  )  ; admin   user info (unfiltered, i.e. from admin perspective)

  (sub-datoms! poshed :mpdairy                    mpdairy            user-public-q )  ; public  user info @mpdairy            can see
  (sub-datoms! poshed :mpdairy                    mpdairy            user-private-q)  ; private user info @mpdairy            can see
  (sub-datoms! poshed :mpdairy                    mpdairy            user-admin-q  )  ; admin   user info @mpdairy            can see (i.e. none)
  (sub-datoms! poshed :mpdairy                    mpdairy            repo-q        )  ; repo         info @mpdairy            can see

  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson user-public-q )  ; public  user info @alexandergunnarson can see
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson user-private-q)  ; private user info @alexandergunnarson can see
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson user-admin-q  )  ; admin   user info @alexandergunnarson can see (i.e. none)
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson repo-q        )) ; repo         info @alexandergunnarson can see


(defn test-filtered
  [{:as args
    :keys [poshed conn lens-ks lens-ks-empty lens-ks-filtered eid-0 eid-1 eid-2 tx-id to-chan]
    {:keys [tempid transact!] :as dcfg} :dcfg}]
  (let [_ (init-db! args)
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
        _ (transact! conn [[:db/add     [:task/name     "Mop Floors"             ] :task/name       "Mop All Floors"]])
        _ (transact! conn [[:db/retract [:task/name     "Draw a picture of a cat"] :task/name       "Draw a picture of a cat"]
                           [:db/add     [:task/name     "Mop All Floors"         ] :task/name       "Mop Some Floors"]])
        _ (transact! conn [[:db/add     [:category/name "At Home"                ] :permission/uuid "sieojeiofja"]])]))

#?(:clj
(defn take<!! [n c]
  (let [ret (transient [])]
    (dotimes [i n] (conj! ret (<!! c)))
    (persistent! ret))))

(def dcfg-dat {:tempid ldat/tempid :transact! pdat/transact! :q* dat/q :entity dat/entity})
(def dcfg-ds  {:tempid lds/tempid  :transact! pds/transact!  :q* ds/q  :entity ds/entity})


#_(:clj
(deftest simple-filtered-local-sync:datomic<->datascript
  (ldat/with-posh-conn pdat/dcfg [:datoms-t] "datomic:mem://test"
    schema
    (fn [dat-poshed dat]
      (with-comms
        (fn [server-sub client-sub]
          (let [ds        (ds/create-conn (lds/->schema schema))
                ds-poshed (pds/posh-one! ds [:datoms-t])
                ; TODO simplify the below using `st/datoms-t`
                lens-ks          [:cache [:q q          [[:db :conn0   ] 54]] :datoms-t :conn0   ]
                ; This query will have empty results because datoms with :task/name are filtered out
                lens-ks-empty    [:cache [:q q          [[:db :filtered] 54]] :datoms-t :filtered]
                lens-ks-filtered [:cache [:q q-filtered [[:db :filtered] 54]] :datoms-t :filtered]]
            ; DATOMIC
            (test-filtered
              {:conn dat :poshed dat-poshed :to-chan client-sub
               :lens-ks lens-ks :lens-ks-empty lens-ks-empty :lens-ks-filtered lens-ks-filtered
               :eid-0 277076930200562 :eid-1 277076930200563 :eid-2 277076930200567 :tx-id 13194139534315
               :dcfg dcfg-dat})
            ; DATASCRIPT
            (test-filtered
              {:conn ds :poshed ds-poshed :to-chan server-sub
               :lens-ks lens-ks :lens-ks-empty lens-ks-empty :lens-ks-filtered lens-ks-filtered
               :eid-0 7 :eid-1 8 :eid-2 12 :tx-id 536870913
               :dcfg dcfg-ds})
            (let [server-ret (take<!! 1 server-sub)
                  client-ret (take<!! 1 client-sub)
                  _ (is (= server-ret
                           [{:adds #{[3 :permission/uuid "sieojeiofja" 536870916]}
                             :retracts #{}}]))
                  _ (is (= client-ret
                           [{:adds #{[277076930200558 :permission/uuid "sieojeiofja" 13194139534331]}
                             :retracts #{}}]))]))))))))

(defn report-while-open! [id c]
  (go-loop [] ; Simulates e.g. server-side websocket receive (client push)
              ;             or client-side websocket receive (server push)
    (when-let [msg (<! c)]
      (debug (str "Received to " id) msg)
      (recur))))

(defn query-cache [poshed]
  (->> @poshed :cache
       (filter (fn [[k _]] (-> k first (= :q))))
       (map (fn [[k v]] [k (-> v :datoms-t first second set)]))))

; A little sync test between Datomic and Clojure DataScript (i.e. ignoring websocket transport for
; now, but focusing on sync itself) showing that the DataScript DB really only gets the subset
; of the Datomic DB that it needs, and at that, only the authorized portions of that subset.
#?(:clj
(deftest filtered-local-sync:datomic<->datascript
  (ldat/with-posh-conn pdat/dcfg [:datoms-t] "datomic:mem://test"
    schema
    (fn [dat-poshed dat]
      (with-channels
        (fn [{:keys [ads mps ags , adc mpc agc]}] ; see `with-channels` for what these stand for
          (let [ds        (ds/create-conn (lds/->schema schema))
                ds-poshed (pds/posh-one! ds [:datoms-t])
                ]
            (init-db! {:conn dat :poshed dat-poshed :dcfg dcfg-dat :admin ads :mpdairy mps :alexandergunnarson ags})
            (init-db! {:conn ds  :poshed ds-poshed  :dcfg dcfg-ds  :admin adc :mpdairy mpc :alexandergunnarson agc})
            (report-while-open! :admin-server              ads)
            (report-while-open! :mpdairy-server            mps)
            (report-while-open! :alexandergunnarson-server mps)

            (report-while-open! :admin-client              adc)
            (report-while-open! :mpdairy-client            mpc)
            (report-while-open! :alexandergunnarson-client mpc)
            (pdat/transact! dat [(->git-commit dcfg-dat :posh 0)])
            (pds/transact!  ds  [(->git-commit dcfg-ds  :posh 0)])
            #_(prl (query-cache dat-poshed))

            )))))))
