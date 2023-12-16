import 'mocha';
import { expect } from 'chai';

import { any } from '../../lib';

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Race of already executing promises', () => {
  it('Should return the first to complete when all complete successfully', async () => {
    const resolved = [false, false, false];
    const promises = [
      wait(200).then(() => {
        resolved[0] = true;
        return 1;
      }),
      wait(100).then(() => {
        resolved[1] = true;
        return 2;
      }),
      wait(300).then(() => {
        resolved[2] = true;
        return 3;
      }),
    ];
    const result = await any(promises);

    expect(result).to.deep.equal(2);
    expect(resolved).to.deep.equal([false, true, false]);
  });

  it('Should return the first to complete when others error', async () => {
    const resolved = [false, false, false];
    const promises = [
      wait(200).then(() => {
        throw new Error('Test error');
      }),
      wait(100).then(() => {
        resolved[1] = true;
        return 2;
      }),
      wait(300).then(() => {
        throw new Error('Test error');
      }),
    ];
    const result = await any(promises);

    expect(result).to.deep.equal(2);
    expect(resolved).to.deep.equal([false, true, false]);
  });

  it('Should return the first to complete successfully when others have failed', async () => {
    const resolved = [false, false, false];
    const promises = [
      wait(100).then(() => {
        throw new Error('Test error');
      }),
      wait(200).then(() => {
        throw new Error('Test error');
      }),
      wait(300).then(() => {
        resolved[2] = true;
        return 3;
      }),
    ];
    const result = await any(promises);

    expect(result).to.deep.equal(3);
    expect(resolved).to.deep.equal([false, false, true]);
  });

  it('Should error when it is not possible for any to resolve successfully, i.e. all fail', async () => {
    const resolved = [false, false, false];
    const promises = [
      wait(100).then(() => {
        throw new Error('Test error');
      }),
      wait(200).then(() => {
        throw new Error('Test error');
      }),
      wait(300).then(() => {
        throw new Error('Test error');
      }),
    ];

    let didError = false;
    let error: Error | undefined;

    const result = await any(promises)
    .catch(err => {
      didError = true;
      error = err;
    });

    expect(resolved).to.deep.equal([false, false, false]);
    expect(didError).to.be.true;
    expect(error).to.be.instanceOf(Error);
    expect(result).to.be.undefined;
    expect(error!.message).to.equal('Test error');
  });
});
