import { check } from './index';
import { Schema } from './schema';

test('single policy in firstApplicable', () => {
  const schema: Schema = {
    attributes: {
      'subject.id': 'String',
      'resource.owner.id': 'String',
    },
    policies: {
      firstApplicable: [
        {
          name: 'Only an author can edit',
          effect: 'PERMIT',
          if: {
            check: {
              attr: 'subject.id',
              '=': { attr: 'resource.owner.id' },
            },
          },
        },
      ],
    },
  };

  expect(check({ subject: { id: 'IDA' }, resource: { owner: { id: 'IDA' } } }, schema)).toBe('PERMIT');
  expect(check({ subject: { id: 'JOHN' }, resource: { owner: { id: 'IDA' } } }, schema)).toBe('DENY');
});

describe('two policies in firstApplicable', () => {
  const schema: Schema = {
    attributes: {
      'subject.id': 'String',
      'subject.role': 'String',
      'resource.owner.id': 'String',
    },
    policies: {
      firstApplicable: [
        {
          name: 'Only an author can edit',
          effect: 'PERMIT',
          if: {
            check: {
              attr: 'subject.id',
              '=': { attr: 'resource.owner.id' },
            },
          },
        },
        {
          name: 'Admin still can edit',
          effect: 'PERMIT',
          if: {
            check: { attr: 'subject.role', '=': { value: 'ADMIN' } },
          },
        },
      ],
    },
  };

  test.each([
    // Subject, Role
    ['Ida', 'User', 'PERMIT'],
    ['John', 'User', 'DENY'],
    ['John', 'Admin', 'PERMIT'],
  ])('User %s with role %s should %s access to resource with owner Ida', (user, role, access) => {
    expect(check({ subject: { id: user, role }, resource: { owner: { id: 'Ida' } } }, schema)).toBe(access);
  });
});

test.todo('permitUnlessDeny');
test.todo('denyUnlessPermit');
