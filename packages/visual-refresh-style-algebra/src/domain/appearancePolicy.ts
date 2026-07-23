import type { Appearance, InteractionState } from './ButtonCase';
import type { SemanticColorRole } from './SemanticColorRole';

export interface AppearanceRoles {
  foregroundRole: SemanticColorRole;
  backgroundRole: SemanticColorRole;
  borderRole: SemanticColorRole;
}

type StateAppearancePolicy = Readonly<Record<InteractionState, AppearanceRoles>>;

const disabledRoles: AppearanceRoles = {
  foregroundRole: 'neutralForegroundDisabled',
  backgroundRole: 'neutralBackgroundDisabled',
  borderRole: 'neutralBorderDisabled',
};

/** Complete state table: no state falls through to a prior layer. */
export const appearanceStatePolicy: Readonly<Record<Appearance, StateAppearancePolicy>> = {
  primary: {
    rest: {
      foregroundRole: 'foregroundOnBrand',
      backgroundRole: 'brandBackground',
      borderRole: 'transparentBorder',
    },
    hover: {
      foregroundRole: 'foregroundOnBrand',
      backgroundRole: 'brandBackgroundHover',
      borderRole: 'transparentBorder',
    },
    pressed: {
      foregroundRole: 'foregroundOnBrand',
      backgroundRole: 'brandBackgroundPressed',
      borderRole: 'transparentBorder',
    },
    focusVisible: {
      foregroundRole: 'foregroundOnBrand',
      backgroundRole: 'brandBackground',
      borderRole: 'transparentBorder',
    },
    disabled: disabledRoles,
  },
  subtle: {
    rest: {
      foregroundRole: 'neutralForeground',
      backgroundRole: 'transparentBackground',
      borderRole: 'transparentBorder',
    },
    hover: {
      foregroundRole: 'neutralForegroundHover',
      backgroundRole: 'neutralBackgroundHover',
      borderRole: 'transparentBorder',
    },
    pressed: {
      foregroundRole: 'neutralForegroundPressed',
      backgroundRole: 'neutralBackgroundPressed',
      borderRole: 'transparentBorder',
    },
    focusVisible: {
      foregroundRole: 'neutralForeground',
      backgroundRole: 'transparentBackground',
      borderRole: 'transparentBorder',
    },
    disabled: disabledRoles,
  },
  transparent: {
    rest: {
      foregroundRole: 'neutralForeground',
      backgroundRole: 'transparentBackground',
      borderRole: 'transparentBorder',
    },
    hover: {
      foregroundRole: 'neutralForegroundHover',
      backgroundRole: 'transparentBackground',
      borderRole: 'transparentBorder',
    },
    pressed: {
      foregroundRole: 'neutralForegroundPressed',
      backgroundRole: 'transparentBackground',
      borderRole: 'transparentBorder',
    },
    focusVisible: {
      foregroundRole: 'neutralForeground',
      backgroundRole: 'transparentBackground',
      borderRole: 'transparentBorder',
    },
    disabled: disabledRoles,
  },
  tint: {
    rest: {
      foregroundRole: 'brandForeground',
      backgroundRole: 'brandBackgroundTint',
      borderRole: 'brandBorder',
    },
    hover: {
      foregroundRole: 'brandForegroundHover',
      backgroundRole: 'brandBackgroundTintHover',
      borderRole: 'brandBorder',
    },
    pressed: {
      foregroundRole: 'brandForegroundPressed',
      backgroundRole: 'brandBackgroundTintPressed',
      borderRole: 'brandBorder',
    },
    focusVisible: {
      foregroundRole: 'brandForeground',
      backgroundRole: 'brandBackgroundTint',
      borderRole: 'brandBorder',
    },
    disabled: disabledRoles,
  },
};

export const forcedColorsPolicy = (interactionState: InteractionState): AppearanceRoles =>
  interactionState === 'disabled'
    ? {
        foregroundRole: 'GrayText',
        backgroundRole: 'ButtonFace',
        borderRole: 'GrayText',
      }
    : {
        foregroundRole: 'ButtonText',
        backgroundRole: 'ButtonFace',
        borderRole: 'ButtonBorder',
      };