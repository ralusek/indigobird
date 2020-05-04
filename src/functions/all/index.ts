// Types
import { IndigobirdAllConfig, IndigobirdAllHandler } from './types';

// Functions
import some from '../some';

async function all<T, I extends any>(
  items: I[],
  handler?: IndigobirdAllHandler<T, I>,
  config: IndigobirdAllConfig = {}
): Promise<T[]> {
  return some(items, handler, {
    ...config,
    amount: items.length,
  });
}

export default all;
