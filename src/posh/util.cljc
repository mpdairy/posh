(ns posh.util)

;;;; db stuff

(defn t-for-datoms [q-fn db datoms]
  (q-fn '[:find ?e ?a ?v ?t
          :in $ [[?e ?a ?v] ...]
          :where
          [?e ?a _ ?t]]
        db
        datoms))
