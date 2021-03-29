import 'mocha';
import { expect } from 'chai';

import indigobird from '../../lib';

const peopleGreetings = {
  john: 'hi',
  jim: 'yo',
  phil: 'sup',
} as const;

type PeopleGreetings = typeof peopleGreetings;

type ResultType = {[K in keyof PeopleGreetings]: { greeting: PeopleGreetings[K] }};

describe('Invocation', () => {
  it('should be able to specify return type.', async () => {
    console.log('indigobird', indigobird);
    // const result: ResultType = await indigobird.map(peopleGreetings, (greeting, personName) => {
    //   return Promise.resolve({ greeting });
    // });
  });
});
