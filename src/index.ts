import { Schema } from './schema';
import { Decision } from './desicion';
import { AttributesDefinition, parseContext, ParsedAttributes } from './attributes';
import { AlgorithmObject, compileAlgorithm } from './algorithm';
import { isPolicy, Policy } from './policy';
import { calculate } from './expression';
import { Rule } from './rule';

type Context = Record<string, string>;
export type { Schema, AttributesDefinition, Policy, Rule };
export type AttributesValues = ParsedAttributes;

function compile(
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  algos: AlgorithmObject<Policy | Rule>,
): Decision {
  return compileAlgorithm(algos, {
    isApplicable(set) {
      if (isPolicy(set)) return calculate(attributes, context, set.policy.target);
      return calculate(attributes, context, set.rule.target);
    },
    calculate(set) {
      if (isPolicy(set)) {
        return compile(attributes, context, set.policy);
      }

      if (calculate(attributes, context, set.rule.target)) {
        return set.rule.effect;
      }

      return 'NOT_APPLICABLE';
    },
  });
}

export function check(context: Context, schema: Schema): Decision {
  const contextParsed = parseContext(context, schema.attributes);
  return compile(schema.attributes, contextParsed, schema.globalPolicy);
}
