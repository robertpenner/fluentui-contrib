import {
  capButtonThemeInputKeys,
  compareCapButtonThemeInput,
  projectCapButtonThemeInput,
} from '../CapButtonTheme';

const source = Object.fromEntries(
  [
    'colorBrandBackground',
    'colorBrandBackground2',
    'colorBrandStroke2',
    'colorCompoundBrandForeground1',
    'colorNeutralBackground3',
    'colorNeutralBackgroundDisabled',
    'colorNeutralForeground3',
    'colorNeutralForegroundDisabled',
    'colorNeutralForegroundOnBrand',
    'colorNeutralStroke4',
    'colorNeutralStrokeDisabled',
    'colorNeutralStrokeOnBrand',
    'colorStrokeFocus1',
    'colorStrokeFocus2',
    'colorTransparentBackground',
    'colorTransparentStroke',
    'strokeWidthThick',
    'strokeWidthThin',
  ].map((key) => [key, `value:${key}`])
);

describe('CAP Button semantic theme input', () => {
  it('projects exactly the token values required by grounded static Button paint', () => {
    const theme = projectCapButtonThemeInput({
      ...source,
      colorBrandBackgroundHover: 'excluded interaction token',
      direction: 'excluded provider context',
      forcedColors: 'excluded media context',
      name: 'excluded fixture identity',
    });

    expect(Object.keys(theme)).toEqual(capButtonThemeInputKeys);
    expect(theme).toEqual(source);
  });

  it('reports a focused difference for every semantic token field', () => {
    const expected = projectCapButtonThemeInput(source);

    for (const key of capButtonThemeInputKeys) {
      const actual = { ...expected, [key]: `mutation:${key}` };

      expect(compareCapButtonThemeInput(actual, expected)).toEqual([
        {
          path: `theme.${key}`,
          actual: `mutation:${key}`,
          expected: `value:${key}`,
        },
      ]);
    }
  });
});
