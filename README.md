# Posh
```clj
[posh "0.3"]
```
Posh is a little library that lets you use a DataScript database to
keep your application state. All components have access to the
complete database, but watch the database's transaction report and
only update when pertinent changes occur.

This gives your components all the power of DataScript queries,
entities, pull requests, etc, but is still very fast, even with a
large database.

## Overview

DataScript is a Clojure/ClojureScript database that gives great flexibility
for queries and transactions, but using it with a React.js front-end
is tricky and it's difficult to come up with a solution that scales
well.

The most obvious step toward efficiency is to update
components only when there has been a transaction. You probably don't
want all the components to re-render every time something in the db changes,
so you have to let the components decide what part of the db they need
and only update when that changes.

One solution is to have the components specify a `q` DataScript query
or a `pull` request. Every time the database changes, the queries for
each component are run to see if they need to update. But queries
aren't totally cheap and you might run into problems if you were, say,
using DataScript to keep track of animation frames and locations for
multiple objects in a game.

In Posh, the components (actually,
the `db-tx` functions called from within the components) specify
datom patterns and match against them in the tx report log to
determine if the component should be updated, so, i.e. the pattern
`'[_ :person/cash _]` would match any time a transaction about a
person's cash amount occured, which would be useful, say, for a
component that displays a sum total of all the cash in circulation.

## Operation

### posh!

Sets up the tx-report listener for a conn.

```clj
(ns ...
   (:require [reagent.core :as r]
             [posh.core :refer [posh! db-tx when-tx transact!]]
             [datascript.core :as d]))

(def conn (d/create-conn))

;;; sets up tx report listener for conn
(posh! conn)
```
You can do it for multiple conn's, though I don't know why you'd want to.

### db-tx

`(db-tx [conn] [tx pattern])`

`db-tx` listens to the tx report queue and returns the value of the
database after a match. The hosting Reagent component won't update
with a new db until there is a pattern match.

This example displays a list of people who are ten years old:

```clj
(defn ten-year-olds []
  (let [db   (db-tx conn '[[_ :person/age 10]])
        kids (map (partial d/entity @db)
                  (d/q '[:find [?p ...] :where
                         [?p :person/age ?a]
                         [(= ?a 10)]]
                       @db))]
    [:ul "These kids are ten years old:"
     (for [k kids]
       ^{:key (:db/id k)} [:li (:person/name k)])]))
```

The example below displays a person and increases its own age
whenever clicked. It only updates when a datom with its own
entity id is transacted.

```clj
(defn person [id]
  (let [db (db-tx conn [[id]])
        p  (d/entity @db id)]
    [:div
     {:on-click #(transact! conn [[:db/add id :person/age (inc (:person/age p))]])}
     (:person/name p) " -- " (:person/age p)]))
```

### pull-tx

`(pull-tx [conn] [tx pattern] [pull pattern] [entity id])`

`pull-tx` is just like DataScript's pull but it will only pull when
the datom pattern matches a tx in the tx report. It remembers the last
pull and only updates the hosting component if they are different.

An example, that pulls all of the info from the entity with `id`
whenever `id` is updated and increases the age whenever clicked:

```clj
(defn pull-person [id]
  (let [p (pull-tx conn [[id]] '[*] id)]
    (println "Person: " (:person/name @p))
    [:div
     {:on-click #(transact! conn [[:db/add id :person/age (inc (:person/age @p))]])}
     (:person/name @p) ": " (:person/age @p)]))
```

### q-tx

`(q-tx [conn] [tx pattern] [query] & args)`

`q-tx` calls DataScript's `q` with the given query, but only if the
tx pattern matches a transaction datom. If the result of the query is
different than the last query, the hosting Reagent component will
update. `args` are optional extra variables that `q` look for
after the `[:find ...]` query if the query has an `:in` specification.
By default, the database at the time of the transaction is implicitly
passed in as the first arg.

Below is an example of a component that shows a list of people's names
who are younger than a certain age:

```clj
(defn people-younger-than [old-age]
  (let [young (q-tx conn [['_ :person/age]] '[:find [?name ...]
                                              :in $ ?old
                                              :where
                                              [?p :person/age ?age]
                                              [(< ?age ?old)]
                                              [?p :person/name ?name]]
                    old-age)]
    [:ul "People younger than 30:"
     (for [n @young] ^{:key n} [:li n])]))
```

You can also set variables in the datom pattern match and use them in
the query. In the next example, the values of `?birthday-boy` and
`?birthday-age` from the pattern match are used as args to the query.

```clj
(defn all-people-older-than-birthday-person []
  (let [r (q-tx conn '[[?birthday-boy :person/age ?birthday-age _ true]]
                    '[:find ?birthday-name ?name
                      :in $ ?birthday-boy ?birthday-age
                      :where
                      [?p :person/age ?age]
                      [(> ?age ?birthday-age)]
                      [?p :person/name ?name]
                      [?birthday-boy :person/name ?birthday-name]]
                    '?birthday-boy
                    '?birthday-age)]
    (if (empty? @r)
      [:div "Waiting for a birthday..."]
      [:ul "Happy Birthday, " (ffirst @r) "! These people are still older than you:"
       (for [n (map second @r)] ^{:key n} [:li n])])))
```

If you put any variable symbols in the `args` (symbols starting with a
`?`), the query will return an empty set on load and won't change
until a datom is matched from the tx report.


### Pattern Matching
#### Tx Datoms

The tx pattern matching used in `db-tx` is very powerful. You can
match on any attribute, use wildcards, and even throw in some side
queries so that your component doesn't update unless it really needs to.
Here are examples of all the ways patterns can match:

```clj

  ;; db-tx takes a list of multiple patterns
  ;; each pattern is tried until one is true

  ;; a pattern can be shorter than the tx report datom
  ;; everything after the pattern ends is assumed to match

  ;; matches every tx
  (db-tx conn [[]])

  ;; matches every tx with entity id of 435
  (db-tx conn [[453]])


  ;; matches to any title changes for this book's id
  (defn book [id]
    (let [db (db-tx conn [[id :book/title]])]
      ...))

  ;; underscore symbol is wildcard, but it must be quoted

  '[[_ :person/name]] ;; or
  [['_ :person/name]]

  ;; tx datoms are [entity attribute value tx added?]
  ;; this matches only those persons who just left a group
  ;; since 'false' means it was retracted
  (db-tx conn '[[_ :person/group _ _ false]])

  ;; if you have external variables you'll have to unquote the form
  ;; and quote each underscore
  (let [color "red"]
    (db-tx conn [['_ :car/color color]]))
  
  ;; multiple patterns. If it matches any one of them it updates
  (db-tx conn '[[_ :person/name]
                [_ :person/age]
                [_ :person/group]])

  ;; You can use predicate functions in the match.
  ;; The function will get passed the datom's value as an arg
  
  ;; this will match any person older than 20
  (db-tx conn '[[_ :person/age #(> % 20)]])

  ;; but it's bad to use anonymous functions in the pattern like this
  ;; because db-tx memoizes and ClojureScript doesn't know that
  ;; #(> % 20) equals #(> % 20) so it gobbles up memory

  ;; So you either need to define your functions or, if you do use
  ;; anonymous functions, at least put `db-tx` in the outer binding of
  ;; a form-2 component.

  ;; same thing, but nice for memoizing
  (defn >20? [n] (> n 20))
  (db-tx conn [['_ :person/age >20?]])

  ;; match on any attrib change for a person,
  ;; like :person/name, :person/age, but not :book/name
  (defn person-attrib? [a] (= (namespace a) "person"))
  (db-tx conn [['_ person-attrib?]])

  ;; you can also group together possibilities in a vector.

  ;; matches on the actions "drink" "burp" "sleep"
  (db-tx conn [['_ :person/action ["drink" "burp" "sleep"]]])

  ;; matches either of two people with id's 123 or 234, if either
  ;; their name or age changes:
  (db-tx conn [[[123 234] [:person/name :person/age]]])
```

#### Query Matching

In some cases you might want to do a little querying to get some extra
information. For example, suppose we have a bookshelf component that
prints out the names of all its books in alphabetical order. You'd want
to listen for any changes to the bookshelf itself (like its own name)
and you want to know when the title of any of the books changes so you
can re-sort the shelf. Here's a less efficient example:

```clj
(defn bookshelf [bookshelf-id]
  (let [db    (db-tx conn
                     [[bookshelf-id]
                      ['_ :book/bookshelf bookshelf-id]
                      '[_ :book/name]])
        b     (d/entity @db bookshelf-id)
        books (map (partial d/entity @db)
                   (d/q '[:find [?b ...]
                          :in $ ?bs
                          :where
                          [?b :book/bookshelf ?bs]]
                        @db bookshelf-id))]
    [:ul "Books on bookshelf: " (:bookshelf/name b)
     (for [b (sort-by :book/name books)]
       ^{:key (:db/id b)} [:li (:book/name b)])]))
```
`[bookshelf-id]` watches for any changes to the
bookshelf itself, like its name.

`['_ :book/bookshelf bookshelf-id]`, watches for
any books that get added to or retracted from the bookshelf.

`'[_ :book/name]` watches for the change of any book names so it can
re-sort the list. The problem with this is that it will match books
that aren't even on its bookshelf. If we had a hundred
bookshelves, changing the name of one book would cause them all the
re-render--not good!

To fix this, you can insert a query as a third argument to `db-tx` and
see if the query unifies with variables it pulls from your pattern.
For example:

```clj
(db-tx conn [[bookshelf-id]
             ['_ :book/bookshelf bookshelf-id]
             '[?b :book/name]]
            [['?b :book/bookshelf bookshelf-id]])
```

This grabs the `?b` from the last pattern (if the rest of the pattern
matches first) and it runs the query below to see if the book is part of
the bookshelf. You can do anything you could normally do in a regular
DataScript `q` query, even functions like:

```clj
(db-tx conn '[[?p :person/action :drinking]]
            '[[?p :person/age ?a]
              [(< ?a 21)]])
```
which matches to any minors who are drinking.

You can match as many variables as you'd like, but the query only gets
run with the first matching pattern that returns vars. This is
somewhat limiting, so if you need more variety you can also pair
individual patterns with their own queries by pairing them in a map in
the pattern list.

Suppose we have a `group` that sorts people either by name or by age.
Let's say we are pretty thorough and only want to re-render the
component when it's sorting by age and a person's age changes, or when it's
sorting by name and a person's name changes, but not when a person's
age changes and it's sorting by name, etc. You could do it this way:

```clj
(db-tx conn
       [[group-id]
        ['_ :person/group group-id]
        {'[?p :person/name _ _ true]
         [['?p :person/group group-id]
          '[?p :person/group ?g]
          '[?g :group/sort-by :person/name]]}
        {'[?p :person/age _ _ true]
         [['?p :person/group group-id]
          '[?p :person/group ?g]
          '[?g :group/sort-by :person/age]]}])
```
That's pretty verbose. Of course, you can generate the matching patterns and queries
programatically.

(You should notice here that `'[?p :person/group ?g]` follows
`['?p :person/group group-id]` to bind `?g` to `group-id` so that it
can unify with `'[?g :group/sort-by :person/name]`. You can't just do
`[group-name :group/sort-by :person/name]` or it will always be true.)

Another weird thing you can do is use a function to return a variable
or set of variables that can then be used to bind to a query. Just put
them in a map. This does the same thing as above, except it will work
with any tags you put into `person-sortables`.

```clj
(def person-sortables [:person/name :person/age :person/height :person/weight])

(defn person-sortable [a]
  (when (some #{a} person-sortables)
    {'?sort-attr a}))

(db-tx conn
       [[group-id]
        ['_ :person/group group-id]
        {['?p person-sortable '_ '_ true]
         [['?p :person/group group-id]
          '[?p :person/group ?g]
          '[?g :group/sort-by ?sort-attr]]}])
```

### when-tx

`(when-tx conn tx-patterns [queries (optional)]  handler-fn)` sets up
a listener that watches for a pattern match, then calls `(handler-fn
matching-tx-datom db-after)`. It can take a query right after the
patterns or inline as maps, like in `db-tx`.


```clj
;; congratulates anyone who turns 21
(when-tx conn
         '[[_ :person/age 21 _ true]]
         (fn [[e a v] db]
           (js/alert (str "You have come of age, "
                          (:person/name (d/entity db e)) "."))))
```

You could use `when-tx` to handle events or to trigger communication
with the server.

### transact!

Right now, `transact!` just calls `d/transact!`, but maybe in the future
it might have to do some pre-transaction filtering or something, so
heck you might as well start using it.

## Advanced Examples

### Mixing with Component Local Variables
Here's a component that uses an `r/atom` in the outer form to keep
track of the local state of the input box. The component takes an
entity id and an attrib, like :person/name or :book/title, and turns
it into a div with an "edit" button that, when clicked, will turn into
an input box with a "done" button, which, when clicked, will transact
the input-box value as the value for the original entity id and attrib.

```clj
(defn editable [id attr]
  (let [db          (db-tx conn [[id :action/editing attr]])
        input-value (r/atom (attr (d/entity @db id)))]
    (fn [id attr]
      (let [parent   (d/entity @db id)
            text     (attr parent)
            editing? (:action/editing parent)]
        (if editing?
          [:div [:input {:type "text"
                         :value @input-value
                         :onChange #(reset! input-value (-> % .-target .-value))}]
           [:button {:onClick #(transact! conn [[:db/add id attr @input-value]
                                               [:db/retract id :action/editing attr]])} "Done"]]
          [:div text
           [:button {:onClick #(transact! conn [[:db/add id :action/editing attr]])}
            "Edit"]])))))

;; would be called with something like [editable person-id :person/name]
```

Alternatively, you could use no local atom and just transact the value
directly to the db as the user types. Or, best of all, you could update a temporary
attrib in the db and then set that to equal the original value when
the editing is finished, so that all state is saved in the db.

## More later...

I haven't even looked at how to communicate with the back-end yet.
Maybe there's some cool, easy way to do it.

## License

Copyright © 2015 Matt Parker

If somebody needs to BSD then sure, it's under that too.
Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
