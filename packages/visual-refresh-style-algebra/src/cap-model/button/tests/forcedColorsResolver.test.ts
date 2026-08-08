import type { CapButtonForcedColorsContract } from '../CapButtonForcedColors';
import { compareCapButtonForcedColors } from '../compareCapButtonForcedColors';
import {
  capButtonForcedColorsMatrix,
  capButtonForcedColorsProjection,
} from '../enumerateCapButtonForcedColorsMatrix';
import { resolveCapButtonForcedColors } from '../resolveCapButtonForcedColors';

describe('CAP Button forced-colors contract', () => {
  it('projects forced colors independently from theme and ordinary interaction fixtures', () => {
    expect(capButtonForcedColorsProjection).toEqual([
      { forcedColors: false, focusVisible: false },
      { forcedColors: true, focusVisible: false },
      { forcedColors: true, focusVisible: true },
    ]);
    expect(capButtonForcedColorsMatrix).toHaveLength(48);
    expect(
      capButtonForcedColorsMatrix.filter((entry) => entry.forcedColors).length
    ).toBe(30);
    expect(
      capButtonForcedColorsMatrix.filter((entry) => entry.focusVisible).length
    ).toBe(12);
    expect(
      capButtonForcedColorsMatrix.every(
        (entry) => !entry.focusVisible || entry.availability !== 'disabled'
      )
    ).toBe(true);
    expect(
      capButtonForcedColorsMatrix.every(
        (entry) => !('theme' in entry) && !('direction' in entry)
      )
    ).toBe(true);
  });

  it('keeps inactive forced-colors contracts free of theme paint claims', () => {
    for (const entry of capButtonForcedColorsMatrix.filter(
      (candidate) => !candidate.forcedColors
    )) {
      expect(
        resolveCapButtonForcedColors(
          entry.appearance,
          entry.availability,
          entry
        )
      ).toMatchObject({
        applies: false,
        authored: null,
        effective: null,
      });
    }
  });

  it('reports every authored and effective forced-colors field through focused comparator paths', () => {
    const expected = resolveCapButtonForcedColors('primary', 'enabled', {
      forcedColors: true,
      focusVisible: true,
    });

    if (!expected.applies) {
      throw new Error('Expected an active forced-colors contract');
    }

    const borderFields = ['top', 'right', 'bottom', 'left'] as const;
    const mutations: ReadonlyArray<
      readonly [CapButtonForcedColorsContract, string]
    > = [
      [
        {
          ...expected,
          authored: {
            ...expected.authored,
            forcedColorAdjust: null,
          },
        },
        'authored.forcedColorAdjust',
      ],
      ...(['foreground', 'background'] as const).map(
        (field): readonly [CapButtonForcedColorsContract, string] => [
          {
            ...expected,
            authored: { ...expected.authored, [field]: null },
          },
          `authored.${field}`,
        ]
      ),
      ...borderFields.map(
        (field): readonly [CapButtonForcedColorsContract, string] => [
          {
            ...expected,
            authored: {
              ...expected.authored,
              border: { ...expected.authored.border, [field]: null },
            },
          },
          `authored.border.${field}`,
        ]
      ),
      ...(['outline', 'innerShadow'] as const).map(
        (field): readonly [CapButtonForcedColorsContract, string] => [
          {
            ...expected,
            authored: {
              ...expected.authored,
              focus: { ...expected.authored.focus, [field]: null },
            },
          },
          `authored.focus.${field}`,
        ]
      ),
      ...(['mediaMatches', 'substitutesSystemColors'] as const).map(
        (field): readonly [CapButtonForcedColorsContract, string] => [
          {
            ...expected,
            effective: {
              ...expected.effective,
              [field]: !expected.effective[field],
            },
          },
          `effective.${field}`,
        ]
      ),
      ...(['forcedColorAdjust', 'foreground', 'background'] as const).map(
        (field): readonly [CapButtonForcedColorsContract, string] => [
          {
            ...expected,
            effective: { ...expected.effective, [field]: 'mutation' },
          },
          `effective.${field}`,
        ]
      ),
      ...borderFields.map(
        (field): readonly [CapButtonForcedColorsContract, string] => [
          {
            ...expected,
            effective: {
              ...expected.effective,
              border: { ...expected.effective.border, [field]: 'mutation' },
            },
          },
          `effective.border.${field}`,
        ]
      ),
      ...(
        [
          'visible',
          'outlineColor',
          'outlineStyle',
          'outlineWidth',
          'outlineOffset',
          'innerShadow',
        ] as const
      ).map((field): readonly [CapButtonForcedColorsContract, string] => [
        {
          ...expected,
          effective: {
            ...expected.effective,
            focus: {
              ...expected.effective.focus,
              [field]:
                field === 'visible'
                  ? !expected.effective.focus.visible
                  : 'mutation',
            },
          },
        },
        `effective.focus.${field}`,
      ]),
    ];

    for (const [actual, path] of mutations) {
      expect(
        compareCapButtonForcedColors(actual, expected).map(
          (difference) => difference.path
        )
      ).toEqual([path]);
    }
  });
});
