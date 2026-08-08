import { appearanceStatePolicy } from '../domain/appearancePolicy';
import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { resolveForcedColorsContract } from './resolveForcedColorsContract';

export const resolveAppearance = (
  input: ButtonCase
): ButtonStyleContract['appearance'] => {
  if (input.colorMode !== 'forcedColors') {
    return appearanceStatePolicy[input.appearance][input.interactionState];
  }

  const forcedColors = resolveForcedColorsContract(input);
  return {
    foregroundRole: forcedColors.foregroundRole,
    backgroundRole: forcedColors.backgroundRole,
    borderRole: forcedColors.borderRole,
  };
};
