import type {
  CapButtonGeometry,
  CapButtonObservation,
} from '../CapButtonObservation';
import {
  capButtonShapes,
  capButtonSizes,
  type CapButtonScenario,
} from '../CapButtonScenario';
import { compareCapButton } from '../compareCapButton';
import { resolveCleanRoomCapButton } from '../resolveCleanRoomCapButton';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
  tracedCapButtonScenario,
  tracedCapButtonTheme,
} from './productionAdapter';

const contentEffects = {
  empty: { icon: 'absent', children: 'absent', iconPosition: 'omitted' },
  textOnly: { icon: 'absent', children: 'present', iconPosition: 'omitted' },
  iconOnly: { icon: 'present', children: 'absent', iconPosition: 'omitted' },
  iconBefore: { icon: 'present', children: 'present', iconPosition: 'before' },
  iconAfter: { icon: 'present', children: 'present', iconPosition: 'after' },
} as const satisfies Readonly<Record<string, CapButtonScenario['content']>>;

type ContentEffect = keyof typeof contentEffects;

const geometryScenarios = capButtonSizes.flatMap((size) =>
  capButtonShapes.flatMap((shape) =>
    Object.entries(contentEffects).map(([effect, content]) => ({
      effect: effect as ContentEffect,
      scenario: {
        ...tracedCapButtonScenario,
        size,
        shape,
        content,
      },
    }))
  )
);

const geometryByEffect = (
  observations: readonly CapButtonObservation[],
  size: CapButtonScenario['size'],
  shape: CapButtonScenario['shape']
): Readonly<Record<ContentEffect, CapButtonGeometry>> =>
  Object.fromEntries(
    observations
      .filter(
        (observation) =>
          observation.scenario.size === size &&
          observation.scenario.shape === shape
      )
      .map((observation) => {
        const effect = geometryScenarios.find(
          (entry) => entry.scenario === observation.scenario
        )?.effect;

        if (effect === undefined) {
          throw new Error('Missing geometry content effect');
        }

        return [effect, observation.geometry];
      })
  ) as Readonly<Record<ContentEffect, CapButtonGeometry>>;

describe('CAP Button geometry parity', () => {
  it('matches production across all sizes, shapes, and content effects', () => {
    const scenarios = geometryScenarios.map((entry) => entry.scenario);
    const production = observeCapButtonProductionScenarios(
      scenarios,
      tracedCapButtonConditions
    );

    expect(production).toHaveLength(45);

    for (const observation of production) {
      const cleanRoom = resolveCleanRoomCapButton(
        observation.scenario,
        observation.conditions,
        tracedCapButtonTheme
      );

      expect(compareCapButton(observation, cleanRoom)).toEqual([]);
    }
  });

  it('preserves production geometry equivalences and distinctions', () => {
    const production = observeCapButtonProductionScenarios(
      geometryScenarios.map((entry) => entry.scenario),
      tracedCapButtonConditions
    );

    for (const size of capButtonSizes) {
      const rounded = geometryByEffect(production, size, 'rounded');
      const circular = geometryByEffect(production, size, 'circular');
      const square = geometryByEffect(production, size, 'square');

      expect(rounded.empty).toEqual(rounded.textOnly);
      expect(rounded.iconOnly.root.minWidth).toBe(
        rounded.iconOnly.root.maxWidth
      );
      expect(rounded.iconOnly.root.paddingLeft).toBe(
        rounded.iconOnly.root.paddingTop
      );
      expect(rounded.iconBefore.root.paddingLeft).not.toBe(
        rounded.iconBefore.root.paddingRight
      );
      expect(rounded.iconAfter.root.paddingLeft).toBe(
        rounded.iconBefore.root.paddingRight
      );
      expect(rounded.iconAfter.root.paddingRight).toBe(
        rounded.iconBefore.root.paddingLeft
      );
      expect(rounded.iconBefore.icon?.marginRight).toBeDefined();
      expect(rounded.iconBefore.icon?.marginLeft).toBeUndefined();
      expect(rounded.iconAfter.icon?.marginLeft).toBe(
        rounded.iconBefore.icon?.marginRight
      );
      expect(rounded.iconAfter.icon?.marginRight).toBeUndefined();

      expect(circular.empty.root).toEqual({
        ...rounded.empty.root,
        borderTopLeftRadius: circular.empty.root.borderTopLeftRadius,
        borderTopRightRadius: circular.empty.root.borderTopRightRadius,
        borderBottomRightRadius: circular.empty.root.borderBottomRightRadius,
        borderBottomLeftRadius: circular.empty.root.borderBottomLeftRadius,
      });
      expect(square.empty.root).toEqual({
        ...rounded.empty.root,
        borderTopLeftRadius: square.empty.root.borderTopLeftRadius,
        borderTopRightRadius: square.empty.root.borderTopRightRadius,
        borderBottomRightRadius: square.empty.root.borderBottomRightRadius,
        borderBottomLeftRadius: square.empty.root.borderBottomLeftRadius,
      });
      expect(
        new Set([
          rounded.empty.root.borderTopLeftRadius,
          circular.empty.root.borderTopLeftRadius,
          square.empty.root.borderTopLeftRadius,
        ]).size
      ).toBe(3);
    }
  });

  it('reports every modeled geometry field independently', () => {
    const [production] = observeCapButtonProductionScenarios(
      [tracedCapButtonScenario],
      tracedCapButtonConditions
    );
    const cleanRoom = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      tracedCapButtonConditions,
      tracedCapButtonTheme
    );
    const productionIcon = production.geometry.icon;

    if (productionIcon === undefined) {
      throw new Error('Traced geometry scenario must render an icon');
    }

    const mutateRoot = (
      field: keyof CapButtonGeometry['root']
    ): readonly [CapButtonObservation, string] => [
      {
        ...production,
        geometry: {
          ...production.geometry,
          root: { ...production.geometry.root, [field]: '999px' },
        },
      },
      `geometry.root.${field}`,
    ];
    const mutateIcon = (
      field: keyof NonNullable<CapButtonGeometry['icon']>
    ): readonly [CapButtonObservation, string] => [
      {
        ...production,
        geometry: {
          ...production.geometry,
          icon: { ...productionIcon, [field]: '999px' },
        },
      },
      `geometry.icon.${field}`,
    ];
    const mutations = [
      mutateRoot('paddingTop'),
      mutateRoot('paddingRight'),
      mutateRoot('paddingBottom'),
      mutateRoot('paddingLeft'),
      mutateRoot('borderTopLeftRadius'),
      mutateRoot('borderTopRightRadius'),
      mutateRoot('borderBottomRightRadius'),
      mutateRoot('borderBottomLeftRadius'),
      mutateRoot('minWidth'),
      mutateRoot('maxWidth'),
      mutateRoot('fontSize'),
      mutateRoot('fontWeight'),
      mutateRoot('lineHeight'),
      mutateIcon('fontSize'),
      mutateIcon('marginLeft'),
      mutateIcon('marginRight'),
    ] as const;

    for (const [mutation, path] of mutations) {
      expect(
        compareCapButton(mutation, cleanRoom).map((item) => item.path)
      ).toEqual([path]);
    }
  });
});
