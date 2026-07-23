import * as fc from 'fast-check';
import { isSystemColorRole } from '../domain/SemanticColorRole';
import type {
  EmissionResult,
  EmittedStyleRule,
} from '../emission/ForcedColorsEmission';
import { resolveForcedColorsContract } from '../semantic/resolveForcedColorsContract';
import { buttonCaseArbitrary } from './arbitraries';
import {
  emittedStyleRuleArbitrary,
  forcedColorsTargetArbitrary,
} from './emissionArbitraries';
import {
  emitForcedColorsWithMutation,
  normalizeForcedColorsWithMutation,
  resolveForcedColorsWithMutation,
} from './forcedColorsMutations';
import {
  emissionRuleRegression,
  forcedColorsDisabledRegression,
  forcedColorsFocusExtensionRegression,
  forcedColorsMutationRegression,
  toggleButtonTargetRegression,
} from './fixtures';
import { resolveButtonWithMutation } from './mutations';
import { propertyParameters } from './propertyConfig';

const mutationParameters = { ...propertyParameters, numRuns: 250 };

const expectShrunkFailure = (property: fc.IProperty<unknown[]>): void => {
  const result = fc.check(property, mutationParameters);
  expect(result.failed).toBe(true);
  expect(result.counterexample).not.toBeNull();
  expect(result.numShrinks).toBeGreaterThan(0);
};

const result = (...rules: EmittedStyleRule[]): EmissionResult => ({
  rules,
  diagnostics: [],
});

describe('forced-colors mutation experiments', () => {
  it('catches a product role written after forced-colors resolution', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (generatedInput) => {
        const input = { ...generatedInput, colorMode: 'forcedColors' as const };
        const contract = resolveButtonWithMutation(
          input,
          'leakProductColorIntoForcedColors'
        );
        return isSystemColorRole(contract.appearance.backgroundRole);
      })
    );
    expect(
      isSystemColorRole(
        resolveButtonWithMutation(
          forcedColorsMutationRegression,
          'leakProductColorIntoForcedColors'
        ).appearance.backgroundRole
      )
    ).toBe(false);
  });

  it('catches an extension that omits its forced-colors focus rule', () => {
    expectShrunkFailure(
      fc.property(
        buttonCaseArbitrary,
        forcedColorsTargetArbitrary,
        (generatedInput, target) => {
          const input = {
            ...generatedInput,
            colorMode: 'forcedColors' as const,
            interactionState: 'focusVisible' as const,
          };
          if (target.component === 'Button') {
            return true;
          }
          const emitted = emitForcedColorsWithMutation(
            resolveForcedColorsContract(input),
            target,
            'extensionOmitsFocus'
          );
          return emitted.rules.some(
            (rule) => rule.semanticDecision === 'focusIndicator'
          );
        }
      )
    );
    expect(
      emitForcedColorsWithMutation(
        resolveForcedColorsContract(forcedColorsFocusExtensionRegression),
        toggleButtonTargetRegression,
        'extensionOmitsFocus'
      ).rules.some((rule) => rule.semanticDecision === 'focusIndicator')
    ).toBe(false);
  });

  it('catches a normalizer that merges different selectors', () => {
    expectShrunkFailure(
      fc.property(emittedStyleRuleArbitrary, (rule) => {
        const other = {
          ...rule,
          selectorScope: `${rule.selectorScope}:focus-visible`,
        };
        return (
          normalizeForcedColorsWithMutation(
            result(rule, other),
            'mergeDifferentSelectors'
          ).rules.length === 2
        );
      })
    );
    expect(
      normalizeForcedColorsWithMutation(
        result(emissionRuleRegression, {
          ...emissionRuleRegression,
          selectorScope: '.Other',
        }),
        'mergeDifferentSelectors'
      ).rules
    ).toHaveLength(1);
  });

  it('catches a normalizer that merges conflicting precedence', () => {
    expectShrunkFailure(
      fc.property(emittedStyleRuleArbitrary, (rule) => {
        const other = { ...rule, precedence: rule.precedence + 1 };
        return (
          normalizeForcedColorsWithMutation(
            result(rule, other),
            'mergeConflictingPrecedence'
          ).rules.length === 2
        );
      })
    );
    expect(
      normalizeForcedColorsWithMutation(
        result(emissionRuleRegression, {
          ...emissionRuleRegression,
          precedence: 101,
        }),
        'mergeConflictingPrecedence'
      ).rules
    ).toHaveLength(1);
  });

  it('catches loss of the visible boundary', () => {
    expectShrunkFailure(
      fc.property(
        buttonCaseArbitrary,
        (generatedInput) =>
          resolveForcedColorsWithMutation(
            { ...generatedInput, colorMode: 'forcedColors' },
            'loseVisibleBoundary'
          ).visibleBoundary
      )
    );
    expect(
      resolveForcedColorsWithMutation(
        forcedColorsMutationRegression,
        'loseVisibleBoundary'
      ).visibleBoundary
    ).toBe(false);
  });

  it('catches disabled output that matches enabled roles', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (generatedInput) => {
        const input = {
          ...generatedInput,
          colorMode: 'forcedColors' as const,
          interactionState: 'disabled' as const,
        };
        const disabled = resolveForcedColorsWithMutation(
          input,
          'disabledMatchesEnabled'
        );
        const enabled = resolveForcedColorsContract({
          ...input,
          interactionState: 'rest',
        });
        return (
          disabled.disabledDistinguishable &&
          (disabled.foregroundRole !== enabled.foregroundRole ||
            disabled.borderRole !== enabled.borderRole)
        );
      })
    );
    expect(
      resolveForcedColorsWithMutation(
        forcedColorsDisabledRegression,
        'disabledMatchesEnabled'
      ).disabledDistinguishable
    ).toBe(false);
  });
});
