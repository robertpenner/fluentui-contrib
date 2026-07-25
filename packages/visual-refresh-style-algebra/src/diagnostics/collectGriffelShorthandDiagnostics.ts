import {
  type GriffelShorthandDiagnostic,
  parseGriffelShorthandDiagnostic,
} from './GriffelDiagnostic';

/**
 * Runs `render` while intercepting `console.error`, returning every Griffel
 * unsupported-shorthand diagnostic emitted during it.
 *
 * Griffel resolves each `makeStyles` definition **once per module registry** and
 * memoizes the result, so a diagnostic is only observable on the first render that
 * reaches the style. Collect around the first render of a fixture, and keep one
 * collecting suite per test file.
 *
 * Console output that is not an unsupported-shorthand diagnostic is forwarded to the
 * original `console.error` so unrelated React or Fluent warnings stay visible.
 */
export const collectGriffelShorthandDiagnostics = (
  render: () => void
): readonly GriffelShorthandDiagnostic[] => {
  const diagnostics: GriffelShorthandDiagnostic[] = [];
  const originalError = console.error;

  console.error = (...args: unknown[]): void => {
    const [first] = args;
    const diagnostic =
      typeof first === 'string'
        ? parseGriffelShorthandDiagnostic(first)
        : undefined;

    if (diagnostic) {
      diagnostics.push(diagnostic);
      return;
    }

    originalError.apply(console, args);
  };

  try {
    render();
  } finally {
    console.error = originalError;
  }

  return diagnostics;
};

/** Formats diagnostics as a readable failure message for assertions and stories. */
export const formatGriffelShorthandDiagnostics = (
  diagnostics: readonly GriffelShorthandDiagnostic[]
): string =>
  diagnostics
    .map(({ property, value }) => `${property}: ${JSON.stringify(value)}`)
    .join('\n');
