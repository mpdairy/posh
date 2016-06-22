(ns posh.stateful
  (:require [datascript.core :as d]
            [posh.core :as p]
            [posh.lib.db :as db]
            [posh.lib.update :as u]))

(defn get-posh-atom [posh-item]
  (:posh (meta posh-item)))

(defn new-posh [dcfg retrieve]
  (atom (p/empty-tree dcfg retrieve)))

(defn add-db [posh-atom db-id conn schema opts]
  (with-meta
    (:return (reset! posh-atom (p/add-db @posh-atom db-id conn schema opts)))
    {:posh posh-atom}))

;;;;;;;;; adding queries  ;;;;;;;;;;

(defn add-pull [poshdb pull-pattern eid]
  (let [posh-atom (get-posh-atom poshdb)]
    (with-meta
      (:return (reset! posh-atom (p/add-pull @posh-atom poshdb pull-pattern eid)))
      {:posh posh-atom})))

(defn add-q [query & args]
  (let [posh-atom (first (remove nil? (map get-posh-atom args)))]
    (with-meta
      (:return (reset! posh-atom (apply (partial p/add-q @posh-atom query) args)))
      {:posh posh-atom})))

;;;; removing item ;;;;

(defn rm [posh-item]
  (let [posh-atom (get-posh-atom posh-item)]
    (reset! posh-atom (p/remove-item @posh-atom posh-item))))

;;;;;;;;;; TX ;;;;;;;;;;;;;

;; just adds tx to posh, call process-transact! to actually do them

(defn transact [posh-item tx]
  (let [posh-atom (get-posh-atom posh-item)]
    (do
      (reset! posh-atom (p/add-tx @posh-atom tx))
      true)))

(defn transact-all! [posh-atom]
  (reset! posh-atom (p/process-tx! @posh-atom)))


;;;;;;;;;  get info from a query ;;;;;;;;;;;;;;;

(defn results [posh-query]
  (:results (get (:cache @(get-posh-atom posh-query)) posh-query)))

(defn datoms [posh-query]
  (:datoms (get (:cache @(get-posh-atom posh-query)) posh-query)))

(defn datoms-t [posh-query]
  (:datoms-t (get (:cache @(get-posh-atom posh-query)) posh-query)))

