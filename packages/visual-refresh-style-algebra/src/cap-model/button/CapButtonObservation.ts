import type {
  CapButtonAppearance,
  CapButtonIconPosition,
  CapButtonObservationConditions,
  CapButtonScenario,
  CapButtonShape,
  CapButtonSize,
} from './CapButtonScenario';

export type CapButtonAnatomySlot = 'icon' | 'content';

export interface CapButtonNormalizedState {
  readonly appearance: CapButtonAppearance;
  readonly size: CapButtonSize;
  readonly shape: CapButtonShape;
  readonly disabled: boolean;
  readonly disabledFocusable: boolean;
  readonly iconPosition: CapButtonIconPosition;
  readonly iconOnly: boolean;
  readonly hasIcon: boolean;
  readonly hasChildren: boolean;
  readonly childrenTruthy: boolean;
}

export interface CapButtonStyleSelections {
  readonly root: {
    readonly appearance: CapButtonAppearance;
    readonly size: CapButtonSize;
    readonly shape: CapButtonShape;
    readonly availability: 'enabled' | 'disabled';
    readonly focus: 'base' | 'primary';
    readonly content:
      | 'base'
      | 'iconOnly'
      | 'textAndIcon.before'
      | 'textAndIcon.after';
  };
  readonly icon?: {
    readonly size: CapButtonSize;
    readonly position: 'none' | CapButtonIconPosition;
  };
}

export interface CapButtonRootGeometry {
  readonly paddingTop: string;
  readonly paddingRight: string;
  readonly paddingBottom: string;
  readonly paddingLeft: string;
  readonly borderTopLeftRadius: string;
  readonly borderTopRightRadius: string;
  readonly borderBottomRightRadius: string;
  readonly borderBottomLeftRadius: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly fontSize: string;
  readonly fontWeight: string;
  readonly lineHeight: string;
}

export interface CapButtonIconGeometry {
  readonly fontSize: string;
  readonly marginLeft?: string;
  readonly marginRight?: string;
}

export interface CapButtonGeometry {
  readonly root: CapButtonRootGeometry;
  readonly icon?: CapButtonIconGeometry;
}

export interface CapButtonBorderColors {
  readonly top: string;
  readonly right: string;
  readonly bottom: string;
  readonly left: string;
}

export interface CapButtonFocusOutline {
  readonly color: string;
  readonly style: string;
  readonly width: string;
}

export interface CapButtonStaticFocusTreatment {
  readonly selection: 'base' | 'primary';
  readonly border: CapButtonBorderColors;
  readonly outline: CapButtonFocusOutline;
  readonly innerShadow: string;
}

export interface CapButtonRootAppearance {
  readonly foreground: string;
  readonly background: string;
  readonly border: CapButtonBorderColors;
  readonly focusTreatment: CapButtonStaticFocusTreatment;
}

export interface CapButtonSemanticObservation {
  readonly normalized: CapButtonNormalizedState;
  readonly anatomy: readonly CapButtonAnatomySlot[];
  readonly styleSelections: CapButtonStyleSelections;
  readonly geometry: CapButtonGeometry;
  readonly rootAppearance: CapButtonRootAppearance;
}

export interface CapButtonGeneratedClassSignature {
  readonly root: string;
  readonly icon?: string;
}

export interface CapButtonObservation extends CapButtonSemanticObservation {
  readonly productionBaseline: string;
  readonly scenario: CapButtonScenario;
  readonly conditions: CapButtonObservationConditions;
  readonly generatedClassSignature?: CapButtonGeneratedClassSignature;
}
