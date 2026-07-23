import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { focusPolicy } from '../domain/policies';
import { resolveForcedColorsContract } from './resolveForcedColorsContract';

export const resolveFocus = (
  input: ButtonCase
): ButtonStyleContract['focus'] => {
  const forcedColors =
    input.colorMode === 'forcedColors'
      ? resolveForcedColorsContract(input)
      : undefined;

  return {
    visible:
      forcedColors?.focusVisible ?? input.interactionState === 'focusVisible',
    colorRole: forcedColors?.focusRole ?? 'focusStroke',
    width: focusPolicy.width,
    offset: focusPolicy.offset,
  };
};
