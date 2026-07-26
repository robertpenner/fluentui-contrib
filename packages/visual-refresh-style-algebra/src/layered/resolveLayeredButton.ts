import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { assertValidButtonCase } from '../domain/validity';
import { applyContextOverrides } from './contextOverrides';
import { applyFluentBase } from './fluentBase';
import { applyForcedColorsOverrides } from './forcedColorsOverrides';
import { applyInteractionOverrides } from './interactionOverrides';
import { applyProductOverrides } from './productOverrides';
import { applyVisualRefreshOverrides } from './visualRefreshOverrides';
import type { LayeredState, LayerName } from './writeHistory';

export type OverrideStageName = Exclude<LayerName, 'fluentBase'>;

export const standardOverrideOrder: readonly OverrideStageName[] = [
  'visualRefresh',
  'product',
  'context',
  'interaction',
  'forcedColors',
];

const applyOverrideStage = (
  state: LayeredState,
  input: ButtonCase,
  stage: OverrideStageName
): void => {
  switch (stage) {
    case 'visualRefresh':
      applyVisualRefreshOverrides(state, input);
      return;
    case 'product':
      applyProductOverrides(state, input);
      return;
    case 'context':
      applyContextOverrides(state, input);
      return;
    case 'interaction':
      applyInteractionOverrides(state, input);
      return;
    case 'forcedColors':
      applyForcedColorsOverrides(state, input);
      return;
  }
};

export const resolveLayeredButtonInOrder = (
  input: ButtonCase,
  stages: readonly OverrideStageName[]
): LayeredState => {
  assertValidButtonCase(input);
  const state = applyFluentBase(input);

  for (const stage of stages) {
    applyOverrideStage(state, input, stage);
  }

  return state;
};

export const resolveLayeredButtonWithHistory = (
  input: ButtonCase
): LayeredState => {
  return resolveLayeredButtonInOrder(input, standardOverrideOrder);
};

export const resolveLayeredButton = (input: ButtonCase): ButtonStyleContract =>
  resolveLayeredButtonWithHistory(input).contract;
