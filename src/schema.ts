export interface Schema {
  attributes: {};
  policies: Policies;
  rules?: Record<string, Rule>;
}

export type Policies = {
  denyUnlessPermit?: Policy[];
  permitUnlessDeny?: Policy[];
  firstApplicable?: Policy[];
};

export type Effect = 'PERMIT' | 'DENY';

export type Policy = PolicyEffect | PolicyNested;

export type Ref = RefAttr & RefLiteral & RefLiteralList & RefList;
export type RefAttr = { attr?: string };
export type RefLiteral = { value?: string | number | boolean };
export type RefLiteralList = { values?: Array<string | number | boolean> };
export type RefList = { list?: Array<RefAttr | RefLiteral> };

export interface PolicyEffect {
  name: String;
  if?: Rule;
  effect: Effect;
}

export interface PolicyNested {
  name: String;
  if?: Rule;
  policies: Policies;
}

export type Rule = {
  use?: string;
  check?: Check;
  and?: Array<Rule>;
  or?: Array<Rule>;
  not?: Rule;
};

export type Func = FuncEquality | FuncList;

export type FuncEquality = {
  '='?: Ref;
  '!='?: Ref;
  '>'?: Ref;
  '>='?: Ref;
  '<'?: Ref;
  '<='?: Ref;
};

export type FuncList = {
  includes?: Ref;
  in?: Ref;
};

export type Check = Ref & Func & CheckAnd & CheckOr & CheckNot;

export type CheckAnd = {
  and?: Array<Func & CheckNot>;
};
export type CheckOr = {
  or?: Array<Func & CheckNot>;
};

export type CheckNot = { not?: Func & CheckAnd & CheckOr };

export function isPolicyNested(policy?: Policy): policy is PolicyNested {
  return typeof policy?.['policies'] !== 'undefined';
}

export function isPolicyEffect(policy?: Policy): policy is PolicyEffect {
  return typeof policy?.['effect'] === 'string';
}
