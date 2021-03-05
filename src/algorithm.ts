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
  isApplicable(): boolean;
  calculate(): Decision;
}

type Algorithm<T extends Applicable> = (
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  applicables: T[],
) => Decision;

export const algorithm: { [K in CombiningAlgorithm]: Algorithm<any> } = {
  denyOverrides: (attributes, context, applicables) => 'DENY',
  denyUnlessPermit: (attributes, context, applicables) => 'DENY',
  firstApplicable: (attributes, context, applicables) => {
    const applicable = applicables.find((appl) => appl.isApplicable(attributes, context, appl));
    if (applicable) {
      // Calculate desicion
    }

    return 'NOT_APPLICABLE';
  },
  onlyOneApplicable: (attributes, context, applicables) => {
    const found = applicables.filter((appl) => appl.isApplicable(attributes, context, appl));
    if (found.length !== 1) return 'DENY';

    // Calculate desicion
    return 'DENY';
  },
  permitOverrides: (attributes, context, applicables) => 'DENY',
  permitUnlessDeny: (attributes, context, applicables) => 'DENY',
};

export function extractAlgorithm() {}
