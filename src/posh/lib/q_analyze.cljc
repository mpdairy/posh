(ns posh.lib.q-analyze
  (:require
   [posh.lib.util :as util]
   [posh.lib.datom-matcher :as dm]
   [posh.lib.pull-analyze :as pa]
   #?(:clj [clojure.core.match :refer [match]]
      :cljs [cljs.core.match :refer-macros [match]])))

;;;;;;;;; Q-datoms  -- gets datoms for a query

(defn take-until [stop-at? ls]
  (if (or
       (empty? ls)
       (stop-at? (first ls)))
    []
    (cons (first ls) (take-until stop-at? (rest ls)))))

(defn rest-at [rest-at? ls]
  (if (or (empty? ls) (rest-at? (first ls)))
    ls
    (recur rest-at? (rest ls))))

(defn split-list-at [split-at? ls]
  (if (empty? ls)
    {}
    (merge {(first ls) (take-until split-at? (take-until split-at? (rest ls)))}
           (split-list-at split-at? (rest-at split-at? (rest ls))))))

(defn query-to-map [query]
  (if-not (map? query)
    (split-list-at keyword? query)
    query))

(defn dbvar? [x] (and (symbol? x) (= (first (str x)) \$)))

(defn qvar? [x] (and (symbol? x) (= (first (str x)) \?)))

(defn get-all-vars [query]
  (cond
   (empty? query) #{}
   (coll? (first query)) (clojure.set/union (get-all-vars (first query))
                                            (get-all-vars (rest query)))
   (qvar? (first query)) (conj (get-all-vars (rest query)) (first query))
   :else (get-all-vars (rest query))))

(def qvar-gen
  (let [qvar-count (atom 3284832)]
    (fn [] (symbol (str "?var" (swap! qvar-count inc))))))

(defn eav? [v]
  (and (vector? v)
       (not (or (coll? (first v))
                (coll? (second v))))))

(defn wildcard? [s] (= s '_))

(defn normalize-eav-helper [eav n neweav vars]
  (if (= n 0)
    {:eav neweav :vars vars}
    (if (and (first eav) (not (wildcard? (first eav))))
      (normalize-eav-helper (rest eav) (dec n)
                            (conj neweav (first eav))
                            vars)
      (let [var (qvar-gen)]
        (normalize-eav-helper (rest eav) (dec n)
                              (conj neweav var)
                              (conj vars var))))))

(defn normalize-eav [eav]
  (let [dbeav (if (dbvar? (first eav))
                eav
                (cons (symbol "$") eav))]
    (vec (cons (first dbeav) (concat (:eav (normalize-eav-helper (rest dbeav) 3 [] []))
                                     (drop 4 dbeav))))))

(defn normalize-all-eavs [where]
  (cond
   (empty? where) []

   (list? where)
   (if (some #{(first where)} ['or-join 'not-join]) ;; skip first vector
     (concat [(first where) (second where)] (normalize-all-eavs (vec (drop 2 where))))
     (cons (first where) (normalize-all-eavs (vec (rest where)))))

   (eav? where)
   (normalize-eav where)

   (and (vector? where) (list? (first where)))
   where

   (coll? where)
   (vec (map normalize-all-eavs where))

   :else where))


(defn get-eavs [where]
  (if (empty? where)
    []
    (let [item (first where)]
      (cond
       (seq? item)
       (if (some #{(first item)} ['or-join 'not-join]) ;; skip first vector
         (concat (get-eavs (vec (rest where))) (get-eavs (vec (drop 2 item))))
         (concat (get-eavs (vec (rest where))) (get-eavs (vec (rest item)))))

       (eav? item)
       (cons item (get-eavs (rest where)))

       (and (vector? item) (seq? (first item)))
       (match (vec (concat [(vec (first item))] (rest item)))
              [['get-else db e a _] v]
              (concat [[db e a v]] (get-eavs (vec (rest where))))
              :else (get-eavs (vec (rest where))))

       :else (get-eavs (vec (rest where)))))))


(defn qm-to-query [qm]
  (reduce (fn [xs [k v]]
            (concat xs [k] v))
          []
          qm))

(defn create-q-datoms [results eavs vars]
  (set
   (mapcat (fn [r] (let [vs (zipmap vars r)]
                    (map (fn [eav]
                           (vec (map #(if (qvar? %) (get vs %) %) eav)))
                         eavs)))
           results)))

;;; q pattern gen ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn count-qvars [xs]
  (cond
   (empty? xs) {}
   (coll? (first xs)) (merge-with + (count-qvars (first xs)) (count-qvars (rest xs)))
   :else (merge-with +
                     (when (qvar? (first xs)) {(first xs) 1})
                     (count-qvars (rest xs)))))

(defn fill-qvar-set [qvar results where]
  (for [r results]
    (let [vars (zipmap where r)]
      (get vars qvar))))

(defn seq-merge-with [f seq1 seq2]
  (if (empty? seq1)
    []
    (cons (f (first seq1) (first seq2))
          (seq-merge-with f (rest seq1) (rest seq2)))))

(defn stack-vectors [vs]
  (reduce (fn [stacked eav]
            (seq-merge-with conj stacked eav))
          (take (count (first vs)) (repeat #{})) vs))

(defn pattern-from-eav--old [vars [e a v :as eav]]
  (let [[qe qa qv] (map qvar? eav)]
    (for [ee (if qe ['_ (get vars e)] [e])
          aa (if qa ['_ (get vars a)] [a])
          vv (if qv ['_ (get vars v)] [v])
          :when (let [wildcard-count
                      (reduce + (map #(if (= '_ %) 1 0) [ee aa vv]))
                      exposed-qvars
                      (reduce + (map (fn [[var? val]]
                                       (if (and var? (not= val '_))
                                         1
                                         0))
                                     [[qe ee] [qa aa] [qv vv]]))
                      qvar-count (reduce + (map #(if % 1 0) [qe qa qv]))]
                  (and (>= wildcard-count 1)
                       (or (and (> qvar-count 1) (= 1 exposed-qvars))
                           (<= qvar-count 1))
                       (<= wildcard-count qvar-count)))]
      [ee aa vv])))

(defn get_ [m k]
  "returns '_ if k is not found"
  (or (get m k) '_))

;; generates matching patterns from eavs.
;; the qvars are "connecting" vars that are used between
;; two eavs in the query. the '_ wildcards are either output
;; vars or originally wildcards. Input vars and things like
;; attribs that are hand-typed in the query are there as
;; they are or as sets (if there was a var that inputted a set)
(defn pattern-from-eav [vars eav]
  (match [(vec eav) (vec (map qvar? eav))]
         [['_ '_ '_] _] [[]]
         [['_ '_ v] [_ _ false]] [['_ '_ v]]
         [['_ '_ v] [_ _ true]] [['_ '_ (get_ vars v)]]
         [['_ a '_] [_ false _]] [['_ a '_]]
         [['_ a '_] [_ true _]] [['_ (get_ vars a) '_]]
         [[e '_ '_] [false _ _]] [[e '_ '_]]
         [[e '_ '_] [true _ _]] [[(get_ vars e) '_ '_]]
         [[e a '_] [true true _]] [[(get_ vars e) '_ '_]
                                   ['_ (get_ vars a) '_]]
         [[e a '_] [true false _]] [[(get_ vars e) a '_]]
         [[e a '_] [false true _]] [[e (get_ vars a) '_]]
         [[e a '_] [false false _]] [[e a '_]]
         [[e '_ v] [true _ true]] [[(get_ vars e) '_ '_]
                                   ['_ '_ (get_ vars v)]]
         [[e '_ v] [true _ false]] [[(get_ vars e) '_ v]]
         [[e '_ v] [false _ true]] [[e '_ (get_ vars v)]]
         [[e '_ v] [false _ false]] [[e '_ v]]
         [['_ a v] [_ true true]] [['_ '_  (get_ vars v)]
                                   ['_ (get_ vars a) '_]]
         [['_ a v] [_ true false]] [['_ (get_ vars a) v]]
         [['_ a v] [_ false true]] [['_ a (get_ vars v)]]
         [['_ a v] [_ false false]] [['_ a v]]
         [[e a v] [true true true]] [['_ '_  (get_ vars v)]
                                     ['_ (get_ vars a) '_]
                                     [(get_ vars e) '_ '_]]
         [[e a v] [false true true]] [[e '_  (get_ vars v)]
                                      [e (get_ vars a) '_]]
         [[e a v] [true false true]] [['_ a  (get_ vars v)]
                                      [(get_ vars e) a '_]]
         [[e a v] [true true false]] [['_ (get_ vars a) v]
                                      [(get_ vars e) '_ v]]
         [[e a v] [false false true]] [[e a '_]]
         [[e a v] [true false false]] [['_ a v]]
         [[e a v] [false true false]] [[e '_ v]]
         [[e a v] [false false false]] [[e a v]]   ;;; maybe this?
         :else [[]]))




;; this is the pattern that tells the filter it should update.
;; it won't match any v's that change unless they are connected
;; to some other part of the query. i.e. if the query is looking
;; at :person/name it won't update when the name changes.
(defn filter-pattern-from-eav [vars eav]
  (match [(vec eav) (vec (map qvar? eav))]
         [['_ '_ '_] _] []  ;; if it matches everything, it never
         ;; needs to update itself
         [['_ '_ v] [_ _ false]] [['_ '_ v]]
         [['_ '_ v] [_ _ true]] [['_ '_ (vars v)]]
         [['_ a '_] [_ false _]] [['_ a '_]]
         [['_ a '_] [_ true _]] [['_ (vars a) '_]]
         [[e '_ '_] [false _ _]] [[e '_ '_]]
         [[e '_ '_] [true _ _]] [[(vars e) '_ '_]]
         [[e a '_] [true true _]] [[(vars e) '_ '_]
                                   ['_ (vars a) '_]]
         [[e a '_] [true false _]] [[(vars e) a '_]]
         [[e a '_] [false true _]] [[e (vars a) '_]]
         [[e '_ v] [true _ true]] [[(vars e) '_ '_]
                                   ['_ '_ (vars v)]]
         [[e '_ v] [true _ false]] [[(vars e) '_ v]]
         [[e '_ v] [false _ true]] [[e '_ (vars v)]]
         [['_ a v] [_ true true]] [['_ '_  (vars v)]
                                   ['_ (vars a) '_]]
         [['_ a v] [_ true false]] [['_ (vars a) v]]
         [['_ a v] [_ false true]] [['_ a (vars v)]]
         [[e a v] [true true true]] [['_ '_  (vars v)]
                                     ['_ (vars a) '_]
                                     [(vars e) '_ '_]]
         [[e a v] [false true true]] [[e '_  (vars v)]
                                      [e (vars a) '_]]
         [[e a v] [true false true]] [['_ a  (vars v)]
                                      [(vars e) a '_]]
         [[e a v] [true true false]] [['_ (vars a) v]
                                      [(vars e) '_ v]]
         [[e a v] [false false true]] [[e a '_]]
         [[e a v] [true false false]] [['_ a v]]
         [[e a v] [false true false]] [[e '_ v]]
         :else [[]]))

(defn patterns-from-eavs [dbvarmap vars patterns]
  (->> (group-by first patterns)
       (map (fn [[k v]]
              {(:db-id (dbvarmap k)) (mapcat #(pattern-from-eav vars (rest %)) v)}))
       (apply merge)))

(defn filter-patterns-from-eavs [dbvarmap vars patterns]
  (->> (group-by first patterns)
       (map (fn [[k v]]
              {(:db-id (dbvarmap k)) (mapcat #(filter-pattern-from-eav vars (rest %)) v)}))
       (apply merge)))

(defn just-qvars [ins args]
  (if (empty? ins)
    {}
    (merge
     (when-not (and (symbol? (first ins)) (= (first (str (first ins))) \$))
       {(first ins) (first args)})
     (just-qvars (rest ins) (rest args)))))

(defn get-input-sets [q-fn ins args]
  (let [varmap  (just-qvars ins args)]
    (if-not (empty? varmap)
      (let
          [qvars   (vec (get-all-vars (keys varmap)))
           varvals (apply
                    (partial q-fn {:find qvars
                                   :in (keys varmap)})
                    (vals varmap))
           varsets (reduce (partial merge-with conj) (zipmap qvars (repeat #{}))
                           (map #(zipmap qvars %) varvals))]
        varsets)
      {})))

;;;; handling pulls in queries

;;; needs to also extract all the pulls

(defn pull-pattern? [x]
  (and (coll? x) (= (first x) 'pull) (= 3 (count x))))

(defn replace-find-pulls [qfind]
  "replaces pulls in query's :find with just their eid symbol"
  (clojure.walk/postwalk (fn [x] (if (pull-pattern? x)
                                  (second x)
                                  x)) qfind))

(defn get-pull-var-pairs [qfind]
  "returns map of any vars and their pull commands in the :find"
  (if (coll? qfind)
    (cond
     (empty? qfind) {}
     (pull-pattern? qfind) {(second qfind) (nth qfind 2)}
     :else (apply merge (map get-pull-var-pairs qfind)))
   {}))

(defn match-var-to-db [var dbvarmap dbeavs]
  (if (empty? dbeavs)
    nil
    (let [[db e a v] (first dbeavs)]
      (if (or (= var e) (and (= var v) (pa/ref? (:schema (dbvarmap db)) a)))
        (dbvarmap db)
        (recur var dbvarmap (rest dbeavs))))))

(defn match-vars-to-dbs [vars dbvarmap dbeavs]
  (if (empty? vars)
    {}
    (merge {(first vars) (match-var-to-db (first vars) dbvarmap dbeavs)}
           (match-vars-to-dbs (rest vars) dbvarmap dbeavs))))

(defn index-of [xs x]
  (loop [n 0
         xs xs]
    (cond
     (empty? xs) nil
     (= (first xs) x) n
     :else (recur (inc n) (rest xs)))))


;;;; handling db args: {:conn conn :db db}

(defn db-arg? [arg]
  (and
   (map? arg)
   (:db arg)
   (:conn arg)))

(defn convert-args-to [type args]
  (map #(if (db-arg? %) (type %) %) args))

(defn make-dbarg-map [ins args]
  (if (empty? ins)
    {}
    (merge
     (when (dbvar? (first ins))
       {(first ins) (first args)})
     (make-dbarg-map (rest ins) (rest args)))))

(comment
  (defn split-datoms [dbvarmap datoms]
    (->> (group-by first datoms)
         (map (fn [[db db-datoms]]
                {(dbvarmap db)
                 (map (comp vec rest) db-datoms)}))
         (apply merge))))

(defn split-datoms [datoms]
  (->> (group-by first datoms)
       (map (fn [[db-sym db-datoms]]
              {db-sym
               (map (comp vec rest) db-datoms)}))
       (apply merge)))

(defn- schema-ref?
  "Returns whether attribute identified by k is of :db/valueType :db.type/ref"
  [schema k]
  (= :db.type/ref (:db/valueType (get schema k))))

(defn- indexes-of [e coll] (keep-indexed #(if (= e %2) %1) coll))

(defn- lookup-ref?
  "Returns whether var-name is used as lookup-ref inside of query's :where clauses.
  var-name - the symbolic variable name
  where - coll of where clauses
  schema - map of schemas with attribute names as keys
  Returns boolean true or false"
  [schema where var-name var-value]
  (if-not (coll? var-value)
    false
    (loop [clause (first where)
           remaining (rest where)]
      (condp = (first (indexes-of var-name clause))
        1 true

        ;; If datascript supported :db/valueTuple :db.type/tuple, could check that here
        ;; instead of needing to scan every :where clause to ensure it's not a schema-ref
        3 (if (schema-ref? schema (nth clause 2))
            true
            (if (seq remaining)
              (recur (first remaining) (rest remaining))
              false))

        (if (seq remaining)
          (recur (first remaining) (rest remaining))
          false)))))

(defn resolve-any-idents
  "Given input-set from query, resolves any lookup-refs
  Inputs:
  entid-fn - Datomic/DS function to take lookup-ref & returns entid
  db - value of DB
  schemas - map with keys matching known schema attributes
  where - where clauses of query
  input-set - value from query :in"
  [entid-fn db schema where var-name input-set]
  (set (for [var-value input-set]
         (if (lookup-ref? schema where var-name var-value)
           (entid-fn db var-value)
           var-value))))

;;;;;;;; q function that gives pattern, datoms, and results all in one
;;;;;;;; query. db should be first of args (for now. later, finding
;;;;;;;; the t of each datom will be part of the q).

;; instead of passing db's to q-analyze you pass
;; {:conn conn :db db :schema schema :db-id db-id}

;; it will return the requested info, sorted by db-id.

;; not necessarily working at this time...
(comment
  (defn q-analyze-with-pulls [dcfg retrieve query & args]
    (if (and (= 1 (count retrieve)) (some #{:results} retrieve))
      {:results (apply (partial (:q dcfg) query) (convert-args-to :db args))}
      (let [qm            (if-not (map? query)
                            (query-to-map query)
                            query)
            where         (normalize-all-eavs (:where qm))
            eavs          (get-eavs where)
            vars          (vec (get-all-vars eavs))
            newqm         (merge qm {:find vars :where where})
            newq          (qm-to-query newqm)
            dbvarmap      (make-dbarg-map (:in qm) args)
            r             (apply (partial (:q dcfg) newqm) (convert-args-to :db args))
            ;; handle pull queries:
            pull-vars     (get-pull-var-pairs (:find qm))
            pull-vars-dbs (match-vars-to-dbs (keys pull-vars) dbvarmap eavs)
            no-pulls-find (replace-find-pulls (:find qm))]
        (merge
         (when (some #{:pulls} retrieve)
           {:pulls pull-vars-dbs})
         (when (some #{:datoms :datoms-t} retrieve)
           (let [datoms (split-datoms dbvarmap (create-q-datoms r eavs vars))]
             (merge
              (when (some #{:datoms} retrieve)
                {:datoms datoms})
              (when (some #{:datoms-t} retrieve)
                {:datoms-t
                 (->> datoms
                      (map (fn [[db db-datoms]]
                             {db
                              (util/t-for-datoms (:q dcfg) (:db db) db-datoms)}))
                      (apply merge))}))))
         (when (some #{:results} retrieve)
           {:results
            (d/q {:find (vec no-pulls-find)
                  :in [[vars '...]]}
                 (vec r))})
         (when (some #{:patterns} retrieve)
           (let
               [in-vars      (get-input-sets (:in qm) args)
                eavs-ins     (clojure.walk/postwalk
                              #(if-let [v (in-vars %)] v %) eavs)
                qvar-count   (count-qvars eavs-ins)
                linked-qvars (set (remove nil? (map (fn [[k v]] (if (> v 1) k)) qvar-count)))
                rvars        (zipmap
                              vars
                              (stack-vectors r))
                prepped-eavs (clojure.walk/postwalk
                              #(if (and (qvar? %) (not (linked-qvars %))) '_ %)
                              eavs-ins)]
             {:patterns (patterns-from-eavs dbvarmap rvars prepped-eavs)})))))))


(defn q-analyze [dcfg retrieve query args]
  (let [qm           (merge
                      {:in '[$]}
                      (query-to-map query))
        where        (normalize-all-eavs (vec (:where qm)))
        eavs         (get-eavs where)
        vars         (vec (get-all-vars eavs))
        newqm        (merge qm {:find vars :where where})
        ;; This doesn't seem to be getting used anymore
        ;;newq         (qm-to-query newqm)
        dbvarmap     (make-dbarg-map (:in qm) args)
        fixed-args   (->> (zipmap (:in qm) args)
                          (map (fn [[sym arg]]
                                 (or (:db (get dbvarmap sym)) arg))))
        r            (apply (partial (:q dcfg) newqm) fixed-args)
        lookup-ref-patterns
        (->> args
             ;; Would be nice to check by the schema as well, to make sure this is actually a identity attribute
             (filter (every-pred vector? (comp keyword? first) (comp (partial = 2) count)))
             (map (fn [[a v]] ['$ '_ a v])))]
    (merge
     (when (some #{:datoms :datoms-t} retrieve)
       (let [datoms (split-datoms (create-q-datoms r eavs vars))]
         (merge
          (when (some #{:datoms} retrieve)
            {:datoms
             (->> datoms
                  (map (fn [[db-sym db-datoms]]
                         {(:db-id (dbvarmap db-sym))
                          db-datoms}))
                  (apply merge))})
          (when (some #{:datoms-t} retrieve)
            {:datoms-t
             (->> datoms
                  (map (fn [[db-sym db-datoms]]
                         (let [db (dbvarmap db-sym)]
                           {(:db-id db)
                            (util/t-for-datoms (:q dcfg) (:db db) db-datoms)})))
                  (apply merge))}))))
     (when (some #{:results} retrieve)
       {:results
        ((:q dcfg) {:find (vec (:find qm))
                    :in [[vars '...]]}
         (vec r))})
     (when (some #{:patterns :filter-patterns :simple-patterns} retrieve)
       (let
           [in-vars      (get-input-sets (:q dcfg) (:in qm) args)
            eavs-ins    (map (fn [[db & eav]]
                               (vec
                                (cons db
                                      (map
                                       (fn [var-name]
                                         (if-let [var-value (in-vars var-name)]
                                           (resolve-any-idents (:entid dcfg)
                                                               (:db (get dbvarmap db))
                                                               (:schema (get dbvarmap db))
                                                               where
                                                               var-name
                                                               var-value)
                                           var-name))
                                       eav))))
                             (concat lookup-ref-patterns eavs))
            qvar-count   (count-qvars eavs-ins)
            linked-qvars (set (remove nil? (map (fn [[k v]] (if (> v 1) k)) qvar-count)))
            rvars        (zipmap
                          vars
                          (stack-vectors r))
            prepped-eavs (clojure.walk/postwalk
                          #(if (and (qvar? %) (not (linked-qvars %))) '_ %)
                          eavs-ins)]
         (merge
          (when (some #{:simple-patterns} retrieve)
            {:patterns
             (patterns-from-eavs dbvarmap rvars
                                 (clojure.walk/postwalk #(if (qvar? %) '_ %)
                                                        eavs-ins))})
          (when (some #{:patterns} retrieve)
            {:patterns (patterns-from-eavs dbvarmap rvars prepped-eavs)
             :linked   linked-qvars})
          (when (some #{:filter-patterns} retrieve)
            {:filter-patterns (filter-patterns-from-eavs dbvarmap rvars prepped-eavs)})))))))
