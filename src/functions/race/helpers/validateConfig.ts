// Types
import { IndigobirdRaceConfig } from '../types';

// Constants
import { RACE_AMOUNT_CONDITIONAL_TYPE } from '../constants';

export default async function validateConfig({ concurrency, amount }: Required<IndigobirdRaceConfig>, itemLength: number) {
  if (concurrency < 1)
    return Promise.reject(new Error('Cannot execute indigobird.race, provided concurrency cannot be less than 1.'));
  if (typeof amount === 'number') {
    if (amount > itemLength) {
      return Promise.reject(
        new Error(
          `Cannot execute indigobird.race, provided amount (${amount}) necessary to resolve cannot exceed the amount of provided items (${itemLength}).`
        )
      );
    }
  } else {
    if (amount.type === RACE_AMOUNT_CONDITIONAL_TYPE.AND) {
      if ((amount.resolved + amount.rejected) > itemLength) {
        return Promise.reject(
          new Error(
            `Cannot execute indigobird.race, race amount specified requires that ${amount.resolved} AND ${amount.rejected} must be resolved/rejected repectively, totalling ${ amount.resolved + amount.rejected }, whereas there are only ${ itemLength } to process.`
          )
        );
      }
    } else {
      if (Math.max(amount.resolved, amount.rejected) > itemLength) {
        return Promise.reject(
          new Error(
            `Cannot execute indigobird.race, race amount specified requires that ${amount.resolved} OR ${amount.rejected} must be resolved/rejected repectively, totalling whereas there are only ${ itemLength } to process. Neither amount may exceed total.`
          )
        );
      }
    }
  }
}
