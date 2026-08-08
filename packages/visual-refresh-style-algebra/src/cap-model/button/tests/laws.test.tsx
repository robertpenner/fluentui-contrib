import type { CapButtonObservation } from '../CapButtonObservation';
import { capButtonScenarios } from '../enumerateCapButtonScenarios';
import {
  capButtonConformanceLaws,
  capButtonLawClassifications,
  capButtonResearchAssumptions,
  diagnoseCapButtonLaws,
  evaluateCapButtonProductionLaws,
  type CapButtonLaw,
} from '../laws';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
} from './productionAdapter';

let productionObservations: readonly CapButtonObservation[] | undefined;

const observeProduction = (): readonly CapButtonObservation[] => {
  productionObservations ??= observeCapButtonProductionScenarios(
    capButtonScenarios,
    tracedCapButtonConditions
  );

  return productionObservations;
};

describe('CAP Button production-backed laws', () => {
  it('classifies conformance claims separately from research assumptions', () => {
    expect(capButtonLawClassifications).toEqual([
      'production-observation',
      'derived-invariant',
      'product-contract',
      'research-assumption',
    ]);
    expect(
      capButtonConformanceLaws.every(
        (law) => law.classification !== 'research-assumption'
      )
    ).toBe(true);
    expect(
      capButtonResearchAssumptions.every(
        (law) => law.classification === 'research-assumption'
      )
    ).toBe(true);
    expect(
      capButtonConformanceLaws.some(
        (law) => law.classification === 'product-contract'
      )
    ).toBe(false);
  });

  it('accepts the observed production census without claiming product support', () => {
    expect(
      diagnoseCapButtonLaws(capButtonConformanceLaws, observeProduction())
    ).toEqual([]);
  });

  it('rejects contradictory classifications for one retained law', () => {
    const productionLaw = capButtonConformanceLaws[0];
    const contradiction: CapButtonLaw = {
      ...productionLaw,
      classification: 'research-assumption',
    };

    expect(
      diagnoseCapButtonLaws(
        [productionLaw, contradiction],
        observeProduction()
      )
    ).toEqual([
      {
        kind: 'contradictory-classification',
        lawId: productionLaw.id,
        classifications: [
          productionLaw.classification,
          contradiction.classification,
        ],
      },
    ]);
  });

  it('rejects law references to unreachable semantic profiles', () => {
    const unreachableLaw: CapButtonLaw = {
      ...capButtonConformanceLaws[0],
      id: 'unreachable-test-law',
      semanticProfileKeys: ['not-an-observed-profile'],
    };

    expect(
      diagnoseCapButtonLaws([unreachableLaw], observeProduction())
    ).toEqual([
      {
        kind: 'unreachable-semantic-profile',
        lawId: unreachableLaw.id,
        semanticProfileKey: 'not-an-observed-profile',
      },
    ]);
  });

  it('invalidates the corresponding law when a production rule mutates', () => {
    const production = observeProduction();
    const [observation, ...remaining] = production;
    const mutation: CapButtonObservation = {
      ...observation,
      rootAppearance: {
        ...observation.rootAppearance,
        background: 'production-rule-mutation',
      },
    };

    expect(
      evaluateCapButtonProductionLaws(production, [mutation, ...remaining])
    ).toEqual([
      {
        kind: 'production-rule-mutation',
        lawId: 'observed-root-appearance',
        classification: 'production-observation',
        contractGroup: 'appearance',
        paths: ['rootAppearance.background'],
      },
    ]);
  });
});