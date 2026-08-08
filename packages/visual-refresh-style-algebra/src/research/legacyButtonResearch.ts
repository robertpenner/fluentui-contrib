import {
  anatomyPolicies,
  appearances,
  contentKinds,
  iconPlacements,
  products,
  visualLanguages,
  type ButtonCase,
} from './domain/ButtonCase';
import {
  buttonCaseAxes,
  buttonCaseCensus,
  contentConstructionCensus,
  enumerateButtonCases,
  productPolicyCensus,
} from './domain/census';
import { invalidButtonCaseReasons, isValidButtonCase } from './domain/validity';
import {
  resolveLayeredButton,
  resolveLayeredButtonWithHistory,
} from './layered/resolveLayeredButton';
import { compareContracts } from './comparison/compareContracts';
import { adaptGriffelForcedColorsCapture } from './emission/adaptGriffelForcedColorsCapture';
import {
  captureGriffelForcedColorsFixture,
  captureGriffelForcedColorsRules,
} from './emission/captureGriffelForcedColorsRules';
import { createForcedColorsEmissionExperiment } from './emission/createForcedColorsEmissionExperiment';
import {
  diffGriffelForcedColorsCaptures,
  type GriffelForcedColorsCapture,
  type GriffelForcedColorsCaptureDifference,
} from './emission/diffGriffelForcedColorsCaptures';
import type {
  EmittedStyleRule,
  EmissionResult,
  ForcedColorsEmissionTarget,
} from './emission/ForcedColorsEmission';
import {
  measureForcedColorsEmission,
  normalizeForcedColorsEmission,
} from './emission/normalizeForcedColorsEmission';
import { CleanRoomButton } from './render/CleanRoomButton';
import { resolveForcedColorsContract } from './semantic/resolveForcedColorsContract';
import { resolveSemanticButton } from './semantic/resolveSemanticButton';
import { resolveButtonWithMutation } from './testing/mutations';

export type LegacyButtonConsumerClassification =
  | 'production-conformance'
  | 'synthetic-research'
  | 'migration'
  | 'removal';

export type LegacyButtonConsumerPolicy =
  | 'must-not-import-legacy'
  | 'retain-with-synthetic-label'
  | 'replace-legacy-dependency'
  | 'remove-in-issue-21';

export type LegacyButtonConsumerMatch =
  | { readonly kind: 'path'; readonly value: string }
  | { readonly kind: 'prefix'; readonly value: string };

export interface LegacyButtonConsumerInventoryEntry {
  readonly match: LegacyButtonConsumerMatch;
  readonly classification: LegacyButtonConsumerClassification;
  readonly policy: LegacyButtonConsumerPolicy;
  readonly purpose: string;
}

export const legacyButtonConsumerInventory: readonly LegacyButtonConsumerInventoryEntry[] =
  [
    {
      match: { kind: 'prefix', value: 'src/cap-model/' },
      classification: 'production-conformance',
      policy: 'must-not-import-legacy',
      purpose: 'Production-observed CAP Button replacement model.',
    },
    {
      match: { kind: 'prefix', value: 'stories/CapAuditIntroduction/' },
      classification: 'production-conformance',
      policy: 'must-not-import-legacy',
      purpose: 'Production-first CAP Button audit reading path.',
    },
    {
      match: { kind: 'prefix', value: 'src/research/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose:
        'Historical ontology, architecture, emission, rendering, and test experiments.',
    },
    {
      match: { kind: 'prefix', value: 'stories/ButtonComparison/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Layered-versus-semantic visual comparison.',
    },
    {
      match: { kind: 'prefix', value: 'stories/ButtonMatrix/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Curated synthetic scenario matrix.',
    },
    {
      match: { kind: 'prefix', value: 'stories/CaseCensus/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Historical raw and model-admitted synthetic census.',
    },
    {
      match: { kind: 'prefix', value: 'stories/Counterexamples/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Synthetic mutation counterexamples.',
    },
    {
      match: { kind: 'prefix', value: 'stories/ForcedColors/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose:
        'Synthetic emission cards beside separately labeled CAP capture.',
    },
    {
      match: { kind: 'prefix', value: 'stories/Walkthrough/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Teaching path for the architecture experiment.',
    },
    {
      match: { kind: 'path', value: 'stories/fixtures.ts' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Synthetic story fixtures.',
    },
    {
      match: { kind: 'path', value: 'stories/storySupport.tsx' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Synthetic story comparison and rejection helpers.',
    },
    {
      match: { kind: 'path', value: 'docs/model.md' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Historical synthetic model and its stated assumptions.',
    },
    {
      match: { kind: 'path', value: 'docs/architectures.md' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Layered-versus-semantic architecture experiment.',
    },
    {
      match: { kind: 'path', value: 'docs/laws.md' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Properties over the synthetic research domain.',
    },
    {
      match: { kind: 'path', value: 'docs/mutations.md' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Mutation sensitivity of synthetic research laws.',
    },
  ];

export const classifyLegacyButtonConsumer = (
  path: string
): LegacyButtonConsumerInventoryEntry | undefined => {
  const normalizedPath = path.split('\\').join('/').replace(/^\.\//, '');

  return legacyButtonConsumerInventory.find(({ match }) =>
    match.kind === 'path'
      ? normalizedPath === match.value
      : normalizedPath.startsWith(match.value)
  );
};

export type SyntheticButtonResearchCase = ButtonCase;

export const syntheticButtonResearchMetadata = {
  kind: 'synthetic-button-research',
  provenance: 'historical-eleven-axis-button-model',
  rawTuples: buttonCaseCensus.rawTotal,
  admittedCases: buttonCaseCensus.validTotal,
  productSupport: 'not-evaluated',
} as const;

export const syntheticButtonResearchAxes = buttonCaseAxes;
export const syntheticButtonResearchCensus = buttonCaseCensus;
export const syntheticButtonResearchAnatomyPolicies = anatomyPolicies;
export const syntheticButtonResearchAppearances = appearances;
export const syntheticButtonResearchContentConstructionCensus =
  contentConstructionCensus;
export const syntheticButtonResearchContentKinds = contentKinds;
export const syntheticButtonResearchIconPlacements = iconPlacements;
export const syntheticButtonResearchProductPolicyCensus = productPolicyCensus;
export const syntheticButtonResearchProducts = products;
export const syntheticButtonResearchVisualLanguages = visualLanguages;
export const enumerateSyntheticButtonResearchCases = enumerateButtonCases;
export const isSyntheticButtonResearchCaseAdmitted = isValidButtonCase;
export const explainSyntheticButtonResearchExclusion = invalidButtonCaseReasons;
export const resolveSyntheticLayeredButton = resolveLayeredButton;
export const resolveSyntheticLayeredButtonWithHistory =
  resolveLayeredButtonWithHistory;
export const resolveSyntheticSemanticButton = resolveSemanticButton;
export const resolveSyntheticForcedColorsContract = resolveForcedColorsContract;
export const compareSyntheticButtonResearchContracts = compareContracts;
export const SyntheticButtonResearchRenderer = CleanRoomButton;
export const createSyntheticForcedColorsEmissionExperiment =
  createForcedColorsEmissionExperiment;
export const measureSyntheticForcedColorsEmission = measureForcedColorsEmission;
export const normalizeSyntheticForcedColorsEmission =
  normalizeForcedColorsEmission;
export const adaptSyntheticGriffelForcedColorsCapture =
  adaptGriffelForcedColorsCapture;
export const captureSyntheticGriffelForcedColorsRules =
  captureGriffelForcedColorsRules;
export const captureSyntheticGriffelForcedColorsFixture =
  captureGriffelForcedColorsFixture;
export const diffSyntheticGriffelForcedColorsCaptures =
  diffGriffelForcedColorsCaptures;
export const resolveSyntheticButtonWithMutation = resolveButtonWithMutation;

export type SyntheticEmittedStyleRule = EmittedStyleRule;
export type SyntheticEmissionResult = EmissionResult;
export type SyntheticForcedColorsEmissionTarget = ForcedColorsEmissionTarget;
export type SyntheticGriffelForcedColorsCapture = GriffelForcedColorsCapture;
export type SyntheticGriffelForcedColorsCaptureDifference =
  GriffelForcedColorsCaptureDifference;
