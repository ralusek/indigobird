## Much of the same functionality as `bluebird`, except everything allows for concurrency and handlers.

Node Install:
`$ npm install --save indigobird`
Deno Install:
`coming soon`


### Where it's like bluebird:

```javascript
import indigobird from 'indigobird';

// Like Promise.all or bluebird's variant
indigobird.all([
  doSomethingAsync(),
  doSomethingAsync(),
  doSomethingAsync(),
]);

// Like bluebird's .some, we wait for `amount` to resolve
// successfully before resolving the batch.
indigobird.some([
  doSomethingAsync(),
  doSomethingAsync(),
  doSomethingAsync(),
], null, { amount: 2 });

// Like bluebird's .props, we resolve the promises at the keys'
// values, and map them onto a result object with the same keys
indigobird.props({
  head: getHeadAsync(),
  shoulders: getShouldersAsync(),
  knees: getKneesAsync(),
  toes: getToesAsync(),
});

// Like .some, but has `amount` set to 1.
indigibird.any([
  doSomethingAsync(),
  doSomethingAsync(),
  doSomethingAsync(),
]);
```

### Where it's NOT like bluebird
Rather than just handing an array of promises, like `Promise.all` or bluebird's `.some`, all of these utilities can also be passed a handler argument
```javascript
// This then behaves like bluebird's .map, where
// arguments in an array will be passed into an asynchronous handler,
// and can therefore have their concurrency specified in the `concurrency`
// argument.
indigobird.some(userIds, (userId) => {
  return validateAndFetchUser(userId);
}, { amount: 5, concurrency: 3});
```
Rather than invoking the functions at a given prop, we could, for example, just pass them instead. Then we could invoke them in the handler, and benefit from having control over concurrency.
```javascript
indigobird.props({
  head: getHeadAsync,
  shoulders: getShouldersAsync,
  knees: getKneesAsync,
  toes: getToesAsync,
}, fn => fn(), { concurrency: 3 });
```

