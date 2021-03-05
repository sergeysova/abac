import { calculate, Expr } from './expression';
import { Rule } from './rule';
import { CombiningAlgorithm } from './algorithm';
import { Distributive } from './distributive';
import { AttributesDefinition, ParsedAttributes } from './attributes';
import { Decision } from './desicion';

export type Policy = {
  policy: {
    name: string;
    target: Expr;
  } & Distributive<CombiningAlgorithm, Rule[]>;
};

export function isApplicable(
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  applicable: Policy,
): boolean {
  return calculate(attributes, context, applicable.policy.target);
}

export function calculateRules(
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  policy: Policy,
): Decision {
  const { name, target, ...algo } = policy.policy;

  return 'DENY';
}
