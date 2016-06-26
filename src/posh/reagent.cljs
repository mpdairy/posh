(ns posh.reagent
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [posh.core :as p]
            [posh.stateful :as ps]
            [posh.lib.db :as db]
            [posh.lib.update :as u]
            [datascript.core :as d]
            [reagent.core :as r]
            [reagent.ratom :as ra]))

(def dcfg
  {:db d/db
   :pull d/pull
   :q d/q
   :filter d/filter
   :with d/with
   :entid d/entid
   :transact! d/transact!})


;; need to set last-tx-t in conn so that it doesn't try the same tx twice
(defn set-conn-listener! [posh-atom conn db-id]
  (let [posh-vars {:posh-atom posh-atom
                   :db-id db-id}]
    (do
      (d/listen! conn :posh-dispenser
                 (fn [var]
                   (when (keyword? var)
                     (get posh-vars var))))
      (d/listen! conn :posh-listener
                 (fn [tx-report]
                   ;;(println "CHANGED: " (keys (:changed (p/after-transact @posh-atom {conn tx-report}))))
                   (let [{:keys [ratoms changed]}
                         (reset! posh-atom (p/after-transact @posh-atom {conn tx-report}))]
                     (doall
                      (map (fn [[k v]]
                             (reset! (get ratoms k) (:results v)))
                           changed)))))
      conn)))


(defn posh! [& conns]
  (let [posh-atom (atom {})]
    (reset! posh-atom
            (loop [n 0
                   conns conns
                   posh-tree (-> (p/empty-tree dcfg [:results])
                                 (assoc :ratoms {}
                                        :reactions {}))]
              (if (empty? conns)
                posh-tree
                (recur (inc n)
                       (rest conns)
                       (let [db-id (keyword (str "conn" n))]
                         (p/add-db posh-tree 
                                   db-id
                                   (set-conn-listener! posh-atom (first conns) db-id)
                                   (:schema @(first conns))))))))))


;; Posh's state atoms are stored inside a listener in the meta data of
;; the datascript conn
(defn get-conn-var [conn var]
  ((:posh-dispenser @(:listeners (meta conn))) var))

(defn get-posh-atom [poshdb-or-conn]
  (if (d/conn? poshdb-or-conn)
    (get-conn-var poshdb-or-conn :posh-atom)
    (ps/get-posh-atom poshdb-or-conn)))

(defn get-db [poshdb-or-conn]
  (if (d/conn? poshdb-or-conn)
    [:db (get-conn-var poshdb-or-conn :db-id)]
    poshdb-or-conn))

(defn rm-posh-item [posh-atom storage-key]
  (reset! posh-atom
          (assoc (p/remove-item @posh-atom storage-key)
            :ratoms (dissoc (:ratoms @posh-atom) storage-key)
            :reactions (dissoc (:reactions @posh-atom) storage-key))))

(defn make-query-reaction [posh-atom storage-key add-query-fn]
  (if-let [r (get (:reactions @posh-atom) storage-key)]
      r
      (->
       (reset!
        posh-atom
        (let [posh-atom-with-query (add-query-fn @posh-atom)
              query-result         (:results (get (:cache posh-atom-with-query) storage-key))
              query-ratom          (or (get (:ratoms posh-atom-with-query) storage-key)
                                       (r/atom query-result))
              query-reaction       (ra/make-reaction
                                    (fn []
                                      ;;(println "RENDERING: " storage-key)
                                      @query-ratom)
                                    :on-dispose
                                    (fn [_ _]
                                      ;;(println "DISPOSING: " storage-key)
                                      (reset! posh-atom
                                              (assoc (p/remove-item @posh-atom storage-key)
                                                :ratoms (dissoc (:ratoms @posh-atom) storage-key)
                                                :reactions (dissoc (:reactions @posh-atom) storage-key)))))]
          (assoc posh-atom-with-query
            :ratoms (assoc (:ratoms posh-atom-with-query) storage-key query-ratom)
            :reactions (assoc (:reactions posh-atom-with-query) storage-key query-reaction))))
       :reactions
       (get storage-key))))

(defn pull [poshdb pull-pattern eid]
  (let [true-poshdb (get-db poshdb)
        storage-key [:pull true-poshdb pull-pattern eid]
        posh-atom   (get-posh-atom poshdb)]
    (make-query-reaction posh-atom
                         storage-key
                         #(p/add-pull % true-poshdb pull-pattern eid))))

(defn pull-tx [tx-patterns poshdb pull-pattern edi]
  (println "pull-tx is deprecated. Calling pull without your tx-patterns."))

;;; q needs to find the posh-atom, go through args and convert any
;;; conn's to true-poshdb's, generate the storage-key with true dbs

(defn q [query & args]
  (let [true-poshdb-args (map #(if (d/conn? %) (get-db %) %) args)
        posh-atom        (first (remove nil? (map get-posh-atom args)))
        storage-key      [:q query true-poshdb-args]]
    (make-query-reaction posh-atom
                         storage-key
                         #(apply (partial p/add-q % query) true-poshdb-args))))


(defn q-tx [tx-patterns query & args]
  (println "q-tx is deprecated. Calling q without your tx-patterns.")
  (apply (partial q query) args))



(defn transact! [conn txs]
  (d/transact! conn txs))
