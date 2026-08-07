import * as React from 'react';
import { render, renderHook } from '@testing-library/react';
import {
  Button,
  FluentProvider,
  renderButton_unstable,
  useButtonStyles_unstable,
  useButton_unstable,
  webLightTheme,
  type ButtonProps,
} from '@fluentui/react-components';
import { CAP_STYLE_HOOKS } from '@fluentui-contrib/react-cap-theme';
import { CapFixtureProvider } from '../fixtures/capButtonFamily';
import {
  buttonContentEvidenceBaseline,
  buttonContentEvidenceRows,
  buttonContentGroundingCensus,
  buttonContentScenarios,
  compareButtonContentObservations,
  mapButtonContentObservation,
  reactChildEdgeCases,
  type ButtonContentEvidenceRow,
  type ButtonContentProductionObservation,
  type ButtonContentScenario,
  type CapStyleEffect,
} from './contentAnatomyGrounding';

type ActualObservation = Omit<
  ButtonContentProductionObservation,
  'capStyleEffect'
> & {
  readonly capClassSignature: string;
  readonly renderedText: string;
};

const slotAttribute = 'data-content-anatomy-slot';

const scenarioProps = (scenario: ButtonContentScenario): ButtonProps => ({
  children:
    scenario.children === 'present' ? (
      <span {...{ [slotAttribute]: 'content' }}>Action</span>
    ) : undefined,
  icon:
    scenario.icon === 'present' ? (
      <span {...{ [slotAttribute]: 'icon' }} aria-hidden="true" />
    ) : undefined,
  iconPosition:
    scenario.iconPosition === 'omitted' ? undefined : scenario.iconPosition,
});

const addedClasses = (baseline: Element, cap: Element): readonly string[] =>
  [...cap.classList]
    .filter((className) => !baseline.classList.contains(className))
    .sort();

const iconSlot = (button: HTMLElement): Element | undefined =>
  button.querySelector(`[${slotAttribute}="icon"]`)?.parentElement ?? undefined;

const classSignature = (
  baselineButton: HTMLElement,
  capButton: HTMLElement
): string => {
  const baselineIcon = iconSlot(baselineButton);
  const capIcon = iconSlot(capButton);

  return JSON.stringify({
    root: addedClasses(baselineButton, capButton),
    icon:
      baselineIcon && capIcon ? addedClasses(baselineIcon, capIcon) : undefined,
  });
};

const observeProps = (
  scenarioId: string,
  props: ButtonProps
): ActualObservation => {
  const { result, unmount: unmountHook } = renderHook(() => {
    const state = useButton_unstable(props, React.createRef());

    useButtonStyles_unstable(state);
    CAP_STYLE_HOOKS.useButtonStyles_unstable?.(state);

    return state;
  });
  const state = result.current;
  const hookElement = renderButton_unstable(state);
  const rendered = render(
    <>
      <FluentProvider theme={webLightTheme}>
        <Button {...props} data-testid="baseline-button" />
      </FluentProvider>
      <CapFixtureProvider>
        <Button {...props} data-testid="cap-button" />
      </CapFixtureProvider>
      <div data-testid="hook-render">{hookElement}</div>
    </>
  );
  const baselineButton = rendered.getByTestId('baseline-button');
  const capButton = rendered.getByTestId('cap-button');
  const hookButton = rendered.getByTestId('hook-render').firstElementChild;

  if (!(hookButton instanceof HTMLElement)) {
    throw new Error(`Scenario ${scenarioId} did not render a button`);
  }

  const observation: ActualObservation = {
    baselineId: buttonContentEvidenceBaseline.id,
    scenarioId,
    normalizedState: {
      effectiveIconPosition: state.iconPosition,
      hasIconSlot: state.icon !== undefined,
      hasRootChildren: state.root.children !== undefined,
      iconOnly: state.iconOnly,
    },
    renderedAnatomy: {
      slots: [...hookButton.querySelectorAll(`[${slotAttribute}]`)].map(
        (slot) => slot.getAttribute(slotAttribute) as 'content' | 'icon'
      ),
    },
    capClassSignature: classSignature(baselineButton, capButton),
    renderedText: hookButton.textContent ?? '',
  };

  rendered.unmount();
  unmountHook();

  return observation;
};

const observeScenario = (scenario: ButtonContentScenario): ActualObservation =>
  observeProps(scenario.id, scenarioProps(scenario));

const edgeCaseChild = (
  id: (typeof reactChildEdgeCases)[number]['id']
): React.ReactNode => {
  switch (id) {
    case 'null':
      return null;
    case 'false':
      return false;
    case 'zero':
      return 0;
    case 'emptyString':
      return '';
    case 'emptyFragment':
      return <></>;
    case 'whitespace':
      return ' ';
  }
};

const edgeCaseProps = (
  id: (typeof reactChildEdgeCases)[number]['id']
): ButtonProps => ({
  children: edgeCaseChild(id),
  icon: <span {...{ [slotAttribute]: 'icon' }} aria-hidden="true" />,
});

const findActual = (
  observations: readonly ActualObservation[],
  scenarioId: string
): ActualObservation => {
  const observation = observations.find(
    (candidate) => candidate.scenarioId === scenarioId
  );

  if (!observation) {
    throw new Error(`Missing actual observation for ${scenarioId}`);
  }

  return observation;
};

const capStyleEffects = (
  observations: readonly ActualObservation[]
): Readonly<Record<string, CapStyleEffect>> => {
  const referenceSignatures: Readonly<Record<CapStyleEffect, string>> = {
    base: findActual(
      observations,
      'icon-absent__children-present__position-omitted'
    ).capClassSignature,
    iconOnly: findActual(
      observations,
      'icon-present__children-absent__position-omitted'
    ).capClassSignature,
    textAndIconBefore: findActual(
      observations,
      'icon-present__children-present__position-before'
    ).capClassSignature,
    textAndIconAfter: findActual(
      observations,
      'icon-present__children-present__position-after'
    ).capClassSignature,
  };

  expect(new Set(Object.values(referenceSignatures)).size).toBe(4);

  return Object.fromEntries(
    observations.map((observation) => {
      const effect = Object.entries(referenceSignatures).find(
        ([, signature]) => signature === observation.capClassSignature
      )?.[0] as CapStyleEffect | undefined;

      if (!effect) {
        throw new Error(
          `Scenario ${observation.scenarioId} produced an unclassified CAP class effect`
        );
      }

      return [observation.scenarioId, effect];
    })
  );
};

const withCapStyleEffect = (
  observation: ActualObservation,
  effect: CapStyleEffect
): ButtonContentProductionObservation => ({
  baselineId: observation.baselineId,
  scenarioId: observation.scenarioId,
  normalizedState: observation.normalizedState,
  renderedAnatomy: observation.renderedAnatomy,
  capStyleEffect: effect,
});

const effectForSignature = (
  observation: ActualObservation,
  references: readonly ActualObservation[],
  effects: Readonly<Record<string, CapStyleEffect>>
): CapStyleEffect => {
  const reference = references.find(
    (candidate) => candidate.capClassSignature === observation.capClassSignature
  );

  if (!reference) {
    throw new Error(
      `Scenario ${observation.scenarioId} produced an unclassified CAP class effect`
    );
  }

  return effects[reference.scenarioId];
};

describe('content anatomy production observations', () => {
  it('enumerates the complete production-shaped input space', () => {
    expect(buttonContentScenarios).toHaveLength(12);
    expect(
      new Set(buttonContentScenarios.map((scenario) => scenario.id)).size
    ).toBe(12);
    expect(
      new Set(
        buttonContentScenarios.map((scenario) =>
          JSON.stringify([
            scenario.icon,
            scenario.children,
            scenario.iconPosition,
          ])
        )
      ).size
    ).toBe(12);
  });

  it('locks normalization, anatomy, CAP effects, and mappings to the real pipeline', () => {
    const actual = buttonContentScenarios.map(observeScenario);
    const effects = capStyleEffects(actual);

    for (const expected of buttonContentEvidenceRows) {
      const observed = withCapStyleEffect(
        findActual(actual, expected.scenario.id),
        effects[expected.scenario.id]
      );

      expect(
        compareButtonContentObservations(observed, expected.observation)
      ).toEqual([]);
      expect(mapButtonContentObservation(observed)).toEqual(expected.mapping);
    }
  });

  it('keeps every evidence row tied to one unique scenario', () => {
    const byScenario = new Map<string, ButtonContentEvidenceRow>();

    for (const row of buttonContentEvidenceRows) {
      expect(byScenario.has(row.scenario.id)).toBe(false);
      expect(row.observation.scenarioId).toBe(row.scenario.id);
      byScenario.set(row.scenario.id, row);
    }

    expect([...byScenario.keys()]).toEqual(
      buttonContentScenarios.map((scenario) => scenario.id)
    );
  });

  it('separates observed scenarios from canonical research configurations', () => {
    expect(buttonContentGroundingCensus).toEqual({
      productionScenarios: 12,
      representedScenarios: 9,
      canonicalConfigurations: 4,
      unrepresentedScenarios: 3,
      productSupportUnknown: 12,
    });
  });

  it('records where React child truthiness diverges from rendered content', () => {
    const basicObservations = buttonContentScenarios.map(observeScenario);
    const effects = capStyleEffects(basicObservations);

    for (const edgeCase of reactChildEdgeCases) {
      const child = edgeCaseChild(edgeCase.id);
      const observed = observeProps(
        `react-child-${edgeCase.id}`,
        edgeCaseProps(edgeCase.id)
      );

      expect(Boolean(child)).toBe(edgeCase.inputTruthy);
      expect(observed.normalizedState.iconOnly).toBe(edgeCase.expectedIconOnly);
      expect(observed.renderedText).toBe(edgeCase.expectedRenderedText);
      expect(effectForSignature(observed, basicObservations, effects)).toBe(
        edgeCase.expectedCapStyleEffect
      );
    }
  });

  it('detects deliberate perturbations at every observation boundary', () => {
    const expected = buttonContentEvidenceRows.find(
      ({ scenario }) =>
        scenario.id === 'icon-present__children-present__position-before'
    )?.observation;

    if (!expected) {
      throw new Error('Missing mutation reference observation');
    }

    const mutations: ReadonlyArray<
      readonly [
        ButtonContentProductionObservation,
        ReturnType<typeof compareButtonContentObservations>[number]
      ]
    > = [
      [{ ...expected, baselineId: 'mutated-baseline' }, 'baselineId'],
      [{ ...expected, scenarioId: 'mutated-scenario' }, 'scenarioId'],
      [
        {
          ...expected,
          normalizedState: {
            ...expected.normalizedState,
            iconOnly: true,
          },
        },
        'normalizedState',
      ],
      [
        {
          ...expected,
          renderedAnatomy: { slots: ['content', 'icon'] },
        },
        'renderedAnatomy',
      ],
      [{ ...expected, capStyleEffect: 'base' }, 'capStyleEffect'],
    ];

    for (const [mutation, field] of mutations) {
      expect(compareButtonContentObservations(mutation, expected)).toEqual([
        field,
      ]);
    }
  });
});
