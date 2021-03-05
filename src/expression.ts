import { AttributesDefinition, AttributeType, ParsedAttributes, parseValue } from './attributes';
import { Distributive } from './distributive';

export type CompareVariant =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessOrEqual'
  | 'greaterThan'
  | 'greaterOrEqual';

type AttrToValue = { attr: string; value: string };
type AttrToValues = { attr: string; values: string[] };
type AttrToAttr = { attr1: string; attr2: string };

export type CompareExpr = Distributive<CompareVariant, AttrToValue | AttrToAttr>;

/** Check several expressions */
export type BooleanExpr = Distributive<'and' | 'or', Expr[]>;

/** Check attribute to several values */
export type InExpr = { in: AttrToValues };

/** Invert comparison results, cannot nest not: { not: {} } */
export type NotExpr = { not: RegularExpr };

export type RegularExpr = CompareExpr | BooleanExpr | InExpr;

export type Expr = RegularExpr | NotExpr;

export function calculate(
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  expression: Expr,
): boolean {
  if (isNot(expression)) {
    return !calculate(attributes, context, expression.not);
  }
  if (isComparer(expression)) {
    const comparerName = Object.keys(expression)[0];
    const comparerFn = comparer[comparerName];
    return comparerFn(attributes, context, expression[comparerName]);
  }
  if (isAnd(expression)) {
    return expression.and
      .map((expr) => calculate(attributes, context, expr))
      .every((result) => result === true);
  }
  if (isOr(expression)) {
    for (const expr of expression.or) {
      const result = calculate(attributes, context, expr);
      if (result === false) return false;
    }
    return true;
  }
  if (isIn(expression)) {
    const type = attributeType(attributes, expression.in.attr);
    const attributeValue = attributeRead(context, expression.in.attr);
    const compareTo = expression.in.values.map((value) => parseValue(type, value));
    return compareTo.some((expected) => expected == attributeValue);
  }

  return false;
}

function isNot(e: Expr): e is NotExpr {
  return Boolean(e['not']);
}

type Comparer = (
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  expr: AttrToValue | AttrToAttr,
) => boolean;

const comparer: { [K in CompareVariant]: Comparer } = {
  equal: (attributes, context, expr) => {
    const { left, right } = extractValues(attributes, context, expr);
    return left == right;
  },
  notEqual: (attributes, context, expr) => {
    return !comparer.equal(attributes, context, expr);
  },
  lessThan: (attributes, context, expr) => {
    const { left, right } = extractValues(attributes, context, expr);
    return left < right;
  },
  lessOrEqual: (attributes, context, expr) => {
    const { left, right } = extractValues(attributes, context, expr);
    return left <= right;
  },
  greaterThan: (attributes, context, expr) => {
    const { left, right } = extractValues(attributes, context, expr);
    return left > right;
  },
  greaterOrEqual: (attributes, context, expr) => {
    const { left, right } = extractValues(attributes, context, expr);
    return left >= right;
  },
};

function isComparer(e: Expr): e is CompareExpr {
  return (
    e['equal'] ||
    e['notEqual'] ||
    e['lessThan'] ||
    e['lessOrEqual'] ||
    e['greaterThan'] ||
    e['greaterOrEqual'] ||
    false
  );
}

function isComparedToValue(e: AttrToValue | AttrToAttr): e is AttrToValue {
  return e['attr'] && e['value'];
}

function extractValues(
  attributes: AttributesDefinition,
  context: ParsedAttributes,
  expr: AttrToValue | AttrToAttr,
): { left: any; right: any } {
  if (isComparedToValue(expr)) {
    const left = attributeRead(context, expr.attr);
    // Here we need type just to parse value as same as attribute
    const type = attributeType(attributes, expr.attr);
    const right = parseValue(type, expr.value);
    return { left, right };
  }

  const left = attributeRead(context, expr.attr1);
  const right = attributeRead(context, expr.attr2);
  return { left, right };
}

function attributeRead(context: ParsedAttributes, name: string): unknown {
  return context[name];
}

function attributeType(attributes: AttributesDefinition, name: string): AttributeType {
  return attributes[name];
}

function isAnd(e: Expr): e is { and: Expr[] } {
  return Boolean(e['and']);
}

function isOr(e: Expr): e is { or: Expr[] } {
  return Boolean(e['or']);
}

function isIn(e: Expr): e is InExpr {
  return Boolean(e['in']);
}
