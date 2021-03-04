import { AttributesFlat } from 'attributes';
import { evaluate } from './rules';
import { Rule, Schema } from './schema';

type Line = [AttributesFlat, Rule, boolean];

describe('check', () => {
  describe('equals', () => {
    const schema: Schema = {
      attributes: {
        'subject.role': 'String',
      },
      policies: { denyUnlessPermit: [] },
      rules: {},
    };

    describe('equals', () => {
      test.each([
        [{}, { check: { value: 'Manager', '=': { value: 'Manager' } } }, true],
        [{}, { check: { value: 'Manager', '=': { value: 'HR' } } }, false],
        [{ 'subject.role': 'Manager' }, { check: { value: 'Manager', '=': { attr: 'subject.role' } } }, true],
        [{ 'subject.role': 'HR' }, { check: { value: 'Manager', '=': { attr: 'subject.role' } } }, false],
      ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
        expect(evaluate(attrs, rule, schema)).toBe(expected);
      });
    });

    describe('not equals', () => {
      test.each([
        [{}, { check: { value: 'Manager', '!=': { value: 'Manager' } } }, false],
        [{}, { check: { value: 'Manager', '!=': { value: 'HR' } } }, true],
        [
          { 'subject.role': 'Manager' },
          { check: { value: 'Manager', '!=': { attr: 'subject.role' } } },
          false,
        ],
        [{ 'subject.role': 'HR' }, { check: { value: 'Manager', '!=': { attr: 'subject.role' } } }, true],
      ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
        expect(evaluate(attrs, rule, schema)).toBe(expected);
      });
    });
  });

  describe('math operators', () => {
    const schema: Schema = {
      attributes: { 'a.a': 'Number', 'a.b': 'Number' },
      policies: { firstApplicable: [] },
      rules: {},
    };

    describe('value with value', () => {
      test.each([
        [{ check: { value: 0, '>': { value: -1 } } }, true],
        [{ check: { value: 1, '>': { value: 2 } } }, false],

        [{ check: { value: 0, '>=': { value: 0 } } }, true],
        [{ check: { value: 1, '>=': { value: 0 } } }, true],
        [{ check: { value: 1, '>=': { value: 2 } } }, false],

        [{ check: { value: 0, '<=': { value: 0 } } }, true],
        [{ check: { value: 0, '<=': { value: 1 } } }, true],
        [{ check: { value: 1, '<=': { value: 0 } } }, false],

        [{ check: { value: 0, '<': { value: 1 } } }, true],
        [{ check: { value: 1, '<': { value: 0 } } }, false],
      ] as Array<[Rule, boolean]>)('(%o) %o should be %p', (rule, expected) => {
        expect(evaluate({}, rule, schema)).toBe(expected);
      });
    });

    describe('value with attribute', () => {
      test.each([
        [{ 'a.b': -1 }, { check: { value: 0, '>': { attr: 'a.b' } } }, true],
        [{ 'a.b': 2 }, { check: { value: 1, '>': { attr: 'a.b' } } }, false],

        [{ 'a.b': 0 }, { check: { value: 0, '>=': { attr: 'a.b' } } }, true],
        [{ 'a.b': 0 }, { check: { value: 1, '>=': { attr: 'a.b' } } }, true],
        [{ 'a.b': 2 }, { check: { value: 1, '>=': { attr: 'a.b' } } }, false],

        [{ 'a.b': 0 }, { check: { value: 0, '<=': { attr: 'a.b' } } }, true],
        [{ 'a.b': 1 }, { check: { value: 0, '<=': { attr: 'a.b' } } }, true],
        [{ 'a.b': 0 }, { check: { value: 1, '<=': { attr: 'a.b' } } }, false],

        [{ 'a.b': 1 }, { check: { value: 0, '<': { attr: 'a.b' } } }, true],
        [{ 'a.b': 0 }, { check: { value: 1, '<': { attr: 'a.b' } } }, false],
      ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
        expect(evaluate(attrs, rule, schema)).toBe(expected);
      });
    });

    describe('attribute with value', () => {
      test.each([
        [{ 'a.b': 0 }, { check: { attr: 'a.b', '>': { value: -1 } } }, true],
        [{ 'a.b': 1 }, { check: { attr: 'a.b', '>': { value: 2 } } }, false],

        [{ 'a.b': 0 }, { check: { attr: 'a.b', '>=': { value: 0 } } }, true],
        [{ 'a.b': 1 }, { check: { attr: 'a.b', '>=': { value: 0 } } }, true],
        [{ 'a.b': 1 }, { check: { attr: 'a.b', '>=': { value: 2 } } }, false],

        [{ 'a.b': 0 }, { check: { attr: 'a.b', '<=': { value: 0 } } }, true],
        [{ 'a.b': 0 }, { check: { attr: 'a.b', '<=': { value: 1 } } }, true],
        [{ 'a.b': 1 }, { check: { attr: 'a.b', '<=': { value: 0 } } }, false],

        [{ 'a.b': 0 }, { check: { attr: 'a.b', '<': { value: 1 } } }, true],
        [{ 'a.b': 1 }, { check: { attr: 'a.b', '<': { value: 0 } } }, false],
      ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
        expect(evaluate(attrs, rule, schema)).toBe(expected);
      });
    });

    describe('attribute with attribute', () => {
      test.each([
        [{ 'a.a': 0, 'a.b': -1 }, { check: { attr: 'a.a', '>': { attr: 'a.b' } } }, true],
        [{ 'a.a': 1, 'a.b': 2 }, { check: { attr: 'a.a', '>': { attr: 'a.b' } } }, false],

        [{ 'a.a': 0, 'a.b': 0 }, { check: { attr: 'a.a', '>=': { attr: 'a.b' } } }, true],
        [{ 'a.a': 1, 'a.b': 0 }, { check: { attr: 'a.a', '>=': { attr: 'a.b' } } }, true],
        [{ 'a.a': 1, 'a.b': 2 }, { check: { attr: 'a.a', '>=': { attr: 'a.b' } } }, false],

        [{ 'a.a': 0, 'a.b': 0 }, { check: { attr: 'a.a', '<=': { attr: 'a.b' } } }, true],
        [{ 'a.a': 0, 'a.b': 1 }, { check: { attr: 'a.a', '<=': { attr: 'a.b' } } }, true],
        [{ 'a.a': 1, 'a.b': 0 }, { check: { attr: 'a.a', '<=': { attr: 'a.b' } } }, false],

        [{ 'a.a': 0, 'a.b': 1 }, { check: { attr: 'a.a', '<': { attr: 'a.b' } } }, true],
        [{ 'a.a': 1, 'a.b': 0 }, { check: { attr: 'a.a', '<': { attr: 'a.b' } } }, false],
      ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
        expect(evaluate(attrs, rule, schema)).toBe(expected);
      });
    });
  });

  describe('includes function', () => {
    const schema: Schema = {
      attributes: { 'some.list': 'Array', 'some.item': 'String' },
      policies: { firstApplicable: [] },
      rules: {},
    };

    test.each([
      [{ 'some.list': ['a', 'b'] }, { check: { attr: 'some.list', includes: { value: 'a' } } }, true],
      [{ 'some.list': ['a', 'b'] }, { check: { attr: 'some.list', includes: { value: 'c' } } }, false],
      [
        { 'some.list': ['a', 'b'], 'some.item': 'b' },
        { check: { attr: 'some.list', includes: { attr: 'some.item' } } },
        true,
      ],
      [
        { 'some.list': ['a', 'b'], 'some.item': 'c' },
        { check: { attr: 'some.list', includes: { attr: 'some.item' } } },
        false,
      ],
      [{ 'some.item': 'b' }, { check: { values: ['a', 'b'], includes: { attr: 'some.item' } } }, true],
      [{ 'some.item': 'c' }, { check: { values: ['a', 'b'], includes: { attr: 'some.item' } } }, false],
    ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
      expect(evaluate(attrs, rule, schema)).toBe(expected);
    });
  });

  describe('in function', () => {
    const schema: Schema = {
      attributes: { 'some.list': 'Array', 'some.item': 'String' },
      policies: { firstApplicable: [] },
      rules: {},
    };

    test.each([
      [{ 'some.list': ['a', 'b'] }, { check: { value: 'a', in: { attr: 'some.list' } } }, true],
      [{ 'some.list': ['a', 'b'] }, { check: { value: 'c', in: { attr: 'some.list' } } }, false],
      [
        { 'some.list': ['a', 'b'], 'some.item': 'b' },
        { check: { attr: 'some.item', in: { attr: 'some.list' } } },
        true,
      ],
      [
        { 'some.list': ['a', 'b'], 'some.item': 'c' },
        { check: { attr: 'some.item', in: { attr: 'some.list' } } },
        false,
      ],
      [{ 'some.item': 'b' }, { check: { attr: 'some.item', in: { values: ['a', 'b'] } } }, true],
      [{ 'some.item': 'c' }, { check: { attr: 'some.item', in: { values: ['a', 'b'] } } }, false],
    ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
      expect(evaluate(attrs, rule, schema)).toBe(expected);
    });
  });

  describe('not function', () => {
    const schema: Schema = {
      attributes: { 'some.list': 'Array', 'some.item': 'String', 'a.a': 'Number', 'a.b': 'Number' },
      policies: { firstApplicable: [] },
      rules: {},
    };

    test.each([
      [{ 'some.list': ['a', 'b'] }, { check: { value: 'a', not: { in: { attr: 'some.list' } } } }, false],
      [
        { 'some.list': ['a', 'b'], 'some.item': 'c' },
        { check: { attr: 'some.item', not: { in: { attr: 'some.list' } } } },
        true,
      ],
      [{ 'some.item': 'b' }, { check: { attr: 'some.item', not: { in: { values: ['a', 'b'] } } } }, false],

      [
        { 'some.list': ['a', 'b'] },
        { check: { attr: 'some.list', not: { includes: { value: 'c' } } } },
        true,
      ],
      [
        { 'some.list': ['a', 'b'], 'some.item': 'b' },
        { check: { attr: 'some.list', not: { includes: { attr: 'some.item' } } } },
        false,
      ],
      [
        { 'some.item': 'b' },
        { check: { values: ['a', 'b'], not: { includes: { attr: 'some.item' } } } },
        true,
      ],

      [{ 'a.a': 0, 'a.b': 1 }, { check: { attr: 'a.a', not: { '<=': { attr: 'a.b' } } } }, false],
      [{ 'a.a': 1, 'a.b': 0 }, { check: { attr: 'a.a', not: { '<=': { attr: 'a.b' } } } }, false],
      [{ 'a.b': -1 }, { check: { value: 0, not: { '>': { attr: 'a.b' } } } }, false],
      [{ 'a.b': 2 }, { check: { value: 1, not: { '>': { attr: 'a.b' } } } }, true],

      [{}, { check: { value: 'Manager', not: { '=': { value: 'HR' } } } }, true],
      [
        { 'subject.role': 'Manager' },
        { check: { value: 'Manager', not: { '=': { attr: 'subject.role' } } } },
        false,
      ],

      [{}, { check: { value: 'Manager', not: { '!=': { value: 'Manager' } } } }, true],
      [
        { 'subject.role': 'HR' },
        { check: { value: 'Manager', not: { '!=': { attr: 'subject.role' } } } },
        false,
      ],
    ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
      expect(evaluate(attrs, rule, schema)).toBe(expected);
    });
  });

  describe('and && or', () => {
    const schema = {
      attributes: { 'some.number': 'Number' },
      policies: { firstApplicable: [] },
    };

    test.each([
      [
        { 'some.number': 5 },
        {
          check: {
            attr: 'some.number',
            and: [{ '>=': { value: 3 } }, { '<=': { value: 5 } }],
          },
        },
        true,
      ],
      [
        { 'some.number': 2 },
        {
          check: {
            attr: 'some.number',
            and: [{ '>=': { value: 3 } }, { '<=': { value: 5 } }],
          },
        },
        false,
      ],
      [
        { 'some.number': 6 },
        {
          check: {
            attr: 'some.number',
            and: [{ '>=': { value: 3 } }, { '<=': { value: 5 } }],
          },
        },
        true,
      ],

      // or

      [
        { 'some.number': 5 },
        {
          check: {
            attr: 'some.number',
            or: [{ '<=': { value: 3 } }, { '>': { value: 5 } }],
          },
        },
        false,
      ],
      [
        { 'some.number': 3 },
        {
          check: {
            attr: 'some.number',
            or: [{ '<=': { value: 3 } }, { '>': { value: 5 } }],
          },
        },
        true,
      ],
      [
        { 'some.number': 7 },
        {
          check: {
            attr: 'some.number',
            or: [{ '<=': { value: 3 } }, { '>': { value: 5 } }],
          },
        },
        true,
      ],
    ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
      expect(evaluate(attrs, rule, schema)).toBe(expected);
    });
  });
});

describe('and', () => {
  const schema: Schema = {
    attributes: { 'subject.id': 'String', 'subject.status': 'String', 'resource.ownerId': 'String' },
    policies: { firstApplicable: [] },
  };

  test.each([
    [
      { 'subject.id': 'asd', 'subject.status': 'BLOCKED', 'resource.ownerId': 'asd' },
      {
        and: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      true,
    ],

    [
      { 'subject.id': 'ANOTHER', 'subject.status': 'BLOCKED', 'resource.ownerId': 'asd' },
      {
        and: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      false,
    ],

    [
      { 'subject.id': 'asd', 'subject.status': 'ACTIVATED', 'resource.ownerId': 'asd' },
      {
        and: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      false,
    ],
  ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
    expect(evaluate(attrs, rule, schema)).toBe(expected);
  });
});

describe('or', () => {
  const schema: Schema = {
    attributes: { 'subject.id': 'String', 'subject.status': 'String', 'resource.ownerId': 'String' },
    policies: { firstApplicable: [] },
  };

  test.each([
    [
      { 'subject.id': 'asd', 'subject.status': 'BLOCKED', 'resource.ownerId': 'asd' },
      {
        or: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      true,
    ],

    [
      { 'subject.id': 'ANOTHER', 'subject.status': 'BLOCKED', 'resource.ownerId': 'asd' },
      {
        or: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      true,
    ],

    [
      { 'subject.id': 'asd', 'subject.status': 'ACTIVATED', 'resource.ownerId': 'asd' },
      {
        or: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      true,
    ],

    [
      { 'subject.id': 'asd', 'subject.status': 'ACTIVATED', 'resource.ownerId': 'ANOTHER' },
      {
        or: [
          { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      false,
    ],
  ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
    expect(evaluate(attrs, rule, schema)).toBe(expected);
  });
});

describe('use', () => {
  const schema: Schema = {
    attributes: { 'subject.id': 'String', 'subject.status': 'String', 'resource.ownerId': 'String' },
    policies: { firstApplicable: [] },
    rules: {
      SameOwner: { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
      StatusBlocked: { check: { attr: 'subject.status', in: { values: ['BLOCKED'] } } },
    },
  };

  test.each([
    [
      { 'subject.id': 'asd', 'subject.status': 'BLOCKED', 'resource.ownerId': 'asd' },
      {
        and: [
          { use: 'SameOwner' },
          { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
        ],
      },
      true,
    ],

    [
      { 'subject.id': 'ANOTHER', 'subject.status': 'BLOCKED', 'resource.ownerId': 'asd' },
      {
        or: [{ check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } }, { use: 'StatusBlocked' }],
      },
      true,
    ],

    [{ 'subject.id': 'asd', 'resource.ownerId': 'asd' }, { use: 'SameOwner' }, true],

    [
      { 'subject.id': 'asd', 'subject.status': 'ACTIVATED', 'resource.ownerId': 'ANOTHER' },
      {
        or: [{ check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } }, { use: 'StatusBlocked' }],
      },
      false,
    ],
  ] as Line[])('(%o) %o should be %p', (attrs, rule, expected) => {
    expect(evaluate(attrs, rule, schema)).toBe(expected);
  });
});
