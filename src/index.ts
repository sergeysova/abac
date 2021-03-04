import { Schema, isPolicyEffect, isPolicyNested, Effect } from './schema';
import { AttributesObjects, flattenAttributes, filterAttributes } from './attributes';

export function check(attributesObject: AttributesObjects, schema: Schema): Effect {
  const attributes = filterAttributes(flattenAttributes(attributesObject), schema);
  return 'DENY';
}

const config: Schema = {
  attributes: {
    'subject.id': 'String',
    'subject.role': 'String',
    'resource.type': 'String',
    'resource.ownerId': 'String',
    'action.name': 'String',
    'environment.localTime': 'LocalTime',
  },
  policies: {
    firstApplicable: [
      {
        name: 'Работа с документами',
        if: { check: { attr: 'resource.type', '=': { value: 'Document' } } },
        policies: {
          permitUnlessDeny: [
            {
              name: 'Доступ только в рабочее время',
              effect: 'PERMIT',
              if: {
                and: [
                  { check: { attr: 'environment.localTime', '>=': { value: '09:00' } } },
                  { check: { attr: 'environment.localTime', '<=': { value: '18:00' } } },
                ],
              },
            },
            {
              name: 'Доступ только в рабочее время (альтернативный)',
              effect: 'PERMIT',
              if: {
                check: {
                  attr: 'environment.localTime',
                  and: [{ '>=': { value: '09:00' } }, { '<=': { value: '18:00' } }],
                },
              },
            },
            {
              name: 'Создание документа',
              if: {
                check: { attr: 'action.name', '=': { value: 'Create' } },
              },
              policies: {
                denyUnlessPermit: [
                  {
                    name: 'Доступно только менеджеру',
                    effect: 'PERMIT',
                    if: {
                      check: { attr: 'subject.role', '=': { value: 'Manager' } },
                    },
                  },
                ],
              },
            },
            {
              name: 'Создание документа (альтернативный)',
              effect: 'PERMIT',
              if: {
                and: [
                  {
                    attr: 'action.name',
                    '=': { value: '' },
                  },
                  {
                    equals: [
                      // Сравнивать только если типы совпадают
                      { '+': [{ attr: 'subject.createdAt' }, { attr: 'environment.liveSessionTime' }] },
                      { value: '08:00' },
                    ],
                  } as any,
                  {
                    check: { attr: 'action.name', '=': { value: 'Create' } },
                  },
                  {
                    check: { attr: 'subject.role', '=': { value: 'Manager' } },
                  },
                ],
              },
            },
            {
              name: 'Изменение документа',
              condition: {
                check: { attr: 'action.name', '=': { value: 'Edit' } },
              },
              policies: {
                denyUnlessPermit: [
                  {
                    name: 'Документ принадлежит субъекту',
                    effect: 'PERMIT',
                    if: {
                      check: { attr: 'resource.ownerId', '=': { attr: 'subject.id' } },
                    },
                  },
                  {
                    name: 'Доступно менеджеру',
                    effect: 'PERMIT',
                    if: { use: 'IsRoleManager' },
                  },
                ],
              },
            } as any,
            {
              name: 'Удаление документа',
              if: {
                check: { attr: 'action.name', '=': { value: 'Delete' } },
              },
              policies: {
                denyUnlessPermit: [
                  {
                    name: 'Доступно только старшему менеджеру',
                    effect: 'PERMIT',
                    if: {
                      check: { attr: 'subject.role', '=': { value: 'SeniorManager' } },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  rules: {
    IsRoleManager: {
      check: { attr: 'subject.role', '=': { value: 'Manager' } },
    },
    Inversion: {
      check: {
        attr: 'subject.status',
        not: {
          in: { values: ['BLOCKED', 'INVITED'] },
        },
      },
    },
    InList: {
      check: {
        value: 'GitHub',
        in: { attr: 'subject.OAuthTypes' },
      },
    },
    IncludesOf: {
      check: {
        attr: 'subject.OAuthTypes',
        includes: { value: 'GitHub' },
      },
    },
    Comparison: {
      check: {
        attr: 'subject.loginFailedAttempts',
        '>=': { value: '50' },
      },
    },
    RulesAnd: {
      and: [
        { check: { attr: 'subject.id', '=': { attr: 'resource.ownerId' } } },
        { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'INVITED'] } } },
      ],
    },
    CheckAnd: {
      check: {
        attr: 'environment.localTime',
        and: [{ '>=': { value: '09:00' } }, { '<=': { value: '18:00' } }],
      },
    },
    RulesOr: {
      or: [
        { check: { attr: 'subject.status', in: { values: ['BLOCKED', 'MUTED'] } } },
        { check: { attr: 'resource.status', '=': { value: 'UNPUBLISHED' } } },
      ],
    },
    CheckOr: {
      check: {
        attr: 'environment.localTime',
        or: [{ '<': { value: '09:00' } }, { '>': { value: '18:00' } }],
      },
    },
    Reuse: {
      use: 'CheckOr',
    },
    ReuseDeep: { and: [{ use: 'ТолькоМенеджер' }, { use: 'РабочееВремя' }] },
    ReuseSoDeep: {
      and: [{ use: 'СистемныйАдминистратор' }, { not: { use: 'РабочееВремя' } }],
    },
  },
};

/**
 * 1. policy + policySet + rules
 * 2. target
 * 3. remove Check
 * 4. infer predicate types
 * 5. each function like equals or and, should be polymorphic
 * 5.1. format { fn: [args] } or { fn: { left: A, right: B } }
 * 6. remove values in favor of list
 */

/**
 * A
 * equalsA
 * listEqualsA
 *
 *
 * A
 * A::fromString
 * A::equals
 *
 * List<T>
 * List<T>::equals
 *
 * function equals(a, b) {
 *   getType(a).equals(a, b)
 * }
 *
 * (a + b) == c
 *
 * function plus(a, b) {
 *   const type = getType(a) || getType(b)
 *   return type.plus(a, b)
 * }
 *
 * { plus: [{ value: '0' }, { attr: 'env.counter' }] }
 *
 * { target: { value: 'true' } }
 *
 * {
 *  'env.localTime': '08:00',
 * }
 *
 * {
 *   attributes: {
 *     'env.list': 'Integer[]',
 *   }
 * }
 *
 *
 * List::equals(a, b) {
 *
 *
 * }
 */
