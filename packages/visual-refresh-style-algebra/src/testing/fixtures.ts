import type { ButtonCase } from '../domain/ButtonCase';

const baseRegressionCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'rest',
  colorMode: 'light',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
};

export const focusMutationRegression: ButtonCase = {
  ...baseRegressionCase,
  interactionState: 'focusVisible',
};

export const anatomyMutationRegression: ButtonCase = {
  ...baseRegressionCase,
  contentKind: 'iconOnly',
  iconPlacement: 'only',
  anatomyPolicy: 'visualRefreshReconstructed',
};

export const rtlPaddingMutationRegression: ButtonCase = {
  ...baseRegressionCase,
  contentKind: 'textAndIcon',
  iconPlacement: 'before',
  direction: 'rtl',
};

export const forcedColorsMutationRegression: ButtonCase = {
  ...baseRegressionCase,
  colorMode: 'forcedColors',
};

export const compactDensityMutationRegression: ButtonCase = {
  ...baseRegressionCase,
  density: 'compact',
};

export const rtlSplitShapeRegression: ButtonCase = {
  ...baseRegressionCase,
  product: 'teams',
  interactionState: 'focusVisible',
  colorMode: 'forcedColors',
  contentKind: 'textAndIcon',
  iconPlacement: 'after',
  anatomyPolicy: 'visualRefreshReconstructed',
  compositionContext: 'splitButtonEnd',
  direction: 'rtl',
};

export const unsupportedAppearanceRegression: ButtonCase = {
  ...baseRegressionCase,
  product: 'teams',
  appearance: 'tint',
};
