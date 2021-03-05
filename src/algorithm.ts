import { Decision } from './desicion';
import { Distributive } from './distributive';

export type CombiningAlgorithm =
  | 'denyOverrides'
  | 'denyUnlessPermit'
  | 'firstApplicable'
  | 'onlyOneApplicable'
  | 'permitOverrides'
  | 'permitUnlessDeny';

export interface Applicable<T> {
  isApplicable(value: T): boolean;
  calculate(value: T): Decision;
}

type Algorithm<T> = (applicable: Applicable<T>, list: T[]) => Decision;

export type AlgorithmObject<T> = Distributive<CombiningAlgorithm, T[]>;

const algorithm: { [K in CombiningAlgorithm]: Algorithm<unknown> } = {
  denyOverrides: (applicable, list) => {
    let latest: Decision = 'NOT_APPLICABLE';
    for (const item of list) {
      if (applicable.isApplicable(item)) {
        latest = applicable.calculate(item);
        if (latest === 'DENY') return 'DENY';
      }
    }
    return latest;
  },
  denyUnlessPermit: (applicable, list) => {
    for (const item of list) {
      if (applicable.isApplicable(item)) {
        const desicion = applicable.calculate(item);
        if (desicion === 'PERMIT') return 'PERMIT';
      }
    }
    return 'DENY';
  },
  firstApplicable: (applicable, list) => {
    const found = list.find((item) => applicable.isApplicable(item));
    if (found) {
      return applicable.calculate(found);
    }

    return 'NOT_APPLICABLE';
  },
  onlyOneApplicable: (applicable, list) => {
    const found = list.filter((item) => applicable.isApplicable(item));
    if (found.length !== 1) return 'DENY';
    return applicable.calculate(found[0]);
  },
  permitOverrides: (applicable, list) => {
    let latest: Decision = 'NOT_APPLICABLE';
    for (const item of list) {
      if (applicable.isApplicable(item)) {
        latest = applicable.calculate(item);
        if (latest === 'PERMIT') return 'PERMIT';
      }
    }
    return latest;
  },
  permitUnlessDeny: (applicable, list) => {
    for (const item of list) {
      if (applicable.isApplicable(item)) {
        const desicion = applicable.calculate(item);
        if (desicion === 'DENY') return 'DENY';
      }
    }
    return 'PERMIT';
  },
};

function findAlgorithm<T>(algos: AlgorithmObject<T>): [CombiningAlgorithm, T[]] {
  if (algos['denyOverrides']) {
    return ['denyOverrides', algos['denyOverrides']];
  }
  if (algos['denyUnlessPermit']) {
    return ['denyUnlessPermit', algos['denyUnlessPermit']];
  }
  if (algos['firstApplicable']) {
    return ['firstApplicable', algos['firstApplicable']];
  }
  if (algos['onlyOneApplicable']) {
    return ['onlyOneApplicable', algos['onlyOneApplicable']];
  }
  if (algos['permitOverrides']) {
    return ['permitOverrides', algos['permitOverrides']];
  }

  return ['permitUnlessDeny', algos['permitUnlessDeny']];
}

export function compileAlgorithm<T>(algos: AlgorithmObject<T>, applicable: Applicable<T>): Decision {
  const [name, list] = findAlgorithm(algos);
  const algorithmFn = algorithm[name];
  return algorithmFn(applicable, list);
}
