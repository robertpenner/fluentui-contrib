import type { CapButtonInteractionAvailability } from './CapButtonInteraction';
import type { CapButtonForcedColorsCondition } from './CapButtonForcedColors';
import {
  capButtonAppearances,
  type CapButtonAppearance,
} from './CapButtonScenario';

export interface CapButtonForcedColorsMatrixEntry
  extends CapButtonForcedColorsCondition {
  readonly appearance: CapButtonAppearance;
  readonly availability: CapButtonInteractionAvailability;
}

export const capButtonForcedColorsProjection: readonly CapButtonForcedColorsCondition[] =
  [
    { forcedColors: false, focusVisible: false },
    { forcedColors: true, focusVisible: false },
    { forcedColors: true, focusVisible: true },
  ];

const availabilities: readonly CapButtonInteractionAvailability[] = [
  'enabled',
  'disabled',
  'disabledFocusable',
];

export const capButtonForcedColorsMatrix: readonly CapButtonForcedColorsMatrixEntry[] =
  capButtonAppearances.flatMap((appearance) =>
    availabilities.flatMap((availability) =>
      capButtonForcedColorsProjection.flatMap(
        (conditions): readonly CapButtonForcedColorsMatrixEntry[] =>
          conditions.focusVisible && availability === 'disabled'
            ? []
            : [{ appearance, availability, ...conditions }]
      )
    )
  );
