/**
 * Griffel refuses to expand a small set of CSS shorthand properties because their
 * expansion is not deterministic. When `makeStyles` encounters one it logs an error
 * and **drops the declaration entirely**, so the diagnostic is not cosmetic: every
 * diagnostic is a style the author wrote and the browser never receives.
 *
 * @see https://aka.ms/griffel-css-shorthands
 */
export const GRIFFEL_UNSUPPORTED_SHORTHAND_PREFIX =
  '@griffel/react: You are using unsupported shorthand CSS property';

/**
 * The properties `@griffel/core` refuses to resolve, mirrored from its
 * `UNSUPPORTED_CSS_PROPERTIES` constant. Mirrored rather than imported so that a
 * change in Griffel surfaces as a failing boundary test instead of silently
 * widening what this research treats as a defect.
 */
export const unsupportedShorthandProperties = [
  'all',
  'borderBlock',
  'borderBlockEnd',
  'borderBlockStart',
  'borderColor',
  'borderInline',
  'borderInlineEnd',
  'borderInlineStart',
  'borderStyle',
  'borderWidth',
] as const;

export type UnsupportedShorthandProperty =
  (typeof unsupportedShorthandProperties)[number];

/** A single dropped declaration, recovered from a Griffel console diagnostic. */
export interface GriffelShorthandDiagnostic {
  /** The shorthand property Griffel refused to resolve. */
  readonly property: string;
  /** The value that was dropped along with the property. */
  readonly value: string;
  /** The raw console message, retained as evidence. */
  readonly message: string;
}

const propertyAndValuePattern = /\[slot\]: \{ ([^:]+): "(.*)" \}/;

/**
 * Recovers the dropped property and value from a Griffel diagnostic message.
 * Returns `undefined` for any console output that is not an unsupported-shorthand
 * diagnostic, so unrelated logging never inflates the defect count.
 */
export const parseGriffelShorthandDiagnostic = (
  message: string
): GriffelShorthandDiagnostic | undefined => {
  if (!message.startsWith(GRIFFEL_UNSUPPORTED_SHORTHAND_PREFIX)) {
    return undefined;
  }

  const match = propertyAndValuePattern.exec(message);
  if (!match) {
    return undefined;
  }

  const [, property, value] = match;

  return { property, value, message };
};

/** Groups diagnostics by property so a report can name each distinct defect once. */
export const summarizeGriffelShorthandDiagnostics = (
  diagnostics: readonly GriffelShorthandDiagnostic[]
): Readonly<Record<string, readonly string[]>> => {
  const summary: Record<string, string[]> = {};

  for (const diagnostic of diagnostics) {
    const values = (summary[diagnostic.property] ??= []);
    if (!values.includes(diagnostic.value)) {
      values.push(diagnostic.value);
    }
  }

  return summary;
};
