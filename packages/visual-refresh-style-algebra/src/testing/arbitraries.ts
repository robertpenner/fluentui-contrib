import * as fc from 'fast-check';
import {
  colorModes,
  compositionContexts,
  densities,
  directions,
  interactionStates,
  products,
  visualLanguages,
  type ButtonCase,
} from '../domain/ButtonCase';
import { supportedAppearances } from '../domain/SupportedDomain';

export const productArbitrary = fc.constantFrom(...products);
export const visualLanguageArbitrary = fc.constantFrom(...visualLanguages);
export const densityArbitrary = fc.constantFrom(...densities);
export const interactionStateArbitrary = fc.constantFrom(...interactionStates);
export const colorModeArbitrary = fc.constantFrom(...colorModes);
export const compositionContextArbitrary = fc.constantFrom(...compositionContexts);
export const directionArbitrary = fc.constantFrom(...directions);

export const contentAndIconArbitrary = fc.constantFrom(
  { contentKind: 'text', iconPlacement: 'none' } as const,
  { contentKind: 'iconOnly', iconPlacement: 'only' } as const,
  { contentKind: 'textAndIcon', iconPlacement: 'before' } as const,
  { contentKind: 'textAndIcon', iconPlacement: 'after' } as const,
);

export const buttonCaseArbitrary: fc.Arbitrary<ButtonCase> = fc
  .tuple(productArbitrary, visualLanguageArbitrary)
  .chain(([product, visualLanguage]) =>
    fc
      .record({
        density: densityArbitrary,
        appearance: fc.constantFrom(...supportedAppearances({ product, visualLanguage })),
        interactionState: interactionStateArbitrary,
        colorMode: colorModeArbitrary,
        content: contentAndIconArbitrary,
        anatomyPolicy:
          visualLanguage === 'visualRefresh'
            ? fc.constantFrom('fluentDefault' as const, 'visualRefreshReconstructed' as const)
            : fc.constant('fluentDefault' as const),
        compositionContext: compositionContextArbitrary,
        direction: directionArbitrary,
      })
      .map(
        ({ content, ...input }): ButtonCase => ({
          product,
          visualLanguage,
          ...input,
          ...content,
        }),
      ),
  );