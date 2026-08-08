import type { CapButtonInteractionContract } from '../CapButtonInteraction';
import { capButtonInteractionConditions } from '../enumerateCapButtonInteractionConditions';
import { compareCapButtonInteraction } from '../compareCapButtonInteraction';
import {
  capButtonInteractionSurfaces,
  resolveCapButtonInteraction,
} from '../resolveCapButtonInteraction';
import { capButtonAppearances } from '../CapButtonScenario';

const rest = capButtonInteractionConditions[0];
const hover = capButtonInteractionConditions[1];
const active = capButtonInteractionConditions[2];
const focusVisible = capButtonInteractionConditions[3];

describe('CAP Button interaction resolver', () => {
  it('provides an independent runtime table for every availability state', () => {
    expect(Object.keys(capButtonInteractionSurfaces)).toEqual([
      'enabled',
      'disabled',
      'disabledFocusable',
    ]);
    expect(capButtonInteractionSurfaces.disabled).not.toBe(
      capButtonInteractionSurfaces.disabledFocusable
    );
  });

  it('resolves every appearance and availability independently', () => {
    for (const appearance of capButtonAppearances) {
      for (const availability of [
        'enabled',
        'disabled',
        'disabledFocusable',
      ] as const) {
        for (const conditions of capButtonInteractionConditions) {
          expect(
            resolveCapButtonInteraction(appearance, availability, conditions)
          ).toMatchObject({
            appearance,
            availability,
            conditions,
            evidence: expect.objectContaining({ support: 'unknown' }),
          });
        }
      }
    }
  });

  it('models enabled rest, hover, and active as distinct surface states', () => {
    for (const appearance of capButtonAppearances) {
      const outputs = [rest, hover, active].map((conditions) =>
        resolveCapButtonInteraction(appearance, 'enabled', conditions)
      );

      expect(
        new Set(outputs.map((output) => JSON.stringify(output.surface))).size
      ).toBeGreaterThan(appearance === 'transparent' ? 1 : 2);
    }
  });

  it('suppresses disabled hover and active surfaces for every appearance', () => {
    for (const appearance of capButtonAppearances) {
      const disabledRest = resolveCapButtonInteraction(
        appearance,
        'disabled',
        rest
      );

      for (const conditions of [hover, active]) {
        expect(
          resolveCapButtonInteraction(appearance, 'disabled', conditions)
            .surface
        ).toEqual(disabledRest.surface);
      }
    }
  });

  it('represents disabledFocusable separately while suppressing its pointer surfaces', () => {
    for (const appearance of capButtonAppearances) {
      const disabled = resolveCapButtonInteraction(
        appearance,
        'disabled',
        focusVisible
      );
      const disabledFocusable = resolveCapButtonInteraction(
        appearance,
        'disabledFocusable',
        focusVisible
      );

      expect(disabled.availability).toBe('disabled');
      expect(disabledFocusable.availability).toBe('disabledFocusable');
      expect(disabled.focusTreatment.visible).toBe(false);
      expect(disabledFocusable.focusTreatment.visible).toBe(true);
    }
  });

  it('adds focus treatment without replacing a coexisting pointer surface', () => {
    for (const appearance of capButtonAppearances) {
      for (const [unfocused, focused] of [
        [capButtonInteractionConditions[0], capButtonInteractionConditions[3]],
        [capButtonInteractionConditions[1], capButtonInteractionConditions[4]],
        [capButtonInteractionConditions[2], capButtonInteractionConditions[5]],
      ] as const) {
        const withoutFocus = resolveCapButtonInteraction(
          appearance,
          'enabled',
          unfocused
        );
        const withFocus = resolveCapButtonInteraction(
          appearance,
          'enabled',
          focused
        );

        expect(withFocus.surface.foreground).toBe(
          withoutFocus.surface.foreground
        );
        expect(withFocus.surface.background).toBe(
          withoutFocus.surface.background
        );
        expect(withoutFocus.focusTreatment.visible).toBe(false);
        expect(withFocus.conditions.focusVisible).toBe(true);
        expect(withFocus.focusTreatment.visible).toBe(!focused.active);
        expect(withFocus.focusTreatment.innerShadow).not.toBe('none');
      }
    }
  });

  it('reports every interactive semantic field through focused comparator paths', () => {
    const expected = resolveCapButtonInteraction(
      'primary',
      'enabled',
      focusVisible
    );
    const borderFields = ['top', 'right', 'bottom', 'left'] as const;
    const mutations: ReadonlyArray<
      readonly [CapButtonInteractionContract, string]
    > = [
      [
        {
          ...expected,
          surface: { ...expected.surface, foreground: 'mutation' },
        },
        'surface.foreground',
      ],
      [
        {
          ...expected,
          surface: { ...expected.surface, background: 'mutation' },
        },
        'surface.background',
      ],
      ...borderFields.map(
        (field): readonly [CapButtonInteractionContract, string] => [
          {
            ...expected,
            surface: {
              ...expected.surface,
              border: { ...expected.surface.border, [field]: 'mutation' },
            },
          },
          `surface.border.${field}`,
        ]
      ),
      ...borderFields.map(
        (field): readonly [CapButtonInteractionContract, string] => [
          {
            ...expected,
            focusTreatment: {
              ...expected.focusTreatment,
              border: {
                ...expected.focusTreatment.border,
                [field]: 'mutation',
              },
            },
          },
          `focusTreatment.border.${field}`,
        ]
      ),
      ...(
        [
          ['color', 'mutation'],
          ['style', 'mutation'],
          ['width', 'mutation'],
          ['offset', 'mutation'],
        ] as const
      ).map(
        ([field, value]): readonly [CapButtonInteractionContract, string] => [
          {
            ...expected,
            focusTreatment: {
              ...expected.focusTreatment,
              outline: { ...expected.focusTreatment.outline, [field]: value },
            },
          },
          `focusTreatment.outline.${field}`,
        ]
      ),
      [
        {
          ...expected,
          focusTreatment: {
            ...expected.focusTreatment,
            innerShadow: 'mutation',
          },
        },
        'focusTreatment.innerShadow',
      ],
      [
        {
          ...expected,
          focusTreatment: {
            ...expected.focusTreatment,
            visible: false,
          },
        },
        'focusTreatment.visible',
      ],
    ];

    for (const [actual, path] of mutations) {
      expect(
        compareCapButtonInteraction(actual, expected).map(
          (difference) => difference.path
        )
      ).toEqual([path]);
    }
  });
});
