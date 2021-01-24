// Types
import { IndigobirdPropsConfig, IndigobirdPropsHandler } from './types';
import { IndigobirdAllHandler } from '../all/types';

// Functions
import all from '../all';

async function props<T extends { [key in K]: any }, I extends any, K extends string | number | symbol>(
  items: { [key in K]: I },
  handler?: IndigobirdPropsHandler<I, K>,
  config: IndigobirdPropsConfig = {}
): Promise<T> {
  const keys: K[] = Object.keys(items) as K[];
  const values = keys.reduce((arr: I[], key) => {
    arr.push(items[key]);
    return arr;
  }, []);

  // Wrap the handler so as to pass in the corresponding key, rather
  // than the corresponding index.
  const wrappedHandler: IndigobirdAllHandler<any, I> | undefined = handler
    ? (item: I, index: number) => handler(item, keys[index])
    : undefined;

  const results = await all(values, wrappedHandler, config);

  return results.reduce((agg: T, result, i) => {
    const key = keys[i];
    agg[key] = result;
    return agg;
  }, {});
}

export default props;
