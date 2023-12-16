// Types
import { IndigobirdAnyConfig, IndigobirdAnyHandler } from './types';

// Functions
import some from '../some';

async function any<T, I extends any>(
  items: I[],
  handlerOrConfig?: IndigobirdAnyHandler<T, I> | IndigobirdAnyConfig | null,
  configOr?: IndigobirdAnyConfig
): Promise<T> {
  // Resolve ambiguous args
  const handler: IndigobirdAnyHandler<T, I> | null = (handlerOrConfig && (typeof handlerOrConfig === 'function'))
                                                      ? handlerOrConfig
                                                      : null;
  const config: IndigobirdAnyConfig | {} = (handler || configOr)
                                            ? (configOr || {})
                                            : (handlerOrConfig || {});
  const result = await some(items, handler, {
    ...config,
    amount: 1,
  });

  return result.find(item => item !== undefined)!;
}

export default any;
