import type {
  CapButtonBorderColors,
  CapButtonObservation,
  CapButtonRootAppearance,
  CapButtonStaticFocusTreatment,
} from '../CapButtonObservation';
import {
  capButtonAppearances,
  type CapButtonScenario,
} from '../CapButtonScenario';
import { compareCapButton } from '../compareCapButton';
import { resolveCleanRoomCapButton } from '../resolveCleanRoomCapButton';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
  tracedCapButtonScenario,
} from './productionAdapter';

const availabilityPairs = [
  { disabled: false, disabledFocusable: false },
  { disabled: true, disabledFocusable: false },
  { disabled: false, disabledFocusable: true },
  { disabled: true, disabledFocusable: true },
] as const;

const appearanceAvailabilityScenarios = capButtonAppearances.flatMap(
  (appearance) =>
    availabilityPairs.map(
      (availability): CapButtonScenario => ({
        ...tracedCapButtonScenario,
        appearance,
        ...availability,
        content: {
          icon: 'absent',
          children: 'present',
          iconPosition: 'omitted',
        },
      })
    )
);

const outputSignature = (observation: CapButtonObservation): string =>
  JSON.stringify(observation.rootAppearance);

const mutateBorder = (
  production: CapButtonObservation,
  location: 'root' | 'focus',
  field: keyof CapButtonBorderColors
): CapButtonObservation => {
  const border =
    location === 'root'
      ? production.rootAppearance.border
      : production.rootAppearance.focusTreatment.border;
  const rootAppearance: CapButtonRootAppearance =
    location === 'root'
      ? {
          ...production.rootAppearance,
          border: { ...border, [field]: 'mutation' },
        }
      : {
          ...production.rootAppearance,
          focusTreatment: {
            ...production.rootAppearance.focusTreatment,
            border: { ...border, [field]: 'mutation' },
          },
        };

  return { ...production, rootAppearance };
};

describe('CAP Button appearance and availability parity', () => {
  it('matches all 24 production appearance and authored availability inputs', () => {
    const production = observeCapButtonProductionScenarios(
      appearanceAvailabilityScenarios,
      tracedCapButtonConditions
    );

    expect(production).toHaveLength(24);

    for (const observation of production) {
      const cleanRoom = resolveCleanRoomCapButton(
        observation.scenario,
        observation.conditions
      );

      expect(compareCapButton(observation, cleanRoom)).toEqual([]);
    }
  });

  it('derives exactly 11 root appearance outputs from production equivalence', () => {
    const production = observeCapButtonProductionScenarios(
      appearanceAvailabilityScenarios,
      tracedCapButtonConditions
    );
    const groups = new Map<string, CapButtonObservation[]>();

    for (const observation of production) {
      const signature = outputSignature(observation);
      const group = groups.get(signature) ?? [];
      group.push(observation);
      groups.set(signature, group);
    }

    expect(groups.size).toBe(11);

    for (const group of groups.values()) {
      const [reference, ...equivalent] = group;

      for (const observation of equivalent) {
        expect(observation.rootAppearance).toEqual(reference.rootAppearance);
      }
    }
  });

  it('keeps disabled and disabledFocusable authored state distinct when styles coincide', () => {
    const production = observeCapButtonProductionScenarios(
      appearanceAvailabilityScenarios,
      tracedCapButtonConditions
    );

    for (const appearance of capButtonAppearances) {
      const disabledFocusableOnly = production.find(
        (observation) =>
          observation.scenario.appearance === appearance &&
          !observation.scenario.disabled &&
          observation.scenario.disabledFocusable
      );
      const bothAuthored = production.find(
        (observation) =>
          observation.scenario.appearance === appearance &&
          observation.scenario.disabled &&
          observation.scenario.disabledFocusable
      );

      expect(disabledFocusableOnly?.normalized).toMatchObject({
        disabled: false,
        disabledFocusable: true,
      });
      expect(bothAuthored?.normalized).toMatchObject({
        disabled: true,
        disabledFocusable: true,
      });
      expect(disabledFocusableOnly?.rootAppearance).toEqual(
        bothAuthored?.rootAppearance
      );
    }

    for (const appearance of ['primary', 'tint'] as const) {
      const disabled = production.find(
        (observation) =>
          observation.scenario.appearance === appearance &&
          observation.scenario.disabled &&
          !observation.scenario.disabledFocusable
      );
      const disabledFocusable = production.find(
        (observation) =>
          observation.scenario.appearance === appearance &&
          !observation.scenario.disabled &&
          observation.scenario.disabledFocusable
      );

      expect(disabled?.rootAppearance.focusTreatment.selection).toBe('primary');
      expect(disabledFocusable?.rootAppearance.focusTreatment.selection).toBe(
        'base'
      );
    }
  });

  it('reports every modeled color, border, and static focus field independently', () => {
    const [production] = observeCapButtonProductionScenarios(
      [tracedCapButtonScenario],
      tracedCapButtonConditions
    );
    const cleanRoom = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      tracedCapButtonConditions
    );
    const focus = production.rootAppearance.focusTreatment;
    const mutateFocus = <Field extends keyof CapButtonStaticFocusTreatment>(
      field: Field,
      value: CapButtonStaticFocusTreatment[Field]
    ): CapButtonObservation => ({
      ...production,
      rootAppearance: {
        ...production.rootAppearance,
        focusTreatment: { ...focus, [field]: value },
      },
    });
    const mutations: ReadonlyArray<readonly [CapButtonObservation, string]> = [
      [
        {
          ...production,
          rootAppearance: {
            ...production.rootAppearance,
            foreground: 'mutation',
          },
        },
        'rootAppearance.foreground',
      ],
      [
        {
          ...production,
          rootAppearance: {
            ...production.rootAppearance,
            background: 'mutation',
          },
        },
        'rootAppearance.background',
      ],
      ...(['top', 'right', 'bottom', 'left'] as const).map(
        (field): readonly [CapButtonObservation, string] => [
          mutateBorder(production, 'root', field),
          `rootAppearance.border.${field}`,
        ]
      ),
      ...(['top', 'right', 'bottom', 'left'] as const).map(
        (field): readonly [CapButtonObservation, string] => [
          mutateBorder(production, 'focus', field),
          `rootAppearance.focusTreatment.border.${field}`,
        ]
      ),
      [
        mutateFocus(
          'selection',
          focus.selection === 'base' ? 'primary' : 'base'
        ),
        'rootAppearance.focusTreatment.selection',
      ],
      [
        mutateFocus('outline', { ...focus.outline, color: 'mutation' }),
        'rootAppearance.focusTreatment.outline.color',
      ],
      [
        mutateFocus('outline', { ...focus.outline, style: 'mutation' }),
        'rootAppearance.focusTreatment.outline.style',
      ],
      [
        mutateFocus('outline', { ...focus.outline, width: 'mutation' }),
        'rootAppearance.focusTreatment.outline.width',
      ],
      [
        mutateFocus('innerShadow', 'mutation'),
        'rootAppearance.focusTreatment.innerShadow',
      ],
    ];

    for (const [mutation, path] of mutations) {
      expect(
        compareCapButton(mutation, cleanRoom).map((item) => item.path)
      ).toEqual([path]);
    }
  });

  it('pins appearance evidence without claiming product support', () => {
    const contract = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      tracedCapButtonConditions
    );
    const appearanceEvidence = contract.provenance.filter((evidence) =>
      evidence.scenarioProjection.includes('appearance')
    );

    expect(appearanceEvidence.length).toBeGreaterThan(0);
    expect(
      appearanceEvidence.every((evidence) => evidence.support === 'unknown')
    ).toBe(true);
  });
});
