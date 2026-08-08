import * as React from 'react';
import { Button, FluentProvider, type Theme } from '@fluentui/react-components';
import { CAP_STYLE_HOOKS } from '@fluentui-contrib/react-cap-theme';
import type { CapButtonMotionAvailability } from '../CapButtonMotion';
import type {
  CapButtonAppearance,
  CapButtonObservationConditions,
} from '../CapButtonScenario';
import { asButtonAppearance } from '../../../fixtures/capButtonFamily';
import {
  capButtonDarkThemeFixture,
  capButtonLightThemeFixture,
  type CapButtonThemeFixtureName,
} from './themeFixtures';

export interface CapButtonMotionProbeProps {
  readonly appearances: readonly CapButtonAppearance[];
  readonly availabilities: readonly CapButtonMotionAvailability[];
  readonly direction: CapButtonObservationConditions['direction'];
  readonly prefix: string;
  readonly theme: CapButtonThemeFixtureName;
}

const providerThemes: Readonly<Record<CapButtonThemeFixtureName, Theme>> = {
  'web-light-with-cap': capButtonLightThemeFixture.providerTheme,
  'web-dark-with-cap': capButtonDarkThemeFixture.providerTheme,
};

export const CapButtonMotionProbe = (
  props: CapButtonMotionProbeProps
): React.ReactElement => {
  const { appearances, availabilities, direction, prefix, theme } = props;

  return (
    <FluentProvider
      theme={providerThemes[theme]}
      dir={direction}
      customStyleHooks_unstable={CAP_STYLE_HOOKS}
    >
      {appearances.flatMap((appearance) =>
        availabilities.map((availability) => (
          <Button
            key={`${appearance}-${availability}`}
            appearance={asButtonAppearance(appearance)}
            disabled={availability === 'disabled'}
            disabledFocusable={availability === 'disabledFocusable'}
            data-testid={`${prefix}-${appearance}-${availability}`}
          >
            {appearance}
          </Button>
        ))
      )}
    </FluentProvider>
  );
};
