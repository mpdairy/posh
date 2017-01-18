(ns posh.lib.util)

;;; MACROS ;;;

(defn cljs-env?
  "Given an &env from a macro, tells whether it is expanding into CLJS."
  [env]
  (boolean (:ns env)))

#?(:clj
(defmacro if-cljs
  "Return @then if the macro is generating CLJS code and @else for CLJ code."
  {:from "https://groups.google.com/d/msg/clojurescript/iBY5HaQda4A/w1lAQi9_AwsJ"}
  ([env then else] `(if (cljs-env? ~env) ~then ~else))))

;;; EXCEPTION ;;;

(defn exception [^String msg]
  #?(:clj
     (throw (Exception. msg))
     :cljs
     (throw (js/Error. msg))))

;;; DB ;;;

(defn t-for-datoms [q-fn db datoms]
  (q-fn '[:find ?e ?a ?v ?t
          :in $ [[?e ?a ?v] ...]
          :where
          [?e ?a _ ?t]]
        db
        datoms))

;;; LOGGING ;;;

(defonce debug? (atom true))

#?(:clj (def print-lock (Object.))) ; to coordinate cross-thread prints

(defn debug* [msg args]
  (#?@(:clj  [locking print-lock]
       :cljs [identity])
    (println #?(:clj (java.util.Date.) :cljs (js/Date.))
      #?(:clj (str "[" (.getName (Thread/currentThread)) "]") :cljs nil)
      msg)
    (doseq [arg args] (clojure.pprint/pprint arg))
    (flush)))

#?(:clj
(defmacro debug [msg & args] (when @debug? `(debug* ~msg (vector ~@args)))))

#?(:clj
(defmacro prl
  "'Print labeled'.
   Puts each x in `xs` as vals in a map.
   The keys in the map are the quoted vals. Then prints the map."
  [& xs] `(debug nil ~(->> xs (map #(vector (list 'quote %) %)) (into {})))))
