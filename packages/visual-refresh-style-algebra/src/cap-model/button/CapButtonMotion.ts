export interface CapButtonMotionTransition {
  readonly property: string;
  readonly durationMs: number;
}

export interface CapButtonMotionContract {
  readonly transitions: readonly CapButtonMotionTransition[];
}

export type CapButtonMotionAvailability =
  | 'enabled'
  | 'disabled'
  | 'disabledFocusable';
