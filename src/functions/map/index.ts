// Types
import { OptionalKeys, NonOptionalKeys } from 'types';
import { IndigobirdMapConfig, IndigobirdMapHandler } from './types';
import { IndigobirdAllHandler } from '../all/types';

// Functions
import all from '../all';

async function map<
  T, // Individual Prop Result Type
  O extends { [key in string | symbol | number] : any }, // Input object type
  K extends keyof O, // Key of input object
  // This is the full result object. We maintain optional props in input type as optional types in output type.
  // Otherwise this would be represented as { [P in K]: T }, which causes the return type to assume all optional
  // props in O are non-optional in R.
  R extends { [P in Exclude<K, | OptionalKeys<O>>]: T } & Partial<{ [P in Exclude<K, | NonOptionalKeys<O>>]: T }>
>(
  items: O,
  handler?: IndigobirdMapHandler<T, O, K>,
  config: IndigobirdMapConfig = {}
): Promise<R> {
  const keys: K[] = Object.keys(items) as K[];
  const values = keys.reduce((arr: O[K][], key) => {
    arr.push(items[key]);
    return arr;
  }, []);

  // Wrap the handler so as to pass in the corresponding key, rather
  // than the corresponding index.
  const wrappedHandler: IndigobirdAllHandler<T, O[K]> | undefined = handler
    ? (item, index) => handler(item, keys[index])
    : undefined;

  const results = await all(values, wrappedHandler, config);

  return results.reduce((agg: R, result, i) => {
    const key = keys[i];
    // @ts-ignore
    agg[key] = result;
    return agg;
  }, {} as R);
}

export default map;
