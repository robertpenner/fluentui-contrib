import { appearanceStatePolicy, forcedColorsPolicy } from '../domain/appearancePolicy';
import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';

export const resolveAppearance = (input: ButtonCase): ButtonStyleContract['appearance'] =>
  input.colorMode === 'forcedColors'
    ? forcedColorsPolicy(input.interactionState)
    : appearanceStatePolicy[input.appearance][input.interactionState];