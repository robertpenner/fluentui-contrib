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
import { resolveLayeredButtonWithHistory } from '../layered/resolveLayeredButton';
import { fieldsWithOverlappingOwnership } from '../layered/writeHistory';

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
    expect(Math.max(...writeCounts)).toBe(50);
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
});
