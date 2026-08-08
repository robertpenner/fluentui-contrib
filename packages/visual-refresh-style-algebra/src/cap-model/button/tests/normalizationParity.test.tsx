import type { CapButtonObservation } from '../CapButtonObservation';
import type { CapButtonReactChildInput } from '../CapButtonScenario';
import { compareCapButton } from '../compareCapButton';
import { capButtonScenarios } from '../enumerateCapButtonScenarios';
import { resolveCleanRoomCapButton } from '../resolveCleanRoomCapButton';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
  tracedCapButtonScenario,
  tracedCapButtonTheme,
} from './productionAdapter';

const semanticProjection = (observation: CapButtonObservation): unknown => ({
  normalized: observation.normalized,
  anatomy: observation.anatomy,
  styleSelections: observation.styleSelections,
});

let productionCensus: readonly CapButtonObservation[] | undefined;

const observeProductionCensus = (): readonly CapButtonObservation[] => {
  productionCensus ??= observeCapButtonProductionScenarios(
    capButtonScenarios,
    tracedCapButtonConditions
  );

  return productionCensus;
};

describe('CAP Button normalization and anatomy parity', () => {
  it('enumerates and matches every production-owned authored scenario', () => {
    const production = observeProductionCensus();

    expect(capButtonScenarios).toHaveLength(2_592);
    expect(production).toHaveLength(capButtonScenarios.length);

    for (const observation of production) {
      const cleanRoom = resolveCleanRoomCapButton(
        observation.scenario,
        observation.conditions,
        tracedCapButtonTheme
      );

      expect(compareCapButton(observation, cleanRoom)).toEqual([]);
    }

    expect(
      new Set(
        production.map((observation) => JSON.stringify(observation.normalized))
      ).size
    ).toBe(1_728);
  });

  it('demonstrates canonicalization with equivalent production observations', () => {
    const production = observeProductionCensus();
    const groups = new Map<string, CapButtonObservation[]>();

    for (const observation of production) {
      const signature = JSON.stringify(observation.normalized);
      const group = groups.get(signature) ?? [];
      group.push(observation);
      groups.set(signature, group);
    }

    const canonicalizedGroups = [...groups.values()].filter(
      (group) => group.length > 1
    );
    expect(canonicalizedGroups.length).toBeGreaterThan(0);

    for (const group of canonicalizedGroups) {
      const [reference, ...equivalent] = group;

      for (const observation of equivalent) {
        expect(semanticProjection(observation)).toEqual(
          semanticProjection(reference)
        );
      }
    }
  });

  it.each<
    readonly [
      CapButtonReactChildInput,
      boolean,
      boolean,
      readonly ('icon' | 'content')[]
    ]
  >([
    ['react.null', false, true, ['icon']],
    ['react.false', false, true, ['icon']],
    ['react.zero', false, true, ['icon']],
    ['react.emptyString', false, true, ['icon']],
    ['react.emptyFragment', true, false, ['icon']],
    ['react.whitespace', true, false, ['icon', 'content']],
  ])(
    'preserves the %s React-child observation',
    (children, childrenTruthy, iconOnly, anatomy) => {
      const scenario = {
        ...tracedCapButtonScenario,
        content: { ...tracedCapButtonScenario.content, children },
      };
      const [production] = observeCapButtonProductionScenarios(
        [scenario],
        tracedCapButtonConditions
      );
      const cleanRoom = resolveCleanRoomCapButton(
        scenario,
        tracedCapButtonConditions,
        tracedCapButtonTheme
      );

      expect(production.normalized).toMatchObject({
        hasChildren: true,
        childrenTruthy,
        iconOnly,
      });
      expect(production.anatomy).toEqual(anatomy);
      expect(compareCapButton(production, cleanRoom)).toEqual([]);
    }
  );

  it('reports each normalization and anatomy mutation independently', () => {
    const [production] = observeCapButtonProductionScenarios(
      [tracedCapButtonScenario],
      tracedCapButtonConditions
    );
    const cleanRoom = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      tracedCapButtonConditions,
      tracedCapButtonTheme
    );
    const mutations: ReadonlyArray<readonly [CapButtonObservation, string]> = [
      [
        {
          ...production,
          normalized: {
            ...production.normalized,
            appearance: 'secondary',
          },
        },
        'normalized.appearance',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, size: 'large' },
        },
        'normalized.size',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, shape: 'square' },
        },
        'normalized.shape',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, disabled: true },
        },
        'normalized.disabled',
      ],
      [
        {
          ...production,
          normalized: {
            ...production.normalized,
            disabledFocusable: true,
          },
        },
        'normalized.disabledFocusable',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, iconPosition: 'after' },
        },
        'normalized.iconPosition',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, iconOnly: true },
        },
        'normalized.iconOnly',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, hasIcon: false },
        },
        'normalized.hasIcon',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, hasChildren: false },
        },
        'normalized.hasChildren',
      ],
      [
        {
          ...production,
          normalized: { ...production.normalized, childrenTruthy: false },
        },
        'normalized.childrenTruthy',
      ],
      [{ ...production, anatomy: ['content', 'icon'] }, 'anatomy'],
    ];

    for (const [mutation, path] of mutations) {
      expect(
        compareCapButton(mutation, cleanRoom).map((item) => item.path)
      ).toEqual([path]);
    }
  });
});
