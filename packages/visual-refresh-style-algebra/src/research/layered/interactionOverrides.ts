import { appearanceStatePolicy } from '../domain/appearancePolicy';
import type { ButtonCase } from '../domain/ButtonCase';
import { resolveCapabilities } from '../semantic/resolveCapabilities';
import { resolveFocus } from '../semantic/resolveFocus';
import { addDecision, type LayeredState, writeField } from './writeHistory';

export const applyInteractionOverrides = (
  state: LayeredState,
  input: ButtonCase
): LayeredState => {
  const appearance =
    appearanceStatePolicy[input.appearance][input.interactionState];
  for (const field of [
    'foregroundRole',
    'backgroundRole',
    'borderRole',
  ] as const) {
    writeField(
      state,
      'interaction',
      `appearance.${field}`,
      appearance[field],
      (contract, value) => {
        contract.appearance[field] = value;
      }
    );
  }
  const focus = resolveFocus(input);
  writeField(
    state,
    'interaction',
    'focus.visible',
    focus.visible,
    (contract, value) => {
      contract.focus.visible = value;
    }
  );
  writeField(
    state,
    'interaction',
    'capabilities',
    resolveCapabilities(input),
    (contract, value) => {
      contract.capabilities = value;
    }
  );
  addDecision(state, {
    rule: 'interaction-override',
    fields: ['appearance', 'focus.visible', 'capabilities'],
    explanation: `${input.appearance}/${input.interactionState} patches state output`,
    evidence: 'modelAssumption',
  });
  return state;
};
