import * as React from 'react';
import { render, type RenderResult } from '@testing-library/react';
import {
  CapButtonFixtures,
  CapFixtureProvider,
  capButtonAppearances,
  type CapButtonAppearance,
} from '../fixtures/capButtonFamily';
import {
  buttonColorModes,
  type ButtonSurfaceObservation,
} from './observeButtonSurface';
import { capColors, capGeometry, observeCapSurface } from './capSurface';

/**
 * Metamorphic laws for the production CAP Button.
 *
 * A metamorphic law does not assert a value; it asserts a *relation* between the
 * surfaces of two related fixtures. That is what lets an audit tell an invariant
 * apart from an appearance policy: `primary` and `subtle` are supposed to differ
 * in colour, so no single expected value can be written down, but they are not
 * supposed to differ in geometry, in native semantics, or in whether disabling
 * suppresses interaction feedback.
 *
 * The surfaces are read from the CSSOM. That establishes what the browser was
 * *told*, not what it painted: contrast and forced-colors substitution are paint
 * questions, and are left to the cross-engine checks.
 */

type Condition = 'enabled' | 'disabled' | 'disabledFocusable';

const conditions = ['enabled', 'disabled', 'disabledFocusable'] as const;

let rendered: RenderResult;

const buttonFor = (
  appearance: CapButtonAppearance,
  condition: Condition
): HTMLElement => rendered.getByTestId(`button-${appearance}-${condition}`);

const surfaceFor = (
  appearance: CapButtonAppearance,
  condition: Condition
): ButtonSurfaceObservation =>
  observeCapSurface(buttonFor(appearance, condition));

const colors = capColors;

const geometry = capGeometry;

// Rendered per test rather than once: Testing Library's automatic cleanup empties
// the container after every test. Griffel's inserted rules survive, so the
// observation still reads a single accumulated stylesheet.
beforeEach(() => {
  rendered = render(
    <CapFixtureProvider>
      <CapButtonFixtures />
    </CapFixtureProvider>
  );
});

describe('CAP Button native semantics', () => {
  it.each(capButtonAppearances)(
    'renders %s as a native button that does not submit a form',
    (appearance) => {
      for (const condition of conditions) {
        const button = buttonFor(appearance, condition);

        expect(button.tagName).toBe('BUTTON');
        expect(button.getAttribute('type')).toBe('button');
      }
    }
  );

  it.each(capButtonAppearances)(
    'removes %s from the tab order when disabled and keeps it when disabled-focusable',
    (appearance) => {
      const disabled = buttonFor(appearance, 'disabled') as HTMLButtonElement;
      const disabledFocusable = buttonFor(
        appearance,
        'disabledFocusable'
      ) as HTMLButtonElement;

      expect(disabled.disabled).toBe(true);
      expect(disabled.hasAttribute('aria-disabled')).toBe(false);

      expect(disabledFocusable.disabled).toBe(false);
      expect(disabledFocusable.getAttribute('aria-disabled')).toBe('true');
      expect(disabledFocusable.getAttribute('tabindex')).not.toBe('-1');
    }
  );
});

describe('CAP Button appearance laws', () => {
  it('changes colour, not size or shape, when the appearance changes', () => {
    const [reference, ...others] = capButtonAppearances;
    const expected = geometry(
      surfaceFor(reference, 'enabled').effective.ordinary.rest
    );

    // A geometry projection that is empty would make this law vacuous.
    expect(Object.keys(expected).length).toBeGreaterThan(0);

    for (const appearance of others) {
      expect(
        geometry(surfaceFor(appearance, 'enabled').effective.ordinary.rest)
      ).toEqual(expected);
    }
  });

  it('gives every appearance a distinct interactive colour treatment', () => {
    // Distinctness is a property of the whole interaction, not of the resting
    // state alone: `subtle` and `transparent` deliberately rest identically and
    // separate only once the pointer arrives.
    const seen = new Map<string, CapButtonAppearance>();

    for (const appearance of capButtonAppearances) {
      const { ordinary } = surfaceFor(appearance, 'enabled').effective;
      const key = JSON.stringify([
        colors(ordinary.rest),
        colors(ordinary.hover),
        colors(ordinary.active),
      ]);
      const collision = seen.get(key);

      expect([appearance, collision]).toEqual([appearance, undefined]);
      seen.set(key, appearance);
    }
  });

  it.each(capButtonAppearances)(
    'gives %s visible hover feedback in every colour mode',
    (appearance) => {
      const { effective } = surfaceFor(appearance, 'enabled');

      for (const mode of buttonColorModes) {
        expect(colors(effective[mode].hover)).not.toEqual(
          colors(effective[mode].rest)
        );
      }
    }
  );
});

describe('CAP Button disabled laws', () => {
  it.each(capButtonAppearances)(
    'suppresses hover and pressed feedback for disabled %s',
    (appearance) => {
      for (const condition of ['disabled', 'disabledFocusable'] as const) {
        const { effective } = surfaceFor(appearance, condition);

        for (const mode of buttonColorModes) {
          expect(colors(effective[mode].hover)).toEqual(
            colors(effective[mode].rest)
          );
          expect(colors(effective[mode].active)).toEqual(
            colors(effective[mode].rest)
          );
        }
      }
    }
  );

  it.each(capButtonAppearances)(
    'keeps disabled %s distinguishable from enabled in every colour mode',
    (appearance) => {
      const enabled = surfaceFor(appearance, 'enabled');
      const disabled = surfaceFor(appearance, 'disabled');

      for (const mode of buttonColorModes) {
        expect(colors(disabled.effective[mode].rest)).not.toEqual(
          colors(enabled.effective[mode].rest)
        );
      }
    }
  );

  it.each(capButtonAppearances)(
    'presents disabled-focusable %s identically to disabled',
    (appearance) => {
      const disabled = surfaceFor(appearance, 'disabled');
      const disabledFocusable = surfaceFor(appearance, 'disabledFocusable');

      for (const mode of buttonColorModes) {
        for (const state of ['rest', 'hover', 'active'] as const) {
          expect(colors(disabledFocusable.effective[mode][state])).toEqual(
            colors(disabled.effective[mode][state])
          );
          expect(geometry(disabledFocusable.effective[mode][state])).toEqual(
            geometry(disabled.effective[mode][state])
          );
        }
      }
    }
  );

  it.each(capButtonAppearances)(
    'marks disabled %s as non-interactive through the cursor',
    (appearance) => {
      expect(
        surfaceFor(appearance, 'disabled').effective.ordinary.rest.cursor
      ).toBe('not-allowed');
      expect(
        surfaceFor(appearance, 'enabled').effective.ordinary.rest.cursor
      ).toBe('pointer');
    }
  );
});

describe('CAP Button focus laws', () => {
  it.each(capButtonAppearances)(
    'reaches %s with a focus indicator that is drawn outside the button',
    (appearance) => {
      for (const condition of ['enabled', 'disabledFocusable'] as const) {
        const focusVisible = surfaceFor(appearance, condition).effective
          .ordinary.focusVisible;

        expect(focusVisible['outline-style']).toBe('solid');
        expect(focusVisible['outline-width']).toBeTruthy();
        expect(focusVisible['outline-color']).toBeTruthy();
        expect(focusVisible['box-shadow']).toBeTruthy();
      }
    }
  );

  it.each(capButtonAppearances)(
    'restates the %s focus indicator in system colours under forced colors',
    (appearance) => {
      for (const condition of ['enabled', 'disabledFocusable'] as const) {
        const { effective } = surfaceFor(appearance, condition);
        const outlineColor =
          effective.forcedColors.focusVisible['outline-color'];

        // A `var(--token)` here would mean the indicator's colour is only
        // whatever the UA happens to substitute, rather than a chosen system colour.
        expect(outlineColor).not.toMatch(/^var\(/);
        expect(outlineColor).toEqual(expect.any(String));
        expect(
          effective.forcedColors.focusVisible['outline-color']
        ).not.toEqual(effective.ordinary.focusVisible['outline-color']);
      }
    }
  );

  it.each(capButtonAppearances)(
    'keeps the %s focus indicator distinct from the resting surface',
    (appearance) => {
      const { effective } = surfaceFor(appearance, 'enabled');

      expect(colors(effective.ordinary.focusVisible)).not.toEqual(
        colors(effective.ordinary.rest)
      );
    }
  );
});
