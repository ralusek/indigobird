// Types
import { OptionalKeys, NonOptionalKeys } from 'types';
import { IndigobirdMapConfig, IndigobirdMapHandler } from './types';
import { IndigobirdAllHandler } from '../all/types';

// Functions
import all from '../all';

async function map<
  T, // Individual Prop Result Type
  O extends { [key in string | symbol | number]: I }, // Input object type
  K extends keyof O, // Key of input object
  I,
  // This is the full result object. We maintain optional props in input type as optional types in output type.
  // Otherwise this would be represented as { [P in K]: T }, which causes the return type to assume all optional
  // props in O are non-optional in R.
  R extends { [P in Exclude<K, | OptionalKeys<O>>]: T } & Partial<{ [P in Exclude<K, | NonOptionalKeys<O>>]: T }>
>(
  items: O,
  handler?: IndigobirdMapHandler<T, I, K>,
  config: IndigobirdMapConfig = {}
): Promise<R> {
  const keys: K[] = Object.keys(items) as K[];
  const values = keys.reduce((arr: I[], key) => {
    arr.push(items[key]);
    return arr;
  }, []);

  // Wrap the handler so as to pass in the corresponding key, rather
  // than the corresponding index.
  const wrappedHandler: IndigobirdAllHandler<T, I> | undefined = handler
    ? (item, index) => handler(item, keys[index])
    : undefined;

  const results = await all(values, wrappedHandler, config);

  return results.reduce((agg: R, result, i) => {
    const key = keys[i];
    // @ts-ignore
    agg[key] = result;
    return agg;
  }, {} as R);
}

export default map;


type FundNames = 'unknownWorldsSubnauticaPin' | 'jokerHospital';
type TokenNames = 'bruceWayne' | 'alfred' | 'theJoker';

type CommentData = {
  content: string;
  user: TokenNames;
  children?: CommentData[];
};

export type Optionalize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const data: {
  [key in FundNames]: CommentData[];
} = {
  unknownWorldsSubnauticaPin: [
    {
      content: 'Dude, this would be so nice. I seriously IMMEDIATELY forget the recipe for what I\'m trying to build.',
      user: 'alfred',
      children: [
        {
          content: 'That\'s what I BEEN sayin, my guy.',
          user: 'bruceWayne',
        },
        {
          content: 'You should probably get that checked.',
          user: 'theJoker',
        },
      ],
    },
    {
      content: 'Even if this was a problem for me, they\'re not going to change this. The game is already out, they\'re literally about to release the sequel.',
      user: 'theJoker',
    },
  ],
  jokerHospital: [],
};

map(data, (hi, key) => {
  hi
  const x = data[key];
  x.push()
  return Promise.resolve(key);
})
.then(result => {
  result.unknownWorldsSubnauticaPin.length;
  result.jokerHospital.length;
})
