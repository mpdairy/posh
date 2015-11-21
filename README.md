# Posh
```clj
[posh "0.2.2"]
```
Posh is a little library that lets you use a DataScript database to
keep your application state. All components have access to the
complete database, but watch the database's transaction report and
only update when pertinent changes occur.

This gives your components all the power of DataScript queries,
entities, pull requests, etc, but is still very fast, even with a
large database.

## Overview

In DataScript, the database is changed by submitting datoms, like
`[:db/add 123 :book/title "Bad Money"]`. The TX report for that
database would have the datom that looked something like this,
`[123 :book/title "Bad Money" 555555 true]` where `123` is the entity
ID, `:book/title` is the attribute, `"Bad Money"` is the value,
`555555` is the time of the transaction, and `true` is if it was
added, or `false` if it was retracted.

## Functions

### init!

```clj
(ns ...
   (:require [reagent.core :as r]
          [posh.core :refer [db-tx when-tx transact] :as posh]
          [datascript.core :as d]))

(def conn (d/create-conn))

;;; sets up tx report listener for conn
(posh/init! conn)
```

### db-tx

The heart of Posh is the function `db-tx`, which takes a `conn` and a list of tx patterns as
input and returns a Regeant `reaction` that updates only when one of
the database's tx report datoms match one of the patterns. The reaction returns
the value of the whole database (`:db-after`) after the tx that it matches. A
really simple example:

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

So, we define `db` to be `(db-tx conn '[[_ :person/age 10]])`, which
returns an atom of sorts that only changes when someone's age changes
to 10 (or gets retracted, like if they turn 11). I know, it's hard to
believe--it's not even a form-2 component--but it really won't
re-render until somebody turns 10.

#### Pattern Matching

The tx pattern matching used in `db-tx` is very powerful. Here's are
examples of all the ways a pattern can match:

```clj
  ;; it can be shorter than the tx report datom

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

  ;; tx datoms are [entity attribute value time added?]
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
  ;; anonymous functions, at least do it in the outer binding of
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
prints out the names of all its books in alphabetical order. We'd want
to listen for any changes to the bookshelf itself (like its own name)
and we want to know when the title of any of the books changes so we
can re-sort the shelf. Here's an inefficient example:

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
that aren't even on its bookshelf. Thus, if we had a hundred
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
matches) and, because it has a variable, it runs the query beloow,
just using DataScript's `q` function, to see if the book is part of
the bookshelf. You can do anything you could normally do in a regular
query, even functions like:

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
age changes and it's sorting by name, etc. We could do it this way,
which is rather verbose:

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
Of course, you can generate the matching patterns and queries
programatically.

(You should notice here that `'[?p :person/group ?g]` follows
`['?p :person/group group-id]` to bind `?g` to `group-id` so that it
can unify with `'[?g :group/sort-by :person/name]`. You can't just do
`[group-name :group/sort-by :person/name]` or it will always be true.)

Another weird thing you can do is use a function to return a variable
or set of variables that can then be used to bind to a query. Just put
them in a map. This does the same thing as above, except it will work
with anything tags you put into `person-sortables`.

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

## when-tx

`(when-tx conn tx-patterns handler-fn)` sets up a listener that watches for a pattern match, then
calls `(handler-fn matching-tx-datom db-after)`. Right now it can't do queries
in the pattern match.

```clj
;; congratulates anyone who turns 21
(when-tx conn
         '[[_ :person/age 21 _ true]]
         (fn [[e a v] db]
           (js/alert (str "You have come of age, " (:person/name
           (d/entity db e)) "."))))
```

## transact

Right now, `transact` just calls `d/transact!`, but maybe in the future
it might have to do some pre-transaction filtering or something, so
heck you might as well start using it.

## License

Copyright © 2015 Matt Parker

If somebody needs to BSD then sure, it's under that too.
Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
