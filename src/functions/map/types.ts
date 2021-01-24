type Resolution<T> = T extends PromiseLike<infer U> ? U : T;

export type IndigobirdMapConfig = {
  /**
   * The number of handlers that are able to be executed simultaneously.
   * Default = 1
   */
  concurrency?: number;
};

export type IndigobirdMapHandler<T, I, K> = {
  (currentItem: I, key: K): PromiseLike<T>;
  (currentItem: I, key: K): T;
}