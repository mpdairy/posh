(ns posh.clj.datascript
  (:require [posh.plugin-base :as base]
            [posh.lib.ratom :as rx]
            [datascript.core :as d]))

(def dcfg
  (let [dcfg {:db            d/db
              :pull*         d/pull
              :q             d/q
              :filter        d/filter
              :with          d/with
              :entid         d/entid
              :transact!     d/transact!
              :listen!       d/listen!
              :conn?         d/conn?
              :ratom         rx/atom
              :make-reaction rx/make-reaction}]
   (assoc dcfg :pull (partial base/safe-pull dcfg))))

(def missing-pull-result (partial base/missing-pull-result dcfg))
(def safe-pull           (partial base/safe-pull           dcfg))
(def set-conn-listener!  (partial base/set-conn-listener!  dcfg))
(def posh!               (partial base/posh!               dcfg))
(def get-conn-var        (partial base/get-conn-var        dcfg))
(def get-posh-atom       (partial base/get-posh-atom       dcfg))
(def get-db              (partial base/get-db              dcfg))
(def rm-posh-item        (partial base/rm-posh-item        dcfg))
(def make-query-reaction (partial base/make-query-reaction dcfg))
(def pull                (partial base/pull                dcfg))
(def pull-info           (partial base/pull-info           dcfg))
(def pull-tx             (partial base/pull-tx             dcfg))
(def parse-q-query       (partial base/parse-q-query       dcfg))
(def q-args-count        (partial base/q-args-count        dcfg))
(def q                   (partial base/q                   dcfg))
(def q-info              (partial base/q-info              dcfg))
(def q-tx                (partial base/q-tx                dcfg))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(def filter-tx           (partial base/filter-tx           dcfg))
(def filter-pull         (partial base/filter-pull         dcfg))
(def filter-q            (partial base/filter-q            dcfg))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(def transact!           (partial base/transact!           dcfg))
