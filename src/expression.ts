import { Distributive } from './distributive';

export type CompareVariant =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessOrEqual'
  | 'greaterThan'
  | 'greaterOrEqual';

type AttrToValue = { attr: string; value: string };
type AttrToValues = { attr: string; values: string[] };
type AttrToAttr = { attr1: string; attr2: string };

export type CompareExpr = Distributive<CompareVariant, AttrToValue | AttrToAttr>;

/** Check several expressions */
export type BooleanExpr = Distributive<'and' | 'or', Expr[]>;

/** Check attribute to several values */
export type InExpr = { in: AttrToValues };

/** Invert comparison results, cannot nest not: { not: {} } */
export type NotExpr = { not: RegularExpr };

export type RegularExpr = CompareExpr | BooleanExpr | InExpr;

export type Expr = RegularExpr | NotExpr;
