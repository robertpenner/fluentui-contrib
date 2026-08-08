import {
  isForcedColorsActiveCondition,
  selectorContainsClass,
} from './captureGriffelForcedColorsRules';

describe('captureGriffelForcedColorsRules filters', () => {
  it('matches exact class tokens without matching class-name prefixes', () => {
    expect(selectorContainsClass('.fui-Button:hover', 'fui-Button')).toBe(true);
    expect(
      selectorContainsClass('.root:hover .fui-Button__icon', 'fui-Button')
    ).toBe(false);
    expect(selectorContainsClass('.fui-Button2', 'fui-Button')).toBe(false);
  });

  it('accepts only the active forced-colors condition', () => {
    expect(isForcedColorsActiveCondition('(forced-colors: active)')).toBe(true);
    expect(isForcedColorsActiveCondition(' (FORCED-COLORS: ACTIVE) ')).toBe(
      true
    );
    expect(isForcedColorsActiveCondition('(forced-colors: none)')).toBe(false);
    expect(isForcedColorsActiveCondition('not (forced-colors: active)')).toBe(
      false
    );
  });
});
