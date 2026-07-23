import { specificity } from 'parsel-js';
import type {
  EmissionResult,
  ForcedColorsDecision,
  ForcedColorsEmissionTarget,
} from './ForcedColorsEmission';

export interface CapturedGriffelStyleRule {
  media: string;
  selectorScope: string;
  declarations: Readonly<Record<string, string>>;
  precedence: number;
  order: number;
  sourceRule: string;
}

const decisionFor = (
  selectorScope: string,
  declarations: Readonly<Record<string, string>>
): ForcedColorsDecision => {
  if (
    selectorScope.includes(':disabled') ||
    selectorScope.includes('[aria-disabled')
  ) {
    return 'disabledState';
  }
  const properties = Object.keys(declarations);
  if (
    selectorScope.includes(':focus') ||
    properties.some(
      (property) => property.startsWith('outline') || property === 'box-shadow'
    )
  ) {
    return 'focusIndicator';
  }
  if (properties.every((property) => property.startsWith('border'))) {
    return 'visibleBoundary';
  }
  return 'appearance';
};

export const adaptGriffelForcedColorsCapture = (
  capturedRules: readonly CapturedGriffelStyleRule[],
  target: ForcedColorsEmissionTarget
): EmissionResult => {
  const specificities = capturedRules.map((capturedRule) =>
    specificity(capturedRule.selectorScope)
  );
  const radix = Math.max(0, ...specificities.flatMap((value) => value)) + 1;

  return {
    rules: capturedRules.map((capturedRule, index) => {
      const [ids, classes, elements] = specificities[index];
      const selectorSpecificity = ids * radix ** 2 + classes * radix + elements;

      return {
        media: capturedRule.media,
        selectorScope: capturedRule.selectorScope,
        declarations: capturedRule.declarations,
        precedence: capturedRule.precedence,
        order: capturedRule.order,
        specificity: selectorSpecificity,
        sourceRules: [capturedRule.sourceRule],
        component: target.component,
        slot: target.slot,
        semanticDecision: decisionFor(
          capturedRule.selectorScope,
          capturedRule.declarations
        ),
      };
    }),
    diagnostics: [],
  };
};
