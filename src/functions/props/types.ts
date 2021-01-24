export type IndigobirdPropsConfig = {
  /**
   * The number of handlers that are able to be executed simultaneously.
   * Default = 1
   */
  concurrency?: number;
};

export type IndigobirdPropsHandler<I, K> = {
  (currentItem: I, key: K): PromiseLike<any>;
  (currentItem: I, key: K): any;
}
