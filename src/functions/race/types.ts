// Constants
import { RACE_AMOUNT_CONDITIONAL_TYPE } from './constants';

export type RaceAmountConditionalType = typeof RACE_AMOUNT_CONDITIONAL_TYPE[keyof typeof RACE_AMOUNT_CONDITIONAL_TYPE];

export type IndigobirdRaceConfig = {
  /**
   * The number of handlers that are able to be executed simultaneously.
   * Default = 1
   */
  concurrency?: number;
  /**
   * The number of handlers which need to cummulatively resolve or reject
   * in order for the race to be resolved. If specified as a number, will
   * simply accept either rejections or resolutions towards total amount,
   * but if specified as a config object, can specify the amount that must
   * be resolved or the amount that much be rejected in order for the
   * race to be resolved.
   * Default = 1
   */
  amount?: number | {
    /**
     * The number of handlers which need to specifically resolve successfully
     * in order for the race to be resolved.
     */
    resolved: number;
    /**
     * The number of handlers which need to specifically be rejected
     * in order for the race to be resolved.
     */
    rejected: number;
    /**
     * Whether or not the resolved/rejected amount criteria must either or both be
     * satisfied in order for the race to be resolved.
     * Default = 'or'
     */
    type: RaceAmountConditionalType;
  };
};

export type IndigobirdRaceHandler<T, I> = (currentItem: I, index: number) => T | PromiseLike<T>;
