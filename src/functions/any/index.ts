// Types
import { IndigobirdAnyConfig, IndigobirdAnyHandler } from './types';

// Functions
import some from '../some';

async function any<T, I extends any>(
  items: I[],
  handler?: IndigobirdAnyHandler<T, I>,
  config: IndigobirdAnyConfig = {}
): Promise<T[]> {
  return some(items, handler, {
    ...config,
    amount: 1,
  });
}

export default any;
