import type {
  CapButtonInteractionAvailability,
  CapButtonInteractionContract,
  CapButtonInteractionSurface,
} from './CapButtonInteraction';
import type {
  CapButtonAppearance,
  CapButtonObservationConditions,
} from './CapButtonScenario';
import { capButtonInteractionRuntimeEvidence } from './evidence';

type PointerState = 'rest' | 'hover' | 'active';
type AppearanceInteractionSurfaces = Readonly<
  Record<
    CapButtonAppearance,
    Readonly<Record<PointerState, CapButtonInteractionSurface>>
  >
>;

const uniformBorder = (color: string) => ({
  top: color,
  right: color,
  bottom: color,
  left: color,
});

const surface = (
  foreground: string,
  background: string,
  border: string
): CapButtonInteractionSurface => ({
  foreground,
  background,
  border: uniformBorder(border),
});

export const capButtonEnabledInteractionSurfaces: AppearanceInteractionSurfaces =
  {
    primary: {
      rest: surface('#ffffff', '#0f6cbd', 'transparent'),
      hover: surface('#ffffff', '#115ea3', 'transparent'),
      active: surface('#ffffff', '#0c3b5e', 'transparent'),
    },
    tint: {
      rest: surface('#0f6cbd', '#ebf3fc', '#b4d6fa'),
      hover: surface('#115ea3', '#cfe4fa', '#77b7f7'),
      active: surface('#0f548c', '#96c6fa', '#0f6cbd'),
    },
    outline: {
      rest: surface('#616161', 'transparent', '#ebebeb'),
      hover: surface('#242424', '#ebebeb', '#e0e0e0'),
      active: surface('#242424', '#d6d6d6', '#d6d6d6'),
    },
    secondary: {
      rest: surface('#616161', '#f5f5f5', '#ebebeb'),
      hover: surface('#242424', '#ebebeb', '#e0e0e0'),
      active: surface('#242424', '#d6d6d6', '#d6d6d6'),
    },
    subtle: {
      rest: surface('#616161', 'transparent', 'transparent'),
      hover: surface('#242424', '#ebebeb', 'transparent'),
      active: surface('#242424', '#d6d6d6', 'transparent'),
    },
    transparent: {
      rest: surface('#616161', 'transparent', 'transparent'),
      hover: surface('#242424', 'transparent', 'transparent'),
      active: surface('#242424', 'transparent', 'transparent'),
    },
  };

const suppressed = (
  foreground: string,
  background: string,
  border: string
): Readonly<Record<PointerState, CapButtonInteractionSurface>> => {
  const suppressedSurface = surface(foreground, background, border);

  return {
    rest: suppressedSurface,
    hover: suppressedSurface,
    active: suppressedSurface,
  };
};

export const capButtonDisabledInteractionSurfaces: AppearanceInteractionSurfaces =
  {
    primary: suppressed('#bdbdbd', '#f0f0f0', 'transparent'),
    tint: suppressed('#bdbdbd', '#f0f0f0', '#e0e0e0'),
    outline: suppressed('#bdbdbd', 'transparent', '#e0e0e0'),
    secondary: suppressed('#bdbdbd', '#f0f0f0', '#e0e0e0'),
    subtle: suppressed('#bdbdbd', 'transparent', 'transparent'),
    transparent: suppressed('#bdbdbd', 'transparent', 'transparent'),
  };

export const capButtonDisabledFocusableInteractionSurfaces: AppearanceInteractionSurfaces =
  {
    primary: suppressed('#bdbdbd', '#f0f0f0', 'transparent'),
    tint: suppressed('#bdbdbd', '#f0f0f0', '#e0e0e0'),
    outline: suppressed('#bdbdbd', 'transparent', '#e0e0e0'),
    secondary: suppressed('#bdbdbd', '#f0f0f0', '#e0e0e0'),
    subtle: suppressed('#bdbdbd', 'transparent', 'transparent'),
    transparent: suppressed('#bdbdbd', 'transparent', 'transparent'),
  };

export const capButtonInteractionSurfaces: Readonly<
  Record<CapButtonInteractionAvailability, AppearanceInteractionSurfaces>
> = {
  enabled: capButtonEnabledInteractionSurfaces,
  disabled: capButtonDisabledInteractionSurfaces,
  disabledFocusable: capButtonDisabledFocusableInteractionSurfaces,
};

const pointerState = (
  conditions: CapButtonObservationConditions
): PointerState =>
  conditions.active ? 'active' : conditions.hover ? 'hover' : 'rest';

export const resolveCapButtonInteraction = (
  appearance: CapButtonAppearance,
  availability: CapButtonInteractionAvailability,
  conditions: CapButtonObservationConditions
): CapButtonInteractionContract => {
  const pointerSurface =
    capButtonInteractionSurfaces[availability][appearance][
      pointerState(conditions)
    ];
  const focusVisible =
    availability !== 'disabled' &&
    conditions.focusVisible &&
    !conditions.active;
  const focusBorder = focusVisible
    ? uniformBorder('#000000')
    : pointerSurface.border;
  const focusedShadow =
    appearance === 'primary' && conditions.hover
      ? '0 0 2px 0 #000000 inset'
      : '0 0 0 1px #ffffff inset';
  const hasKeyboardFocusTreatment =
    availability !== 'disabled' && conditions.focusVisible;

  return {
    appearance,
    availability,
    conditions,
    surface: {
      ...pointerSurface,
      border: focusBorder,
    },
    focusTreatment: {
      visible: focusVisible,
      border: focusBorder,
      outline: focusVisible
        ? {
            color: '#000000',
            style: 'solid',
            width: '2px',
            offset: '0px',
          }
        : {
            color:
              conditions.active && conditions.focusVisible
                ? '#000000'
                : pointerSurface.foreground,
            style: 'none',
            width: '0px',
            offset: '0px',
          },
      innerShadow: hasKeyboardFocusTreatment ? focusedShadow : 'none',
    },
    evidence: capButtonInteractionRuntimeEvidence,
  };
};
