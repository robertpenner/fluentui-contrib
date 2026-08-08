import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  type ButtonProps,
  useButton_unstable,
} from '@fluentui/react-components';
import { CAP_STYLE_HOOKS } from '@fluentui-contrib/react-cap-theme';
import {
  asButtonAppearance,
  capButtonAppearances,
  type CapButtonAppearance,
} from '../fixtures/capButtonFamily';
import {
  buttonContentScenarios,
  type ButtonContentScenario,
} from './contentAnatomyGrounding';
import {
  productionButtonAvailabilityInputs,
  productionButtonGeneratedClassCensus,
  productionButtonShapes,
  productionButtonSizes,
} from './productionButtonGeneratedClassCensus';

const contentProps = (scenario: ButtonContentScenario): ButtonProps => ({
  children: scenario.children === 'present' ? 'Action' : undefined,
  icon: scenario.icon === 'present' ? <span aria-hidden="true" /> : undefined,
  iconPosition:
    scenario.iconPosition === 'omitted' ? undefined : scenario.iconPosition,
});

type GeneratedClassProfileProbeProps = {
  readonly appearance: CapButtonAppearance;
  readonly size: (typeof productionButtonSizes)[number];
  readonly shape: (typeof productionButtonShapes)[number];
  readonly disabled: boolean;
  readonly disabledFocusable: boolean;
  readonly content: ButtonContentScenario;
};

const GeneratedClassProfileProbe = (
  props: GeneratedClassProfileProbeProps
): React.ReactElement => {
  const { appearance, size, shape, disabled, disabledFocusable, content } =
    props;
  const state = useButton_unstable(
    {
      ...contentProps(content),
      appearance: asButtonAppearance(appearance),
      size,
      shape,
      disabled,
      disabledFocusable,
    },
    React.createRef()
  );

  CAP_STYLE_HOOKS.useButtonStyles_unstable?.(state);

  return (
    <output
      data-testid="generated-class-profile"
      data-scenario={content.id}
      data-normalized={JSON.stringify({
        appearance: state.appearance,
        size: state.size,
        shape: state.shape,
        disabled: state.disabled,
        disabledFocusable: state.disabledFocusable,
        iconPosition: state.iconPosition,
        iconOnly: state.iconOnly,
        hasIcon: state.icon !== undefined,
        hasChildren: state.root.children !== undefined,
      })}
      data-signature={JSON.stringify({
        root: state.root.className,
        icon: state.icon?.className,
      })}
    />
  );
};

describe('production CAP Button generated class census', () => {
  it('derives the finite scenario counts from production-shaped inputs', () => {
    expect(productionButtonGeneratedClassCensus.authoredScenarios).toBe(2_592);
    expect(productionButtonGeneratedClassCensus.normalizedStateTuples).toBe(
      1_728
    );
    expect(
      productionButtonGeneratedClassCensus.generatedClassSelectionProfiles
    ).toBe(504);
    expect(productionButtonGeneratedClassCensus.status).toBe(
      'version-sensitive-diagnostic'
    );
  });

  it('observes generated class-selection profiles from the production CAP hook', () => {
    render(
      <>
        {capButtonAppearances.flatMap((appearance) =>
          productionButtonSizes.flatMap((size) =>
            productionButtonShapes.flatMap((shape) =>
              productionButtonAvailabilityInputs.flatMap(
                ({ disabled, disabledFocusable }) =>
                  buttonContentScenarios.map((content) => (
                    <GeneratedClassProfileProbe
                      key={`${appearance}-${size}-${shape}-${disabled}-${disabledFocusable}-${content.id}`}
                      appearance={appearance}
                      size={size}
                      shape={shape}
                      disabled={disabled}
                      disabledFocusable={disabledFocusable}
                      content={content}
                    />
                  ))
              )
            )
          )
        )}
      </>
    );

    const probes = screen.getAllByTestId('generated-class-profile');
    const normalizedStates = probes.map((element) =>
      element.getAttribute('data-normalized')
    );
    const signatures = probes.map((element) =>
      element.getAttribute('data-signature')
    );

    expect(probes).toHaveLength(
      productionButtonGeneratedClassCensus.authoredScenarios
    );
    expect(new Set(normalizedStates).size).toBe(
      productionButtonGeneratedClassCensus.normalizedStateTuples
    );
    expect(new Set(signatures).size).toBe(
      productionButtonGeneratedClassCensus.generatedClassSelectionProfiles
    );
  });
});
