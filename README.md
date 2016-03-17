# Posh

Posh is a ClojureScript / React library that lets you use a single
[DataScript](https://github.com/tonsky/datascript/) database to store your app state. Components access the
data they need to render by calling DataScript queries with `q` or
`pull` and are only updated when the query changes. `transact!` is
used within components to change the global state. If you are familiar
with Datomic, you will find Posh incredibly easy to use. If not, it's
worth learning because of the power and versatility it will give your components.

Posh uses [Reagent](https://github.com/reagent-project/reagent) and can be integrated with your current Reagent
project. Because it uses a single database to store app state, like [Om](https://github.com/omcljs/om) or [re-frame](https://github.com/Day8/re-frame), it is fitting to write
large, extensible apps and reusable components, with the added
benefit of being much simpler to use and having a more expressive data
retrieval and state updating syntax.

Posh is also very fast because the in-component data queries only run when the
database is updated with relevant data (found by pattern matching on the
tx report).

For example, below is a component that displays a list of a person's age, name,
and weight. The component will only re-render when something in the
database changed an attribute of the `person-id` entity:

```
(defn person [conn person-id]
  (let [p @(pull conn '[*] person-id)]
    [:ul
     [:li (:person/name p)]
     [:li (:person/age p)]
     [:li (:person/weight p)]]))
```
## Resources

Posh chat room on Gitter: https://gitter.im/metasoarous/posh

### Examples:

[Posh Todo List](https://github.com/mpdairy/posh-todo) - A todo list
with categories, edit boxes, checkboxes, and multi-stage delete
buttons ([trashy live demo](http://otherway.org/posh-todo/)).

## Usage

Start a Reagent project and include these dependencies:

```clj
[posh "0.3.5"]
[datascript "0.13.3"]
```
Require in Reagent app files:
```clj
(ns example
  (:require [reagent.core :as r]
            [posh.core :refer [pull q db-tx pull-tx q-tx after-tx! transact! posh!]]
            [datascript.core :as d]))
```

## Overview

Posh gives you three functions to retrieve data from the database from
within Reagent components: `pull`, `q`, and `db-tx`. They watch the
database's transaction report and only update (re-render) the hosting
component when one of the transacted datoms affects the requested data.

### posh!

`(posh! [DataScript conn])`

Sets up the tx-report listener for a conn.

```clj
(def conn (d/create-conn))

(posh! conn)
```
You can do it for multiple conn's, though I can't imagine a good use case
for that.

### pull

`(pull [conn] [pull pattern] [entity id])`

`pull` retrieves the data specified in `pull-pattern` for the entity
with `entity-id`.  `pull` can be called from within any Reagent
component and will re-render the component only when the pulled
information has changed.

Posh's `pull` operates just like Datomic / Datascript's `pull` except it takes a
`conn` instead of a `db`. (See
[Datomic's pull](http://docs.datomic.com/pull.html))

Posh's `pull` only attempts to pull any new data if there has been a
transaction of any datoms that have changed the data it is
looking at. For example:

```clj
(pull conn '[:person/name :person/age] 1234)
```
Would only do a pull into Datascript if there has been a transaction
changing `:person/name` or `:person/age` for entity `1234`.

Below is an example that pulls all of the info from the entity with `id`
whenever `id` is updated and increases its age whenever clicked:

```clj
(defn pull-person [id]
  (let [p @(pull conn '[*] id)]
    (println "Person: " (:person/name p))
    [:div
     {:on-click #(transact! conn [[:db/add id :person/age (inc (:person/age p))]])}
     (:person/name p) ": " (:person/age p)]))
```

If you would like to fine-tune when `pull` actually attempts to pull
new data, you can use `pull-tx`:

`(pull-tx [conn] [tx pattern] [pull pattern] [entity id])`

Where `tx-pattern` is a datom matching pattern for the transaction
queue. See the pattern-matching section below.

### q

`(q [conn] [query] & args)`

`q` queries for data from the database according to the rules
specified in the query. It must be called within a Reagent component
and will only update the component whenever the data it is querying
has changed. See
[Datomic's Queries and Rules](http://docs.datomic.com/query.html) for
how to do datalog queries. `args` are optional extra variables that DataScript's `q` looks for
after the `[:find ...]` query if the query has an `:in` specification.
By default, the database at the time of the latest transaction is implicitly
passed in as the first arg, which will correspond with `$` in the
`:in` clause.

Whenever the database has changed, `q` will check the transacted
datoms to see if anything relevant to its query has occured. If so,
`q` runs Datascript's `q` and compares the new query to the old. If it
is different, the hosting component will update with the new data.

Posh's `q` looks at the query pattern and tries to make a pattern to
identify relevant tx datoms. If there is anything complex in the
query, such as function calls or `get-else`, it will have a
non-restrictive pattern and will run the query whenever there has been
a database change. To specify the matching pattern by hand, you can
use `q-tx`:

`(q-tx [conn] [tx pattern] [query] & args)`

`q-tx` takes a `tx pattern` as its second argument (see the Pattern
Matching section below).

Below is an example of a component that shows a list of people's names
who are younger than a certain age. It only attempts the query when
someone's age changes:

```clj
(defn people-younger-than [old-age]
  (let [young @(q-tx conn [['_ :person/age]] '[:find [?name ...]
                                               :in $ ?old
                                               :where
                                               [?p :person/age ?age]
                                               [(< ?age ?old)]
                                               [?p :person/name ?name]]
                     old-age)]
    [:ul "People younger than 30:"
     (for [n young] ^{:key n} [:li n])]))
```

Or, if you called the same query with just `q`:
```clj
(q conn '[:find [?name ...]
          :in $ ?old
          :where
          [?p :person/age ?age]
          [(< ?age ?old)]
          [?p :person/name ?name]]
   old-age)
```
In this case, `q` would run the query every time there is a
transaction in the database because one of the clauses is a function
call `(< ?age ?old)`.

An example of a simple call would be:

```clj
(q conn '[:find [?name ...]
          :in $ ?age
          :where
          [?p :person/age ?age]
          [?p :person/name ?name]]
   age)
```
This finds the name of every person whose `:person/age` is `age`. It
will re-query whenever anyone's `:person/age` changes to or from `age`
or whenever anybody's `:person/name` changes. 


### db-tx

`(db-tx [conn] [tx pattern])`

`db-tx` listens to the tx report queue and returns the value of the
database after a match. The hosting Reagent component won't update
with a new db until there is a pattern match.

It is generally recommended that you use `pull`s and `q`s for any
components instead of `db-tx`. If you do use `db-tx`, it is
very important to provide thorough tx pattern matching rules to
restrict the component from re-rendering each time the db changes.

This example displays a list of people who are ten years old. The
component will only update when someone's age is set to 10 or changed
from 10 (retracted).

```clj
(defn ten-year-olds []
  (let [db   @(db-tx conn '[[_ :person/age 10]])
        kids (map (partial d/entity db)
                  (d/q '[:find [?p ...] :where
                         [?p :person/age ?a]
                         [(= ?a 10)]]
                       db))]
    [:ul "These kids are ten years old:"
     (for [k kids]
       ^{:key (:db/id k)} [:li (:person/name k)])]))
```
(Note: the above component should have just used posh's `q`)

The example below displays a person and increases its own age
whenever clicked. It only re-renders when a datom with its own
entity id is transacted.

```clj
(defn person [id]
  (let [db @(db-tx conn [[id]])
        p  (d/entity db id)]
    [:div
     {:on-click #(transact! conn [[:db/add id :person/age (inc (:person/age p))]])}
     (:person/name p) " -- " (:person/age p)]))
```

(Note: the above component should have just used posh's `pull`)

### after-tx!

`(after-tx! conn [tx patterns] handler-fn)`

`after-tx!` sets up a listener that watches for a transaction pattern match, then
calls `(handler-fn matching-tx-datom db-after)`.

```clj
;; congratulates any one who turns 21
(after-tx! conn
          '[[_ :person/age 21 _ true]]
          (fn [[e a v] db]
            (js/alert (str "You have come of age, "
                           (:person/name (d/entity db e)) "."))))
```

You could use `after-tx!` to handle events or to trigger communication
with the server.

### transact!

`transact!` operates just like DataScript's `transact!`:

```clj
(transact! conn [[:db/add 123 :person/name "Jim"]])
```

Posh's transact just calls DataScript's transact, but returns an empty
`[:span]` so that it can easily be used inside the body of components.

### active-queries

`(active-queries conn)`

Returns a Reagent atom that contains a set of descriptions of all the `q`, `pull`,
and `db-tx` queries called from within any currently-rendered Reagent components.

Their descriptions are represented as vectors that are the same order
as the arguments to `db-tx`, `q-tx`, and `pull-tx`:

```clj
[:db-tx <tx-patterns>]

[:pull <tx-patterns> <pull-pattern> <entity-identifier>]

[:q <tx-pattern> <query> <args>]  ;; args is a vector of args
                                  ;; or nil if none
```

## Advanced Examples

### Editable Label

This component will show the text value
for any entity and attrib combo. There is an "edit" button that, when clicked, 
creates an `:edit` entity that keeps track of the
temporary text typed in the edit box. The "done" button resets the original
value of the entity and attrib and deletes the `:edit` entity. The
"cancel" button just deletes the `:edit` entity.

The state is stored entirely in the database for this solution, so if
you were to save the db during the middle of an edit, if you restored
it later, you would be in the middle of the edit still.

```clj
(defn edit-box [conn edit-id id attr]
  (let [edit @(p/pull conn [:edit/val] edit-id)]
    [:span
     [:input
      {:type "text"
       :value (:edit/val edit)
       :onChange #(p/transact! conn [[:db/add edit-id :edit/val (-> % .-target .-value)]])}]
     [:button
      {:onClick #(p/transact! conn [[:db/add id attr (:edit/val edit)]
                                    [:db.fn/retractEntity edit-id]])}
      "Done"]
     [:button
      {:onClick #(p/transact! conn [[:db.fn/retractEntity edit-id]])}
      "Cancel"]]))

(defn editable-label [conn id attr]
  (let [val  (attr @(p/pull conn [attr] id))
        edit @(p/q conn '[:find ?edit .
                          :in $ ?id ?attr
                          :where
                          [?edit :edit/id ?id]
                          [?edit :edit/attr ?attr]]
                   id attr)]
    (if-not edit
      [:span val
       [:button
        {:onClick #(new-entity! conn {:edit/id id :edit/val val :edit/attr attr})}
        "Edit"]]
      [edit-box conn edit id attr])))

```

This can be called with any entity and its text attrib, like
`[editable-label conn 123 :person/name]` or
`[editable-label conn 432 :category/title]`.

## Pattern Matching

Posh now generates exactly thorough pattern matching for `pull` and
pretty efficient patterns for `q`, so you shouldn't need to specify your
own unless you want to make things update less, like if you want
certain components to just listen to a refresh signal, or if you are
using `after-tx` or `db-tx`.

The datom pattern matcher just takes a list of vectors that consist of
values, sets, or a wildcard that match against tx-datoms. Tx-datoms
are structured as: `[eid attr val tx added?]`. Typically
you'll just want to match the `eid` and `attr`, and sometimes
`val` if there is a ref.

```clj
(use 'posh.datom-matcher)

;; (datom-match? patterns datom)

(datom-match? '[[12 _ "hey"]] [12 :greeting "hey"])  ;; true

(datom-match? '[[12 _ "what"]] [12 :greeting "hey"])  ;; false

;; it just has to match one of the patterns
(datom-match? '[[12 _ "what"]
                [12 _ "hey"]]
              [12 :greeting "hey"])  ;; true

;; sets just see if the thing is in the set
(datom-match? '[[12 _ #{"what" "hey"}]] [12 :greeting "hey"]) ;; true

;; if it reaches the end of the pattern, it's a match:
(datom-match? '[[4]] [4 :person/name "Jimmy Hogan"])  ;; true

;; here's an example of a pattern generated for a pull that has some refs:
'[[_ :category/todo 1]
  [2 #{:category/name :category/slug} _]
  [_ :task/category 2]
  [3 #{:category/name :category/slug} _]
  [_ :task/category 3]
  [4 #{:category/name :category/slug} _]
  [_ :task/category 4]]

```
## Back-end

We are working on automating the back-end sync with
datomic/datascript. Basically, the server will keep track of all the
active queries for a client, do its own pattern matching on the tx-report, and send
only the datoms that the client is looking for and does not already
have. Should be nice.

See our Gitter room for updates: https://gitter.im/metasoarous/posh

## License

Copyright © 2015 Matt Parker

If somebody needs to BSD then sure, it's under that too.
Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
