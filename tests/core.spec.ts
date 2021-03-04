import { check } from '../src';

import config from './fixtures/config.json';
import tests from './fixtures/tests.json';

describe('fixtures', () => {
  for (const { name, context, expected } of tests) {
    test(name, () => {
      const result = check(context as any, config as any);
      expect(result).toBe(expected);
    });
  }
});
