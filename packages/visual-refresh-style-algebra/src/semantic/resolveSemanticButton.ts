import type { ButtonCase } from '../domain/ButtonCase';
import type {
  ButtonStyleContract,
  StyleDecision,
} from '../domain/ButtonStyleContract';
import { DESIGN_LANGUAGE_VERSION } from '../domain/policies';
import { assertValidButtonCase } from '../domain/validity';
import { deriveValidationObligations } from './deriveValidationObligations';
import { resolveAnatomy } from './resolveAnatomy';
import { resolveAppearance } from './resolveAppearance';
import { resolveCapabilities } from './resolveCapabilities';
import { resolveFocus } from './resolveFocus';
import { resolveGeometry } from './resolveGeometry';
import { resolveShape } from './resolveShape';
import { resolveSupportedDomain } from './resolveSupportedDomain';
import { resolveTypography } from './resolveTypography';

const collectDecisions = (input: ButtonCase): readonly StyleDecision[] => [
  {
    rule: 'supported-appearance-domain',
    fields: ['supportedDomain.appearanceSupported'],
    explanation: `${input.product}/${input.visualLanguage} explicitly admits ${input.appearance}`,
    evidence: 'domainDeclaration',
  },
  {
    rule: 'product-density-policy',
    fields: ['geometry.blockSize', 'geometry.minInlineSize'],
    explanation: `${input.product}/${input.visualLanguage}/${input.density} selects one named size policy`,
    evidence:
      input.visualLanguage === 'visualRefresh' && input.density === 'standard'
        ? 'presentationObservation'
        : 'modelAssumption',
  },
  {
    rule: 'content-direction-padding',
    fields: [
      'geometry.paddingInlineStart',
      'geometry.paddingInlineEnd',
      'geometry.gap',
    ],
    explanation: `${input.contentKind}/${input.iconPlacement}/${input.direction} selects logical spacing`,
    evidence: 'modelAssumption',
  },
  {
    rule: 'visual-language-shape',
    fields: ['shape'],
    explanation: `${input.visualLanguage}/${input.compositionContext}/${input.direction} selects joined-edge geometry`,
    evidence: 'modelAssumption',
  },
  {
    rule: 'complete-state-color-table',
    fields: ['appearance'],
    explanation: `${input.appearance}/${input.interactionState}/${input.colorMode} selects explicit semantic roles`,
    evidence:
      input.colorMode === 'forcedColors'
        ? 'accessibilityProtection'
        : 'modelAssumption',
  },
  {
    rule: 'anatomy-and-name-source',
    fields: ['anatomy'],
    explanation: `${input.anatomyPolicy}/${input.contentKind}/${input.iconPlacement} selects slots and naming source`,
    evidence: 'modelAssumption',
  },
];

export const resolveSemanticButton = (
  input: ButtonCase
): ButtonStyleContract => {
  assertValidButtonCase(input);

  return {
    modelVersion: DESIGN_LANGUAGE_VERSION,
    geometry: resolveGeometry(input),
    shape: resolveShape(input),
    appearance: resolveAppearance(input),
    typography: resolveTypography(input),
    anatomy: resolveAnatomy(input),
    supportedDomain: resolveSupportedDomain(input),
    validationObligations: deriveValidationObligations(input),
    focus: resolveFocus(input),
    capabilities: resolveCapabilities(input),
    provenance: collectDecisions(input),
  };
};
