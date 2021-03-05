import { Schema } from './schema';
import { Decision, Effect } from './desicion';
import { parseContext } from './attributes';
import { compileAlgorithm } from './algorithm';
import { isApplicable } from './policy';
import { calculate } from './expression';

type Context = Record<string, string>;

export function check(context: Context, schema: Schema): Decision {
  const parsedContext = parseContext(context, schema.attributes);
  const desicion = compileAlgorithm(schema.globalPolicy, {
    isApplicable(policy) {
      return isApplicable(schema.attributes, parsedContext, policy);
    },
    calculate({ policy }) {
      return compileAlgorithm(policy, {
        isApplicable(rule) {
          return calculate(schema.attributes, parsedContext, rule.rule.target);
        },
        calculate(rule) {
          return rule.rule.effect;
        },
      });
    },
  });
  return desicion;
}
