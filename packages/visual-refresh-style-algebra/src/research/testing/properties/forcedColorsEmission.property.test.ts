import * as fc from 'fast-check';
import type { ButtonCase } from '../../domain/ButtonCase';
import { systemColorRoles } from '../../domain/SemanticColorRole';
import { normalizeContract } from '../../comparison/normalizeContract';
import { emitForcedColors } from '../../emission/emitForcedColors';
import type {
  EmissionResult,
  EmittedStyleRule,
} from '../../emission/ForcedColorsEmission';
import {
  evaluateEmission,
  normalizeForcedColorsEmission,
} from '../../emission/normalizeForcedColorsEmission';
import { applyForcedColorsOverrides } from '../../layered/forcedColorsOverrides';
import {
  resolveLayeredButtonInOrder,
  standardOverrideOrder,
} from '../../layered/resolveLayeredButton';
import { resolveForcedColorsContract } from '../../semantic/resolveForcedColorsContract';
import { buttonCaseArbitrary } from '../arbitraries';
import {
  emittedStyleRuleArbitrary,
  forcedColorsTargetArbitrary,
} from '../emissionArbitraries';
import { propertyParameters } from '../propertyConfig';

const forcedColorsButtonCaseArbitrary: fc.Arbitrary<ButtonCase> =
  buttonCaseArbitrary.map((input) => ({
    ...input,
    colorMode: 'forcedColors',
  }));

const result = (...rules: EmittedStyleRule[]): EmissionResult => ({
  rules,
  diagnostics: [],
});

const enabledInput = (input: ButtonCase): ButtonCase => ({
  ...input,
  interactionState:
    input.interactionState === 'disabled' ? 'rest' : input.interactionState,
});

describe('forced-colors semantic and emission laws', () => {
  it('FC Law 1: every valid forced-colors case resolves a complete contract', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (input) => {
        expect(resolveForcedColorsContract(input)).toEqual(
          expect.objectContaining({
            foregroundRole: expect.any(String),
            backgroundRole: expect.any(String),
            borderRole: expect.any(String),
            focusRole: expect.any(String),
            focusVisible: expect.any(Boolean),
            disabledDistinguishable: expect.any(Boolean),
            visibleBoundary: expect.any(Boolean),
          })
        );
      }),
      propertyParameters
    );
  });

  it('FC Law 2: only approved system roles leave the semantic policy', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (input) => {
        const contract = resolveForcedColorsContract(input);
        for (const role of [
          contract.foregroundRole,
          contract.backgroundRole,
          contract.borderRole,
          contract.focusRole,
        ]) {
          expect(systemColorRoles).toContain(role);
        }
      }),
      propertyParameters
    );
  });

  it('FC Law 3: focus-visible interactive cases retain a system focus indicator', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (generatedInput) => {
        const contract = resolveForcedColorsContract({
          ...generatedInput,
          interactionState: 'focusVisible',
        });
        expect(contract.focusVisible).toBe(true);
        expect(systemColorRoles).toContain(contract.focusRole);
      }),
      propertyParameters
    );
  });

  it('FC Law 4: every modeled forced-colors case retains a visible boundary', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (input) => {
        const contract = resolveForcedColorsContract(input);
        expect(contract.visibleBoundary).toBe(true);
        expect(systemColorRoles).toContain(contract.borderRole);
      }),
      propertyParameters
    );
  });

  it('FC Law 5: disabled cases remain distinguishable from enabled cases', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (generatedInput) => {
        const disabled = resolveForcedColorsContract({
          ...generatedInput,
          interactionState: 'disabled',
        });
        const enabled = resolveForcedColorsContract({
          ...generatedInput,
          interactionState: 'rest',
        });
        expect(disabled.disabledDistinguishable).toBe(true);
        expect([disabled.foregroundRole, disabled.borderRole]).not.toEqual([
          enabled.foregroundRole,
          enabled.borderRole,
        ]);
      }),
      propertyParameters
    );
  });

  it('FC Law 6: product and density specialization preserve accessibility guarantees', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (generatedInput) => {
        const input = enabledInput({
          ...generatedInput,
          appearance: 'primary',
        });
        const baseline = resolveForcedColorsContract(input);
        const specialized = resolveForcedColorsContract({
          ...input,
          product: input.product === 'teams' ? 'sharepoint' : 'teams',
          density: input.density === 'compact' ? 'standard' : 'compact',
        });
        expect(specialized).toEqual(baseline);
      }),
      propertyParameters
    );
  });

  it('FC Law 7: Button, ToggleButton, and split slots emit the same foundational decisions', () => {
    fc.assert(
      fc.property(
        forcedColorsButtonCaseArbitrary,
        forcedColorsTargetArbitrary,
        (input, target) => {
          const contract = resolveForcedColorsContract(input);
          const emitted = emitForcedColors(contract, target);
          expect(
            new Set(emitted.rules.map((rule) => rule.semanticDecision))
          ).toEqual(
            new Set([
              'appearance',
              'visibleBoundary',
              ...(contract.focusVisible ? ['focusIndicator' as const] : []),
              ...(contract.disabledDistinguishable
                ? ['disabledState' as const]
                : []),
            ])
          );
        }
      ),
      propertyParameters
    );
  });

  it('FC Law 8: layered forced-colors adaptation is semantically idempotent', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (input) => {
        const stages = standardOverrideOrder.filter(
          (stage) => stage !== 'forcedColors'
        );
        const state = resolveLayeredButtonInOrder(input, stages);
        applyForcedColorsOverrides(state, input);
        const once = normalizeContract(state.contract);
        applyForcedColorsOverrides(state, input);
        expect(normalizeContract(state.contract)).toEqual(once);
      }),
      propertyParameters
    );
  });

  it('FC Law 9: protected fields reject later ordinary interaction styling', () => {
    fc.assert(
      fc.property(forcedColorsButtonCaseArbitrary, (input) => {
        const wrongOrder = standardOverrideOrder.filter(
          (stage) => stage !== 'forcedColors'
        );
        wrongOrder.splice(wrongOrder.indexOf('interaction'), 0, 'forcedColors');
        expect(() => resolveLayeredButtonInOrder(input, wrongOrder)).toThrow(
          'Protected field'
        );
      }),
      propertyParameters
    );
  });

  it('FC Law 10: normalization preserves modeled declarations within one scope', () => {
    fc.assert(
      fc.property(emittedStyleRuleArbitrary, (rule) => {
        const compatible: EmittedStyleRule = {
          ...rule,
          declarations: { forcedColorAdjust: 'none' },
          sourceRules: ['compatible-rule'],
        };
        const original = result(rule, compatible);
        const normalized = normalizeForcedColorsEmission(original);
        expect(evaluateEmission(normalized.rules)).toEqual(
          evaluateEmission(original.rules)
        );
      }),
      propertyParameters
    );
  });

  it('FC Law 11: exact duplicates are safely reduced', () => {
    fc.assert(
      fc.property(emittedStyleRuleArbitrary, (rule) => {
        const original = result(rule, { ...rule, sourceRules: ['duplicate'] });
        const normalized = normalizeForcedColorsEmission(original);
        expect(normalized.rules).toHaveLength(1);
        expect(evaluateEmission(normalized.rules)).toEqual(
          evaluateEmission(original.rules)
        );
      }),
      propertyParameters
    );
  });

  it('FC Law 12: scope, slot, precedence, and declaration conflicts remain separate', () => {
    fc.assert(
      fc.property(
        emittedStyleRuleArbitrary,
        fc.constantFrom(
          'selector',
          'slot',
          'precedence',
          'declaration' as const
        ),
        (rule, variation) => {
          const [declarationProperty, declarationValue] = Object.entries(
            rule.declarations
          )[0];
          const changed: EmittedStyleRule =
            variation === 'selector'
              ? {
                  ...rule,
                  selectorScope: `${rule.selectorScope}:focus-visible`,
                }
              : variation === 'slot'
              ? { ...rule, slot: rule.slot === 'root' ? 'menuAction' : 'root' }
              : variation === 'precedence'
              ? { ...rule, precedence: rule.precedence + 1 }
              : {
                  ...rule,
                  declarations: {
                    [declarationProperty]:
                      declarationValue === 'ConflictValue'
                        ? 'DifferentValue'
                        : 'ConflictValue',
                  },
                };
          const normalized = normalizeForcedColorsEmission(
            result(rule, changed)
          );
          expect(normalized.rules).toHaveLength(2);
          expect(normalized.diagnostics).toContainEqual(
            expect.objectContaining({ kind: 'unsafeToMerge' })
          );
        }
      ),
      propertyParameters
    );
  });

  it('FC Law 13: repeated decisions across scopes produce a compression diagnostic only', () => {
    fc.assert(
      fc.property(emittedStyleRuleArbitrary, (rule) => {
        const scopedCopy: EmittedStyleRule = {
          ...rule,
          selectorScope: `${rule.selectorScope}--extension`,
          component: rule.component === 'Button' ? 'ToggleButton' : 'Button',
        };
        const normalized = normalizeForcedColorsEmission(
          result(rule, scopedCopy)
        );
        expect(normalized.rules).toHaveLength(2);
        expect(normalized.diagnostics).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ kind: 'semanticCompression' }),
            expect.objectContaining({ kind: 'unsafeToMerge' }),
          ])
        );
      }),
      propertyParameters
    );
  });
});
