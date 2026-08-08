import * as React from 'react';
import { Button } from '@fluentui/react-components';
import {
  asButtonAppearance,
  CapFixtureProvider,
} from '../../../fixtures/capButtonFamily';
import type { CapButtonInteractionAvailability } from '../CapButtonInteraction';
import type { CapButtonAppearance } from '../CapButtonScenario';

export interface CapButtonInteractionProbeProps {
  readonly appearances: readonly CapButtonAppearance[];
  readonly availability: CapButtonInteractionAvailability;
}

export const CapButtonInteractionProbe = (
  props: CapButtonInteractionProbeProps
): React.ReactElement => {
  const { appearances, availability } = props;

  return (
    <CapFixtureProvider>
      <button data-testid="interaction-focus-sentinel" type="button">
        focus sentinel
      </button>
      {appearances.map((appearance) => (
        <Button
          key={appearance}
          appearance={asButtonAppearance(appearance)}
          disabled={availability === 'disabled'}
          disabledFocusable={availability === 'disabledFocusable'}
          data-testid={`interaction-${availability}-${appearance}`}
        >
          {appearance}
        </Button>
      ))}
    </CapFixtureProvider>
  );
};
