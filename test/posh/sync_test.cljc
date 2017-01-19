(ns posh.sync-test
  (:require [#?(:clj  clojure.test
                :cljs cljs.test) :as test
              #?(:clj  :refer
                 :cljs :refer-macros) [is deftest testing]]
            [clojure.set         :as set]
            [#?(:clj  clojure.core.async
                :cljs cljs.core.async) :as async
              :refer [offer! put! <! >! close! chan #?@(:clj [go go-loop <!! alts!!])]]
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
  (let [k-id (keyword (name to) (str "_" id))]
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
      [(->git-commit dcfg :posh                       0)
       (->git-commit dcfg :posh                       1)
       (->git-commit dcfg :mpdairy-private            0)
       (->git-commit dcfg :mpdairy-private            1)
       (->git-commit dcfg :quantum                    0)
       (->git-commit dcfg :quantum                    1)
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
        (when (not= oldv newv)
          (let [adds     (set/difference newv oldv)
                retracts (set/difference oldv newv)]
            (when (or (seq adds) (seq retracts))
              ; Send all datoms for a given transaction as a contiguous package; don't stream them separately
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

        chans {:>ads admin-server-sub
               :>mps mpdairy-server-sub
               :>ags alexandergunnarson-server-sub

               :>adc admin-client-sub
               :>mpc mpdairy-client-sub
               :>agc alexandergunnarson-client-sub}
        mults (->> chans
                   (map (fn [[k c]] [(->> k name rest (apply str) keyword) (async/mult c)]))
                   (into {}))
        taps  (->> mults
                   (map (fn [[k c]] [(keyword (str "<" (name k))) (async/tap c (chan 100))]))
                   (into {}))]
    (try (f (merge chans mults taps))
      (finally (doseq [c (vals chans)] (close! c))))))

; Retrieve users whose public information is visible
(def user-public-q
  '[:find ?username ?name
    :where
      [?u :user/username      ?username]
      [?u :user/name          ?name]])

; Retrieve users whose private information is visible
(def user-private-q
  '[:find ?username ?name ?location
    :where
      [?u :user/username      ?username]
      [?u :user/name          ?name]
      [?u :user/location      ?location]])

; Retrieve users whose admin information is visible
(def user-admin-q
  '[:find ?username ?name ?location ?password-hash
    :where
      [?u :user/username      ?username]
      [?u :user/name          ?name]
      [?u :user/location      ?location]
      [?u :user/password-hash ?password-hash]])

; Retrieve all visible repos
(def repo-q
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

  ; These are all the subscriptions that @mpdairy has checked out, say, in the frontend
  (sub-datoms! poshed :mpdairy                    mpdairy            user-public-q )  ; public  user info @mpdairy            can see
  (sub-datoms! poshed :mpdairy                    mpdairy            user-private-q)  ; private user info @mpdairy            can see
  (sub-datoms! poshed :mpdairy                    mpdairy            user-admin-q  )  ; admin   user info @mpdairy            can see (i.e. none)
  (sub-datoms! poshed :mpdairy                    mpdairy            repo-q        )  ; repo         info @mpdairy            can see

  ; These are all the subscriptions that @alexandergunnarson has checked out, say, in the frontend
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson user-public-q )  ; public  user info @alexandergunnarson can see
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson user-private-q)  ; private user info @alexandergunnarson can see
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson user-admin-q  )  ; admin   user info @alexandergunnarson can see (i.e. none)
  (sub-datoms! poshed :alexandergunnarson         alexandergunnarson repo-q        )) ; repo         info @alexandergunnarson can see

#?(:clj
(defn <!!*
  "Take with timeout; assert result != nil and chan empty"
  ([c] (<!!* c 1000))
  ([c timeout]
    (let [[v _] (alts!! [c (async/timeout timeout)])
          c-ct (-> ^clojure.core.async.impl.channels.ManyToManyChannel c .buf count)]
      (assert (some? v))
      (assert (= c-ct 0) {:ct c-ct}) ; assert empty channel
      v))))

(def dcfg-dat {:tempid ldat/tempid :transact! pdat/transact! :q* dat/q :entity dat/entity})
(def dcfg-ds  {:tempid lds/tempid  :transact! pds/transact!  :q* ds/q  :entity ds/entity})

(defn report-while-open! [id c]
  (let [c' (async/tap c (chan 100))]
    (go-loop [] ; Simulates e.g. server-side websocket receive (client push)
                ;             or client-side websocket receive (server push)
      (if-let [msg (<! c')]
        (do (debug (str "Received by " id) msg)
            (recur))
        #_(debug (str "Report loop for " id " closed"))))))

(defn query-cache [poshed]
  (->> @poshed :cache
       (filter (fn [[k _]] (-> k first (= :q))))
       (map (fn [[k v]] [k (-> v :datoms-t first second set)]))))

(defn get-in-cache [poshed db-name q & in]
  (get-in @poshed [:cache [:q q (into [[:db db-name]] in)] :datoms-t db-name]))

(defn test-db-initialization
  [poshed type]
  (testing "DB initialization and filters"
    (let [user-tx-id                      (case type :dat 13194139534315  :ds 536870913)
          repo-tx-id                      (case type :dat 13194139534322  :ds 536870914)
          id                              (case type :dat 277076930200556 :ds 1)
          reified-txn-ct                  (case type :dat 1               :ds 0)
          r                               reified-txn-ct
          mpdairy-public                  #{[(+ id 0)        :user/username       :mpdairy                         user-tx-id]
                                            [(+ id 0)        :user/name           "Matt Parker"                    user-tx-id]}
          mpdairy-private                 #{[(+ id 0)        :user/location       :usa                             user-tx-id]}
          mpdairy-admin                   #{[(+ id 0)        :user/password-hash  "mpdairy/hash"                   user-tx-id]}
          mpdairy                         (set/union mpdairy-public mpdairy-private mpdairy-admin)
          posh                            #{[(+ id 1)        :repo/name           :posh                            user-tx-id]
                                            [(+ id 6  r)     :repo.commit/to      (+ id 1)                         repo-tx-id]
                                            [(+ id 6  r)     :repo.commit/id      :posh/_0                         repo-tx-id]
                                            [(+ id 6  r)     :repo.commit/content ":posh/_0"                       repo-tx-id]
                                            [(+ id 7  r)     :repo.commit/to      (+ id 1)                         repo-tx-id]
                                            [(+ id 7  r)     :repo.commit/id      :posh/_1                         repo-tx-id]
                                            [(+ id 7  r)     :repo.commit/content ":posh/_1"                       repo-tx-id]}
          mpdairy-private-repo            #{[(+ id 2)        :repo/name           :mpdairy-private                 user-tx-id]
                                            [(+ id 8  r)     :repo.commit/to      (+ id 2)                         repo-tx-id]
                                            [(+ id 8  r)     :repo.commit/id      :mpdairy-private/_0              repo-tx-id]
                                            [(+ id 8  r)     :repo.commit/content ":mpdairy-private/_0"            repo-tx-id]
                                            [(+ id 9  r)     :repo.commit/to      (+ id 2)                         repo-tx-id]
                                            [(+ id 9  r)     :repo.commit/id      :mpdairy-private/_1              repo-tx-id]
                                            [(+ id 9  r)     :repo.commit/content ":mpdairy-private/_1"            repo-tx-id]}

          alexandergunnarson-public       #{[(+ id 3)        :user/username       :alexandergunnarson              user-tx-id]
                                            [(+ id 3)        :user/name           "Alex Gunnarson"                 user-tx-id]}
          alexandergunnarson-private      #{[(+ id 3)        :user/location       :utah                            user-tx-id]}
          alexandergunnarson-admin        #{[(+ id 3)        :user/password-hash  "alexandergunnarson/hash"        user-tx-id]}
          alexandergunnarson              (set/union alexandergunnarson-public alexandergunnarson-private alexandergunnarson-admin)
          quantum                         #{[(+ id 4)        :repo/name           :quantum                         user-tx-id]
                                            [(+ id 10 r)     :repo.commit/id      :quantum/_0                      repo-tx-id]
                                            [(+ id 10 r)     :repo.commit/to      (+ id 4)                         repo-tx-id]
                                            [(+ id 10 r)     :repo.commit/content ":quantum/_0"                    repo-tx-id]
                                            [(+ id 11 r)     :repo.commit/id      :quantum/_1                      repo-tx-id]
                                            [(+ id 11 r)     :repo.commit/content ":quantum/_1"                    repo-tx-id]
                                            [(+ id 11 r)     :repo.commit/to      (+ id 4)                         repo-tx-id]}
          alexandergunnarson-private-repo #{[(+ id 5)        :repo/name           :alexandergunnarson-private      user-tx-id]
                                            [(+ id 12 r)     :repo.commit/id      :alexandergunnarson-private/_0   repo-tx-id]
                                            [(+ id 12 r)     :repo.commit/to      (+ id 5)                         repo-tx-id]
                                            [(+ id 12 r)     :repo.commit/content ":alexandergunnarson-private/_0" repo-tx-id]
                                            [(+ id 13 r)     :repo.commit/content ":alexandergunnarson-private/_1" repo-tx-id]
                                            [(+ id 13 r)     :repo.commit/to      (+ id 5)                         repo-tx-id]
                                            [(+ id 13 r)     :repo.commit/id      :alexandergunnarson-private/_1   repo-tx-id]}]
      (testing "user-public-q"
        (doseq [username #{:mpdairy :alexandergunnarson}]
          (testing username
            (is (= (get-in-cache poshed username user-public-q)
                   (set/union mpdairy-public alexandergunnarson-public))))))
      (testing "user-private-q"
        (testing :mpdairy
          (is (= (get-in-cache poshed :mpdairy user-private-q)
                 (set/union mpdairy-public mpdairy-private))))
        (testing :alexandergunnarson
          (is (= (get-in-cache poshed :alexandergunnarson user-private-q)
                 (set/union alexandergunnarson-public alexandergunnarson-private)))))
      (testing "user-admin-q"
        (testing :admin
          (is (= (get-in-cache poshed :conn0 user-admin-q)
                 (set/union mpdairy alexandergunnarson))))
        (doseq [username #{:mpdairy :alexandergunnarson}]
          (testing username
            (is (= (get-in-cache poshed username user-admin-q)
                   nil)))))
      (testing "repo-q"
        (testing :mpdairy
          (is (= (get-in-cache poshed :mpdairy repo-q)
                 (set/union posh mpdairy-private-repo quantum))))
        (testing :alexandergunnarson
          (is (= (get-in-cache poshed :alexandergunnarson repo-q)
                 (set/union quantum alexandergunnarson-private-repo posh))))))))

; A little sync test between Datomic and Clojure DataScript (i.e. ignoring websocket transport for
; now, but focusing on sync itself) showing that the DataScript DB really only gets the subset
; of the Datomic DB that it needs, and at that, only the authorized portions of that subset.
#?(:clj
(deftest filtered-local-sync:datomic<->datascript
  (ldat/with-posh-conn pdat/dcfg [:datoms-t] "datomic:mem://test"
    schema
    (fn [s-poshed s-conn]
      (with-channels
        (fn [{:keys [>ads >mps >ags , >adc >mpc >agc
                      ads  mps  ags ,  adc  mpc  agc
                     <ads <mps <ags , <adc <mpc <agc]}] ; see `with-channels` for what these stand for
          (let [c-conn   (ds/create-conn (lds/->schema schema))
                c-poshed (pds/posh-one! c-conn [:datoms-t])]
            (testing "Data insertion and datoms listeners"
              (init-db! {:conn s-conn :poshed s-poshed :dcfg dcfg-dat :admin >ads :mpdairy >mps :alexandergunnarson >ags})
              (init-db! {:conn c-conn :poshed c-poshed :dcfg dcfg-ds  :admin >adc :mpdairy >mpc :alexandergunnarson >agc})
              (report-while-open! :admin-server              ads)
              (report-while-open! :mpdairy-server            mps)
              (report-while-open! :alexandergunnarson-server mps)

              (report-while-open! :admin-client              adc)
              (report-while-open! :mpdairy-client            mpc)
              (report-while-open! :alexandergunnarson-client mpc))
            (test-db-initialization s-poshed :dat)
            (test-db-initialization c-poshed :ds )

            ; TODO try retracts as well

            (testing "Server push"
              ; The server decides to rehash all passwords with a better hashing algorithm (don't ask if this is a good idea...)
              (pdat/transact! s-conn [[:db/add [:user/username :mpdairy] :user/password-hash "mpdairy/hash-more-secure"]])
              (is (= (<!!* <ads)
                     {:adds
                        #{[277076930200556 :user/password-hash "mpdairy/hash-more-secure" 13194139534331]}
                      :retracts
                        #{[277076930200556 :user/password-hash "mpdairy/hash"             13194139534315]}}))
              (pdat/transact! s-conn [[:db/add [:user/username :alexandergunnarson] :user/password-hash "alexandergunnarson/hash-more-secure"]])
              (is (= (<!!* <ads)
                     {:adds
                        #{[277076930200559 :user/password-hash "alexandergunnarson/hash-more-secure" 13194139534332]},
                      :retracts
                        #{[277076930200559 :user/password-hash "alexandergunnarson/hash"             13194139534315]}})))
            (testing "Client push"
              ; @mpdairy decides to rename himself Matthew P. Dairy.
              ; This will cause multiple listeners with overlapping queries to offer the same datoms to the client receive-chan.
              (pds/transact! c-conn [[:db/add [:user/username :mpdairy] :user/name "Matthew P. Dairy"]])
              (let [datoms {:adds     #{[1 :user/name "Matthew P. Dairy" 536870915]},
                            :retracts #{[1 :user/name "Matt Parker"      536870913]}}]
                #_(doseq [c #{<adc <agc <mpc}]
                  (is (= (<!!* c) datoms)))))
            #_(pdat/transact! dat [(->git-commit dcfg-dat :posh 2)])


            #_(pds/transact!  ds  [(->git-commit dcfg-ds  :posh 2)])

            #_(is (= (take<!! 1 server-sub) ...))
            )))))))

; ===== TODOS ===== ;

; ----- TXN FNS ----- ;
; Register tx-fns on both server and client

; ----- SCHEMA CHANGES ----- ;
; Client -> server is easy; server -> client is less so
; The listener will listen for schema changes and extract those

; ----- AUTH ----- ;
; Pretty good right now; obviously some improvements are available
