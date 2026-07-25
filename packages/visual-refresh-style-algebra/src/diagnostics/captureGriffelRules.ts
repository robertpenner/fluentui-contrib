import { selectorContainsClass } from '../emission/captureGriffelForcedColorsRules';

/**
 * Griffel's style buckets, in the order it inserts them into the document.
 *
 * Griffel keeps every atomic class at the same specificity and resolves conflicts
 * purely by stylesheet order, so this list *is* the cascade. Reading it back is
 * the only way to say which of two equally specific declarations actually wins:
 * a reset style always loses to an atomic one, and `:focus-visible` (`i`) beats
 * the unqualified bucket (`d`) that attribute selectors land in.
 *
 * Mirrored from `@griffel/core`'s `styleBucketOrdering`, which is `@internal`.
 * `griffelBucketOrdering.test.ts` holds the mirror honest against the real thing.
 */
export const griffelBucketOrdering = [
  'r',
  'd',
  'l',
  'v',
  'w',
  'f',
  'i',
  'h',
  'a',
  's',
  'k',
  't',
  'm',
  'c',
] as const;

const bucketRank = (bucket: string): number => {
  const index = griffelBucketOrdering.indexOf(
    bucket as (typeof griffelBucketOrdering)[number]
  );

  // An unknown bucket is treated as latest so its declarations are never assumed
  // to lose a conflict they might actually win.
  return index === -1 ? griffelBucketOrdering.length : index;
};

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
  /** The `data-make-styles-bucket` of the stylesheet the rule came from. */
  readonly bucket: string;
  readonly selector: string;
  readonly declarations: Readonly<Record<string, string>>;
  readonly cssText: string;
}

/**
 * Orders rules the way the browser resolves them. Griffel emits every atomic
 * class at identical specificity, so bucket order decides the winner; ties inside
 * a bucket keep the order they were inserted in.
 */
export const byGriffelCascade = (
  first: CapturedGriffelRule,
  second: CapturedGriffelRule
): number => bucketRank(first.bucket) - bucketRank(second.bucket);

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
  bucket: string,
  classNames: readonly string[],
  captured: CapturedGriffelRule[]
): void => {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSMediaRule) {
      collectFromRules(
        rule.cssRules,
        rule.conditionText,
        bucket,
        classNames,
        captured
      );
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
      bucket,
      selector: rule.selectorText,
      declarations: readDeclarations(rule.style),
      cssText: rule.cssText,
    });
  }
};

/**
 * Captures every inserted rule that targets one of the given atomic class names.
 *
 * Rules are read from `<style>` elements rather than `document.styleSheets`
 * because the bucket is carried by the element as `data-make-styles-bucket`, and
 * `CSSStyleSheet.ownerNode` is not reliably populated outside real browsers.
 */
export const captureGriffelRules = (
  targetDocument: Document,
  classNames: readonly string[]
): readonly CapturedGriffelRule[] => {
  const captured: CapturedGriffelRule[] = [];

  for (const element of Array.from(targetDocument.querySelectorAll('style'))) {
    const cssRules = element.sheet?.cssRules;

    if (!cssRules) {
      continue;
    }

    collectFromRules(
      cssRules,
      '',
      element.getAttribute('data-make-styles-bucket') ?? '',
      classNames,
      captured
    );
  }

  return captured;
};

/** Captures every inserted rule that targets the element's own atomic classes. */
export const captureElementGriffelRules = (
  targetDocument: Document,
  element: Element
): readonly CapturedGriffelRule[] =>
  captureGriffelRules(targetDocument, [...element.classList]);

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
