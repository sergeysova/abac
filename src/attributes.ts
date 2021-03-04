type AttributeType = 'String' | 'Int' | 'Double' | 'Boolean' | 'LocalTime';

type AttributeTypeMap = {
  String: string;
  Int: number;
  Double: number;
  Boolean: boolean;
  LocalTime: Date;
};

type AttributeJsType<T extends AttributeType> = AttributeTypeMap[T];

export function parseValue(attribute: 'String', value: string): AttributeJsType<'String'> | null;
export function parseValue(attribute: 'Int', value: string): AttributeJsType<'Int'> | null;
export function parseValue(attribute: 'Double', value: string): AttributeJsType<'Double'> | null;
export function parseValue(attribute: 'Boolean', value: string): AttributeJsType<'Boolean'> | null;
export function parseValue(attribute: 'LocalTime', value: string): AttributeJsType<'LocalTime'> | null;
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
      if (Number.isNaN(result)) {
        return null;
      }
      return result;
    }
    case 'Double': {
      const result = parseFloat(value);
      if (Number.isNaN(result)) {
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
