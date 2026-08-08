import {
  anatomyPolicies,
  appearances,
  contentKinds,
  iconPlacements,
  products,
  visualLanguages,
  type ButtonCase,
} from '../domain/ButtonCase';
import {
  buttonCaseAxes,
  buttonCaseCensus,
  contentConstructionCensus,
  enumerateButtonCases,
  productPolicyCensus,
} from '../domain/census';
import {
  invalidButtonCaseReasons,
  isValidButtonCase,
} from '../domain/validity';
import {
  resolveLayeredButton,
  resolveLayeredButtonWithHistory,
} from '../layered/resolveLayeredButton';
import { resolveForcedColorsContract } from '../semantic/resolveForcedColorsContract';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';

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
      match: { kind: 'prefix', value: 'src/domain/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Historical eleven-axis research ontology and policy inputs.',
    },
    {
      match: { kind: 'prefix', value: 'src/research/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Explicit public boundary for retained synthetic research.',
    },
    {
      match: { kind: 'prefix', value: 'src/layered/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Ordered-override architecture experiment.',
    },
    {
      match: { kind: 'prefix', value: 'src/semantic/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Semantic-composition architecture experiment.',
    },
    {
      match: { kind: 'prefix', value: 'src/testing/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Property and mutation experiments over the synthetic domain.',
    },
    {
      match: { kind: 'prefix', value: 'src/render/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Synthetic contract rendering and browser demonstrations.',
    },
    {
      match: { kind: 'prefix', value: 'src/comparison/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Comparison instruments for the two research architectures.',
    },
    {
      match: { kind: 'prefix', value: 'src/emission/' },
      classification: 'synthetic-research',
      policy: 'retain-with-synthetic-label',
      purpose: 'Synthetic forced-colors emission and normalization experiments.',
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
      purpose: 'Synthetic emission cards beside separately labeled CAP capture.',
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
      match: {
        kind: 'path',
        value: 'src/grounding/contentAnatomyGrounding.ts',
      },
      classification: 'migration',
      policy: 'replace-legacy-dependency',
      purpose: 'Production grounding still borrows two synthetic type labels.',
    },
    {
      match: { kind: 'path', value: 'src/index.ts' },
      classification: 'removal',
      policy: 'remove-in-issue-21',
      purpose: 'Raw legacy root exports retained only through migration.',
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
export const explainSyntheticButtonResearchExclusion =
  invalidButtonCaseReasons;
export const resolveSyntheticLayeredButton = resolveLayeredButton;
export const resolveSyntheticLayeredButtonWithHistory =
  resolveLayeredButtonWithHistory;
export const resolveSyntheticSemanticButton = resolveSemanticButton;
export const resolveSyntheticForcedColorsContract =
  resolveForcedColorsContract;