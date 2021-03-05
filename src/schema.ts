import { AttributeType } from './attributes';
import { CombiningAlgorithm } from './algorithm';
import { Policy } from 'policy';

export type Attributes = Record<string, AttributeType>;

export type Schema = {
  attributes: Attributes;
  globalPolicy: {
    [A in CombiningAlgorithm]: Policy[];
  };
};
