import type {
  Appearance,
  ButtonCase,
  Product,
  VisualLanguage,
} from './ButtonCase';

type AppearanceDomains = Readonly<
  Record<VisualLanguage, Readonly<Record<Product, readonly Appearance[]>>>
>;

/**
 * Clean-room model assumption: Visual Refresh introduces tint, while product
 * specializations can deliberately narrow the accepted appearance domain.
 */
export const appearanceDomains: AppearanceDomains = {
  fluent2: {
    fluent: ['primary', 'subtle', 'transparent'],
    sharepoint: ['primary', 'subtle', 'transparent'],
    teams: ['primary', 'subtle', 'transparent'],
  },
  visualRefresh: {
    fluent: ['primary', 'subtle', 'transparent', 'tint'],
    sharepoint: ['primary', 'subtle', 'tint'],
    teams: ['primary', 'subtle', 'transparent'],
  },
};

export const supportedAppearances = (
  input: Pick<ButtonCase, 'product' | 'visualLanguage'>
): readonly Appearance[] =>
  appearanceDomains[input.visualLanguage][input.product];

export const isAppearanceSupported = (
  input: Pick<ButtonCase, 'product' | 'visualLanguage' | 'appearance'>
): boolean => supportedAppearances(input).includes(input.appearance);
