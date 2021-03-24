import { Effect } from './desicion';
import { Expr } from './expression';

export type Rule = {
  rule: {
    name: string;
    target: Expr;
    effect: Effect;
  };
};
