import * as React from 'react';
import {
  Button,
  type ButtonProps,
  FluentProvider,
  SplitButton,
  type SplitButtonProps,
  ToggleButton,
  webLightTheme,
} from '@fluentui/react-components';
import {
  CAP_STYLE_HOOKS,
  CAP_THEME_TOKENS,
} from '@fluentui-contrib/react-cap-theme';

/**
 * The appearances CAP's Button style hooks actually implement.
 *
 * `tint` is a CAP addition that has no counterpart in the public Fluent
 * `ButtonProps['appearance']` union, so fixtures must widen the prop to exercise
 * it. That gap is recorded as an evidence boundary rather than worked around
 * silently.
 */
export const capButtonAppearances = [
  'primary',
  'tint',
  'outline',
  'secondary',
  'subtle',
  'transparent',
] as const;

export type CapButtonAppearance = (typeof capButtonAppearances)[number];

/** Appearances expressible through the public Fluent Button props type. */
export const fluentExpressibleAppearances = capButtonAppearances.filter(
  (appearance): appearance is Exclude<CapButtonAppearance, 'tint'> =>
    appearance !== 'tint'
);

/** Widens a CAP appearance to the public prop type, marking the typing boundary. */
export const asButtonAppearance = (
  appearance: CapButtonAppearance
): ButtonProps['appearance'] => appearance as ButtonProps['appearance'];

export const capTheme = { ...webLightTheme, ...CAP_THEME_TOKENS };

export interface CapFixtureProviderProps {
  readonly children: React.ReactNode;
  readonly dir?: 'ltr' | 'rtl';
}

/** Renders children through the production CAP theme and style hooks. */
export const CapFixtureProvider: React.FC<CapFixtureProviderProps> = ({
  children,
  dir = 'ltr',
}) => (
  <FluentProvider
    theme={capTheme}
    dir={dir}
    customStyleHooks_unstable={CAP_STYLE_HOOKS}
  >
    {children}
  </FluentProvider>
);

/**
 * Every CAP Button appearance in enabled, disabled, and focusable-disabled form.
 * Rendered through the public component APIs so the fixture exercises production
 * style hooks rather than a reconstruction of them.
 */
export const CapButtonFixtures: React.FC = () => (
  <>
    {capButtonAppearances.map((appearance) => (
      <React.Fragment key={appearance}>
        <Button
          appearance={asButtonAppearance(appearance)}
          data-testid={`button-${appearance}-enabled`}
        >
          {appearance}
        </Button>
        <Button
          appearance={asButtonAppearance(appearance)}
          disabled
          data-testid={`button-${appearance}-disabled`}
        >
          {appearance}
        </Button>
        <Button
          appearance={asButtonAppearance(appearance)}
          disabledFocusable
          data-testid={`button-${appearance}-disabledFocusable`}
        >
          {appearance}
        </Button>
      </React.Fragment>
    ))}
  </>
);

/** Every CAP ToggleButton appearance across checked, unchecked, and disabled. */
export const CapToggleButtonFixtures: React.FC = () => (
  <>
    {capButtonAppearances.map((appearance) => (
      <React.Fragment key={appearance}>
        <ToggleButton
          appearance={asButtonAppearance(appearance)}
          data-testid={`toggle-${appearance}-unchecked`}
        >
          {appearance}
        </ToggleButton>
        <ToggleButton
          appearance={asButtonAppearance(appearance)}
          checked
          data-testid={`toggle-${appearance}-checked`}
        >
          {appearance}
        </ToggleButton>
        <ToggleButton
          appearance={asButtonAppearance(appearance)}
          disabled
          data-testid={`toggle-${appearance}-disabled`}
        >
          {appearance}
        </ToggleButton>
        <ToggleButton
          appearance={asButtonAppearance(appearance)}
          checked
          disabled
          data-testid={`toggle-${appearance}-checkedDisabled`}
        >
          {appearance}
        </ToggleButton>
        <ToggleButton
          appearance={asButtonAppearance(appearance)}
          checked
          disabled
          disabledFocusable
          data-testid={`toggle-${appearance}-checkedDisabledFocusable`}
        >
          {appearance}
        </ToggleButton>
      </React.Fragment>
    ))}
  </>
);

/** The SplitButton conditions the propagation laws are stated over. */
export const capSplitButtonConditions = [
  'enabled',
  'disabled',
  'disabledFocusable',
] as const;

export type CapSplitButtonCondition =
  (typeof capSplitButtonConditions)[number];

export interface CapSplitButtonFixturesProps {
  /**
   * Distinguishes otherwise identical fixture sets, so the same appearances can
   * be rendered once per writing direction without their test ids colliding.
   */
  readonly prefix?: string;
}

/**
 * Every CAP SplitButton appearance, enabled and disabled.
 *
 * Both actions carry their own test id: a SplitButton is two buttons sharing an
 * outline, and propagation laws are precisely claims about the pair, so neither
 * action can be observed only through the root.
 */
export const CapSplitButtonFixtures: React.FC<CapSplitButtonFixturesProps> = ({
  prefix = 'split',
}) => (
  <>
    {capButtonAppearances.map((appearance) =>
      capSplitButtonConditions.map((condition) => {
        const id = `${prefix}-${appearance}-${condition}`;

        return (
          <SplitButton
            key={id}
            appearance={asButtonAppearance(appearance)}
            disabled={condition !== 'enabled'}
            disabledFocusable={condition === 'disabledFocusable'}
            primaryActionButton={
              {
                'data-testid': `${id}-primary`,
              } as SplitButtonProps['primaryActionButton']
            }
            menuButton={
              {
                'aria-label': `More ${appearance} actions`,
                'data-testid': `${id}-menu`,
              } as SplitButtonProps['menuButton']
            }
            data-testid={id}
          >
            {appearance}
          </SplitButton>
        );
      })
    )}
  </>
);

/**
 * The whole Button family under CAP style hooks. Every style hook the family owns
 * is reached at least once, which is what makes it usable as a diagnostic surface:
 * a `makeStyles` definition that is never rendered can never be shown to be clean.
 */
export const CapButtonFamilyFixtures: React.FC = () => (
  <>
    <CapButtonFixtures />
    <CapToggleButtonFixtures />
    <CapSplitButtonFixtures />
  </>
);
