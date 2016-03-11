(ns posh.util)

(defn resolve-alias-or-namespace [sym]
  (or (find-ns sym) (get (ns-aliases *ns*) sym)))


(defn resolve-var [sym-of-ns-or-alias sym-of-var]
  (ns-resolve
   (resolve-alias-or-namespace sym-of-ns-or-alias)
   sym-of-var))

