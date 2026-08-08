import * as fc from 'fast-check';
import type {
  EmittedStyleRule,
  ForcedColorsEmissionTarget,
} from '../emission/ForcedColorsEmission';

export const forcedColorsTargetArbitrary: fc.Arbitrary<ForcedColorsEmissionTarget> =
  fc.constantFrom(
    { component: 'Button', slot: 'root' } as const,
    { component: 'ToggleButton', slot: 'root' } as const,
    { component: 'SplitButton', slot: 'primaryAction' } as const,
    { component: 'SplitButton', slot: 'menuAction' } as const
  );

const declarationArbitrary = fc.constantFrom<Readonly<Record<string, string>>>(
  { color: 'ButtonText' },
  { color: 'GrayText' },
  { backgroundColor: 'ButtonFace' },
  { borderColor: 'ButtonBorder' },
  { outlineColor: 'Highlight' }
);

export const emittedStyleRuleArbitrary: fc.Arbitrary<EmittedStyleRule> = fc
  .record({
    target: forcedColorsTargetArbitrary,
    declarations: declarationArbitrary,
    precedence: fc.integer({ min: 90, max: 120 }),
    order: fc.integer({ min: 0, max: 4 }),
    specificity: fc.constantFrom(20, 30),
  })
  .map(
    ({ target, ...generated }): EmittedStyleRule => ({
      media: '(forced-colors: active)',
      selectorScope: `.${target.component}[data-slot="${target.slot}"]`,
      declarations: generated.declarations,
      precedence: generated.precedence,
      order: generated.order,
      specificity: generated.specificity,
      sourceRules: ['generated-rule'],
      component: target.component,
      slot: target.slot,
      semanticDecision: 'appearance',
    })
  );
