import type { CapButtonForcedColorsSemanticContract } from './CapButtonForcedColors';

export interface CapButtonForcedColorsDifference {
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
  differences: CapButtonForcedColorsDifference[]
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

export const compareCapButtonForcedColors = (
  actual: CapButtonForcedColorsSemanticContract,
  expected: CapButtonForcedColorsSemanticContract
): readonly CapButtonForcedColorsDifference[] => {
  const differences: CapButtonForcedColorsDifference[] = [];

  compareValues(actual.applies, expected.applies, 'applies', differences);
  compareValues(actual.authored, expected.authored, 'authored', differences);
  compareValues(actual.effective, expected.effective, 'effective', differences);

  return differences;
};
