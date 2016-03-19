(ns datascript.js
  (:refer-clojure)
  (:require
    [core :as p])

;; Public API

;; posh(conn)
;; transact(conn, tx)
;; q(conn, query, args)
;; db_tx(conn, tx)
;; pull_tx(conn, txPatterns, pullPattern, entityId)
;; q_tx(conn, patterns, query, args)
;; after_tx(conn, patterns, handlerFn]

(defn ^:export posh [conn]
  (p/posh! conn))

(defn ^:export transact [conn tx]
  (p/transact! conn tx))

(defn ^:export db_tx [conn patterns]
  (p/db-tx conn patterns))

(defn ^:export pull_tx [conn tx-patterns pull-pattern entity-id]
  (p/pull-tx conn tx-patterns pull-pattern entity-id))

(defn ^:export q_tx [conn patterns query & args]
  (p/q-tx conn patterns query args))

(defn ^:export q [conn query & args]
  (p/q conn query args))

(defn ^:export after_tx [conn patterns handler-fn]
  (p/after-tx! conn patterns handler-fn))






