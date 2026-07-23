import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';

export const resolveCapabilities = (input: ButtonCase): ButtonStyleContract['capabilities'] => ({
  interactive: input.interactionState !== 'disabled',
  supportsKeyboardActivation: true,
  exposesDisabledState: input.interactionState === 'disabled',
  semanticActionRole: 'button',
});