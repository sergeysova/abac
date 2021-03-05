import { AttributesDefinition } from './attributes';
import { CombiningAlgorithm } from './algorithm';
import { Policy } from './policy';
import { Distributive } from './distributive';
import { Rule } from './rule';

export type Schema = {
  attributes: AttributesDefinition;
  globalPolicy: Distributive<CombiningAlgorithm, (Policy | Rule)[]>;
};
