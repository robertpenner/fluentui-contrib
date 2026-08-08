import type { SyntheticButtonResearchCase as ButtonCase } from '../src';

export const rtlSplitRegression: ButtonCase = {
  product: 'teams',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'focusVisible',
  colorMode: 'forcedColors',
  contentKind: 'textAndIcon',
  iconPlacement: 'after',
  anatomyPolicy: 'visualRefreshReconstructed',
  compositionContext: 'splitButtonEnd',
  direction: 'rtl',
};

export const unsupportedTeamsTint: ButtonCase = {
  product: 'teams',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'tint',
  interactionState: 'rest',
  colorMode: 'light',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
};
