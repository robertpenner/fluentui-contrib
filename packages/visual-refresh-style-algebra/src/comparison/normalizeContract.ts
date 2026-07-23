import type { ButtonStyleContract } from '../domain/ButtonStyleContract';

export type ComparableButtonStyleContract = Omit<ButtonStyleContract, 'provenance'>;

export const normalizeContract = (contract: ButtonStyleContract): ComparableButtonStyleContract => ({
  modelVersion: contract.modelVersion,
  geometry: contract.geometry,
  shape: contract.shape,
  appearance: contract.appearance,
  typography: contract.typography,
  anatomy: contract.anatomy,
  supportedDomain: contract.supportedDomain,
  validationObligations: contract.validationObligations,
  focus: contract.focus,
  capabilities: contract.capabilities,
});