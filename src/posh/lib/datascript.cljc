(ns posh.lib.datascript)

(defn conn->schema [conn] (:schema @conn))

(defn add-schema-listener! [conn posh-atom db-id]
  (add-watch conn :posh-schema-listener
    (fn [_ _ old-state new-state]
      (when (not= (:schema old-state) (:schema new-state))
        (swap! posh-atom assoc-in [:schema db-id] (:schema new-state))))))
