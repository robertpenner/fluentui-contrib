import * as fc from 'fast-check';
import type { ButtonCase } from '../../domain/ButtonCase';
import { isSystemColorRole } from '../../domain/SemanticColorRole';
import type { ValidationObligation } from '../../domain/ValidationObligation';
import { resolveLayeredButton } from '../../layered/resolveLayeredButton';
import { resolveSemanticButton } from '../../semantic/resolveSemanticButton';
import { buttonCaseArbitrary } from '../arbitraries';
import { propertyParameters } from '../propertyConfig';

const resolvers = [resolveLayeredButton, resolveSemanticButton] as const;

const withUniversalAppearance = (input: ButtonCase): ButtonCase => ({
  ...input,
  appearance: 'primary',
});

const isSubset = <Value>(
  subset: readonly Value[],
  superset: readonly Value[]
): boolean => subset.every((value) => superset.includes(value));

describe('behavioral and accessibility preservation laws', () => {
  it('Law 2: behavioral preservation under visual specialization', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (generatedInput) => {
        const input = withUniversalAppearance(generatedInput);
        const variants: ButtonCase[] = [
          {
            ...input,
            visualLanguage:
              input.visualLanguage === 'fluent2' ? 'visualRefresh' : 'fluent2',
            anatomyPolicy: 'fluentDefault',
          },
          { ...input, product: input.product === 'teams' ? 'fluent' : 'teams' },
          {
            ...input,
            density: input.density === 'standard' ? 'compact' : 'standard',
          },
          {
            ...input,
            appearance: input.appearance === 'primary' ? 'subtle' : 'primary',
          },
          {
            ...input,
            compositionContext:
              input.compositionContext === 'toolbar' ? 'standalone' : 'toolbar',
          },
        ];

        for (const resolver of resolvers) {
          const capabilities = resolver(input).capabilities;
          for (const variant of variants) {
            expect(resolver(variant).capabilities).toEqual(capabilities);
          }
        }
      }),
      propertyParameters
    );
  });

  it('Law 3: focus preservation', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        const focusCase: ButtonCase = {
          ...input,
          interactionState: 'focusVisible',
        };
        for (const resolver of resolvers) {
          const contract = resolver(focusCase);
          expect(contract.capabilities.interactive).toBe(true);
          expect(contract.focus.visible).toBe(true);
          expect(contract.focus.width).toBeGreaterThan(0);
        }
      }),
      propertyParameters
    );
  });

  it('Law 4: forced-colors preservation', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        const forcedColorsCase: ButtonCase = {
          ...input,
          colorMode: 'forcedColors',
        };
        for (const resolver of resolvers) {
          const contract = resolver(forcedColorsCase);
          expect(isSystemColorRole(contract.appearance.foregroundRole)).toBe(
            true
          );
          expect(isSystemColorRole(contract.appearance.backgroundRole)).toBe(
            true
          );
          expect(isSystemColorRole(contract.appearance.borderRole)).toBe(true);
          expect(isSystemColorRole(contract.focus.colorRole)).toBe(true);
        }
      }),
      propertyParameters
    );
  });

  it('Law 14: anatomy and accessible-name preservation', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        for (const resolver of resolvers) {
          const contract = resolver(input);
          expect(new Set(contract.anatomy.orderedSlots).size).toBe(
            contract.anatomy.orderedSlots.length
          );
          if (input.contentKind === 'iconOnly') {
            expect(contract.anatomy).toMatchObject({
              orderedSlots: ['icon'],
              iconPlacement: 'only',
              accessibleNameSource: 'ariaLabel',
            });
            expect(contract.validationObligations).toContain(
              'accessibleNaming'
            );
          } else {
            expect(contract.anatomy.accessibleNameSource).toBe('text');
            expect(contract.anatomy.orderedSlots).toContain('content');
          }
        }
      }),
      propertyParameters
    );
  });

  it('Law 16: validation-obligation monotonicity', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (generatedInput) => {
        const baseline: ButtonCase = {
          ...generatedInput,
          product: 'fluent',
          visualLanguage: 'visualRefresh',
          appearance: 'primary',
          anatomyPolicy: 'fluentDefault',
        };
        const reconstructed: ButtonCase = {
          ...baseline,
          anatomyPolicy: 'visualRefreshReconstructed',
        };

        for (const resolver of resolvers) {
          const before = resolver(baseline).validationObligations;
          const after = resolver(reconstructed).validationObligations;
          expect(isSubset<ValidationObligation>(before, after)).toBe(true);
          expect(after).toContain('accessibleNaming');
        }
      }),
      propertyParameters
    );
  });
});
