(ns posh.lib.util)

(defn exception [^String msg]
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

(defonce debug? (atom true))

#?(:clj
(defmacro debug [msg & args]
  (when @debug?
    `(let [out-str# (with-out-str
                      (println ~msg)
                      ~@(for [arg args]
                          `(clojure.pprint/pprint ~arg)))]
       (print out-str#)
       (flush)))))

#?(:clj
(defmacro prl
  "'Print labeled'.
   Puts each x in `xs` as vals in a map.
   The keys in the map are the quoted vals. Then prints the map."
  [& xs]
  (when @debug?
    `(let [out-str# (with-out-str
                      (clojure.pprint/pprint ~(->> xs (map #(vector (list 'quote %) %)) (into {}))))]
       (print out-str#)
       (flush)))))
