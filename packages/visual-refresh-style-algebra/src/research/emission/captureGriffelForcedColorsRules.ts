import type { CapturedGriffelStyleRule } from './adaptGriffelForcedColorsCapture';
import type { GriffelForcedColorsCapture } from './diffGriffelForcedColorsCaptures';
import { selectorContainsClass } from '../../diagnostics/selectorContainsClass';

const FORCED_COLORS_ACTIVE = '(forced-colors: active)';

export { selectorContainsClass } from '../../diagnostics/selectorContainsClass';

export const isForcedColorsActiveCondition = (condition: string): boolean =>
  condition.trim().toLowerCase() === FORCED_COLORS_ACTIVE;

export const captureGriffelForcedColorsRules = (
  styleSheets: StyleSheetList,
  classNames: readonly string[]
): CapturedGriffelStyleRule[] => {
  const captures: CapturedGriffelStyleRule[] = [];
  let order = 0;

  for (const [styleSheetIndex, styleSheet] of Array.from(
    styleSheets
  ).entries()) {
    let cssRules: CSSRuleList;
    try {
      cssRules = styleSheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(cssRules)) {
      if (
        !(rule instanceof CSSMediaRule) ||
        !isForcedColorsActiveCondition(rule.conditionText)
      ) {
        continue;
      }

      for (const nestedRule of Array.from(rule.cssRules)) {
        if (!(nestedRule instanceof CSSStyleRule)) {
          continue;
        }
        const sourceOrder = order;
        order += 1;

        if (
          !classNames.some((className) =>
            selectorContainsClass(nestedRule.selectorText, className)
          )
        ) {
          continue;
        }

        captures.push({
          media: rule.conditionText,
          selectorScope: nestedRule.selectorText,
          declarations: Object.fromEntries(
            Array.from(nestedRule.style).map((property) => [
              property,
              nestedRule.style.getPropertyValue(property),
            ])
          ),
          precedence: styleSheetIndex,
          order: sourceOrder,
          sourceRule: nestedRule.cssText,
        });
      }
    }
  }

  return captures;
};

export const captureGriffelForcedColorsFixture = (
  styleSheets: StyleSheetList,
  element: Element
): GriffelForcedColorsCapture => {
  const classNames = [...element.classList];
  const rules = captureGriffelForcedColorsRules(styleSheets, classNames);

  return {
    classNames,
    rules,
    matchingRuleIndexes: rules.flatMap((rule, index) =>
      element.matches(rule.selectorScope) ? [index] : []
    ),
  };
};
