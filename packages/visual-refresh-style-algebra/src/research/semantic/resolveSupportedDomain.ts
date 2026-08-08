import { interactionStates, type ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { isAppearanceSupported } from '../domain/SupportedDomain';

export const resolveSupportedDomain = (
  input: ButtonCase
): ButtonStyleContract['supportedDomain'] => ({
  appearanceSupported: isAppearanceSupported(input),
  supportedStates: interactionStates,
});
