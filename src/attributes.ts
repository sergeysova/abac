export type AttributesDefinition = Record<string, AttributeType>;
export type AttributeType = 'String' | 'Int' | 'Double' | 'Boolean' | 'LocalTime';

type AttributeTypeMap = {
  String: string;
  Int: number;
  Double: number;
  Boolean: boolean;
  LocalTime: Date;
};

type AttributeJsType<T extends AttributeType> = AttributeTypeMap[T];

export type ParsedAttributes = Record<string, AttributeJsType<AttributeType>>;

export function parseValue(
  attribute: AttributeType,
  value: string,
): AttributeJsType<typeof attribute> | null {
  switch (attribute) {
    case 'String': {
      return value;
    }
    case 'Int': {
      const result = parseInt(value, 10);
      if (!Number.isFinite(result) || String(result) !== value) {
        return null;
      }
      return result;
    }
    case 'Double': {
      const result = parseFloat(value);
      if (!Number.isFinite(result) || String(result) !== value) {
        return null;
      }
      return result;
    }
    case 'Boolean': {
      switch (value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return null;
      }
    }
    case 'LocalTime': {
      if (Number.isNaN(Date.parse(value))) {
        return null;
      }
      return new Date(value);
    }
  }

  // @ts-expect-error If not all cases will be handled in switch, this should fail
  return null;
}
