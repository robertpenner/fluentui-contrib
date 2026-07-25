import * as React from 'react';
import { Button, ToggleButton } from '@fluentui/react-components';
import {
  CapFixtureProvider,
  asButtonAppearance,
  capButtonAppearances,
} from './capButtonFamily';

export interface AlternateAppearanceProbeProps {
  /**
   * Renders every other CAP appearance *before* the probe pair.
   *
   * Griffel inserts a rule the first time the style that owns it is used, and
   * all Griffel classes carry the same specificity, so insertion order is the
   * cascade. Rendering unrelated appearances first therefore changes which of
   * two equally specific rules wins. A law that only holds for one render order
   * is not a law, so each render order is mounted in its own test.
   */
  readonly perturbOrder?: boolean;
  /** Distinguishes test ids when the fixture is mounted more than once. */
  readonly prefix?: string;
}

/**
 * The smallest fixture that reproduces the alternate-appearance question.
 *
 * Under `forced-colors: active` an unselected primary ToggleButton and a
 * secondary Button are both "not the brand-filled resting state", and earlier
 * cross-engine research recorded that Chromium and Firefox painted them alike
 * while WebKit did not. Everything here goes through the public component APIs,
 * so the fixture exercises the production style hooks rather than a
 * reconstruction of them.
 */
export const AlternateAppearanceProbe: React.FC<
  AlternateAppearanceProbeProps
> = ({ perturbOrder = false, prefix = 'probe' }) => (
  <CapFixtureProvider>
    {perturbOrder
      ? capButtonAppearances.map((appearance) => (
          <Button
            key={appearance}
            appearance={asButtonAppearance(appearance)}
            data-testid={`${prefix}-warmup-${appearance}`}
          >
            {appearance}
          </Button>
        ))
      : null}
    <ToggleButton
      appearance={asButtonAppearance('primary')}
      data-testid={`${prefix}-unselected-toggle`}
    >
      unselected
    </ToggleButton>
    <ToggleButton
      appearance={asButtonAppearance('primary')}
      checked
      data-testid={`${prefix}-selected-toggle`}
    >
      selected
    </ToggleButton>
    <Button
      appearance={asButtonAppearance('secondary')}
      data-testid={`${prefix}-secondary-button`}
    >
      secondary
    </Button>
    {/*
     * A surface with no forced-colors treatment at all. An engine that performs
     * forced-colors substitution replaces these authored values with system
     * colours; an engine that only *matches* the media query leaves them alone.
     * Reading the canary lets the laws below name the engine capability they
     * depend on instead of branching on a browser name.
     */}
    <div
      data-testid={`${prefix}-substitution-canary`}
      style={{ backgroundColor: 'rgb(1, 2, 3)', color: 'rgb(4, 5, 6)' }}
    >
      canary
    </div>
    {/*
     * The system-colour keywords the CAP forced-colors blocks name explicitly.
     * Every engine resolves these keywords whether or not it substitutes, so
     * this is the reference against which "the toggle followed the named system
     * colours" can be checked without hard-coding one engine's palette.
     */}
    <div
      data-testid={`${prefix}-system-color-reference`}
      style={{
        backgroundColor: 'ButtonFace',
        color: 'ButtonText',
        borderTopColor: 'ButtonBorder',
      }}
    >
      reference
    </div>
  </CapFixtureProvider>
);
