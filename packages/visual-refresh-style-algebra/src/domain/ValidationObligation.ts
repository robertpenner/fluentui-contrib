export const validationObligations = [
  'nativeButtonSemantics',
  'focusVisibility',
  'forcedColorsBehavior',
  'accessibleNaming',
  'stateCompleteness',
  'textOverflow',
  'compoundGeometry',
] as const;

export type ValidationObligation = (typeof validationObligations)[number];