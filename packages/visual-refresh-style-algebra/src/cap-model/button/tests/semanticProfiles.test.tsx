import type { CapButtonObservation } from '../CapButtonObservation';
import { capButtonScenarios } from '../enumerateCapButtonScenarios';
import {
  capButtonSemanticProfileCensus,
  capButtonSemanticProfileProjection,
  compareCapButtonSemanticProfiles,
  createCapButtonSemanticProfileCensus,
  projectCapButtonSemanticProfile,
} from '../semanticProfiles';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
} from './productionAdapter';

let productionCensus: readonly CapButtonObservation[] | undefined;

const observeProductionCensus = (): readonly CapButtonObservation[] => {
  productionCensus ??= observeCapButtonProductionScenarios(
    capButtonScenarios,
    tracedCapButtonConditions
  );

  return productionCensus;
};

describe('CAP Button semantic profiles', () => {
  it('derives the scoped semantic census from all production observations', () => {
    const census = createCapButtonSemanticProfileCensus(
      observeProductionCensus()
    );

    expect(capButtonSemanticProfileProjection).toEqual([
      'geometry.root',
      'geometry.icon',
      'rootAppearance',
    ]);
    expect(census.authoredScenarios).toBe(2_592);
    expect(census.normalizedStateTuples).toBe(1_728);
    expect(census.semanticProfiles).toBe(396);
    expect(census.semanticProfiles).toBeLessThan(census.normalizedStateTuples);
    expect(census.productSupport).toEqual({
      status: 'unknown',
      knownProfiles: 0,
      unknownProfiles: census.semanticProfiles,
    });
    expect(census).toMatchObject({
      authoredScenarios: capButtonSemanticProfileCensus.authoredScenarios,
      normalizedStateTuples:
        capButtonSemanticProfileCensus.normalizedStateTuples,
      semanticProfiles: capButtonSemanticProfileCensus.semanticProfiles,
      productSupport: capButtonSemanticProfileCensus.productSupport,
    });
    expect(
      capButtonSemanticProfileCensus.semanticFactors
        .rootAppearanceAvailabilityOutputs *
        capButtonSemanticProfileCensus.semanticFactors.sizes *
        capButtonSemanticProfileCensus.semanticFactors.shapes *
        capButtonSemanticProfileCensus.semanticFactors.geometryContentOutputs
    ).toBe(census.semanticProfiles);
  });

  it('ignores generated class identity while retaining it as a diagnostic', () => {
    const [observation] = observeProductionCensus();
    const differentClasses: CapButtonObservation = {
      ...observation,
      generatedClassSignature: {
        root: 'different-generated-root-class',
        icon: observation.generatedClassSignature?.icon
          ? 'different-generated-icon-class'
          : undefined,
      },
    };

    expect(observation.generatedClassSignature?.root).not.toBe(
      differentClasses.generatedClassSignature?.root
    );
    expect(projectCapButtonSemanticProfile(differentClasses)).toEqual(
      projectCapButtonSemanticProfile(observation)
    );
    expect(
      compareCapButtonSemanticProfiles(observation, differentClasses)
    ).toEqual([]);
  });

  it('detects a semantic style mutation even when CAP classes remain present', () => {
    const [observation] = observeProductionCensus();
    const mutation: CapButtonObservation = {
      ...observation,
      rootAppearance: {
        ...observation.rootAppearance,
        background: 'semantic-mutation',
      },
    };

    expect(observation.generatedClassSignature?.root).toBeTruthy();
    expect(mutation.generatedClassSignature).toBe(
      observation.generatedClassSignature
    );
    expect(compareCapButtonSemanticProfiles(observation, mutation)).toEqual([
      {
        path: 'rootAppearance.background',
        left: observation.rootAppearance.background,
        right: 'semantic-mutation',
      },
    ]);
  });

  it('attributes every census reduction to observed equivalence', () => {
    const census = createCapButtonSemanticProfileCensus(
      observeProductionCensus()
    );
    const attributedAuthoredReductions = census.equivalenceGroups.reduce(
      (total, group) => total + group.evidence.authoredScenarioReduction,
      0
    );
    const attributedReductions = census.equivalenceGroups.reduce(
      (total, group) => total + group.evidence.normalizedStateReduction,
      0
    );

    expect(census.equivalenceGroups).toHaveLength(census.semanticProfiles);
    expect(attributedAuthoredReductions).toBe(
      census.authoredScenarios - census.normalizedStateTuples
    );
    expect(attributedReductions).toBe(
      census.normalizedStateTuples - census.semanticProfiles
    );

    for (const group of census.equivalenceGroups) {
      const [reference, ...members] = group.members;

      expect(group.profile).toEqual(projectCapButtonSemanticProfile(reference));
      expect(group.evidence).toMatchObject({
        kind: 'observed-semantic-equivalence',
        projection: capButtonSemanticProfileProjection,
        authoredScenarioCount: group.members.length,
        productSupport: 'unknown',
      });
      expect(group.evidence.normalizedStateReduction).toBe(
        group.evidence.normalizedStateTupleCount - 1
      );
      expect(group.evidence.authoredScenarioReduction).toBe(
        group.evidence.authoredScenarioCount -
          group.evidence.normalizedStateTupleCount
      );

      for (const member of members) {
        expect(projectCapButtonSemanticProfile(member)).toEqual(
          projectCapButtonSemanticProfile(reference)
        );
      }
    }
  });
});
