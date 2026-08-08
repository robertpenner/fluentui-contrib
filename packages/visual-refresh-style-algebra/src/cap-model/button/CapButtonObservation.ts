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

export interface CapButtonSemanticObservation {
  readonly normalized: CapButtonNormalizedState;
  readonly anatomy: readonly CapButtonAnatomySlot[];
  readonly styleSelections: CapButtonStyleSelections;
}

export interface CapButtonObservation extends CapButtonSemanticObservation {
  readonly productionBaseline: string;
  readonly scenario: CapButtonScenario;
  readonly conditions: CapButtonObservationConditions;
}
