import type { CapButtonBorderColors } from './CapButtonObservation';
import type { CapButtonInteractionAvailability } from './CapButtonInteraction';
import type { CapButtonAppearance } from './CapButtonScenario';
import type { CapModelEvidence } from './evidence';

export type CapButtonSystemColorKeyword =
  | 'ButtonBorder'
  | 'ButtonFace'
  | 'GrayText'
  | 'Highlight'
  | 'HighlightText';

export interface CapButtonForcedColorsCondition {
  readonly forcedColors: boolean;
  readonly focusVisible: boolean;
}

export interface CapButtonForcedColorsAuthoredFocus {
  /** System-color keyword proven separately from computed paint through CSSOM. */
  readonly outline: CapButtonSystemColorKeyword | null;
  /** System-color keyword inside the authored inset shadow, not its computed serialization. */
  readonly innerShadow: CapButtonSystemColorKeyword | null;
}

export interface CapButtonForcedColorsAuthoredContract {
  /** A declaration in the matching forced-colors rule; null means no authored declaration. */
  readonly forcedColorAdjust: 'none' | null;
  readonly foreground: CapButtonSystemColorKeyword | null;
  readonly background: CapButtonSystemColorKeyword | null;
  readonly border: Readonly<
    Record<keyof CapButtonBorderColors, CapButtonSystemColorKeyword | null>
  >;
  readonly focus: CapButtonForcedColorsAuthoredFocus;
}

export interface CapButtonForcedColorsEffectiveFocus {
  readonly visible: boolean;
  readonly outlineColor: string;
  readonly outlineStyle: string;
  readonly outlineWidth: string;
  readonly outlineOffset: string;
  readonly innerShadow: string;
}

export interface CapButtonForcedColorsEffectiveContract {
  readonly mediaMatches: boolean;
  /** Canary-observed engine capability, not a claim about a universal OS palette. */
  readonly substitutesSystemColors: boolean;
  readonly forcedColorAdjust: 'auto' | 'none';
  /** Computed RGB paint. These fields intentionally do not claim system keywords. */
  readonly foreground: string;
  readonly background: string;
  readonly border: CapButtonBorderColors;
  readonly focus: CapButtonForcedColorsEffectiveFocus;
}

export interface CapButtonForcedColorsInactiveSemanticContract {
  readonly applies: false;
  readonly authored: null;
  readonly effective: null;
}

export interface CapButtonForcedColorsActiveSemanticContract {
  readonly applies: true;
  readonly authored: CapButtonForcedColorsAuthoredContract;
  readonly effective: CapButtonForcedColorsEffectiveContract;
}

export type CapButtonForcedColorsSemanticContract =
  | CapButtonForcedColorsInactiveSemanticContract
  | CapButtonForcedColorsActiveSemanticContract;

export type CapButtonForcedColorsContract =
  CapButtonForcedColorsSemanticContract & {
    readonly appearance: CapButtonAppearance;
    readonly availability: CapButtonInteractionAvailability;
    readonly conditions: CapButtonForcedColorsCondition;
    readonly evidence: CapModelEvidence;
  };
