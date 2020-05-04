import 'mocha';
import { expect } from 'chai';

import indigobird from '../../lib';

describe('Invokation', () => {
  it('should be able to be executed.', () => {
    console.log('indigobird', indigobird);
    return indigobird.props({
      hey: 'sup',
    });
  });
});
