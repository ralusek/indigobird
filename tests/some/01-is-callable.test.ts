import 'mocha';
import { expect } from 'chai';

import { some } from '../../lib';

describe('Invokation', () => {
  it('should be able to be executed.', () => {
    return some([5]);
  });
});
