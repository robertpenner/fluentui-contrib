import type { CapButtonMotionAvailability } from './CapButtonMotion';
import {
  capButtonAppearances,
  type CapButtonAppearance,
} from './CapButtonScenario';

export interface CapButtonMotionMatrixEntry {
  readonly appearance: CapButtonAppearance;
  readonly availability: CapButtonMotionAvailability;
  readonly prefersReducedMotion: boolean;
}

const availabilities: readonly CapButtonMotionAvailability[] = [
  'enabled',
  'disabled',
  'disabledFocusable',
];

const preferences = [false, true] as const;

export const capButtonMotionMatrix: readonly CapButtonMotionMatrixEntry[] =
  capButtonAppearances.flatMap((appearance) =>
    availabilities.flatMap((availability) =>
      preferences.map((prefersReducedMotion) => ({
        appearance,
        availability,
        prefersReducedMotion,
      }))
    )
  );
