# Posh

A luxuriously simple and powerful way to front-end with DataScript and
Reagent in Clojure.

## What is Posh?

Posh is a little library that lets you use a DataScript database to
keep your application state. All components have access to the
complete database, but watch the database's transaction report and
only update when pertinent changes occur.

This gives your components all the power of DataScript queries,
entities, pull requests, etc, but is still very fast, even with a
large database.

## The Luxury: db-tx

In DataScript, the database is changed by submitting datoms, like
`[:db/add 123 :book/title "Bad Money"]`. The TX report for that
database would have the datom that looked something like this,
`[123 :book/title "Bad Money" 555555 true]` where `123` is the entity
ID, `:book/title` is the attribute, `"Bad Money"` is the value,
`555555` is the time of the transaction, and `true` is if it was
added, or `false` if it was retracted.

The heart of Posh is the function `db-tx`, which takes a list of tx patterns as
input and returns a Regeant `reaction` that updates only when one of
the database's tx report datoms match one of the patterns. It returns
the value of the whole database right after the tx that it matches. An
really simple example:

```clj
(defn ten-year-olds []
  (let [db   (db-tx '[[_ :person/age 10]])
        kids (map (partial d/entity @db)
                  (d/q '[:find [?p ...] :where
                         [?p :person/age ?a]
                         [(= ?a 10)]]
                       @db))]
    [:ul "These kids are ten years old:"
     (for [k kids]
       ^{:key (:db/id k)} [:li (:person/name k)])]))
```

So, we define `db` to be `(db-tx '[[_ :person/age 10]])`, which
returns an atom of sorts that only changes when someone's age changes
to 10 (or gets retracted, like if they turn 11). I know it's hard to
believe; it's not even a form-2 component, but this component really won't update
until somebody turns 10.

### Pattern Matching

The tx pattern matching is very powerful. Here's a run-down of all a
pattern can be.

The tx pattern can be shorter than the tx datom:
```clj
  (db-tx [[]])     ;; matches every tx

  (db-tx [[453]])  ;; matches every tx with entity id of 435

  ;; matches to any title changes for this book's id
  (defn book [id]
    (let [db (db-tx [[id :book/title]])]
      ...))

  ;; underscore symbol is wildcard, but it must be quoted

  '[[_ :person/name]] ;; or
  [['_ :person/name]]

  ;; tx datoms are [entity attribute value time added?]
  ;; this matches only those persons who just left a group
  (db-tx '[[_ :person/group _ _ false]])

  ;; if you have external variables you'll have to unquote the form
  ;; and quote each underscore
  (let [color "red"]
    (db-tx [['_ :car/color color]]))
  
  ;; multiple patterns. If it matches any one of them it updates
  (db-tx '[[_ :person/name]
           [_ :person/age]
           [_ :person/group]])

  ;; You can use predicate functions in the match.
  ;; The function will get passed the datom's value as an arg
  
  ;; this will match any person older than 20
  (db-tx '[[_ :person/age #(> % 20)]])


  ;; but it's bad to use anonymous functions in the pattern like this
  ;; because db-tx memoizes and ClojureScript doesn't know that
  ;; #(+ 3 %) equals #(+ 3 %) so it gobbles up memory

  ;; So you either need to define your functions or, if you do use
  ;; anonymous functions, at least do it in the outer binding of
  ;; a form-2 component.

  ;; same thing, but nice for memoizing
  (defn >20? [n] (> n 20))
  (db-tx [['_ :person/age >20?]])

  ;; match on any attrib change for a person
  (defn person-attrib? [a] (= (namespace a) "person"))
  (db-tx [['_ person-attrib?]])

  ;; you can also group together possibilities in a vector.

  ;; matches on the actions "drink" "burp" "sleep"
  (db-tx [['_ :person/action ["drink" "burp" "sleep"]]])

  ;; matches either of two people with id's 123 or 234, if either
  ;; their name or age changes:
  (db-tx [[[123 234] [:person/name :person/age]]])
  
```




```clj



```



## License

Copyright © 2015 FIXME

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
