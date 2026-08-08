import {
  anatomyPolicies,
  appearances,
  type ButtonCase,
  colorModes,
  compositionContexts,
  contentKinds,
  densities,
  directions,
  iconPlacements,
  interactionStates,
  products,
  visualLanguages,
} from './ButtonCase';
import { appearanceDomains, supportedAppearances } from './SupportedDomain';
import { invalidButtonCaseReasons, isValidButtonCase } from './validity';

const baseCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'fluent2',
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

describe('supported appearance domain', () => {
  it('returns the declared domain for every product and visual language', () => {
    for (const visualLanguage of visualLanguages) {
      for (const product of products) {
        expect(supportedAppearances({ product, visualLanguage })).toEqual(
          appearanceDomains[visualLanguage][product]
        );
      }
    }
  });

  it('adds and removes appearances explicitly at domain boundaries', () => {
    expect(
      supportedAppearances({
        product: 'fluent',
        visualLanguage: 'visualRefresh',
      })
    ).toContain('tint');
    expect(
      supportedAppearances({
        product: 'sharepoint',
        visualLanguage: 'visualRefresh',
      })
    ).not.toContain('transparent');
    expect(
      supportedAppearances({
        product: 'teams',
        visualLanguage: 'visualRefresh',
      })
    ).not.toContain('tint');
  });
});

describe('ButtonCase validity', () => {
  it.each([
    ['text', 'none'],
    ['iconOnly', 'only'],
    ['textAndIcon', 'before'],
    ['textAndIcon', 'after'],
  ] as const)(
    'accepts %s content with %s placement',
    (contentKind, iconPlacement) => {
      expect(
        isValidButtonCase({ ...baseCase, contentKind, iconPlacement })
      ).toBe(true);
    }
  );

  it('rejects every undeclared content and icon placement relationship', () => {
    const acceptedPairs = new Set([
      'text:none',
      'iconOnly:only',
      'textAndIcon:before',
      'textAndIcon:after',
    ]);

    for (const contentKind of contentKinds) {
      for (const iconPlacement of iconPlacements) {
        const input = { ...baseCase, contentKind, iconPlacement };
        expect(isValidButtonCase(input)).toBe(
          acceptedPairs.has(`${contentKind}:${iconPlacement}`)
        );
      }
    }
  });

  it('requires Visual Refresh before reconstructed anatomy is valid', () => {
    const input: ButtonCase = {
      ...baseCase,
      anatomyPolicy: 'visualRefreshReconstructed',
    };

    expect(invalidButtonCaseReasons(input)).toContain(
      'reconstructedAnatomyRequiresVisualRefresh'
    );
    expect(
      isValidButtonCase({ ...input, visualLanguage: 'visualRefresh' })
    ).toBe(true);
  });

  it('classifies every finite combination deterministically', () => {
    let classifiedCases = 0;

    for (const product of products)
      for (const visualLanguage of visualLanguages)
        for (const density of densities)
          for (const appearance of appearances)
            for (const interactionState of interactionStates)
              for (const colorMode of colorModes)
                for (const contentKind of contentKinds)
                  for (const iconPlacement of iconPlacements)
                    for (const anatomyPolicy of anatomyPolicies)
                      for (const compositionContext of compositionContexts)
                        for (const direction of directions) {
                          const input: ButtonCase = {
                            product,
                            visualLanguage,
                            density,
                            appearance,
                            interactionState,
                            colorMode,
                            contentKind,
                            iconPlacement,
                            anatomyPolicy,
                            compositionContext,
                            direction,
                          };
                          const reasons = invalidButtonCaseReasons(input);

                          expect(isValidButtonCase(input)).toBe(
                            reasons.length === 0
                          );
                          expect(new Set(reasons).size).toBe(reasons.length);
                          classifiedCases += 1;
                        }

    expect(classifiedCases).toBe(138_240);
  });
});
