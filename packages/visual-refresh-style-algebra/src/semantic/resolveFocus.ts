import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { focusPolicy } from '../domain/policies';

export const resolveFocus = (input: ButtonCase): ButtonStyleContract['focus'] => ({
  visible: input.interactionState === 'focusVisible',
  colorRole: input.colorMode === 'forcedColors' ? 'Highlight' : 'focusStroke',
  width: focusPolicy.width,
  offset: focusPolicy.offset,
});