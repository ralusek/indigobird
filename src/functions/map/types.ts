export type IndigobirdMapConfig = {
  /**
   * The number of handlers that are able to be executed simultaneously.
   * Default = 1
   */
  concurrency?: number;
};

export type IndigobirdMapHandler<T, O, K extends keyof O> = (currentItem: O[K], key: K) => T | PromiseLike<T>;
