export const capButtonThemeInputKeys = [
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
] as const;

export const capButtonThemeFixtureNames = [
  'web-light-with-cap',
  'web-dark-with-cap',
] as const;

export type CapButtonThemeFixtureName =
  (typeof capButtonThemeFixtureNames)[number];

export type CapButtonThemeInputKey = (typeof capButtonThemeInputKeys)[number];

export type CapButtonThemeInput = Readonly<
  Record<CapButtonThemeInputKey, string>
>;

export interface CapButtonThemeInputDifference {
  readonly path: `theme.${CapButtonThemeInputKey}`;
  readonly actual: string;
  readonly expected: string;
}

export const projectCapButtonThemeInput = (
  source: Readonly<Record<string, unknown>>
): CapButtonThemeInput =>
  Object.fromEntries(
    capButtonThemeInputKeys.map((key) => {
      const value = source[key];

      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error(`CAP Button theme input is missing ${key}`);
      }

      return [key, String(value)];
    })
  ) as CapButtonThemeInput;

export const compareCapButtonThemeInput = (
  actual: CapButtonThemeInput,
  expected: CapButtonThemeInput
): readonly CapButtonThemeInputDifference[] =>
  capButtonThemeInputKeys.flatMap((key) =>
    actual[key] === expected[key]
      ? []
      : [
          {
            path: `theme.${key}` as const,
            actual: actual[key],
            expected: expected[key],
          },
        ]
  );
