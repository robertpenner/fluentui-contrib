import type { CapButtonBorderColors } from './CapButtonObservation';
import type {
  CapButtonAppearance,
  CapButtonObservationConditions,
} from './CapButtonScenario';
import type { CapModelEvidence } from './evidence';

export type CapButtonInteractionAvailability =
  | 'enabled'
  | 'disabled'
  | 'disabledFocusable';

export interface CapButtonInteractionSurface {
  readonly foreground: string;
  readonly background: string;
  readonly border: CapButtonBorderColors;
}

export interface CapButtonInteractionFocusOutline {
  readonly color: string;
  readonly style: string;
  readonly width: string;
  readonly offset: string;
}

export interface CapButtonInteractionFocusTreatment {
  /** Whether Chromium paints the CAP outline for this condition. */
  readonly visible: boolean;
  readonly border: CapButtonBorderColors;
  readonly outline: CapButtonInteractionFocusOutline;
  readonly innerShadow: string;
}

export interface CapButtonInteractionSemanticContract {
  readonly surface: CapButtonInteractionSurface;
  readonly focusTreatment: CapButtonInteractionFocusTreatment;
}

export interface CapButtonInteractionContract
  extends CapButtonInteractionSemanticContract {
  readonly appearance: CapButtonAppearance;
  readonly availability: CapButtonInteractionAvailability;
  readonly conditions: CapButtonObservationConditions;
  readonly evidence: CapModelEvidence;
}
