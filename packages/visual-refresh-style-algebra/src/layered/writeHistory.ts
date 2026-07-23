import type { ButtonStyleContract, StyleDecision } from '../domain/ButtonStyleContract';

export type LayerName =
  | 'fluentBase'
  | 'visualRefresh'
  | 'product'
  | 'context'
  | 'interaction'
  | 'forcedColors';

export interface FieldWrite {
  layer: LayerName;
  field: string;
  value: unknown;
  replacedLayer?: LayerName;
}

export interface LayeredState {
  contract: ButtonStyleContract;
  writeHistory: FieldWrite[];
}

export const writeField = <Value>(
  state: LayeredState,
  layer: LayerName,
  field: string,
  value: Value,
  assign: (contract: ButtonStyleContract, value: Value) => void,
): void => {
  const previousWrite = [...state.writeHistory].reverse().find(write => write.field === field);
  assign(state.contract, value);
  state.writeHistory.push({
    layer,
    field,
    value,
    replacedLayer: previousWrite?.layer,
  });
};

export const addDecision = (state: LayeredState, decision: StyleDecision): void => {
  state.contract.provenance = [...state.contract.provenance, decision];
};

export const fieldsWithOverlappingOwnership = (writeHistory: readonly FieldWrite[]): readonly string[] => {
  const owners = new Map<string, Set<LayerName>>();

  for (const write of writeHistory) {
    const fieldOwners = owners.get(write.field) ?? new Set<LayerName>();
    fieldOwners.add(write.layer);
    owners.set(write.field, fieldOwners);
  }

  return [...owners.entries()]
    .filter(([, fieldOwners]) => fieldOwners.size > 1)
    .map(([field]) => field)
    .sort();
};