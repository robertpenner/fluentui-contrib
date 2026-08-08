import type { ButtonCase } from '../domain/ButtonCase';
import { resolveForcedColorsContract } from '../semantic/resolveForcedColorsContract';
import {
  addDecision,
  type LayeredState,
  protectField,
  writeField,
} from './writeHistory';

export const applyForcedColorsOverrides = (
  state: LayeredState,
  input: ButtonCase
): LayeredState => {
  if (input.colorMode !== 'forcedColors') {
    return state;
  }

  const forcedColors = resolveForcedColorsContract(input);
  for (const field of [
    'foregroundRole',
    'backgroundRole',
    'borderRole',
  ] as const) {
    const path = `appearance.${field}`;
    writeField(
      state,
      'forcedColors',
      path,
      forcedColors[field],
      (contract, value) => {
        contract.appearance[field] = value;
      }
    );
    protectField(state, 'forcedColors', path);
  }
  writeField(
    state,
    'forcedColors',
    'focus.colorRole',
    forcedColors.focusRole,
    (contract, value) => {
      contract.focus.colorRole = value;
    }
  );
  protectField(state, 'forcedColors', 'focus.colorRole');
  writeField(
    state,
    'forcedColors',
    'focus.visible',
    forcedColors.focusVisible,
    (contract, value) => {
      contract.focus.visible = value;
    }
  );
  protectField(state, 'forcedColors', 'focus.visible');
  addDecision(state, {
    rule: 'forced-colors-protection',
    fields: ['appearance', 'focus.colorRole', 'focus.visible'],
    explanation:
      'System color roles and focus replace ordinary styling and are protected from later writes',
    evidence: 'accessibilityProtection',
  });
  return state;
};
