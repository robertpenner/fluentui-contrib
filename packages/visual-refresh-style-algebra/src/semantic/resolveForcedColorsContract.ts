import type { ButtonCase } from '../domain/ButtonCase';
import type { ForcedColorsContract } from '../domain/ForcedColorsContract';

export const resolveForcedColorsContract = (
  input: ButtonCase
): ForcedColorsContract => {
  if (input.colorMode !== 'forcedColors') {
    throw new Error(
      'resolveForcedColorsContract requires colorMode=forcedColors'
    );
  }

  const disabled = input.interactionState === 'disabled';

  return {
    foregroundRole: disabled ? 'GrayText' : 'ButtonText',
    backgroundRole: 'ButtonFace',
    borderRole: disabled ? 'GrayText' : 'ButtonBorder',
    focusRole: 'Highlight',
    focusVisible: input.interactionState === 'focusVisible',
    disabledDistinguishable: disabled,
    visibleBoundary: true,
  };
};
