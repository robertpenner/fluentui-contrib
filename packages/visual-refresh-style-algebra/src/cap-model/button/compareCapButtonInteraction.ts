import type { CapButtonInteractionSemanticContract } from './CapButtonInteraction';

export interface CapButtonInteractionDifference {
  readonly path: string;
  readonly actual: unknown;
  readonly expected: unknown;
}

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const compareValues = (
  actual: unknown,
  expected: unknown,
  path: string,
  differences: CapButtonInteractionDifference[]
): void => {
  if (actual === expected) {
    return;
  }

  if (isRecord(actual) && isRecord(expected)) {
    const keys = new Set([...Object.keys(actual), ...Object.keys(expected)]);

    for (const key of keys) {
      compareValues(
        actual[key],
        expected[key],
        path.length === 0 ? key : `${path}.${key}`,
        differences
      );
    }
    return;
  }

  differences.push({ path, actual, expected });
};

export const compareCapButtonInteraction = (
  actual: CapButtonInteractionSemanticContract,
  expected: CapButtonInteractionSemanticContract
): readonly CapButtonInteractionDifference[] => {
  const differences: CapButtonInteractionDifference[] = [];

  compareValues(actual.surface, expected.surface, 'surface', differences);
  compareValues(
    actual.focusTreatment,
    expected.focusTreatment,
    'focusTreatment',
    differences
  );

  return differences;
};
