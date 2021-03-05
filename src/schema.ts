import { AttributeType } from './attributes';
import { CombiningAlgorithm } from './algorithm';
import { Policy } from './policy';
import { Distributive } from './distributive';

export type Attributes = Record<string, AttributeType>;

export type Schema = {
  attributes: Attributes;
  globalPolicy: Distributive<CombiningAlgorithm, Policy[]>;
};
