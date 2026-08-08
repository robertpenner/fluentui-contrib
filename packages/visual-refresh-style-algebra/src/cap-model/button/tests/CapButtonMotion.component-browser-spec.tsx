import * as React from 'react';
import { type Locator, expect, test } from '@playwright/experimental-ct-react';
import type {
  CapButtonMotionAvailability,
  CapButtonMotionContract,
} from '../CapButtonMotion';
import {
  capButtonAppearances,
  type CapButtonObservationConditions,
} from '../CapButtonScenario';
import { compareCapButtonMotion } from '../compareCapButtonMotion';
import { capButtonMotionMatrix } from '../enumerateCapButtonMotionMatrix';
import { projectCapButtonMotion } from '../projectCapButtonMotion';
import { resolveCapButtonMotion } from '../resolveCapButtonMotion';
import { CapButtonMotionProbe } from './CapButtonMotionProbe.test-story';
import type { CapButtonThemeFixtureName } from './themeFixtures';

const availabilities: readonly CapButtonMotionAvailability[] = [
  'enabled',
  'disabled',
  'disabledFocusable',
];

const observeMotion = async (
  button: Locator
): Promise<CapButtonMotionContract> => {
  const computed = await button.evaluate((element) => {
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);

    if (style === undefined) {
      throw new Error('Button computed style is unavailable');
    }

    return {
      transitionProperty: style.transitionProperty,
      transitionDuration: style.transitionDuration,
    };
  });

  return projectCapButtonMotion(
    computed.transitionProperty,
    computed.transitionDuration
  );
};

test.describe('CAP Button browser-backed motion contract', () => {
  test.beforeEach(({ browserName }) => {
    // eslint-disable-next-line playwright/no-skipped-test -- Evidence is intentionally pinned to Chromium 141.
    test.skip(
      browserName !== 'chromium',
      'Pinned reduced-motion media and computed-style evidence is Chromium-only.'
    );
  });

  for (const prefersReducedMotion of [false, true] as const) {
    test(`matches all appearances and availability states with prefersReducedMotion=${prefersReducedMotion}`, async ({
      mount,
      page,
    }) => {
      await page.emulateMedia({
        reducedMotion: prefersReducedMotion ? 'reduce' : 'no-preference',
      });
      const component = await mount(
        <CapButtonMotionProbe
          appearances={capButtonAppearances}
          availabilities={availabilities}
          direction="ltr"
          prefix="motion-matrix"
          theme="web-light-with-cap"
        />
      );
      const expected = resolveCapButtonMotion(prefersReducedMotion);
      const observations: Array<{
        readonly appearance: string;
        readonly availability: string;
        readonly differences: ReturnType<typeof compareCapButtonMotion>;
      }> = [];

      expect(
        await page.evaluate(
          () =>
            globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
      ).toBe(prefersReducedMotion);

      for (const entry of capButtonMotionMatrix.filter(
        (candidate) => candidate.prefersReducedMotion === prefersReducedMotion
      )) {
        const actual = await observeMotion(
          component.getByTestId(
            `motion-matrix-${entry.appearance}-${entry.availability}`
          )
        );
        const entryDifferences = compareCapButtonMotion(actual, expected);

        observations.push({
          appearance: entry.appearance,
          availability: entry.availability,
          differences: entryDifferences,
        });
      }

      expect(
        observations.filter((entry) => entry.differences.length > 0)
      ).toEqual([]);
    });
  }

  test('keeps the preference independent from theme, direction, and forced colors', async ({
    mount,
    page,
  }) => {
    const themes: readonly CapButtonThemeFixtureName[] = [
      'web-light-with-cap',
      'web-dark-with-cap',
    ];
    const directions: readonly CapButtonObservationConditions['direction'][] = [
      'ltr',
      'rtl',
    ];
    const component = await mount(
      <>
        {themes.flatMap((theme) =>
          directions.map((direction) => {
            const prefix = `motion-independent-${theme}-${direction}`;

            return (
              <CapButtonMotionProbe
                key={prefix}
                appearances={['primary']}
                availabilities={['enabled']}
                direction={direction}
                prefix={prefix}
                theme={theme}
              />
            );
          })
        )}
      </>
    );

    for (const forcedColors of ['none', 'active'] as const) {
      for (const prefersReducedMotion of [false, true] as const) {
        await page.emulateMedia({
          forcedColors,
          reducedMotion: prefersReducedMotion ? 'reduce' : 'no-preference',
        });
        const expected = resolveCapButtonMotion(prefersReducedMotion);

        for (const theme of themes) {
          for (const direction of directions) {
            const actual = await observeMotion(
              component.getByTestId(
                `motion-independent-${theme}-${direction}-primary-enabled`
              )
            );

            expect(
              compareCapButtonMotion(actual, expected),
              JSON.stringify({
                theme,
                direction,
                forcedColors,
                prefersReducedMotion,
              })
            ).toEqual([]);
          }
        }
      }
    }
  });
});
