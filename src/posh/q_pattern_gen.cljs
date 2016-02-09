(ns posh.q-pattern-gen)

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
  (split-list-at keyword? query))

(defn clause-item [varmap item]
  (if (symbol? item)
    (or (varmap item) '_)
    item))

(defn pattern-from-clause [varmap clause]
  (vec (map (partial clause-item varmap) clause)))

(defn patterns-from-where [varmap where]
  (map (partial pattern-from-clause varmap) where))

(defn complex-query? [query]
  (some #(some coll? %) query))

(defn q-pattern-gen [query vars]
  (let [qm            (query-to-map query)
        simple-query? (not (complex-query? (:where qm)))
        varmap        (if (and (:in qm) (> (count (:in qm)) 1))
                        (zipmap (rest (:in qm)) vars)
                        {})]
    (if simple-query?
      (patterns-from-where varmap (:where qm))
      [[]])))

(comment
  (def test-query '[:find [?p ...] :where [?p :person/name _]])

  
  ( (:where (query-to-map test-query)))

  (q-pattern-gen '[:find [?p ...] :where [?p :person/name _]] nil)

  (->> '[:find [?p ...] :where [?p :person/name _]]
       second
       second
       symbol?)
  )
