import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';

export const resolveAnatomy = (
  input: ButtonCase
): ButtonStyleContract['anatomy'] => {
  if (input.contentKind === 'text') {
    return {
      orderedSlots: ['content'],
      iconPlacement: 'none',
      accessibleNameSource: 'text',
    };
  }

  if (input.contentKind === 'iconOnly') {
    return {
      orderedSlots: ['icon'],
      iconPlacement: 'only',
      accessibleNameSource: 'ariaLabel',
    };
  }

  return {
    orderedSlots:
      input.iconPlacement === 'before'
        ? ['icon', 'content']
        : ['content', 'icon'],
    iconPlacement: input.iconPlacement,
    accessibleNameSource: 'text',
  };
};
