import 'mocha';
import { expect } from 'chai';

import { props } from '../../lib';

describe('Invokation', () => {
  it('should be able to be executed.', () => {
    return props({
      hey: 'sup',
    });
  });
});
