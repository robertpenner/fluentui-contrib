import type {
  CapButtonObservation,
  CapButtonSemanticObservation,
} from './CapButtonObservation';
import {
  capButtonSemanticProfileKey,
  compareCapButtonSemanticProfileCensuses,
} from './semanticProfiles';
import type { CapButtonContractGroup } from './versionedVerification';

export const capButtonLawClassifications = [
  'production-observation',
  'derived-invariant',
  'product-contract',
  'research-assumption',
] as const;

export type CapButtonLawClassification =
  (typeof capButtonLawClassifications)[number];

export interface CapButtonLaw {
  readonly id: string;
  readonly classification: CapButtonLawClassification;
  readonly statement: string;
  readonly contractGroup?: CapButtonContractGroup;
  readonly semanticPaths: readonly string[];
  readonly semanticProfileKeys?: readonly string[];
}

export interface CapButtonConformanceLaw extends CapButtonLaw {
  readonly classification: Exclude<
    CapButtonLawClassification,
    'research-assumption'
  >;
  readonly contractGroup: CapButtonContractGroup;
}

export interface CapButtonResearchAssumption extends CapButtonLaw {
  readonly classification: 'research-assumption';
}

export type CapButtonLawDiagnostic =
  | {
      readonly kind: 'contradictory-classification';
      readonly lawId: string;
      readonly classifications: readonly CapButtonLawClassification[];
    }
  | {
      readonly kind: 'unreachable-semantic-profile';
      readonly lawId: string;
      readonly semanticProfileKey: string;
    };

export interface CapButtonProductionLawFailure {
  readonly kind: 'production-rule-mutation';
  readonly lawId: string;
  readonly classification: CapButtonConformanceLaw['classification'];
  readonly contractGroup: CapButtonContractGroup;
  readonly paths: readonly string[];
}

export const capButtonConformanceLaws: readonly CapButtonConformanceLaw[] = [
  {
    id: 'observed-root-geometry',
    classification: 'production-observation',
    statement:
      'Scoped root geometry remains equal to the pinned production observation.',
    contractGroup: 'geometry',
    semanticPaths: ['geometry.root'],
  },
  {
    id: 'observed-icon-geometry',
    classification: 'production-observation',
    statement:
      'Scoped icon geometry remains equal to the pinned production observation.',
    contractGroup: 'geometry',
    semanticPaths: ['geometry.icon'],
  },
  {
    id: 'observed-root-appearance',
    classification: 'production-observation',
    statement:
      'Scoped root appearance remains equal to the pinned production observation.',
    contractGroup: 'appearance',
    semanticPaths: ['rootAppearance'],
  },
  {
    id: 'observed-semantic-equivalence',
    classification: 'derived-invariant',
    statement:
      'Semantic profile groups contain only observations equal under the declared projection.',
    contractGroup: 'appearance',
    semanticPaths: [],
  },
];

export const capButtonResearchAssumptions: readonly CapButtonResearchAssumption[] =
  [
    {
      id: 'legacy-synthetic-button-cross-product',
      classification: 'research-assumption',
      statement:
        'The historical product, density, and composition cross-product is a research domain, not CAP Button conformance.',
      semanticPaths: [],
    },
  ];

export const diagnoseCapButtonLaws = (
  laws: readonly CapButtonLaw[],
  observations: readonly CapButtonSemanticObservation[]
): readonly CapButtonLawDiagnostic[] => {
  const diagnostics: CapButtonLawDiagnostic[] = [];
  const classificationsByLaw = new Map<
    string,
    CapButtonLawClassification[]
  >();
  const reachableProfileKeys = new Set(
    observations.map(capButtonSemanticProfileKey)
  );

  for (const law of laws) {
    const classifications = classificationsByLaw.get(law.id) ?? [];

    if (!classifications.includes(law.classification)) {
      classifications.push(law.classification);
    }
    classificationsByLaw.set(law.id, classifications);

    for (const semanticProfileKey of law.semanticProfileKeys ?? []) {
      if (!reachableProfileKeys.has(semanticProfileKey)) {
        diagnostics.push({
          kind: 'unreachable-semantic-profile',
          lawId: law.id,
          semanticProfileKey,
        });
      }
    }
  }

  for (const [lawId, classifications] of classificationsByLaw) {
    if (classifications.length > 1) {
      diagnostics.unshift({
        kind: 'contradictory-classification',
        lawId,
        classifications,
      });
    }
  }

  return diagnostics;
};

const pathBelongsToLaw = (
  path: string,
  law: CapButtonConformanceLaw
): boolean =>
  law.semanticPaths.some(
    (semanticPath) =>
      path === semanticPath || path.startsWith(`${semanticPath}.`)
  );

export const evaluateCapButtonProductionLaws = (
  baseline: readonly CapButtonObservation[],
  actual: readonly CapButtonObservation[],
  laws: readonly CapButtonConformanceLaw[] = capButtonConformanceLaws
): readonly CapButtonProductionLawFailure[] => {
  const difference = compareCapButtonSemanticProfileCensuses(baseline, actual);
  const changedPaths = new Set(
    difference.changedObservations.flatMap((change) =>
      change.differences.map(({ path }) => path)
    )
  );
  const failures: CapButtonProductionLawFailure[] = [];

  for (const law of laws) {
    const paths = [...changedPaths].filter((path) =>
      pathBelongsToLaw(path, law)
    );

    if (paths.length > 0) {
      failures.push({
        kind: 'production-rule-mutation',
        lawId: law.id,
        classification: law.classification,
        contractGroup: law.contractGroup,
        paths,
      });
    }
  }

  return failures;
};