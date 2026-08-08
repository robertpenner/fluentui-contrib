import * as React from 'react';
import { Button } from '@fluentui/react-components';
import {
  asButtonAppearance,
  CapFixtureProvider,
} from '../../../fixtures/capButtonFamily';
import { observeCapSurface } from '../../../observation/capSurface';
import type { CapButtonInteractionAvailability } from '../CapButtonInteraction';
import type {
  CapButtonForcedColorsAuthoredContract,
  CapButtonSystemColorKeyword,
} from '../CapButtonForcedColors';
import type { CapButtonAppearance } from '../CapButtonScenario';

export interface CapButtonForcedColorsProbeProps {
  readonly appearances: readonly CapButtonAppearance[];
  readonly availability: CapButtonInteractionAvailability;
}

interface AuthoredStateProjection {
  readonly rest: CapButtonForcedColorsAuthoredContract;
  readonly focusVisible: CapButtonForcedColorsAuthoredContract;
}

const systemColorKeywords: readonly CapButtonSystemColorKeyword[] = [
  'HighlightText',
  'ButtonBorder',
  'ButtonFace',
  'GrayText',
  'Highlight',
];

const systemColorKeyword = (
  value: string | undefined
): CapButtonSystemColorKeyword | null =>
  systemColorKeywords.find((keyword) =>
    value?.toLowerCase().includes(keyword.toLowerCase())
  ) ?? null;

const authoredProjection = (
  button: HTMLElement,
  focusVisible: boolean
): CapButtonForcedColorsAuthoredContract => {
  const { declared } = observeCapSurface(button);
  const declarations = {
    ...declared.forcedColors.rest,
    ...(focusVisible ? declared.forcedColors.focus : {}),
    ...(focusVisible ? declared.forcedColors.focusVisible : {}),
  };

  return {
    forcedColorAdjust:
      declarations['forced-color-adjust'] === 'none' ? 'none' : null,
    foreground: systemColorKeyword(declarations.color),
    background: systemColorKeyword(declarations['background-color']),
    border: {
      top: systemColorKeyword(declarations['border-top-color']),
      right: systemColorKeyword(declarations['border-right-color']),
      bottom: systemColorKeyword(declarations['border-bottom-color']),
      left: systemColorKeyword(declarations['border-left-color']),
    },
    focus: {
      outline: systemColorKeyword(declarations['outline-color']),
      innerShadow: systemColorKeyword(declarations['box-shadow']),
    },
  };
};

export const CapButtonForcedColorsProbe = (
  props: CapButtonForcedColorsProbeProps
): React.ReactElement => {
  const { appearances, availability } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [authored, setAuthored] = React.useState<
    Readonly<Record<string, AuthoredStateProjection>>
  >({});

  React.useEffect(() => {
    const buttons = rootRef.current?.querySelectorAll<HTMLElement>(
      '[data-forced-colors-button]'
    );

    if (!buttons) {
      return;
    }

    React.startTransition(() => {
      setAuthored(
        Object.fromEntries(
          Array.from(buttons).map((button) => {
            const testId = button.dataset.testid;

            if (!testId) {
              throw new Error(
                'Forced-colors probe Button is missing a test id'
              );
            }

            return [
              testId,
              {
                rest: authoredProjection(button, false),
                focusVisible: authoredProjection(button, true),
              },
            ];
          })
        )
      );
    });
  }, []);

  return (
    <CapFixtureProvider>
      <div ref={rootRef}>
        <button data-testid="forced-colors-focus-sentinel" type="button">
          focus sentinel
        </button>
        <span
          data-testid="forced-colors-substitution-canary"
          style={{ color: 'rgb(4, 5, 6)', backgroundColor: 'rgb(1, 2, 3)' }}
        >
          substitution canary
        </span>
        {appearances.map((appearance) => (
          <Button
            key={appearance}
            appearance={asButtonAppearance(appearance)}
            disabled={availability === 'disabled'}
            disabledFocusable={availability === 'disabledFocusable'}
            data-forced-colors-button=""
            data-testid={`forced-colors-${availability}-${appearance}`}
          >
            {appearance}
          </Button>
        ))}
        <output data-testid="forced-colors-authored-contracts">
          {JSON.stringify(authored)}
        </output>
      </div>
    </CapFixtureProvider>
  );
};
