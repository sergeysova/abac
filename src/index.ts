import { parseValue } from './attributes';

const d = parseValue('Boolean', 'true');

export function check(attributesObject: AttributesObjects, schema: Schema): Effect {
  const attributes = filterAttributes(flattenAttributes(attributesObject), schema);
  return 'DENY';
}
