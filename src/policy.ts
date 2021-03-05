import { Expr } from './expression';
import { Rule } from './rule';
import { CombiningAlgorithm } from './algorithm';
import { Distributive } from 'distributive';

export type Policy = {
  policy: {
    name: string;
    target: Expr;
  } & Distributive<CombiningAlgorithm, Rule[]>;
};
