import type { IconPlacement } from './ButtonCase';

export type ButtonSlot = 'icon' | 'content';

export interface ButtonAnatomy {
  orderedSlots: readonly ButtonSlot[];
  iconPlacement: IconPlacement;
  accessibleNameSource: 'text' | 'ariaLabel';
}
