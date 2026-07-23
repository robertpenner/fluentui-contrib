import type { CapturedGriffelStyleRule } from './adaptGriffelForcedColorsCapture';

export interface GriffelForcedColorsCapture {
  classNames: readonly string[];
  rules: readonly CapturedGriffelStyleRule[];
  matchingRuleIndexes: readonly number[];
}

export interface GriffelForcedColorsCaptureDifference {
  addedClassNames: string[];
  removedClassNames: string[];
  addedRules: CapturedGriffelStyleRule[];
  removedRules: CapturedGriffelStyleRule[];
  activatedRules: CapturedGriffelStyleRule[];
  deactivatedRules: CapturedGriffelStyleRule[];
}

const ruleKey = (rule: CapturedGriffelStyleRule): string =>
  JSON.stringify([
    rule.media,
    rule.selectorScope,
    Object.entries(rule.declarations).sort(([left], [right]) =>
      left.localeCompare(right)
    ),
    rule.precedence,
    rule.order,
    rule.sourceRule,
  ]);

const subtractRules = (
  rules: readonly CapturedGriffelStyleRule[],
  comparison: readonly CapturedGriffelStyleRule[]
): CapturedGriffelStyleRule[] => {
  const remainingKeys = new Map<string, number>();
  comparison.forEach((rule) => {
    const key = ruleKey(rule);
    remainingKeys.set(key, (remainingKeys.get(key) ?? 0) + 1);
  });

  return rules.filter((rule) => {
    const key = ruleKey(rule);
    const remaining = remainingKeys.get(key) ?? 0;
    if (remaining === 0) {
      return true;
    }
    remainingKeys.set(key, remaining - 1);
    return false;
  });
};

const matchingRules = (
  capture: GriffelForcedColorsCapture
): CapturedGriffelStyleRule[] =>
  capture.matchingRuleIndexes.flatMap((index) => capture.rules[index] ?? []);

export const diffGriffelForcedColorsCaptures = (
  baseline: GriffelForcedColorsCapture,
  candidate: GriffelForcedColorsCapture
): GriffelForcedColorsCaptureDifference => ({
  addedClassNames: candidate.classNames.filter(
    (className) => !baseline.classNames.includes(className)
  ),
  removedClassNames: baseline.classNames.filter(
    (className) => !candidate.classNames.includes(className)
  ),
  addedRules: subtractRules(candidate.rules, baseline.rules),
  removedRules: subtractRules(baseline.rules, candidate.rules),
  activatedRules: subtractRules(
    matchingRules(candidate),
    matchingRules(baseline)
  ),
  deactivatedRules: subtractRules(
    matchingRules(baseline),
    matchingRules(candidate)
  ),
});
