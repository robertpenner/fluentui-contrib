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
  productionButtonShapes,
  productionButtonSizes,
  productionButtonStyleCensus,
} from './productionButtonStyleCensus';

const contentProps = (scenario: ButtonContentScenario): ButtonProps => ({
  children: scenario.children === 'present' ? 'Action' : undefined,
  icon: scenario.icon === 'present' ? <span aria-hidden="true" /> : undefined,
  iconPosition:
    scenario.iconPosition === 'omitted' ? undefined : scenario.iconPosition,
});

type StyleProfileProbeProps = {
  readonly appearance: CapButtonAppearance;
  readonly size: (typeof productionButtonSizes)[number];
  readonly shape: (typeof productionButtonShapes)[number];
  readonly disabled: boolean;
  readonly disabledFocusable: boolean;
  readonly content: ButtonContentScenario;
};

const StyleProfileProbe = (
  props: StyleProfileProbeProps
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
      data-testid="style-profile"
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

describe('production CAP Button style census', () => {
  it('derives the finite scenario counts from production-shaped inputs', () => {
    expect(productionButtonStyleCensus.authoredScenariosPerVariant).toBe(2_592);
    expect(productionButtonStyleCensus.normalizedStateTuplesPerVariant).toBe(
      1_728
    );
    expect(productionButtonStyleCensus.styleProfilesPerVariant).toBe(504);
  });

  it('observes the full normalization and style-profile census from the production CAP hook', () => {
    render(
      <>
        {capButtonAppearances.flatMap((appearance) =>
          productionButtonSizes.flatMap((size) =>
            productionButtonShapes.flatMap((shape) =>
              productionButtonAvailabilityInputs.flatMap(
                ({ disabled, disabledFocusable }) =>
                  buttonContentScenarios.map((content) => (
                    <StyleProfileProbe
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

    const probes = screen.getAllByTestId('style-profile');
    const normalizedStates = probes.map((element) =>
      element.getAttribute('data-normalized')
    );
    const signatures = probes.map((element) =>
      element.getAttribute('data-signature')
    );

    expect(probes).toHaveLength(
      productionButtonStyleCensus.authoredScenariosPerVariant
    );
    expect(new Set(normalizedStates).size).toBe(
      productionButtonStyleCensus.normalizedStateTuplesPerVariant
    );
    expect(new Set(signatures).size).toBe(
      productionButtonStyleCensus.styleProfilesPerVariant
    );
  });
});
