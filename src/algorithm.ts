import { ParsedAttributes, AttributesDefinition } from './attributes';
import { Decision } from './desicion';

export type CombiningAlgorithm =
  | 'denyOverrides'
  | 'denyUnlessPermit'
  | 'firstApplicable'
  | 'onlyOneApplicable'
  | 'permitOverrides'
  | 'permitUnlessDeny';

export interface Applicable {
  isApplicable(attributes: AttributesDefinition, context: ParsedAttributes): boolean;
  calculate(attributes: AttributesDefinition, context: ParsedAttributes): Decision;
}

type Algorithm = (
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  applicables: Applicable[],
) => Decision;

export const algorithm: { [K in CombiningAlgorithm]: Algorithm } = {
  denyOverrides: (attributes, context, applicables) => {
    let latest: Decision = 'NOT_APPLICABLE';
    for (const applicable of applicables) {
      if (applicable.isApplicable(attributes, context)) {
        latest = applicable.calculate(attributes, context);
        if (latest === 'DENY') return 'DENY';
      }
    }
    return latest;
  },
  denyUnlessPermit: (attributes, context, applicables) => {
    for (const applicable of applicables) {
      if (applicable.isApplicable(attributes, context)) {
        const desicion = applicable.calculate(attributes, context);
        if (desicion === 'PERMIT') return 'PERMIT';
      }
    }
    return 'DENY';
  },
  firstApplicable: (attributes, context, applicables) => {
    const applicable = applicables.find((appl) => appl.isApplicable(attributes, context));
    if (applicable) {
      return applicable.calculate(attributes, context);
    }

    return 'NOT_APPLICABLE';
  },
  onlyOneApplicable: (attributes, context, applicables) => {
    const found = applicables.filter((appl) => appl.isApplicable(attributes, context));
    if (found.length !== 1) return 'DENY';
    return found[0].calculate(attributes, context);
  },
  permitOverrides: (attributes, context, applicables) => {
    let latest: Decision = 'NOT_APPLICABLE';
    for (const applicable of applicables) {
      if (applicable.isApplicable(attributes, context)) {
        latest = applicable.calculate(attributes, context);
        if (latest === 'PERMIT') return 'PERMIT';
      }
    }
    return latest;
  },
  permitUnlessDeny: (attributes, context, applicables) => {
    for (const applicable of applicables) {
      if (applicable.isApplicable(attributes, context)) {
        const desicion = applicable.calculate(attributes, context);
        if (desicion === 'DENY') return 'DENY';
      }
    }
    return 'PERMIT';
  },
};
