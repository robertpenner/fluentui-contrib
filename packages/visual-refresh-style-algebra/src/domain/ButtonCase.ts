export const products = ['fluent', 'sharepoint', 'teams'] as const;
export type Product = (typeof products)[number];

export const visualLanguages = ['fluent2', 'visualRefresh'] as const;
export type VisualLanguage = (typeof visualLanguages)[number];

export const densities = ['standard', 'compact'] as const;
export type Density = (typeof densities)[number];

export const appearances = [
  'primary',
  'subtle',
  'transparent',
  'tint',
] as const;
export type Appearance = (typeof appearances)[number];

export const interactionStates = [
  'rest',
  'hover',
  'pressed',
  'focusVisible',
  'disabled',
] as const;
export type InteractionState = (typeof interactionStates)[number];

export const colorModes = ['light', 'dark', 'forcedColors'] as const;
export type ColorMode = (typeof colorModes)[number];

export const contentKinds = ['text', 'iconOnly', 'textAndIcon'] as const;
export type ContentKind = (typeof contentKinds)[number];

export const iconPlacements = ['none', 'before', 'after', 'only'] as const;
export type IconPlacement = (typeof iconPlacements)[number];

export const anatomyPolicies = [
  'fluentDefault',
  'visualRefreshReconstructed',
] as const;
export type AnatomyPolicy = (typeof anatomyPolicies)[number];

export const compositionContexts = [
  'standalone',
  'toolbar',
  'splitButtonStart',
  'splitButtonEnd',
] as const;
export type CompositionContext = (typeof compositionContexts)[number];

export const directions = ['ltr', 'rtl'] as const;
export type Direction = (typeof directions)[number];

export interface ButtonCase {
  product: Product;
  visualLanguage: VisualLanguage;
  density: Density;
  appearance: Appearance;
  interactionState: InteractionState;
  colorMode: ColorMode;
  contentKind: ContentKind;
  iconPlacement: IconPlacement;
  anatomyPolicy: AnatomyPolicy;
  compositionContext: CompositionContext;
  direction: Direction;
}

export const formatButtonCase = (input: ButtonCase): string =>
  JSON.stringify(input, undefined, 2);