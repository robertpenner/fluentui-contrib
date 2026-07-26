import type { ButtonCase } from '../domain/ButtonCase';
import type { ContractDifference } from './compareContracts';

export const formatCounterexample = (
  input: ButtonCase,
  differences: readonly ContractDifference[] = []
): string =>
  JSON.stringify(
    {
      input,
      differences,
    },
    undefined,
    2
  );
