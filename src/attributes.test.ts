import { filterAttributes, flattenAttributes } from './attributes';

test('flattening for simple object', () => {
  const source = {
    foo: 1,
    bar: '2',
    baz: false,
  };

  expect(flattenAttributes(source)).toMatchInlineSnapshot(`
    Object {
      "bar": "2",
      "baz": false,
      "foo": 1,
    }
  `);
});

test('flattening for 2-level object', () => {
  const source = {
    foo: 1,
    bar: '2',
    baz: {
      raz: 2,
      naz: true,
    },
  };

  expect(flattenAttributes(source)).toMatchInlineSnapshot(`
    Object {
      "bar": "2",
      "baz.naz": true,
      "baz.raz": 2,
      "foo": 1,
    }
  `);
});

test('flattening for 3-level object', () => {
  const source = {
    foo: 1,
    bar: '2',
    resource: {
      raz: 2,
      micro: {
        id: 'asoufhsidufhb',
      },
    },
  };

  expect(flattenAttributes(source)).toMatchInlineSnapshot(`
    Object {
      "bar": "2",
      "foo": 1,
      "resource.micro.id": "asoufhsidufhb",
      "resource.raz": 2,
    }
  `);
});

test('flattening for 4-level object', () => {
  const source = {
    foo: {
      bar: {
        baz: {
          bad: false,
        },
      },
    },
  };

  expect(flattenAttributes(source)).toMatchInlineSnapshot(`
    Object {
      "foo.bar.baz.bad": false,
    }
  `);
});

test('filterAttributes', () => {
  const schema = {
    attributes: {
      'subject.id': 'String',
      'resource.ownerId': 'String',
    },
    policies: { firstApplicable: [] },
  };
  const attributes = flattenAttributes({
    subject: { id: 'qwe', name: 'Sova' },
    resource: { ownerId: 'qwe', type: 'Demo' },
  });

  expect(filterAttributes(attributes, schema)).toEqual({
    'subject.id': 'qwe',
    'resource.ownerId': 'qwe',
  });
});
