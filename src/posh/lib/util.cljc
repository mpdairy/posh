(ns posh.lib.util)

(defn exception [msg]
  #?(:clj
     (throw (Exception. msg))
     :cljs
     (throw (js/Error. msg))))

;;;; db stuff

(defn t-for-datoms [q-fn db datoms]
  (q-fn '[:find ?e ?a ?v ?t
          :in $ [[?e ?a ?v] ...]
          :where
          [?e ?a _ ?t]]
        db
        datoms))
