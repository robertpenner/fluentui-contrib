import { forcedColorsPolicy } from '../domain/appearancePolicy';
import type { ButtonCase } from '../domain/ButtonCase';
import type { SemanticColorRole } from '../domain/SemanticColorRole';
import { addDecision, type LayeredState, writeField } from './writeHistory';

export const applyForcedColorsOverrides = (state: LayeredState, input: ButtonCase): LayeredState => {
  if (input.colorMode !== 'forcedColors') {
    return state;
  }

  const appearance = forcedColorsPolicy(input.interactionState);
  for (const field of ['foregroundRole', 'backgroundRole', 'borderRole'] as const) {
    writeField(state, 'forcedColors', `appearance.${field}`, appearance[field], (contract, value) => {
      contract.appearance[field] = value;
    });
  }
  const focusRole: SemanticColorRole = 'Highlight';
  writeField(state, 'forcedColors', 'focus.colorRole', focusRole, (contract, value) => {
    contract.focus.colorRole = value;
  });
  addDecision(state, {
    rule: 'forced-colors-protection',
    fields: ['appearance', 'focus.colorRole'],
    explanation: 'System color roles replace ordinary product roles after all product and interaction stages',
    evidence: 'accessibilityProtection',
  });
  return state;
};