import type {
  CapButtonGeometry,
  CapButtonObservation,
  CapButtonRootAppearance,
  CapButtonSemanticObservation,
} from './CapButtonObservation';
import { capButtonProductionBaseline } from './evidence';

export const capButtonSemanticProfileProjection = [
  'geometry.root',
  'geometry.icon',
  'rootAppearance',
] as const;

export interface CapButtonSemanticProfile {
  readonly geometry: CapButtonGeometry;
  readonly rootAppearance: CapButtonRootAppearance;
}

export interface CapButtonSemanticProfileDifference {
  readonly path: string;
  readonly left: unknown;
  readonly right: unknown;
}

export interface CapButtonChangedSemanticObservation {
  readonly key: string;
  readonly differences: readonly CapButtonSemanticProfileDifference[];
}

export interface CapButtonSemanticProfileCensusDifference {
  readonly baselineProfileCount: number;
  readonly actualProfileCount: number;
  readonly addedProfileKeys: readonly string[];
  readonly removedProfileKeys: readonly string[];
  readonly addedObservationKeys: readonly string[];
  readonly removedObservationKeys: readonly string[];
  readonly changedObservations: readonly CapButtonChangedSemanticObservation[];
}

export interface CapButtonObservedEquivalenceEvidence {
  readonly kind: 'observed-semantic-equivalence';
  readonly projection: typeof capButtonSemanticProfileProjection;
  readonly productionBaselines: readonly string[];
  readonly authoredScenarioCount: number;
  readonly authoredScenarioReduction: number;
  readonly normalizedStateTupleCount: number;
  readonly normalizedStateReduction: number;
  readonly productSupport: 'unknown';
}

export interface CapButtonSemanticProfileGroup {
  readonly key: string;
  readonly profile: CapButtonSemanticProfile;
  readonly members: readonly CapButtonObservation[];
  readonly evidence: CapButtonObservedEquivalenceEvidence;
}

export interface CapButtonSemanticProfileCensus {
  readonly authoredScenarios: number;
  readonly normalizedStateTuples: number;
  readonly semanticProfiles: number;
  readonly productSupport: {
    readonly status: 'unknown';
    readonly knownProfiles: 0;
    readonly unknownProfiles: number;
  };
  readonly equivalenceGroups: readonly CapButtonSemanticProfileGroup[];
}

export const capButtonSemanticProfileCensus = {
  scope:
    'effective CAP Button root and icon geometry plus root appearance for the scoped basic Button inputs',
  productionBaseline: capButtonProductionBaseline.id,
  projection: capButtonSemanticProfileProjection,
  authoredScenarios: 2_592,
  normalizedStateTuples: 1_728,
  semanticProfiles: 396,
  semanticFactors: {
    rootAppearanceAvailabilityOutputs: 11,
    sizes: 3,
    shapes: 3,
    geometryContentOutputs: 4,
  },
  authoredScenarioReduction: {
    count: 864,
    attribution: 'observed-equivalence-groups',
  },
  normalizedStateReduction: {
    count: 1_332,
    attribution: 'observed-equivalence-groups',
  },
  generatedClassProfiles: {
    count: 504,
    status: 'version-sensitive-diagnostic',
  },
  productSupport: {
    status: 'unknown',
    knownProfiles: 0,
    unknownProfiles: 396,
  },
} as const;

export const projectCapButtonSemanticProfile = (
  observation: CapButtonSemanticObservation
): CapButtonSemanticProfile => {
  const { root, icon } = observation.geometry;
  const { focusTreatment } = observation.rootAppearance;

  return {
    geometry: {
      root: {
        paddingTop: root.paddingTop,
        paddingRight: root.paddingRight,
        paddingBottom: root.paddingBottom,
        paddingLeft: root.paddingLeft,
        borderTopLeftRadius: root.borderTopLeftRadius,
        borderTopRightRadius: root.borderTopRightRadius,
        borderBottomRightRadius: root.borderBottomRightRadius,
        borderBottomLeftRadius: root.borderBottomLeftRadius,
        minWidth: root.minWidth,
        maxWidth: root.maxWidth,
        fontSize: root.fontSize,
        fontWeight: root.fontWeight,
        lineHeight: root.lineHeight,
      },
      icon: icon
        ? {
            fontSize: icon.fontSize,
            marginLeft: icon.marginLeft,
            marginRight: icon.marginRight,
          }
        : undefined,
    },
    rootAppearance: {
      foreground: observation.rootAppearance.foreground,
      background: observation.rootAppearance.background,
      border: {
        top: observation.rootAppearance.border.top,
        right: observation.rootAppearance.border.right,
        bottom: observation.rootAppearance.border.bottom,
        left: observation.rootAppearance.border.left,
      },
      focusTreatment: {
        selection: focusTreatment.selection,
        border: {
          top: focusTreatment.border.top,
          right: focusTreatment.border.right,
          bottom: focusTreatment.border.bottom,
          left: focusTreatment.border.left,
        },
        outline: {
          color: focusTreatment.outline.color,
          style: focusTreatment.outline.style,
          width: focusTreatment.outline.width,
        },
        innerShadow: focusTreatment.innerShadow,
      },
    },
  };
};

export const capButtonSemanticProfileKey = (
  observation: CapButtonSemanticObservation
): string => JSON.stringify(projectCapButtonSemanticProfile(observation));

export const capButtonSemanticObservationKey = (
  observation: CapButtonObservation
): string =>
  JSON.stringify({
    scenario: observation.scenario,
    conditions: observation.conditions,
    productionBaseline: observation.productionBaseline,
  });

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const compareValues = (
  left: unknown,
  right: unknown,
  path: string,
  differences: CapButtonSemanticProfileDifference[]
): void => {
  if (left === right) {
    return;
  }

  if (isRecord(left) && isRecord(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);

    for (const key of keys) {
      compareValues(
        left[key],
        right[key],
        path.length === 0 ? key : `${path}.${key}`,
        differences
      );
    }
    return;
  }

  differences.push({ path, left, right });
};

export const compareCapButtonSemanticProfiles = (
  left: CapButtonSemanticObservation,
  right: CapButtonSemanticObservation
): readonly CapButtonSemanticProfileDifference[] => {
  const differences: CapButtonSemanticProfileDifference[] = [];

  compareValues(
    projectCapButtonSemanticProfile(left),
    projectCapButtonSemanticProfile(right),
    '',
    differences
  );

  return differences;
};

const difference = (
  left: ReadonlySet<string>,
  right: ReadonlySet<string>
): readonly string[] => [...left].filter((key) => !right.has(key)).sort();

export const compareCapButtonSemanticProfileCensuses = (
  baseline: readonly CapButtonObservation[],
  actual: readonly CapButtonObservation[]
): CapButtonSemanticProfileCensusDifference => {
  const baselineProfiles = new Set(baseline.map(capButtonSemanticProfileKey));
  const actualProfiles = new Set(actual.map(capButtonSemanticProfileKey));
  const baselineObservations = new Map(
    baseline.map((observation) => [
      capButtonSemanticObservationKey(observation),
      observation,
    ])
  );
  const actualObservations = new Map(
    actual.map((observation) => [
      capButtonSemanticObservationKey(observation),
      observation,
    ])
  );
  const changedObservations: CapButtonChangedSemanticObservation[] = [];

  for (const [key, baselineObservation] of baselineObservations) {
    const actualObservation = actualObservations.get(key);

    if (actualObservation) {
      const differences = compareCapButtonSemanticProfiles(
        baselineObservation,
        actualObservation
      );

      if (differences.length > 0) {
        changedObservations.push({ key, differences });
      }
    }
  }

  return {
    baselineProfileCount: baselineProfiles.size,
    actualProfileCount: actualProfiles.size,
    addedProfileKeys: difference(actualProfiles, baselineProfiles),
    removedProfileKeys: difference(baselineProfiles, actualProfiles),
    addedObservationKeys: difference(
      new Set(actualObservations.keys()),
      new Set(baselineObservations.keys())
    ),
    removedObservationKeys: difference(
      new Set(baselineObservations.keys()),
      new Set(actualObservations.keys())
    ),
    changedObservations,
  };
};

export const createCapButtonSemanticProfileCensus = (
  observations: readonly CapButtonObservation[]
): CapButtonSemanticProfileCensus => {
  const groups = new Map<string, CapButtonObservation[]>();
  const normalizedStateKeys = new Set<string>();

  for (const observation of observations) {
    const key = capButtonSemanticProfileKey(observation);
    const members = groups.get(key) ?? [];

    members.push(observation);
    groups.set(key, members);
    normalizedStateKeys.add(JSON.stringify(observation.normalized));
  }

  const equivalenceGroups = [...groups.entries()].map(
    ([key, members]): CapButtonSemanticProfileGroup => {
      const normalizedStates = new Set(
        members.map((member) => JSON.stringify(member.normalized))
      );

      return {
        key,
        profile: projectCapButtonSemanticProfile(members[0]),
        members,
        evidence: {
          kind: 'observed-semantic-equivalence',
          projection: capButtonSemanticProfileProjection,
          productionBaselines: [
            ...new Set(members.map((member) => member.productionBaseline)),
          ],
          authoredScenarioCount: members.length,
          authoredScenarioReduction: members.length - normalizedStates.size,
          normalizedStateTupleCount: normalizedStates.size,
          normalizedStateReduction: normalizedStates.size - 1,
          productSupport: 'unknown',
        },
      };
    }
  );

  return {
    authoredScenarios: observations.length,
    normalizedStateTuples: normalizedStateKeys.size,
    semanticProfiles: equivalenceGroups.length,
    productSupport: {
      status: 'unknown',
      knownProfiles: 0,
      unknownProfiles: equivalenceGroups.length,
    },
    equivalenceGroups,
  };
};
