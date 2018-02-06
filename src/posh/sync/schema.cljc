(ns posh.sync.schema
  "Schema syncing and schema alteration functions."
  (:require [clojure.set      :as set]
            [datascript.core  :as ds]
    #?(:clj [datomic.api      :as dat])
            [posh.lib.datomic :as ldat]
            [posh.lib.util :refer [dissoc-in merge-deep]]))

(defn ensure-schema-changes-valid
  "For DataScript db.
   Will not change any user data as a result of schema alteration.
   Assumes EAVT-indexed datoms."
  {:attribution "alexandergunnarson"
   :see-also    #{"https://github.com/tonsky/datascript/issues/174"}
   :performance "At least O(d•s), where d = # datoms and s = # schemas to be changed"
   :todo {0 "[:index true] -> [:index false] needs to take effect"
          1 ":many -> :one needs to be validated but allowed"
          2 "non-unique -> unique needs to be validated but allowed"
          3 "use proper logging, not `println`"
          4 "handle db/isComponent changes (necessary?)"}}
  [schemas schemas' datoms]
  (let [deleted       (set/difference (-> schemas keys set) (-> schemas' keys set))
        changed+added (->> schemas' (remove (fn [[k v]] (= (get schemas k) v))))
        illegal-schema-change
          (fn [k v v'] (throw (ex-info "Illegal schema change attempted" {:k k :v v :v' v'})))
        unclear-validation
          (fn [k v v'] (println "WARN:" "Unclear whether DataScript will validate" k v "->" v'))] ; TODO 3
    ; Ensure that no datoms are affected by deleted schemas
    (doseq [[schema-name schema] deleted]
      (doseq [[_ a _ _] datoms]
        (assert (not= a schema-name))))
    ; Ensure changed and added schemas are valid
    (doseq [[schema-name' schema'] changed+added]
      (let [schema (get schemas schema-name')]
        (doseq [[k v'] schema']
          (let [v (get schema k)]
            (case k
              :db/cardinality
              (when (= [v v'] [:db.cardinality/many :db.cardinality/one])
                (illegal-schema-change k v v')) ; TODO 1
              :db/index
              (when (and (true? v) (not v'))
                (println "WARN:" "Unindexing" k "won't take effect in previous datoms")) ; TODO 0, 3
              :db/valueType
              (cond (and schema (not= v v'))
                    (illegal-schema-change k v v')
                    (not schema)
                    (unclear-validation k v v'))
              :db/unique
              (cond
                (and (not v) v)
                (illegal-schema-change k v v') ; TODO 2
                (= [v v'] [:db.unique/value :db.unique/identity])
                (unclear-validation k v v')
                (= [v v'] [:db.unique/identity :db.unique/value])
                (unclear-validation k v v'))
              :db/isComponent
              (throw (ex-info "TODO" {})) ; TODO 4
              ; Doesn't validate other schema changes
              )))))))

(defn update-schemas
  "Updates the schemas of a DataScript db."
  {:attribution "alexandergunnarson"
   :see-also #{"metasoarous/datsync.client"
               "http://docs.datomic.com/schema.html#Schema-Alteration"
               "https://github.com/tonsky/datascript/issues/174"}}
  ([db f]
    (assert (ds/db? db))
    (let [schemas  (:schema db)
          schemas' (f schemas)
          datoms   (ds/datoms db :eavt)]
      (ensure-schema-changes-valid schemas schemas' datoms)
      (-> (ds/init-db datoms schemas')
          (ds/db-with
            [{:db/ident  :type  }
             {:db/ident  :schema}])
          (ds/db-with
            (for [schema (keys schemas')]
              {:db/ident schema
               :type     [:db/ident :schema]}))))))

(defn update-schemas! [conn f]
  (assert (ds/conn? conn))
  (swap! conn update-schemas f))

(defn merge-schemas
  "Immutably merges schemas and/or schema attributes (`schemas`) into the database `db`."
  {:usage `(merge-schemas {:task:estimated-duration {:db/valueType :db.type/long}})}
  [db schemas]
    (if #?@(:clj [(ldat/db? db)
                  (for [[schema kvs] schemas]
                    (merge
                      {:db/id               schema
                       :db.alter/_attribute :db.part/db}
                      kvs))]
            :cljs [false false])
        (update-schemas db #(merge-deep % schemas))))

(defn merge-schemas!
  "Mutably merges (transacts) schemas and/or schema attributes (`schemas`) into the `conn`."
  [conn schemas]
    (if #?@(:clj  [(ldat/conn? conn)
                   @(dat/transact conn (merge-schemas schemas))] ; TODO may want to sync schema?
            :cljs [false false])
        (swap! conn merge-schemas schemas)))

(defn replace-schemas!
  "Mutably replaces schemas of the provided DataScript `conn`."
  [conn schemas]
    (assert (ds/conn? conn))
    (swap! conn update-schemas (constantly schemas)))

(defn dissoc-schema!
  "Mutably dissociates a schema from `conn`."
  [conn s k v]
    (if #?@(:clj  [(ldat/conn? conn)
                   @(dat/transact conn ; TODO may want to sync schema?
                      [[:db/retract s k v]
                       [:db/add :db.part/db :db.alter/attribute k]])]
            :cljs [false false]))
        (update-schemas! conn #(dissoc-in % [s k])))
