// Types
import { IndigobirdRaceConfig, IndigobirdRaceHandler } from './types';

// Constants
import { RACE_AMOUNT_CONDITIONAL_TYPE } from './constants';

// Utils
import sandbox from '@/utils/sandbox';
import validateConfig from './helpers/validateConfig';

/**
 * Executes `concurrency` number of handlers/items simultaneously.
 * Will resolve as soon as `amount` number have resolved successfully.
 * Will only error if number have errored `items.length` - `amount`,
 * such that it is not possible for `amount` to resolve.
 * @param items The items to handle.
 * @param handler Optional handler which will be passed the current item.
 * @param config Configuration.
 */
async function race<T extends any, I extends any>(
  items: I[],
  handlerOrConfig?: IndigobirdRaceHandler<T, I> | IndigobirdRaceConfig | null,
  configOr?: IndigobirdRaceConfig
): Promise<T[]> {
  // Resolve ambiguous args
  const handler: IndigobirdRaceHandler<T, I> | null = (handlerOrConfig && (typeof handlerOrConfig === 'function'))
                                                      ? handlerOrConfig
                                                      : null;
  const config: IndigobirdRaceConfig | {} = (handler || configOr)
                                            ? (configOr || {})
                                            : (handlerOrConfig || {});

  const { concurrency = Infinity, amount = items.length } = config as IndigobirdRaceConfig;
  if (!items.length) return [];
  await validateConfig({ concurrency, amount }, items.length);
    

  const resolutions: T[] = [];
  const errors: Error[] = [];
  let firstError: Error;

  const activity = {
    hasCompleted: false, // Has either succeeded or errored enough in order to complete
    // Have begun executing.
    started: 0,
    // Currently executing.
    executing: 0,
    resolved: 0, // Keep track numerically, rather than resolutions.length, as it is a sparse array.
    errored: 0, // Keep track numerically, rather than errors.length, as it is a spare array.
  };

  return new Promise((resolve, reject) => {
    executeNextHandler();

    async function evaluateCompletionCriteria() {
      if (typeof amount === 'number') {
        if ((activity.resolved + activity.errored) === amount) {
          activity.hasCompleted = true;
          resolve(resolutions);
        }
      }
      else {
        if (activity.resolved >= amount.resolved) {
          if (amount.type === RACE_AMOUNT_CONDITIONAL_TYPE.OR) {
            activity.hasCompleted = true;
            resolve(resolutions);
          }
          else {
            if (activity.errored >= amount.rejected) {
              activity.hasCompleted = true;
              resolve(resolutions);
            }
          }
        }
      }
    }

    async function executeNextHandler() {
      if (activity.hasCompleted) return;
      if (activity.executing === concurrency) return;
      if (activity.started === items.length) return;

      const index = activity.started++;
      const currentItem = items[index];
      activity.executing++;

      sandbox(() => (handler ? handler(currentItem, index) : currentItem)).then(
        (result) => {
          if (activity.hasCompleted) return;
          activity.executing--;
          activity.resolved++;
          resolutions[index] = result as T;

          evaluateCompletionCriteria();
          executeNextHandler();
        },
        (err) => {
          if (activity.hasCompleted) return;
          firstError = firstError || err;
          activity.executing--;
          activity.errored++;
          errors[index] = err;

          if (activity.errored > maxNumberOfErrors) {
            activity.hasCompleted = true;
            // @ts-ignore
            firstError.errors = errors;
            reject(firstError);
          } else executeNextHandler();
        }
      );

      executeNextHandler();
    }
  });
}

export default race;
