import type { ForcedColorsContract } from '../domain/ForcedColorsContract';
import {
  FORCED_COLORS_MEDIA,
  type EmissionResult,
  type EmittedStyleRule,
  type ForcedColorsEmissionTarget,
} from './ForcedColorsEmission';

const selectorFor = ({ component, slot }: ForcedColorsEmissionTarget): string =>
  `.${component}[data-slot="${slot}"]`;

export const emitForcedColors = (
  contract: ForcedColorsContract,
  target: ForcedColorsEmissionTarget
): EmissionResult => {
  const selectorScope = selectorFor(target);
  const rules: EmittedStyleRule[] = [
    {
      media: FORCED_COLORS_MEDIA,
      selectorScope,
      declarations: {
        color: contract.foregroundRole,
        backgroundColor: contract.backgroundRole,
      },
      precedence: 100,
      order: 0,
      specificity: 20,
      sourceRules: ['forced-colors-appearance'],
      component: target.component,
      slot: target.slot,
      semanticDecision: 'appearance',
    },
    {
      media: FORCED_COLORS_MEDIA,
      selectorScope,
      declarations: { borderColor: contract.borderRole },
      precedence: 100,
      order: 1,
      specificity: 20,
      sourceRules: ['forced-colors-visible-boundary'],
      component: target.component,
      slot: target.slot,
      semanticDecision: 'visibleBoundary',
    },
  ];

  if (contract.focusVisible) {
    rules.push({
      media: FORCED_COLORS_MEDIA,
      selectorScope,
      declarations: {
        outlineColor: contract.focusRole,
        outlineStyle: 'solid',
      },
      precedence: 110,
      order: 2,
      specificity: 20,
      sourceRules: ['forced-colors-focus-indicator'],
      component: target.component,
      slot: target.slot,
      semanticDecision: 'focusIndicator',
    });
  }

  if (contract.disabledDistinguishable) {
    rules.push({
      media: FORCED_COLORS_MEDIA,
      selectorScope: `${selectorScope}:disabled`,
      declarations: {
        color: contract.foregroundRole,
        borderColor: contract.borderRole,
      },
      precedence: 120,
      order: 3,
      specificity: 30,
      sourceRules: ['forced-colors-disabled-state'],
      component: target.component,
      slot: target.slot,
      semanticDecision: 'disabledState',
    });
  }

  return { rules, diagnostics: [] };
};
