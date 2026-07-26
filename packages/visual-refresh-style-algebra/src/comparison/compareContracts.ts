import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { normalizeContract } from './normalizeContract';

export interface ContractDifference {
  field: string;
  layered: unknown;
  semantic: unknown;
}

const visit = (
  layered: unknown,
  semantic: unknown,
  field: string,
  differences: ContractDifference[]
): void => {
  if (Object.is(layered, semantic)) {
    return;
  }
  if (
    typeof layered !== 'object' ||
    layered === null ||
    typeof semantic !== 'object' ||
    semantic === null
  ) {
    differences.push({ field, layered, semantic });
    return;
  }

  const layeredRecord = layered as Readonly<Record<string, unknown>>;
  const semanticRecord = semantic as Readonly<Record<string, unknown>>;
  const keys = new Set([
    ...Object.keys(layeredRecord),
    ...Object.keys(semanticRecord),
  ]);
  for (const key of keys) {
    visit(
      layeredRecord[key],
      semanticRecord[key],
      field ? `${field}.${key}` : key,
      differences
    );
  }
};

export const compareContracts = (
  layered: ButtonStyleContract,
  semantic: ButtonStyleContract
): readonly ContractDifference[] => {
  const differences: ContractDifference[] = [];
  visit(
    normalizeContract(layered),
    normalizeContract(semantic),
    '',
    differences
  );
  return differences;
};
