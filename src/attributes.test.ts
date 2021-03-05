import { parseValue } from './attributes';

test('Int', () => {
  expect(parseValue('Int', '123')).toBe(123);
  expect(parseValue('Int', '-123')).toBe(-123);
  expect(parseValue('Int', '0')).toBe(0);

  expect(parseValue('Int', '')).toBe(null);
  expect(parseValue('Int', 'abc')).toBe(null);
  expect(parseValue('Int', '1.1')).toBe(null);
  expect(parseValue('Int', 'Infinity')).toBe(null);
  expect(parseValue('Int', 'NaN')).toBe(null);
});

test('Double', () => {
  expect(parseValue('Double', '123')).toBe(123);
  expect(parseValue('Double', '-123')).toBe(-123);
  expect(parseValue('Double', '0')).toBe(0);
  expect(parseValue('Double', '1.1')).toBe(1.1);
  expect(parseValue('Double', '-1.1')).toBe(-1.1);
  expect(parseValue('Double', '1.10000000001')).toBe(1.10000000001);

  expect(parseValue('Double', '')).toBe(null);
  expect(parseValue('Double', 'abc')).toBe(null);
  expect(parseValue('Double', 'Infinity')).toBe(null);
  expect(parseValue('Double', 'NaN')).toBe(null);
});

test('String', () => {
  expect(parseValue('String', '')).toBe('');
  expect(parseValue('String', '123')).toBe('123');
  expect(parseValue('String', '-123')).toBe('-123');
  expect(parseValue('String', '0')).toBe('0');
  expect(parseValue('String', '1.1')).toBe('1.1');
  expect(parseValue('String', '-1.1')).toBe('-1.1');
  expect(parseValue('String', '1.10000000001')).toBe('1.10000000001');
  expect(parseValue('String', 'abc')).toBe('abc');
  expect(parseValue('String', 'Infinity')).toBe('Infinity');
  expect(parseValue('String', 'NaN')).toBe('NaN');
});

test('Boolean', () => {
  expect(parseValue('Boolean', 'true')).toBe(true);
  expect(parseValue('Boolean', 'false')).toBe(false);

  expect(parseValue('Boolean', '')).toBe(null);
  expect(parseValue('Boolean', 'True')).toBe(null);
  expect(parseValue('Boolean', 'False')).toBe(null);
  expect(parseValue('Boolean', 'On')).toBe(null);
  expect(parseValue('Boolean', 'Off')).toBe(null);
  expect(parseValue('Boolean', '1')).toBe(null);
  expect(parseValue('Boolean', '0')).toBe(null);
});

test('LocalTime', () => {
  expect(parseValue('LocalTime', '2019-01-09')).toEqual(new Date('2019-01-09'));
  expect(parseValue('LocalTime', '2020-01-01T10:30:00')).toEqual(new Date('2020-01-01T10:30:00'));
  expect(parseValue('LocalTime', '1')).toEqual(new Date('2000-12-31T21:00:00.000Z'));
  expect(parseValue('LocalTime', '0')).toEqual(new Date('1999-12-31T21:00:00.000Z'));

  expect(parseValue('LocalTime', '')).toBe(null);
  expect(parseValue('LocalTime', 'True')).toBe(null);
  expect(parseValue('LocalTime', 'False')).toBe(null);
  expect(parseValue('LocalTime', 'On')).toBe(null);
  expect(parseValue('LocalTime', 'Off')).toBe(null);
});
