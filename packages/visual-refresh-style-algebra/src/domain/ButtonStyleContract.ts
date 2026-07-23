import type { InteractionState } from './ButtonCase';
import type { ButtonAnatomy } from './ButtonAnatomy';
import type { Pixels } from './policies';
import type { SemanticColorRole } from './SemanticColorRole';
import type { ValidationObligation } from './ValidationObligation';

export type DecisionEvidence =
  | 'presentationObservation'
  | 'publicCapObservation'
  | 'modelAssumption'
  | 'domainDeclaration'
  | 'accessibilityProtection';

export interface StyleDecision {
  rule: string;
  fields: readonly string[];
  explanation: string;
  evidence: DecisionEvidence;
}

export interface ButtonStyleContract {
  modelVersion: string;
  geometry: {
    blockSize: Pixels;
    minInlineSize: Pixels;
    paddingInlineStart: Pixels;
    paddingInlineEnd: Pixels;
    gap: Pixels;
  };
  shape: {
    radiusStartStart: Pixels;
    radiusStartEnd: Pixels;
    radiusEndStart: Pixels;
    radiusEndEnd: Pixels;
  };
  appearance: {
    foregroundRole: SemanticColorRole;
    backgroundRole: SemanticColorRole;
    borderRole: SemanticColorRole;
  };
  typography: {
    fontSize: Pixels;
    fontWeight: number;
    lineHeight: Pixels;
  };
  anatomy: ButtonAnatomy;
  supportedDomain: {
    appearanceSupported: boolean;
    supportedStates: readonly InteractionState[];
  };
  validationObligations: readonly ValidationObligation[];
  focus: {
    visible: boolean;
    colorRole: SemanticColorRole;
    width: Pixels;
    offset: Pixels;
  };
  capabilities: {
    interactive: boolean;
    supportsKeyboardActivation: boolean;
    exposesDisabledState: boolean;
    semanticActionRole: 'button';
  };
  provenance: readonly StyleDecision[];
}