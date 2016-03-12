(ns posh.util)

(defn resolve-alias-or-namespace [sym]
  (or (find-ns sym) (get (ns-aliases *ns*) sym)))


(defn resolve-var [sym-of-ns-or-alias sym-of-var]
  (ns-resolve
   (resolve-alias-or-namespace sym-of-ns-or-alias)
   sym-of-var))


;;;; db stuff

(defn t-for-datoms [db-ns db datoms]
  (let [q (resolve-var db-ns 'q)]
    (q '[:find ?e ?a ?v ?t
           :in $ [[?e ?a ?v] ...]
           :where
           [?e ?a _ ?t]]
         db
         datoms)))
