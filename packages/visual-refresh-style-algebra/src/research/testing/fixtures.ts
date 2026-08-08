import type { ButtonCase } from '../domain/ButtonCase';
import type {
  EmittedStyleRule,
  ForcedColorsEmissionTarget,
} from '../emission/ForcedColorsEmission';

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

export const forcedColorsFocusExtensionRegression: ButtonCase = {
  ...forcedColorsMutationRegression,
  interactionState: 'focusVisible',
};

export const forcedColorsDisabledRegression: ButtonCase = {
  ...forcedColorsMutationRegression,
  interactionState: 'disabled',
};

export const toggleButtonTargetRegression: ForcedColorsEmissionTarget = {
  component: 'ToggleButton',
  slot: 'root',
};

export const emissionRuleRegression: EmittedStyleRule = {
  media: '(forced-colors: active)',
  selectorScope: '.Button[data-slot="root"]',
  declarations: { color: 'ButtonText' },
  precedence: 100,
  order: 0,
  specificity: 20,
  sourceRules: ['regression-base'],
  component: 'Button',
  slot: 'root',
  semanticDecision: 'appearance',
};
