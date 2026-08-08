import * as React from 'react';
import {
  type Locator,
  type Page,
  expect,
  test,
} from '@playwright/experimental-ct-react';
import type {
  CapButtonInteractionAvailability,
  CapButtonInteractionSemanticContract,
} from '../CapButtonInteraction';
import type { CapButtonObservationConditions } from '../CapButtonScenario';
import { capButtonAppearances } from '../CapButtonScenario';
import { compareCapButtonInteraction } from '../compareCapButtonInteraction';
import {
  capButtonInteractionConditionLedger,
  capButtonInteractionConditions,
} from '../enumerateCapButtonInteractionConditions';
import { resolveCapButtonInteraction } from '../resolveCapButtonInteraction';
import { CapButtonInteractionProbe } from './CapButtonInteractionProbe.test-story';

interface ComputedInteractionStyle {
  readonly color: string;
  readonly backgroundColor: string;
  readonly borderTopColor: string;
  readonly borderRightColor: string;
  readonly borderBottomColor: string;
  readonly borderLeftColor: string;
  readonly outlineColor: string;
  readonly outlineStyle: string;
  readonly outlineWidth: string;
  readonly outlineOffset: string;
  readonly boxShadow: string;
  readonly hasFocusVisibleMarker: boolean;
}

const colorToHex = (value: string): string => {
  if (value === 'rgba(0, 0, 0, 0)') {
    return 'transparent';
  }

  const channels = value.match(/\d+(?:\.\d+)?/g);

  if (!value.startsWith('rgb') || channels === null || channels.length < 3) {
    return value;
  }

  return `#${channels
    .slice(0, 3)
    .map((channel) => Math.round(Number(channel)).toString(16).padStart(2, '0'))
    .join('')}`;
};

const normalizeShadow = (value: string): string => {
  if (value === 'none') {
    return value;
  }

  const color = value.match(/rgba?\([^)]+\)/)?.[0];
  const lengths = value.match(/-?\d+(?:\.\d+)?px/g);

  if (color === undefined || lengths === null || lengths.length < 4) {
    return value;
  }

  return `${lengths
    .slice(0, 4)
    .map((length) => (length === '0px' ? '0' : length))
    .join(' ')} ${colorToHex(color)}${value.includes('inset') ? ' inset' : ''}`;
};

const observeInteraction = async (
  button: Locator
): Promise<CapButtonInteractionSemanticContract> => {
  const computed = await button.evaluate(
    (element): ComputedInteractionStyle => {
      const style =
        element.ownerDocument.defaultView?.getComputedStyle(element);

      if (style === undefined) {
        throw new Error('Button computed style is unavailable');
      }

      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderTopColor: style.borderTopColor,
        borderRightColor: style.borderRightColor,
        borderBottomColor: style.borderBottomColor,
        borderLeftColor: style.borderLeftColor,
        outlineColor: style.outlineColor,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineOffset: style.outlineOffset,
        boxShadow: style.boxShadow,
        hasFocusVisibleMarker: element.hasAttribute('data-fui-focus-visible'),
      };
    }
  );
  const border = {
    top: colorToHex(computed.borderTopColor),
    right: colorToHex(computed.borderRightColor),
    bottom: colorToHex(computed.borderBottomColor),
    left: colorToHex(computed.borderLeftColor),
  };
  const visible =
    computed.hasFocusVisibleMarker &&
    computed.outlineStyle !== 'none' &&
    computed.outlineWidth !== '0px';

  return {
    surface: {
      foreground: colorToHex(computed.color),
      background: colorToHex(computed.backgroundColor),
      border,
    },
    focusTreatment: {
      visible,
      border,
      outline: {
        color: colorToHex(computed.outlineColor),
        style: computed.outlineStyle,
        width: computed.outlineWidth,
        offset: computed.outlineOffset,
      },
      innerShadow: normalizeShadow(computed.boxShadow),
    },
  };
};

const prepareKeyboardFocusVisible = async (page: Page): Promise<void> => {
  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
};

const waitForStyleAnimations = async (button: Locator): Promise<void> => {
  await button.evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished)
    );
  });
};

const applyPointerConditions = async (
  page: Page,
  button: Locator,
  conditions: CapButtonObservationConditions
): Promise<void> => {
  if (!conditions.hover) {
    return;
  }

  await button.hover();
  await waitForStyleAnimations(button);

  if (conditions.active) {
    if (conditions.focusVisible) {
      await page.keyboard.down('Space');
    } else {
      await page.mouse.down();
    }
    await waitForStyleAnimations(button);
  }
};

const releasePointer = async (
  page: Page,
  conditions: CapButtonObservationConditions
): Promise<void> => {
  if (conditions.active) {
    if (conditions.focusVisible) {
      await page.keyboard.up('Space');
    } else {
      await page.mouse.up();
    }
  }
};

const assertAppearanceMatrix = async (
  page: Page,
  root: Locator,
  availability: CapButtonInteractionAvailability,
  conditions: CapButtonObservationConditions
): Promise<void> => {
  const matrixDifferences: Array<{
    readonly appearance: string;
    readonly differences: ReturnType<typeof compareCapButtonInteraction>;
  }> = [];

  if (conditions.focusVisible) {
    await prepareKeyboardFocusVisible(page);
  }

  for (const appearance of capButtonAppearances) {
    const button = root.getByTestId(
      `interaction-${availability}-${appearance}`
    );

    if (conditions.focusVisible) {
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      await waitForStyleAnimations(button);
    }

    await applyPointerConditions(page, button, conditions);

    const actual = await observeInteraction(button);
    const expected = resolveCapButtonInteraction(
      appearance,
      availability,
      conditions
    );

    const differences = compareCapButtonInteraction(actual, expected);

    if (differences.length > 0) {
      matrixDifferences.push({ appearance, differences });
    }

    await releasePointer(page, conditions);
  }

  expect(
    matrixDifferences,
    `${availability}: ${JSON.stringify(conditions)}`
  ).toEqual([]);
};

test.describe('CAP Button browser-backed interaction contract', () => {
  test.beforeEach(({ browserName }) => {
    // eslint-disable-next-line playwright/no-skipped-test -- Evidence is intentionally pinned to Chromium 141.
    test.skip(
      browserName !== 'chromium',
      'Pinned interaction evidence is Chromium-only.'
    );
  });

  for (const entry of capButtonInteractionConditionLedger) {
    test(`matches every enabled appearance at ${entry.id}`, async ({
      mount,
      page,
    }) => {
      const component = await mount(
        <CapButtonInteractionProbe
          appearances={capButtonAppearances}
          availability="enabled"
        />
      );

      expect(entry.evidence.support).toBe('unknown');

      await assertAppearanceMatrix(
        page,
        component,
        'enabled',
        entry.conditions
      );
    });
  }

  test('proves native disabled hover and active suppression', async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <CapButtonInteractionProbe
        appearances={capButtonAppearances}
        availability="disabled"
      />
    );
    const suppressionConditions = capButtonInteractionConditions.slice(0, 3);

    expect(suppressionConditions).toHaveLength(3);

    for (const conditions of suppressionConditions) {
      await assertAppearanceMatrix(page, component, 'disabled', conditions);
    }
  });

  test('proves disabledFocusable pointer suppression independently', async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <CapButtonInteractionProbe
        appearances={capButtonAppearances}
        availability="disabledFocusable"
      />
    );
    const suppressionConditions = capButtonInteractionConditions.slice(0, 3);

    expect(suppressionConditions).toHaveLength(3);

    for (const conditions of suppressionConditions) {
      await assertAppearanceMatrix(
        page,
        component,
        'disabledFocusable',
        conditions
      );
    }
  });

  test('proves disabledFocusable keyboard focus treatment independently', async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <CapButtonInteractionProbe
        appearances={capButtonAppearances}
        availability="disabledFocusable"
      />
    );

    expect(capButtonInteractionConditions[3].focusVisible).toBe(true);

    await assertAppearanceMatrix(
      page,
      component,
      'disabledFocusable',
      capButtonInteractionConditions[3]
    );
  });
});
