import { adaptGriffelForcedColorsCapture } from './adaptGriffelForcedColorsCapture';

describe('adaptGriffelForcedColorsCapture', () => {
  it('preserves one captured CSS rule and its context', () => {
    const result = adaptGriffelForcedColorsCapture(
      [
        {
          media: '(forced-colors: active)',
          selectorScope: '.fui-Button:hover',
          declarations: {
            'background-color': 'highlighttext',
            'border-left-color': 'highlight',
            color: 'highlight',
          },
          precedence: 8,
          order: 12,
          sourceRule:
            '.fui-Button:hover { background-color: highlighttext; border-left-color: highlight; color: highlight; }',
        },
      ],
      { component: 'Button', slot: 'root' }
    );

    expect(result.rules).toEqual([
      expect.objectContaining({
        media: '(forced-colors: active)',
        selectorScope: '.fui-Button:hover',
        declarations: {
          'background-color': 'highlighttext',
          'border-left-color': 'highlight',
          color: 'highlight',
        },
        precedence: 8,
        order: 12,
        specificity: 6,
        semanticDecision: 'appearance',
      }),
    ]);
    expect(result.rules.every((rule) => rule.sourceRules.length === 1)).toBe(
      true
    );
  });

  it('classifies focus selectors before boundary declarations', () => {
    const result = adaptGriffelForcedColorsCapture(
      [
        {
          media: '(forced-colors: active)',
          selectorScope: '.fui-Button:focus',
          declarations: { 'border-color': 'buttontext' },
          precedence: 8,
          order: 0,
          sourceRule: '.fui-Button:focus { border-color: buttontext; }',
        },
      ],
      { component: 'Button', slot: 'root' }
    );

    expect(result.rules).toEqual([
      expect.objectContaining({ semanticDecision: 'focusIndicator' }),
    ]);
  });

  it('preserves specificity ordering within the captured corpus', () => {
    const result = adaptGriffelForcedColorsCapture(
      [
        {
          media: '(forced-colors: active)',
          selectorScope: '.button:hover',
          declarations: { color: 'ButtonText' },
          precedence: 0,
          order: 0,
          sourceRule: '.button:hover { color: ButtonText; }',
        },
        {
          media: '(forced-colors: active)',
          selectorScope: '#button',
          declarations: { color: 'Highlight' },
          precedence: 0,
          order: 1,
          sourceRule: '#button { color: Highlight; }',
        },
      ],
      { component: 'Button', slot: 'root' }
    );

    expect(result.rules[1].specificity).toBeGreaterThan(
      result.rules[0].specificity
    );
  });
});
