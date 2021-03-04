import { Schema } from './schema';

type Value = string | number | boolean | Array<string | number | boolean>;
export type AttributesObjects = { [key: string]: Value | AttributesObjects };
export type AttributesFlat = Record<string, Value>;

export function flattenAttributes(attributes: AttributesObjects, parentKey?: string): AttributesFlat {
  const map = {};
  for (const key in attributes) {
    const resultKey = parentKey ? `${parentKey}.${key}` : key;
    const value = attributes[key];
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(map, flattenAttributes(value, resultKey));
    } else {
      map[resultKey] = attributes[key];
    }
  }
  return map;
}

/**
 * Return only attributes exits in schema
 */
export function filterAttributes(attributes: AttributesFlat, schema: Schema): AttributesFlat {
  const finalAttributes = {};
  for (const key in schema.attributes) {
    if (typeof schema.attributes[key] !== 'undefined') {
      finalAttributes[key] = attributes[key];
    }
  }
  return finalAttributes;
}
