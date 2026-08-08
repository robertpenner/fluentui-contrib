import type { EmittedStyleRule, EmissionResult } from './ForcedColorsEmission';
import {
  evaluateEmission,
  normalizeForcedColorsEmission,
} from './normalizeForcedColorsEmission';

const rule = (overrides: Partial<EmittedStyleRule> = {}): EmittedStyleRule => ({
  media: '(forced-colors: active)',
  selectorScope: '.Button[data-slot="root"]',
  declarations: { color: 'ButtonText' },
  precedence: 100,
  order: 0,
  specificity: 20,
  sourceRules: ['test-rule'],
  component: 'Button',
  slot: 'root',
  semanticDecision: 'appearance',
  ...overrides,
});

const result = (...rules: EmittedStyleRule[]): EmissionResult => ({
  rules,
  diagnostics: [],
});

describe('normalizeForcedColorsEmission', () => {
  it('deduplicates exact rules and preserves modeled declarations', () => {
    const original = result(
      rule(),
      rule({ sourceRules: ['duplicate-source'] })
    );
    const normalized = normalizeForcedColorsEmission(original);

    expect(normalized.rules).toHaveLength(1);
    expect(normalized.rules[0].sourceRules).toEqual([
      'test-rule',
      'duplicate-source',
    ]);
    expect(evaluateEmission(normalized.rules)).toEqual(
      evaluateEmission(original.rules)
    );
  });

  it('groups compatible declarations at the same cascade position', () => {
    const original = result(
      rule(),
      rule({
        declarations: { backgroundColor: 'ButtonFace' },
        semanticDecision: 'visibleBoundary',
      })
    );
    const normalized = normalizeForcedColorsEmission(original);

    expect(normalized.rules).toHaveLength(1);
    expect(normalized.rules[0].declarations).toEqual({
      color: 'ButtonText',
      backgroundColor: 'ButtonFace',
    });
    expect(evaluateEmission(normalized.rules)).toEqual(
      evaluateEmission(original.rules)
    );
  });

  it.each([
    ['selectorScope', { selectorScope: '.ToggleButton[data-slot="root"]' }],
    ['component', { component: 'ToggleButton' as const }],
    ['slot', { slot: 'menuAction' as const }],
    ['precedence', { precedence: 110 }],
    ['order', { order: 1 }],
    ['specificity', { specificity: 30 }],
    ['media', { media: '( forced-colors : active )' }],
  ])(
    'keeps equal declarations separate when %s differs',
    (_dimension, overrides) => {
      const normalized = normalizeForcedColorsEmission(
        result(rule(), rule(overrides))
      );

      expect(normalized.rules).toHaveLength(2);
      expect(normalized.diagnostics).toContainEqual(
        expect.objectContaining({ kind: 'unsafeToMerge' })
      );
    }
  );

  it('keeps conflicting declarations separate at one scope', () => {
    const normalized = normalizeForcedColorsEmission(
      result(rule(), rule({ declarations: { color: 'GrayText' } }))
    );

    expect(normalized.rules).toHaveLength(2);
    expect(evaluateEmission(normalized.rules)).toEqual({ color: 'GrayText' });
    expect(normalized.diagnostics).toContainEqual(
      expect.objectContaining({
        kind: 'unsafeToMerge',
        blockedBy: ['declaration:color'],
      })
    );
  });
});
