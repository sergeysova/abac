export type CombiningAlgorithm =
  | 'denyOverrides'
  | 'denyUnlessPermit'
  | 'firstApplicable'
  | 'onlyOneApplicable'
  | 'permitOverrides'
  | 'permitUnlessDeny';
