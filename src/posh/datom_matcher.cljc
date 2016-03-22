(ns posh.datom-matcher)

(defn datom-match-pattern? [pattern datom]
  (if (empty? pattern)
    true
    (when (let [p (first pattern)]
            (or
             (= p '_)
             (and (set? p) (p (first datom)))
             (= p (first datom))))
      (datom-match-pattern? (rest pattern) (rest datom)))))

(defn datom-match? [patterns datom]
  (some #(datom-match-pattern? % datom) patterns))

(defn any-datoms-match? [patterns datoms]
  (some #(datom-match? patterns %) datoms))

(comment
  (datom-match? '[#{123 88 32} :jimmy _] '[123 :jimmy "hey"])

  (datom-match-patterns? '[[88 :deandog]
                           [#{123 88 32} :jimmy _]] '[123 :jimmy "hey"])

  (any-datoms-match? '[[88 :deandog]
                       [#{123 88 32} :jimmy _]]
                     '[[28882 :major "billy"] [123 :jimmy "hey"]])
  )
