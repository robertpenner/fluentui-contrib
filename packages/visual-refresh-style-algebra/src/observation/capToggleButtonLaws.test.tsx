import * as React from 'react';
import { render, type RenderResult } from '@testing-library/react';
import {
  CapButtonFamilyFixtures,
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
 * Specialization laws for the production CAP ToggleButton.
 *
 * A ToggleButton is a Button that also carries a selected state. Specialization
 * is only sound if the added state is *additive*: everything the foundational
 * Button guarantees must still hold in every toggle state, and the selected
 * state must itself be perceivable.
 *
 * The laws therefore come in two families. The inherited family re-asserts the
 * Button guarantees against toggle fixtures, so a regression in the toggle layer
 * cannot quietly cancel them. The specialization family asserts what only a
 * ToggleButton has to promise.
 */

type ToggleCondition =
  | 'unchecked'
  | 'checked'
  | 'disabled'
  | 'checkedDisabled'
  | 'checkedDisabledFocusable';

const toggleConditions = [
  'unchecked',
  'checked',
  'disabled',
  'checkedDisabled',
  'checkedDisabledFocusable',
] as const;

const checkedConditions = [
  'checked',
  'checkedDisabled',
  'checkedDisabledFocusable',
] as const;

let rendered: RenderResult;

const toggleFor = (
  appearance: CapButtonAppearance,
  condition: ToggleCondition
): HTMLElement => rendered.getByTestId(`toggle-${appearance}-${condition}`);

const surfaceFor = (
  appearance: CapButtonAppearance,
  condition: ToggleCondition
): ButtonSurfaceObservation => observeCapSurface(toggleFor(appearance, condition));

// Rendered per test: Testing Library's automatic cleanup empties the container
// after every test, while Griffel's inserted rules survive.
beforeEach(() => {
  rendered = render(
    <CapFixtureProvider>
      <CapButtonFamilyFixtures />
    </CapFixtureProvider>
  );
});

describe('CAP ToggleButton inherited Button guarantees', () => {
  it.each(capButtonAppearances)(
    'keeps %s a native button that does not submit a form',
    (appearance) => {
      for (const condition of toggleConditions) {
        const toggle = toggleFor(appearance, condition);

        expect(toggle.tagName).toBe('BUTTON');
        expect(toggle.getAttribute('type')).toBe('button');
      }
    }
  );

  it.each(capButtonAppearances)(
    'keeps the %s focus indicator drawn in every toggle state',
    (appearance) => {
      for (const condition of toggleConditions) {
        const { effective } = surfaceFor(appearance, condition);

        // Selection must not cancel the focus ring: a disabled-focusable toggle
        // is still reachable by keyboard and still has to show where focus is.
        expect([condition, effective.ordinary.focusVisible['outline-style']]) //
          .toEqual([condition, 'solid']);
      }
    }
  );

  it.each(capButtonAppearances)(
    'changes colour, not size or shape, when %s becomes selected',
    (appearance) => {
      const unchecked = capGeometry(
        surfaceFor(appearance, 'unchecked').effective.ordinary.rest
      );

      expect(Object.keys(unchecked).length).toBeGreaterThan(0);

      expect(
        capGeometry(surfaceFor(appearance, 'checked').effective.ordinary.rest)
      ).toEqual(unchecked);
    }
  );

  it.each(capButtonAppearances)(
    'suppresses hover and pressed feedback for disabled %s',
    (appearance) => {
      const { effective } = surfaceFor(appearance, 'disabled');

      for (const mode of buttonColorModes) {
        expect(capColors(effective[mode].hover)).toEqual(
          capColors(effective[mode].rest)
        );
        expect(capColors(effective[mode].active)).toEqual(
          capColors(effective[mode].rest)
        );
      }
    }
  );
});

describe('CAP ToggleButton classified exceptions', () => {
  /**
   * A checked, disabled toggle contradicts itself under forced colors.
   *
   * Fluent applies its checked high-contrast styling whenever `checked` is set,
   * disabled or not. Those declarations carry different Griffel keys from CAP's
   * disabled ones, so `mergeClasses` cannot drop either, and both land in the
   * media bucket at equal specificity. The winner is then decided by which
   * component rendered first — the resting border reads as selected (`Highlight`)
   * while hovering reads as disabled (`GrayText`).
   *
   * CAP cannot settle this from its own style hook: restating the disabled
   * declarations reuses the same atomic classes, so no later insertion is
   * produced. The behaviour is pinned here so a fix, wherever it lands, is
   * noticed rather than absorbed. See the production bug audit.
   */
  it.each(capButtonAppearances)(
    'still contradicts itself for checked, disabled %s under forced colors',
    (appearance) => {
      const { effective } = surfaceFor(appearance, 'checkedDisabled');

      expect(capColors(effective.forcedColors.rest)['border-top-color']).toBe(
        'Highlight'
      );
      expect(capColors(effective.forcedColors.hover)['border-top-color']).toBe(
        'GrayText'
      );

      // Ordinary rendering is unaffected: only the forced-colors layer conflicts.
      expect(capColors(effective.ordinary.hover)).toEqual(
        capColors(effective.ordinary.rest)
      );
    }
  );
});

describe('CAP ToggleButton specialization laws', () => {
  it.each(capButtonAppearances)(
    'announces the pressed state of %s to assistive technology',
    (appearance) => {
      expect(
        toggleFor(appearance, 'unchecked').getAttribute('aria-pressed')
      ).toBe('false');

      for (const condition of checkedConditions) {
        expect([
          condition,
          toggleFor(appearance, condition).getAttribute('aria-pressed'),
        ]).toEqual([condition, 'true']);
      }
    }
  );

  it.each(capButtonAppearances)(
    'makes selection visible for %s, not only announced',
    (appearance) => {
      const unchecked = capColors(
        surfaceFor(appearance, 'unchecked').effective.ordinary.rest
      );
      const checked = capColors(
        surfaceFor(appearance, 'checked').effective.ordinary.rest
      );

      expect([appearance, checked]).not.toEqual([appearance, unchecked]);
    }
  );

  it.each(capButtonAppearances)(
    'restates the selection of %s in system colours under forced colors',
    (appearance) => {
      // Forced colors discards authored colour, so a selection expressed only in
      // theme tokens disappears for the users who most need to see it.
      const unchecked = capColors(
        surfaceFor(appearance, 'unchecked').effective.forcedColors.rest
      );
      const checked = capColors(
        surfaceFor(appearance, 'checked').effective.forcedColors.rest
      );

      expect([appearance, checked]).not.toEqual([appearance, unchecked]);
    }
  );

  it.each(capButtonAppearances)(
    'keeps disabled-focusable %s presenting as disabled while staying reachable',
    (appearance) => {
      const disabled = toggleFor(appearance, 'checkedDisabled');
      const disabledFocusable = toggleFor(
        appearance,
        'checkedDisabledFocusable'
      ) as HTMLButtonElement;

      expect((disabled as HTMLButtonElement).disabled).toBe(true);
      expect(disabledFocusable.disabled).toBe(false);
      expect(disabledFocusable.getAttribute('aria-disabled')).toBe('true');
      expect(disabledFocusable.getAttribute('tabindex')).not.toBe('-1');

      for (const mode of buttonColorModes) {
        expect(
          capColors(surfaceFor(appearance, 'checkedDisabledFocusable').effective[mode].rest)
        ).toEqual(
          capColors(surfaceFor(appearance, 'checkedDisabled').effective[mode].rest)
        );
      }
    }
  );
});
