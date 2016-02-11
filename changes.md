#### 0.3.4

- Component-friendly: `posh!` now stores posh state inside the
  meta-data of the DataScript conn. There are now no global atoms and
  all is passed around in the conn.
- **Breaking change**: Removed `before-tx!`. You can bake up your own
  version of `transact!` in the rare case you need to add
  pre-transaction filters.
- New Feature: `active-queries` returns an atom that contains the set
  of all active queries for any rendered components. This info is
  helpful for syncing with the back-end.


