# Posh

Posh is a little library that lets you use a DataScript database to
keep your application state in Reagent.  It can be incorporated with
your existing Reagent project and mixed with regular Reagent atoms.
Using Posh, components can have access to the
complete database, but watch the database's transaction report and
only update when pertinent changes occur.

This gives your components all the power of DataScript queries,
entities, pull syntax, etc, but it's still very fast, even with a
large database.

## Usage

Start a Reagent project and include these dependencies

```clj
[posh "0.3.1"]
[datascript "0.13.3"]
```
Require in Reagent app files:
```clj
(ns example
  (:require [reagent.core :as r]
            [posh.core :refer [db-tx pull-tx q-tx when-tx! transact! posh!]]
            [datascript.core :as d]))
```

## Overview

Posh gives you three functions to retrieve data from the database from
within Reagent components: `db-tx`,
`pull-tx`, and `q-tx`. They watch the database's transaction report
and only update (re-render) when one of the transacted datoms matches the
specified pattern. The datom pattern matcher is very powerful and is
explained below this overview of functions.

### posh!

`(posh! [DataScript conn])`

Sets up the tx-report listener for a conn.

```clj
(ns ...
   (:require [reagent.core :as r]
             [posh.core :refer [db-tx pull-tx q-tx when-tx! transact! posh!]]
             [datascript.core :as d]))

(def conn (d/create-conn))

(posh! conn)
```
You can do it for multiple conn's, though I don't know why you'd want to.

### db-tx

`(db-tx [conn] [tx pattern])`

`db-tx` listens to the tx report queue and returns the value of the
database after a match. The hosting Reagent component won't update
with a new db until there is a pattern match.

This example displays a list of people who are ten years old. The
component will only update when someone's age is set to 10 or changed
from 10 (retracted).

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
whenever clicked. It only re-renders when a datom with its own
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
pull and only updates the hosting component if the new pull is different.

An example, that pulls all of the info from the entity with `id`
whenever `id` is updated and increases its age whenever clicked:

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
who are younger than a certain age. It only attempts the query when
someone's age changes::

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

### when-tx!

`(when-tx! conn [tx patterns]  handler-fn)`

`when-tx!` sets up a listener that watches for a transaction pattern match, then
calls `(handler-fn matching-tx-datom db-after)`.

```clj
;; congratulates any one who turns 21
(when-tx conn
         '[[_ :person/age 21 _ true]]
         (fn [[e a v] db]
           (js/alert (str "You have come of age, "
                          (:person/name (d/entity db e)) "."))))
```

You could use `when-tx!` to handle events or to trigger communication
with the server.

### transact!

Right now, `transact!` just calls `d/transact!`, but maybe in the future
it might have to do some pre-transaction filtering or something, so
heck you might as well start using it.

## Pattern Matching

The datom pattern matcher is used to find if any pertinant datoms have
been transacted in the database. The pattern can either be a
list of patterns or a tuple of a list of patterns and a query.

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
examples use `db-tx`, though `pull-tx`, `q-tx`, and `when-tx!` use the
same pattern matching.

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

### Using `?variables` from the Datom Match

This is not really recommended because it ruins the purity of the
state.

In `pull-tx` and `q-tx` you can set variables in the datom
match and use the values for them in the query or pull.

You should never do it though and I'll probably remove this feature so
that nobody is tempted.

#### pull-tx

You can use `?` symbols from the datom match as vars in the pull
pattern or for the entity id.

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
the last changed person or to set up a `when-tx!` that updates some
var in the db that points to the last changed person.

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

I haven't even looked at how to communicate with the back-end yet.
Maybe there's some cool, easy way to do it.

## License

Copyright © 2015 Matt Parker

If somebody needs to BSD then sure, it's under that too.
Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
