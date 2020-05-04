Much of the same functionality with `bluebird`, but where everything allows for concurrency and handlers.

```
const pendingPromises = []; // Imagine these were pending promises
```

In `bluebird`:
```
Promise.all(pendingPromises);

Promise.map(
  items,
  (item) => someAsync(item),
  { concurrency: 2},
)
```

In `indigobird`:
```
indigobird.all(pendingPromises);

// But we can also add.
indigobird.all(pendingPromises, { concurrency: 5 });
```
Concurrency doesn't make any sense for already-resolving promises, but what if we didn't handle them yet?
```

indigobird.all(
  [ userA, userB, userC, userD, userE ],
  (userId) => getFromDB(userId),
  { concurrency: 2},
);
```
So we've arrived at the same effect as `bluebird`'s `Promise.map`, which also offers concurrency. The thing is that we can also use it for other functions.

For example, improved `Promise.props`

```
// For example, here is a `Promise.props` equivalent, only we can provide
// it with a handler function to allow it to manage concurrency.
indigobird.props(
  { userA, userB, userC, userD, userE },
  (userId) => getFromDB(userId),
  { concurrency: 2}
);
```
