import {
  anatomyPolicies,
  appearances,
  colorModes,
  compositionContexts,
  contentKinds,
  densities,
  directions,
  iconPlacements,
  interactionStates,
  products,
  visualLanguages,
  type ButtonCase,
} from '../domain/ButtonCase';
import { isValidButtonCase } from '../domain/validity';
import { createForcedColorsEmissionExperiment } from '../emission/createForcedColorsEmissionExperiment';
import type { ForcedColorsEmissionTarget } from '../emission/ForcedColorsEmission';
import {
  measureForcedColorsEmission,
  normalizeForcedColorsEmission,
} from '../emission/normalizeForcedColorsEmission';
import { resolveLayeredButtonWithHistory } from '../layered/resolveLayeredButton';
import { fieldsWithOverlappingOwnership } from '../layered/writeHistory';
import { resolveForcedColorsContract } from '../semantic/resolveForcedColorsContract';

const enumerateCases = (): ButtonCase[] => {
  const cases: ButtonCase[] = [];
  for (const product of products) {
    for (const visualLanguage of visualLanguages) {
      for (const density of densities) {
        for (const appearance of appearances) {
          for (const interactionState of interactionStates) {
            for (const colorMode of colorModes) {
              for (const contentKind of contentKinds) {
                for (const iconPlacement of iconPlacements) {
                  for (const anatomyPolicy of anatomyPolicies) {
                    for (const compositionContext of compositionContexts) {
                      for (const direction of directions) {
                        cases.push({
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
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return cases;
};

const forcedColorsMetricCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'focusVisible',
  colorMode: 'forcedColors',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
};

const forcedColorsMetricTargets: readonly {
  input: ButtonCase;
  target: ForcedColorsEmissionTarget;
}[] = [
  {
    input: forcedColorsMetricCase,
    target: { component: 'Button', slot: 'root' },
  },
  {
    input: forcedColorsMetricCase,
    target: { component: 'ToggleButton', slot: 'root' },
  },
  {
    input: { ...forcedColorsMetricCase, interactionState: 'disabled' },
    target: { component: 'Button', slot: 'root' },
  },
  {
    input: forcedColorsMetricCase,
    target: { component: 'SplitButton', slot: 'primaryAction' },
  },
  {
    input: forcedColorsMetricCase,
    target: { component: 'SplitButton', slot: 'menuAction' },
  },
];

describe('research metrics', () => {
  it('keeps the documented finite-domain census reproducible', () => {
    const allCases = enumerateCases();
    const validCases = allCases.filter(isValidButtonCase);

    expect(allCases).toHaveLength(138_240);
    expect(validCases).toHaveLength(27_840);
  });

  it('measures layered write volume and ownership overlap exhaustively', () => {
    const validCases = enumerateCases().filter(isValidButtonCase);
    const writeCounts = validCases.map(
      (input) => resolveLayeredButtonWithHistory(input).writeHistory.length
    );
    const overlappingFields = new Set(
      validCases.flatMap((input) =>
        fieldsWithOverlappingOwnership(
          resolveLayeredButtonWithHistory(input).writeHistory
        )
      )
    );

    expect(Math.min(...writeCounts)).toBe(38);
    expect(Math.max(...writeCounts)).toBe(51);
    expect([...overlappingFields].sort()).toEqual([
      'anatomy',
      'appearance.backgroundRole',
      'appearance.borderRole',
      'appearance.foregroundRole',
      'capabilities',
      'focus.colorRole',
      'focus.visible',
      'geometry.blockSize',
      'geometry.gap',
      'geometry.minInlineSize',
      'geometry.paddingInlineEnd',
      'geometry.paddingInlineStart',
      'shape.radiusEndEnd',
      'shape.radiusEndStart',
      'shape.radiusStartEnd',
      'shape.radiusStartStart',
      'supportedDomain.appearanceSupported',
      'validationObligations',
    ]);
  });

  it('keeps forced-colors semantic and emission metrics reproducible', () => {
    const measurements = forcedColorsMetricTargets.map(({ input, target }) => {
      const original = createForcedColorsEmissionExperiment(
        resolveForcedColorsContract(input),
        target
      );
      const normalized = normalizeForcedColorsEmission(original);
      return {
        original,
        metrics: measureForcedColorsEmission(original, normalized),
      };
    });
    const sum = (
      field:
        | 'emittedRules'
        | 'exactDuplicateRules'
        | 'safelyNormalizedRules'
        | 'unsafeToMergePairs'
    ) =>
      measurements.reduce(
        (total, measurement) => total + measurement.metrics[field],
        0
      );
    const semanticDecisions = new Set(
      measurements.flatMap((measurement) =>
        measurement.original.rules.map((rule) => rule.semanticDecision)
      )
    );
    const scopes = new Set(
      forcedColorsMetricTargets.map(
        ({ target }) => `${target.component}/${target.slot}`
      )
    );
    const writesAfterForcedColors = forcedColorsMetricTargets.flatMap(
      ({ input }) => {
        const writes = resolveLayeredButtonWithHistory(input).writeHistory;
        const forcedColorsIndex = writes.findIndex(
          (write) => write.layer === 'forcedColors'
        );
        return writes
          .slice(forcedColorsIndex)
          .filter((write) => write.layer !== 'forcedColors');
      }
    );

    expect(semanticDecisions.size).toBe(4);
    expect(sum('emittedRules')).toBe(25);
    expect(sum('exactDuplicateRules')).toBe(5);
    expect(sum('safelyNormalizedRules')).toBe(5);
    expect(sum('unsafeToMergePairs')).toBe(14);
    expect(writesAfterForcedColors).toHaveLength(0);
    expect(scopes.size).toBe(4);
  });
});
