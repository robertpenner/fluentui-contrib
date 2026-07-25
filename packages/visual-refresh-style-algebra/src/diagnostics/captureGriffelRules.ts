import { selectorContainsClass } from '../emission/captureGriffelForcedColorsRules';

/**
 * A single CSS rule Griffel inserted, captured from the live CSSOM.
 *
 * Unlike the forced-colors capture, this keeps rules from every media context so a
 * fixture can be examined for boundary, focus, selected, and disabled declarations
 * in ordinary rendering as well as under `forced-colors: active`.
 */
export interface CapturedGriffelRule {
  /** The enclosing media condition, or `''` for a rule outside any media block. */
  readonly media: string;
  readonly selector: string;
  readonly declarations: Readonly<Record<string, string>>;
  readonly cssText: string;
}

const readDeclarations = (
  style: CSSStyleDeclaration
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    // `CSSStyleDeclaration` is array-like but not iterable in jsdom.
    Array.from(style).map((property) => [
      property,
      style.getPropertyValue(property),
    ])
  );

const collectFromRules = (
  rules: CSSRuleList,
  media: string,
  classNames: readonly string[],
  captured: CapturedGriffelRule[]
): void => {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSMediaRule) {
      collectFromRules(rule.cssRules, rule.conditionText, classNames, captured);
      continue;
    }

    if (!(rule instanceof CSSStyleRule)) {
      continue;
    }

    if (
      !classNames.some((className) =>
        selectorContainsClass(rule.selectorText, className)
      )
    ) {
      continue;
    }

    captured.push({
      media,
      selector: rule.selectorText,
      declarations: readDeclarations(rule.style),
      cssText: rule.cssText,
    });
  }
};

/** Captures every inserted rule that targets one of the given atomic class names. */
export const captureGriffelRules = (
  styleSheets: StyleSheetList,
  classNames: readonly string[]
): readonly CapturedGriffelRule[] => {
  const captured: CapturedGriffelRule[] = [];

  for (const styleSheet of Array.from(styleSheets)) {
    let cssRules: CSSRuleList;
    try {
      cssRules = styleSheet.cssRules;
    } catch {
      // Cross-origin stylesheets cannot be read; they never carry Griffel output.
      continue;
    }

    collectFromRules(cssRules, '', classNames, captured);
  }

  return captured;
};

/** Captures every inserted rule that targets the element's own atomic classes. */
export const captureElementGriffelRules = (
  styleSheets: StyleSheetList,
  element: Element
): readonly CapturedGriffelRule[] =>
  captureGriffelRules(styleSheets, [...element.classList]);

/**
 * The declarations a rule contributes to a named CSS property, keyed by the
 * rule's media condition and selector. Used to ask whether a fixture emits a
 * boundary, focus, or state colour at all — the question a dropped shorthand
 * silently answers "no".
 */
export const declarationsForProperty = (
  rules: readonly CapturedGriffelRule[],
  property: string
): readonly CapturedGriffelRule[] =>
  rules.filter((rule) => rule.declarations[property] !== undefined);
