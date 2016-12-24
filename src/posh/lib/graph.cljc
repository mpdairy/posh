(ns posh.lib.graph)


;; graph-add-item


;; data graph :: {key {:inputs #{keys} :outputs #{keys}}]

;; new-graph :: graph
(defn new-graph [] {})

;; add-item :: graph -> key -> graph
;; only adds if item doesn't exist
(defn add-item [graph item-k]
  (merge {item-k {:inputs #{} :outputs #{}}}
         graph))

;; add-item-input :: graph -> key -> key -> graph
(defn add-input [graph item-k input]
  (update-in graph [item-k :inputs] conj input))

;; add-item-output :: graph -> key -> key -> graph
(defn add-output [graph item-k output]
  (update-in graph [item-k :outputs] conj output))

(defn add-item-full [graph item-k inputs outputs]
  (reduce (fn [gr input] (add-input gr item-k input))
          (reduce (fn [gr output] (add-output gr item-k output))
                  (add-item graph item-k)
                  outputs)
          inputs))

;; connects item to output of inputs
(defn add-item-connect [graph item-k inputs]
  (reduce (fn [gr input]
            (-> gr
                (add-input item-k input)
                (add-output input item-k)))
          (add-item graph item-k)
          inputs))

;; remove-input :: graph -> key -> key -> graph
(defn remove-input [graph item-k input]
  (update-in graph [item-k :inputs] disj input))

;; remove-output :: graph -> key -> key -> graph
(defn remove-output [graph item-k output]
  (update-in graph [item-k :outputs] disj output))

;; rm-dep :: graph -> key -> key -> graph
(defn remove-dep [graph k dep-k]
  (update graph k #(disj % dep-k)))

;; rm-item :: graph -> key -> graph
(defn remove-item [graph item-k]
  (if-let [{:keys [inputs outputs]} (get graph item-k)]
    (dissoc
     (reduce (fn [gr output-k] (remove-output gr output-k item-k))
             (reduce remove-item graph outputs)
             inputs)
     item-k)
    graph))

(comment

  (def patgraph
    (-> (new-graph)
        (add-item :db1)
        (add-item :db2)
        (add-item :query1)
        (add-output :db2 :query1)
        (add-item :filter1)
        (add-item :filter2)
        (add-input :filter2 :db1)
        (add-output :db1 :filter1)
        (add-output :db1 :filter2)
        (add-output :filter2 :query2)
        (add-item :query2)
        (add-output :filter2 :query3)
        (add-output :db2 :query3)
        (add-item :query3)))

  (remove-item patgraph :filter2)

  )

