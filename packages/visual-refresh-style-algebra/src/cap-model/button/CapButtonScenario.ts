export const capButtonAppearances = [
  'primary',
  'tint',
  'outline',
  'secondary',
  'subtle',
  'transparent',
] as const;

export const capButtonSizes = ['small', 'medium', 'large'] as const;
export const capButtonShapes = ['rounded', 'circular', 'square'] as const;

export type CapButtonAppearance = (typeof capButtonAppearances)[number];
export type CapButtonSize = (typeof capButtonSizes)[number];
export type CapButtonShape = (typeof capButtonShapes)[number];
export type CapButtonContentPresence = 'absent' | 'present';
export type CapButtonAuthoredIconPosition = 'omitted' | 'before' | 'after';
export type CapButtonIconPosition = 'before' | 'after';

export interface CapButtonScenario {
  readonly appearance: CapButtonAppearance;
  readonly size: CapButtonSize;
  readonly shape: CapButtonShape;
  readonly disabled: boolean;
  readonly disabledFocusable: boolean;
  readonly content: {
    readonly icon: CapButtonContentPresence;
    readonly children: CapButtonContentPresence;
    readonly iconPosition: CapButtonAuthoredIconPosition;
  };
}

export interface CapButtonObservationConditions {
  readonly hover: boolean;
  readonly active: boolean;
  readonly focusVisible: boolean;
  readonly forcedColors: boolean;
  readonly prefersReducedMotion: boolean;
  readonly direction: 'ltr' | 'rtl';
}
