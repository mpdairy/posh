(ns posh.reagent
  (:require [posh.core :as p]
            [posh.lib.db :as db]
            [posh.lib.update :as u]))

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
    (d/listen! conn :posh-dispenser
               (fn [var]
                 (when (keyword? var)
                   (get posh-vars var))))
    (d/listen! conn :posh
               (fn [tx-report]
                 (swap! posh-atom
                        (fn [posh-tree]
                          (let [{:keys [changed] :as posh-tree}
                                (p/after-transact posh-tree {conn tx-report})]
                            (reduce (fn [{:keys [ratoms] :as posh-tree} [k v]]
                                      (assoc posh-tree
                                        :ratoms (assoc ratoms k
                                                       (reset! (get ratoms k) v))))
                                    posh-tree
                                    changed))))))))


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

(defn get-atom [conn var]
  ((:posh-dispenser @(:listeners (meta conn))) var))


(defn pull [poshdb pull-pattern eid]
  (let [storage-key [poshdb pull-pattern eid]]
    (if-let [r (get (:reactions @(get-posh-atom poshdb)) storage-key)]
      r
      "Oh well")))
