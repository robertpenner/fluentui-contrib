import type { CapturedGriffelStyleRule } from './adaptGriffelForcedColorsCapture';
import { diffGriffelForcedColorsCaptures } from './diffGriffelForcedColorsCaptures';

const createRule = (
  selectorScope: string,
  declarations: Readonly<Record<string, string>>,
  order: number
): CapturedGriffelStyleRule => ({
  media: '(forced-colors: active)',
  selectorScope,
  declarations,
  precedence: 2,
  order,
  sourceRule: `${selectorScope} { color: CanvasText; }`,
});

describe('diffGriffelForcedColorsCaptures', () => {
  it('separates generated-class, emitted-rule, and matching-selector changes', () => {
    const baseRule = createRule('.base', { color: 'CanvasText' }, 0);
    const disabledRule = createRule('.base:disabled', { color: 'GrayText' }, 1);
    const selectedRule = createRule(
      '.selected',
      { 'background-color': 'Highlight' },
      2
    );

    const difference = diffGriffelForcedColorsCaptures(
      {
        classNames: ['fui-Button', 'base'],
        rules: [baseRule, disabledRule],
        matchingRuleIndexes: [0],
      },
      {
        classNames: ['fui-Button', 'base', 'selected'],
        rules: [baseRule, disabledRule, selectedRule],
        matchingRuleIndexes: [0, 1, 2],
      }
    );

    expect(difference).toEqual({
      addedClassNames: ['selected'],
      removedClassNames: [],
      addedRules: [selectedRule],
      removedRules: [],
      activatedRules: [disabledRule, selectedRule],
      deactivatedRules: [],
    });
  });
});
