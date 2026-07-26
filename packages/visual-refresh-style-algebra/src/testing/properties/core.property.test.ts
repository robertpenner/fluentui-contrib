import * as fc from 'fast-check';
import { compareContracts } from '../../comparison/compareContracts';
import { formatCounterexample } from '../../comparison/formatCounterexample';
import {
  appearances,
  interactionStates,
  type ButtonCase,
} from '../../domain/ButtonCase';
import { supportedAppearances } from '../../domain/SupportedDomain';
import { isValidButtonCase } from '../../domain/validity';
import { resolveLayeredButton } from '../../layered/resolveLayeredButton';
import { resolveSemanticButton } from '../../semantic/resolveSemanticButton';
import {
  buttonCaseArbitrary,
  productArbitrary,
  visualLanguageArbitrary,
} from '../arbitraries';
import { propertyParameters } from '../propertyConfig';

const assertCompleteValue = (value: unknown, path: string): void => {
  expect(value).not.toBeUndefined();
  if (typeof value === 'number') {
    expect(Number.isFinite(value)).toBe(true);
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertCompleteValue(entry, `${path}[${index}]`)
    );
  } else if (typeof value === 'object' && value !== null) {
    for (const [key, entry] of Object.entries(value)) {
      assertCompleteValue(entry, `${path}.${key}`);
    }
  }
};

const supportedCase = (
  product: ButtonCase['product'],
  visualLanguage: ButtonCase['visualLanguage'],
  appearance: ButtonCase['appearance']
): ButtonCase => ({
  product,
  visualLanguage,
  density: 'standard',
  appearance,
  interactionState: 'rest',
  colorMode: 'light',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
});

describe('core preservation laws', () => {
  it('Law 1: totality over valid cases', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        expect(isValidButtonCase(input)).toBe(true);
        assertCompleteValue(resolveLayeredButton(input), 'layered');
        assertCompleteValue(resolveSemanticButton(input), 'semantic');
      }),
      propertyParameters
    );
  });

  it('Law 5: state completeness', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        for (const interactionState of interactionStates) {
          const stateCase = { ...input, interactionState };
          for (const contract of [
            resolveLayeredButton(stateCase),
            resolveSemanticButton(stateCase),
          ]) {
            expect(contract.supportedDomain.supportedStates).toEqual(
              interactionStates
            );
            expect(contract.appearance.foregroundRole).toBeDefined();
            expect(contract.appearance.backgroundRole).toBeDefined();
            expect(contract.appearance.borderRole).toBeDefined();
          }
        }
      }),
      propertyParameters
    );
  });

  it('Law 11: observational equivalence of semantic contracts', () => {
    fc.assert(
      fc.property(buttonCaseArbitrary, (input) => {
        const differences = compareContracts(
          resolveLayeredButton(input),
          resolveSemanticButton(input)
        );
        if (differences.length > 0) {
          throw new Error(formatCounterexample(input, differences));
        }
      }),
      propertyParameters
    );
  });

  it('Law 13: supported-domain correctness', () => {
    fc.assert(
      fc.property(
        productArbitrary,
        visualLanguageArbitrary,
        fc.constantFrom(...appearances),
        (product, visualLanguage, appearance) => {
          const input = supportedCase(product, visualLanguage, appearance);
          const isSupported = supportedAppearances(input).includes(appearance);

          expect(isValidButtonCase(input)).toBe(isSupported);
          if (isSupported) {
            expect(
              resolveSemanticButton(input).supportedDomain.appearanceSupported
            ).toBe(true);
            expect(
              resolveLayeredButton(input).supportedDomain.appearanceSupported
            ).toBe(true);
          } else {
            expect(() => resolveSemanticButton(input)).toThrow(
              'unsupportedAppearance'
            );
            expect(() => resolveLayeredButton(input)).toThrow(
              'unsupportedAppearance'
            );
          }
        }
      ),
      propertyParameters
    );
  });
});
