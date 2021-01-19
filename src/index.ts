interface Schema {
  attributes: {};
  policies: {};
  rules?: [];
}

export function check(attributes: Record<string, string>, schema: Schema): boolean {
  return false;
}
