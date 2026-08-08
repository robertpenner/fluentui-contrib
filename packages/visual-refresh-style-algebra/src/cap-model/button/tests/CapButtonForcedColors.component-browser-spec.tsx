import * as React from 'react';
import {
  type Locator,
  type Page,
  expect,
  test,
} from '@playwright/experimental-ct-react';
import type { CapButtonInteractionAvailability } from '../CapButtonInteraction';
import type {
  CapButtonForcedColorsAuthoredContract,
  CapButtonForcedColorsEffectiveContract,
  CapButtonForcedColorsSemanticContract,
} from '../CapButtonForcedColors';
import { capButtonAppearances } from '../CapButtonScenario';
import { compareCapButtonForcedColors } from '../compareCapButtonForcedColors';
import { capButtonForcedColorsMatrix } from '../enumerateCapButtonForcedColorsMatrix';
import {
  capButtonChromiumSystemColorPaint,
  resolveCapButtonForcedColors,
} from '../resolveCapButtonForcedColors';
import { CapButtonForcedColorsProbe } from './CapButtonForcedColorsProbe.test-story';

interface ComputedForcedColorsStyle {
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
  readonly forcedColorAdjust: string;
  readonly hasFocusVisibleMarker: boolean;
}

interface AuthoredStateProjection {
  readonly rest: CapButtonForcedColorsAuthoredContract;
  readonly focusVisible: CapButtonForcedColorsAuthoredContract;
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

const observeEffective = async (
  page: Page,
  root: Locator,
  button: Locator
): Promise<CapButtonForcedColorsEffectiveContract> => {
  const computed = await button.evaluate(
    (element): ComputedForcedColorsStyle => {
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
        forcedColorAdjust: style.forcedColorAdjust,
        hasFocusVisibleMarker: element.hasAttribute('data-fui-focus-visible'),
      };
    }
  );
  const canaryBackground = await root
    .getByTestId('forced-colors-substitution-canary')
    .evaluate((element) =>
      element.ownerDocument.defaultView
        ?.getComputedStyle(element)
        .getPropertyValue('background-color')
    );

  return {
    mediaMatches: await page.evaluate(
      () => globalThis.matchMedia('(forced-colors: active)').matches
    ),
    substitutesSystemColors: canaryBackground !== 'rgb(1, 2, 3)',
    forcedColorAdjust: computed.forcedColorAdjust === 'none' ? 'none' : 'auto',
    foreground: colorToHex(computed.color),
    background: colorToHex(computed.backgroundColor),
    border: {
      top: colorToHex(computed.borderTopColor),
      right: colorToHex(computed.borderRightColor),
      bottom: colorToHex(computed.borderBottomColor),
      left: colorToHex(computed.borderLeftColor),
    },
    focus: {
      visible:
        computed.hasFocusVisibleMarker &&
        computed.outlineStyle !== 'none' &&
        computed.outlineWidth !== '0px',
      outlineColor: colorToHex(computed.outlineColor),
      outlineStyle: computed.outlineStyle,
      outlineWidth: computed.outlineWidth,
      outlineOffset: computed.outlineOffset,
      innerShadow: normalizeShadow(computed.boxShadow),
    },
  };
};

const authoredContracts = async (
  root: Locator
): Promise<Readonly<Record<string, AuthoredStateProjection>>> => {
  const output = root.getByTestId('forced-colors-authored-contracts');

  await expect(output).not.toHaveText('{}');

  return JSON.parse((await output.textContent()) ?? '{}') as Readonly<
    Record<string, AuthoredStateProjection>
  >;
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

const assertActiveMatrix = async (
  page: Page,
  root: Locator,
  availability: CapButtonInteractionAvailability,
  focusVisible: boolean
): Promise<void> => {
  const authored = await authoredContracts(root);
  const matrixDifferences: Array<{
    readonly appearance: string;
    readonly differences: ReturnType<typeof compareCapButtonForcedColors>;
  }> = [];

  if (focusVisible) {
    await prepareKeyboardFocusVisible(page);
  }

  for (const appearance of capButtonAppearances) {
    const testId = `forced-colors-${availability}-${appearance}`;
    const button = root.getByTestId(testId);

    if (focusVisible) {
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      await waitForStyleAnimations(button);
    }

    const actual: CapButtonForcedColorsSemanticContract = {
      applies: true,
      authored: authored[testId][focusVisible ? 'focusVisible' : 'rest'],
      effective: await observeEffective(page, root, button),
    };
    const expected = resolveCapButtonForcedColors(appearance, availability, {
      forcedColors: true,
      focusVisible,
    });
    const differences = compareCapButtonForcedColors(actual, expected);

    if (differences.length > 0) {
      matrixDifferences.push({ appearance, differences });
    }
  }

  expect(
    matrixDifferences,
    `${availability}: focusVisible=${focusVisible}`
  ).toEqual([]);
};

test.describe('CAP Button browser-backed forced-colors contract', () => {
  test.beforeEach(({ browserName }) => {
    // eslint-disable-next-line playwright/no-skipped-test -- Evidence is pinned to Chromium 141 on Linux.
    test.skip(
      browserName !== 'chromium',
      'Pinned forced-colors paint and CSSOM evidence is Chromium-only.'
    );
  });

  test('keeps inactive forced colors independent from theme paint', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'none' });

    expect(
      await page.evaluate(
        () => globalThis.matchMedia('(forced-colors: active)').matches
      )
    ).toBe(false);
    expect(
      capButtonForcedColorsMatrix
        .filter((entry) => !entry.forcedColors)
        .every((entry) => {
          const contract = resolveCapButtonForcedColors(
            entry.appearance,
            entry.availability,
            entry
          );

          return !contract.applies;
        })
    ).toBe(true);
  });

  test('pins the Chromium 141 Linux system-color paint baseline', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    const systemColorPaint = await page.evaluate((keywords) => {
      const targetDocument = globalThis.document;

      return Object.fromEntries(
        keywords.map((keyword) => {
          const element = targetDocument.createElement('span');
          element.style.color = keyword;
          targetDocument.body.append(element);
          const value = globalThis.getComputedStyle(element).color;
          element.remove();

          return [keyword, value];
        })
      );
    }, Object.keys(capButtonChromiumSystemColorPaint));

    expect(
      Object.fromEntries(
        Object.entries(systemColorPaint).map(([keyword, value]) => [
          keyword,
          colorToHex(value),
        ])
      )
    ).toEqual(capButtonChromiumSystemColorPaint);
  });

  for (const availability of [
    'enabled',
    'disabled',
    'disabledFocusable',
  ] as const) {
    test(`matches every ${availability} rest appearance`, async ({
      mount,
      page,
    }) => {
      expect(capButtonAppearances).toHaveLength(6);
      await page.emulateMedia({ forcedColors: 'active' });
      const component = await mount(
        <CapButtonForcedColorsProbe
          appearances={capButtonAppearances}
          availability={availability}
        />
      );

      await assertActiveMatrix(page, component, availability, false);
    });
  }

  for (const availability of ['enabled', 'disabledFocusable'] as const) {
    test(`matches every ${availability} focus-visible appearance`, async ({
      mount,
      page,
    }) => {
      expect(capButtonAppearances).toHaveLength(6);
      await page.emulateMedia({ forcedColors: 'active' });
      const component = await mount(
        <CapButtonForcedColorsProbe
          appearances={capButtonAppearances}
          availability={availability}
        />
      );

      await assertActiveMatrix(page, component, availability, true);
    });
  }
});
