import { Schema } from './schema';
import { Effect } from './desicion';
export type AttributesObject = Record<string, string>;

export function check(attributesObject: AttributesObject, schema: Schema): Effect {
  return 'DENY';
}
