import type {
  EmissionDiagnostic,
  EmissionResult,
  EmittedStyleRule,
  ForcedColorsEmissionMetrics,
} from './ForcedColorsEmission';

const stableDeclarations = (
  declarations: Readonly<Record<string, string>>
): string =>
  JSON.stringify(
    Object.entries(declarations).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  );

const exactIdentity = (rule: EmittedStyleRule): string =>
  JSON.stringify({
    media: rule.media,
    selectorScope: rule.selectorScope,
    declarations: stableDeclarations(rule.declarations),
    precedence: rule.precedence,
    order: rule.order,
    specificity: rule.specificity,
    component: rule.component,
    slot: rule.slot,
    semanticDecision: rule.semanticDecision,
  });

const mergeIdentity = (rule: EmittedStyleRule): string =>
  JSON.stringify({
    media: rule.media,
    selectorScope: rule.selectorScope,
    precedence: rule.precedence,
    order: rule.order,
    specificity: rule.specificity,
    component: rule.component,
    slot: rule.slot,
  });

const blockedDimensions = (
  left: EmittedStyleRule,
  right: EmittedStyleRule
): readonly string[] => {
  const blockedBy: string[] = [];
  if (left.media !== right.media) {
    blockedBy.push('media');
  }
  if (left.selectorScope !== right.selectorScope) {
    blockedBy.push('selectorScope');
  }
  if (left.component !== right.component) {
    blockedBy.push('component');
  }
  if (left.slot !== right.slot) {
    blockedBy.push('slot');
  }
  if (left.precedence !== right.precedence) {
    blockedBy.push('precedence');
  }
  if (left.order !== right.order) {
    blockedBy.push('order');
  }
  if (left.specificity !== right.specificity) {
    blockedBy.push('specificity');
  }
  for (const property of Object.keys(left.declarations)) {
    if (
      property in right.declarations &&
      left.declarations[property] !== right.declarations[property]
    ) {
      blockedBy.push(`declaration:${property}`);
    }
  }
  return blockedBy;
};

export const evaluateEmission = (
  rules: readonly EmittedStyleRule[]
): Readonly<Record<string, string>> => {
  const declarations: Record<string, string> = {};
  for (const rule of [...rules].sort(
    (left, right) =>
      left.precedence - right.precedence ||
      left.specificity - right.specificity ||
      left.order - right.order
  )) {
    Object.assign(declarations, rule.declarations);
  }
  return declarations;
};

export const normalizeForcedColorsEmission = (
  result: EmissionResult
): EmissionResult => {
  const normalized: EmittedStyleRule[] = [];
  const diagnostics: EmissionDiagnostic[] = [...result.diagnostics];

  result.rules.forEach((rule, ruleIndex) => {
    const duplicateIndex = normalized.findIndex(
      (candidate) => exactIdentity(candidate) === exactIdentity(rule)
    );
    if (duplicateIndex >= 0) {
      const duplicate = normalized[duplicateIndex];
      normalized[duplicateIndex] = {
        ...duplicate,
        sourceRules: [...duplicate.sourceRules, ...rule.sourceRules],
      };
      diagnostics.push({
        kind: 'merged',
        ruleIndexes: [duplicateIndex, ruleIndex],
        blockedBy: [],
        explanation:
          'Exact duplicate retained one cascade position and combined provenance.',
      });
      return;
    }

    const compatibleIndex = normalized.findIndex(
      (candidate) => mergeIdentity(candidate) === mergeIdentity(rule)
    );
    if (compatibleIndex >= 0) {
      const compatible = normalized[compatibleIndex];
      const blockedBy = blockedDimensions(compatible, rule);
      if (blockedBy.length === 0) {
        normalized[compatibleIndex] = {
          ...compatible,
          declarations: { ...compatible.declarations, ...rule.declarations },
          sourceRules: [...compatible.sourceRules, ...rule.sourceRules],
          semanticDecision: compatible.semanticDecision,
        };
        diagnostics.push({
          kind: 'merged',
          ruleIndexes: [compatibleIndex, ruleIndex],
          blockedBy: [],
          explanation:
            'Rules shared scope and cascade dimensions and had compatible declarations.',
        });
        return;
      }
      diagnostics.push({
        kind: 'unsafeToMerge',
        ruleIndexes: [compatibleIndex, ruleIndex],
        blockedBy,
        explanation: `Rules at one scope remain separate because ${blockedBy.join(
          ', '
        )} conflict.`,
      });
    }

    normalized.push(rule);
  });

  for (let leftIndex = 0; leftIndex < result.rules.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < result.rules.length;
      rightIndex += 1
    ) {
      const left = result.rules[leftIndex];
      const right = result.rules[rightIndex];
      const sharesDeclarationProperty = Object.keys(left.declarations).some(
        (property) => property in right.declarations
      );
      if (
        stableDeclarations(left.declarations) !==
          stableDeclarations(right.declarations) &&
        !sharesDeclarationProperty
      ) {
        continue;
      }
      const blockedBy = blockedDimensions(left, right);
      if (blockedBy.length > 0) {
        diagnostics.push({
          kind: 'unsafeToMerge',
          ruleIndexes: [leftIndex, rightIndex],
          blockedBy,
          explanation: `Textually equal declarations remain separate because ${blockedBy.join(
            ', '
          )} differ.`,
        });
      }
    }
  }

  const decisions = new Set(
    result.rules.map((rule) => stableDeclarations(rule.declarations))
  );
  if (result.rules.length > decisions.size) {
    diagnostics.push({
      kind: 'semanticCompression',
      ruleIndexes: result.rules.map((_, index) => index),
      blockedBy: [],
      explanation: `${result.rules.length} emitted rules represent ${decisions.size} declaration decisions; inspect scope before proposing compression.`,
    });
  }

  return { rules: normalized, diagnostics };
};

export const measureForcedColorsEmission = (
  original: EmissionResult,
  normalized: EmissionResult
): ForcedColorsEmissionMetrics => ({
  semanticDecisions: new Set(
    original.rules.map((rule) => rule.semanticDecision)
  ).size,
  emittedRules: original.rules.length,
  exactDuplicateRules:
    original.rules.length -
    new Set(original.rules.map((rule) => exactIdentity(rule))).size,
  safelyNormalizedRules: original.rules.length - normalized.rules.length,
  unsafeToMergePairs: normalized.diagnostics.filter(
    (diagnostic) => diagnostic.kind === 'unsafeToMerge'
  ).length,
  distinctScopes: new Set(
    original.rules.map(
      (rule) => `${rule.component}/${rule.slot}/${rule.selectorScope}`
    )
  ).size,
});
