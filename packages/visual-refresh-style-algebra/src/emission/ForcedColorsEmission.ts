export const FORCED_COLORS_MEDIA = '(forced-colors: active)';

export type ForcedColorsComponent = 'Button' | 'ToggleButton' | 'SplitButton';
export type ForcedColorsSlot = 'root' | 'primaryAction' | 'menuAction';
export type ForcedColorsDecision =
  | 'appearance'
  | 'focusIndicator'
  | 'visibleBoundary'
  | 'disabledState';

export interface ForcedColorsEmissionTarget {
  component: ForcedColorsComponent;
  slot: ForcedColorsSlot;
}

export interface EmittedStyleRule {
  media?: string;
  selectorScope: string;
  declarations: Readonly<Record<string, string>>;
  precedence: number;
  order: number;
  specificity: number;
  sourceRules: readonly string[];
  component: ForcedColorsComponent;
  slot: ForcedColorsSlot;
  semanticDecision: ForcedColorsDecision;
}

export interface EmissionDiagnostic {
  kind: 'merged' | 'unsafeToMerge' | 'semanticCompression';
  ruleIndexes: readonly number[];
  blockedBy: readonly string[];
  explanation: string;
}

export interface EmissionResult {
  rules: readonly EmittedStyleRule[];
  diagnostics: readonly EmissionDiagnostic[];
}

export interface ForcedColorsEmissionMetrics {
  semanticDecisions: number;
  emittedRules: number;
  exactDuplicateRules: number;
  safelyNormalizedRules: number;
  unsafeToMergePairs: number;
  distinctScopes: number;
}
