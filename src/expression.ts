import { Distributive } from './distributive';

export type CompareVariant =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessOrEqual'
  | 'greaterThan'
  | 'greaterOrEqual';

export type CompareExpr_ = {
  [C in CompareVariant]: {
    attr: string;
    value: string;
  };
};

export type CompareExpr = Distributive<
  CompareVariant,
  {
    attr: string;
    value: string;
  }
>;

export type BooleanExpr = Distributive<'and' | 'or', (BooleanExpr | CompareExpr | NotExpr)[]>;

export type NotExpr = { not: (BooleanExpr | CompareExpr)[] };

export type Expr = CompareExpr | BooleanExpr | NotExpr;
