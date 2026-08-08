import * as fc from 'fast-check';
import { normalizeContract } from '../../comparison/normalizeContract';
import type { ButtonCase } from '../../domain/ButtonCase';
import { shapePolicy } from '../../domain/policies';
import { applyForcedColorsOverrides } from '../../layered/forcedColorsOverrides';
import {
  resolveLayeredButton,
  resolveLayeredButtonInOrder,
  standardOverrideOrder,
} from '../../layered/resolveLayeredButton';
import { resolveSemanticButton } from '../../semantic/resolveSemanticButton';
import { buttonCaseArbitrary, productArbitrary } from '../arbitraries';
import { propertyParameters } from '../propertyConfig';

const resolvers = [resolveLayeredButton, resolveSemanticButton] as const;

describe('specialization and composition preservation laws', () => {
  it('Law 6: density locality', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        const standardCase: ButtonCase = { ...input, density: 'standard' };
        const compactCase: ButtonCase = { ...input, density: 'compact' };

        for (const resolver of resolvers) {
          const standard = resolver(standardCase);
          const compact = resolver(compactCase);
          expect(compact.geometry.blockSize).toBeLessThanOrEqual(
            standard.geometry.blockSize
          );
          expect(compact.appearance).toEqual(standard.appearance);
          expect(compact.shape).toEqual(standard.shape);
          expect(compact.anatomy).toEqual(standard.anatomy);
          expect(compact.supportedDomain).toEqual(standard.supportedDomain);
          expect(compact.validationObligations).toEqual(
            standard.validationObligations
          );
          expect(compact.focus).toEqual(standard.focus);
          expect(compact.capabilities).toEqual(standard.capabilities);
        }
      }),
      propertyParameters
    );
  });

  it('Law 7: product-specialization preservation', () => {
    fc.assert(
      fc.property(
        buttonCaseArbitrary,
        productArbitrary,
        (generatedInput, product) => {
          const input: ButtonCase = {
            ...generatedInput,
            appearance: 'primary',
          };
          const specialized: ButtonCase = { ...input, product };

          for (const resolver of resolvers) {
            const baseline = resolver(input);
            const productResult = resolver(specialized);
            expect(productResult.appearance).toEqual(baseline.appearance);
            expect(productResult.capabilities).toEqual(baseline.capabilities);
            expect(productResult.focus).toEqual(baseline.focus);
            expect(productResult.supportedDomain.supportedStates).toEqual(
              baseline.supportedDomain.supportedStates
            );
            expect(productResult.capabilities.semanticActionRole).toBe(
              'button'
            );
          }
        }
      ),
      propertyParameters
    );
  });

  it('Law 8: compound-shape coherence including RTL', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        const radius = shapePolicy[input.visualLanguage];
        for (const direction of ['ltr', 'rtl'] as const) {
          const start = resolveSemanticButton({
            ...input,
            direction,
            compositionContext: 'splitButtonStart',
          }).shape;
          const end = resolveSemanticButton({
            ...input,
            direction,
            compositionContext: 'splitButtonEnd',
          }).shape;
          const startOuterIsLogicalStart = direction === 'ltr';

          if (startOuterIsLogicalStart) {
            expect(start).toEqual({
              radiusStartStart: radius,
              radiusStartEnd: 0,
              radiusEndStart: radius,
              radiusEndEnd: 0,
            });
            expect(end).toEqual({
              radiusStartStart: 0,
              radiusStartEnd: radius,
              radiusEndStart: 0,
              radiusEndEnd: radius,
            });
          } else {
            expect(start).toEqual({
              radiusStartStart: 0,
              radiusStartEnd: radius,
              radiusEndStart: 0,
              radiusEndEnd: radius,
            });
            expect(end).toEqual({
              radiusStartStart: radius,
              radiusStartEnd: 0,
              radiusEndStart: radius,
              radiusEndEnd: 0,
            });
          }
        }
      }),
      propertyParameters
    );
  });

  it('Law 9: forced-colors transformation idempotence', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (generatedInput) => {
        const input: ButtonCase = {
          ...generatedInput,
          colorMode: 'forcedColors',
        };
        const stagesWithoutForcedColors = standardOverrideOrder.filter(
          (stage) => stage !== 'forcedColors'
        );
        const state = resolveLayeredButtonInOrder(
          input,
          stagesWithoutForcedColors
        );

        applyForcedColorsOverrides(state, input);
        const once = JSON.stringify(normalizeContract(state.contract));
        applyForcedColorsOverrides(state, input);
        const twice = JSON.stringify(normalizeContract(state.contract));
        expect(twice).toBe(once);
      }),
      propertyParameters
    );
  });

  it('Law 10: explicit precedence and independent-stage commutativity', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (generatedInput) => {
        const input: ButtonCase = {
          ...generatedInput,
          colorMode: 'forcedColors',
        };
        const independentOrder = standardOverrideOrder.map((stage) => stage);
        const contextIndex = independentOrder.indexOf('context');
        const interactionIndex = independentOrder.indexOf('interaction');
        independentOrder[contextIndex] = 'interaction';
        independentOrder[interactionIndex] = 'context';

        expect(
          normalizeContract(
            resolveLayeredButtonInOrder(input, independentOrder).contract
          )
        ).toEqual(normalizeContract(resolveLayeredButton(input)));

        const wrongProtectedOrder = standardOverrideOrder.filter(
          (stage) => stage !== 'forcedColors'
        );
        wrongProtectedOrder.splice(
          wrongProtectedOrder.indexOf('interaction'),
          0,
          'forcedColors'
        );
        expect(() =>
          resolveLayeredButtonInOrder(input, wrongProtectedOrder)
        ).toThrow('Protected field');
      }),
      propertyParameters
    );
  });

  it('Law 15: conditional-padding coherence and directional mirroring', () => {
    fc.assert(
      fc.property(
        buttonCaseArbitrary,
        fc.constantFrom('before' as const, 'after' as const),
        (input, iconPlacement) => {
          const base: ButtonCase = {
            ...input,
            contentKind: 'textAndIcon',
            iconPlacement,
            compositionContext: 'standalone',
          };
          const ltr = resolveSemanticButton({
            ...base,
            direction: 'ltr',
          }).geometry;
          const rtl = resolveSemanticButton({
            ...base,
            direction: 'rtl',
          }).geometry;

          expect(ltr.paddingInlineStart).toBe(rtl.paddingInlineEnd);
          expect(ltr.paddingInlineEnd).toBe(rtl.paddingInlineStart);
          expect(ltr.minInlineSize).toBeGreaterThanOrEqual(ltr.blockSize);
          expect(rtl.minInlineSize).toBeGreaterThanOrEqual(rtl.blockSize);
          expect(ltr.paddingInlineStart).toBeGreaterThanOrEqual(0);
          expect(ltr.paddingInlineEnd).toBeGreaterThanOrEqual(0);
        }
      ),
      propertyParameters
    );
  });
});
