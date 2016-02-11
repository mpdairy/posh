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
[posh "0.3.4"]
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
transaction of any datoms that might have changed the data it is
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

Returns a Reagent atom that contains the set of descriptions of all the `q`, `pull`,
and `db-tx` queries call from within any currently-rendered Reagent components.

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

The datom pattern matcher is used to find if any pertinant datoms have
been transacted in the database. If you stick to just using `q` and `pull`,
you probably won't need to do any pattern matching, but you might want it for
`after-tx!` and most certainly you'll want it if you use `db-tx`.

The pattern can either be a list of patterns or a tuple of a list of patterns and a query.

To play around with the datom matcher:

```clj
(use 'posh.datom-match)

;;;(datom-match? db patterns datom)

> (datom-match? (d/db conn) '[[_ :age 34]] [123 :age 5])
nil

```
Note, if the pattern match is true, it will return a map that contains
any variables that might have been bound in the match, or just an
empty map if there are no variables.

```clj
> (datom-match? (d/db conn) '[[?p [:name :age]]] [123 :name "jim"])
{?p 123}
```

### Datom Matching

Here are examples of all the ways patterns can match. The
examples use `db-tx`, though `pull-tx`, `q-tx`, `after-tx!`, and
`before-tx!` use the same pattern matching.

```clj

  ;; The matcher takes a list of possible patterns
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
  ;; because db-tx, pull-tx, and q-tx memoize and ClojureScript doesn't know that
  ;; #(> % 20) equals #(> % 20) so it gobbles up memory

  ;; So you either need to define your functions or, if you do use
  ;; anonymous functions, at least put db-tx, pull-tx, or q-tx in the
  ;; outer binding of  a form-2 component so it only loads onces.

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

### Query Matching

Note: You shouldn't need query matching when using `pull`s and `q`s, but it
is useful for `db-tx`, `after-tx!`, and `before-tx!`.

In some cases you might want to do a little querying to get some extra
information. For example, suppose we have a bookshelf component that
prints out the names of all its books in alphabetical order. You'd want
to listen for any changes to the bookshelf itself (like its own name)
and you want to know when the title of any of the books changes so you
can re-sort the shelf. Here's an example:

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

To fix this, you can specify a query alongside your pattern matching.
Just put the query in a map with the patterns as key.
For example:

```clj
(db-tx conn {[[bookshelf-id]
              ['_ :book/bookshelf bookshelf-id]
              '[?b :book/name]]
             [['?b :book/bookshelf bookshelf-id]]})
```

This grabs the `?b` from the last pattern (if the rest of the pattern `:book/name`
matches first) and it runs the query to see if the book is part of
the bookshelf. You can do anything you could normally do in a regular
DataScript `q` query, even functions like:

```clj
(db-tx conn {'[[?p :person/action :drinking]]
             '[[?p :person/age ?a]
               [(< ?a 21)]]})             
```
which matches to any underaged drinkers.

You can match as many variables as you'd like, but the query only gets
run with the first matching pattern that returns vars.

The pattern matcher is recursive, so you can pair queries with any
datom pattern in the list.

Suppose we have a `group` that sorts people either by name or by age.
Let's say we are pretty thorough and only want to re-render the
component when it's sorting by age and a person's age changes, or when it's
sorting by name and a person's name changes, but not when a person's
age changes and it's sorting by name, etc. You could do it this way:

```clj
(db-tx conn
    [[group-id]
     ['_ :person/group group-id]
     {'[[?p :person/name _ _ true]]
      [['?p :person/group group-id]
       '[?p :person/group ?g]
       '[?g :group/sort-by :person/name]]}
     {'[[?p :person/age _ _ true]]
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

If you have nested queries, the parent queries get concatenated onto
the children queries. Below is the same query as above:

```clj
(db-tx conn
       [[group-id]
        ['_ :person/group group-id]
        {[{'[[?p :person/age _ _ true]]
           '[[?g :group/sort-by :person/age]]}
          {'[[?p :person/name _ _ true]]
           '[[?g :group/sort-by :person/name]]}]
         '[[?p :person/group ?g]]}])
```
`[[?p :person/group ?g]]` is a parent query so it gets appended to
the children query. Let's say the datom is `[123 :person/name "Jim"]`.
It won't match with `[group-id]` or with `['_ :person/group group-id]`
so it will move onto the next pattern, which is a map, so it will grab
the query `'[[?p :person/group ?g]]` and check the list of patterns,
which are themselves query maps. It will fail to match
`'[[?p :person/age _ _ true]]` so it will ignore the corresponding
query. It will finally match `'[[?p :person/name _ _ true]]` and
combine the parent and children queries and run `d/q`.

Another thing you can do is use a function to return a variable
or set of variables that can then be used to bind to a query. Just put
them in a map.

The solution below does the same thing as both above, except it will work
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

### Using `?variables` from the Datom Match

This is not really recommended because it ruins the purity of the
state.

In `pull-tx` and `q-tx` you can set variables in the datom
match and use the values for them in the query or pull.

You should never do it though and I'll probably remove this feature so
that nobody is tempted.

#### pull-tx

In the example below, `?p` and `?attr` are set in the datom match and
are used to pull info about the person who has most recently changed
an attribute.

```clj
(defn person-attr [a]
  (when (= (namespace a) "person")
    {'?attr a}))

(defn last-person-changed []
  (let [p (pull-tx conn [['?p person-attr]] '[:person/name ?attr] '?p)]
    (if-not @p
      [:div "Waiting for someone to change something..."]
      (let [changed-attr (or (first (remove #(= :person/name %) (keys @p)))
                             :person/name)]
        [:div (:person/name @p)
         " just changed his/her " (name changed-attr)
         " to " (changed-attr @p)]))))
```

The problem with this is that when you reload the app, nothing will
appear until something is new is transacted. It would be better to query for
the last changed person or to set up a `after-tx!` that updates some
entry in the db that points to the last changed person.

#### q-tx

In the next example, the values of `?birthday-boy` and
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
`?`), the query will return an empty set on its very first load and won't change
until a datom is matched from the tx report.

This also is just a lame trick and probably no use.

## More later...

I haven't looked at how to communicate with the back-end yet.
Maybe there's some cool, easy way to do it.

## License

Copyright © 2015 Matt Parker

If somebody needs to BSD then sure, it's under that too.
Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
