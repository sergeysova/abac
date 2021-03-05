export type Distributive<Keys extends string, Value> = {
  [K in Keys]: Record<K, Value>;
}[Keys];
