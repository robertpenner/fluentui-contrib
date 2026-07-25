import * as React from 'react';
import { type Page, expect, test } from '@playwright/experimental-ct-react';
import { capButtonAppearances } from '../fixtures/capButtonFamily';
import { CapFocusRingProbe } from '../fixtures/CapFocusRingProbe';

/**
 * The focus-ring law, asserted in engines that actually paint.
 *
 * The jsdom law suite proves the *declarations* survive: it reads the CSSOM and
 * checks that a focus indicator is emitted and not cancelled. It cannot prove
 * anything is drawn, because jsdom does not paint, does not run the whole
 * cascade, and does not implement `:focus-visible`.
 *
 * That gap matters here more than usual. The correction this file guards was the
 * *deletion* of an `outline: none`, so both failure modes are invisible to the
 * unit suite: the ring never appearing, and the browser default outline
 * reappearing underneath the Fluent indicator.
 */

/** WebKit's cold start under component testing runs past the shared 10s cap. */
const coldStartBudget = 60_000;

/**
 * Enough presses to walk past every focusable fixture in the Button row. Walking
 * the real tab order matters: Fluent gates its indicator on the `:focus-visible`
 * heuristic, which a programmatic `.focus()` does not trip.
 */
const tabPresses = 40;

interface FocusPaint {
  readonly outlineStyle: string;
  readonly outlineWidth: string;
  readonly hasFluentFocusMarker: boolean;
}

const expectRing = (
  appearance: string,
  paint: FocusPaint | undefined
): void => {
  expect(
    paint,
    `${appearance} was never reached by the tab order`
  ).toBeDefined();

  // The defect this replaces: `outline: none` in a later Griffel bucket beat the
  // focus indicator, so a keyboard-focused CAP Button drew nothing at all.
  expect(
    paint?.hasFluentFocusMarker,
    `${appearance} did not receive Fluent's focus-visible marker`
  ).toBe(true);
  expect(
    paint?.outlineStyle,
    `${appearance} painted no focus outline`
  ).not.toBe('none');
  expect(
    parseFloat(paint?.outlineWidth ?? '0'),
    `${appearance} painted a zero-width focus outline`
  ).toBeGreaterThan(0);
};

/**
 * Walks the real tab order and records how each focused fixture paints.
 *
 * Kept out of the test body so the bookkeeping needed to survive a tab stop that
 * carries no test id does not read as branching on the result.
 */
const walkTabOrder = async (
  page: Page,
  presses: number
): Promise<Record<string, FocusPaint>> => {
  const measured: Record<string, FocusPaint> = {};

  // Fluent decides that focus is keyboard-driven from a keydown it has already
  // seen. On the very first Tab of a fresh page some engines deliver the focus
  // change before that listener has classified the press, so the first stop can
  // read as pointer focus. Spend one press priming that classification, then
  // blur back to the body so the measured walk still starts from the top of the
  // tab order. Shift+Tab would not do: the tab order does not wrap, so stepping
  // backwards off the first stop leaves the document for good.
  await page.keyboard.press('Tab');
  await page.evaluate(() => {
    const active = globalThis.document.activeElement;

    if (active instanceof globalThis.HTMLElement) {
      active.blur();
    }
  });

  for (let press = 0; press < presses; press++) {
    await page.keyboard.press('Tab');

    const reading = await page.evaluate(() => {
      const active = globalThis.document.activeElement;
      const testId = active?.getAttribute('data-testid');

      if (!active || !testId) {
        return null;
      }

      const style = active.ownerDocument.defaultView?.getComputedStyle(active);

      return {
        testId,
        paint: {
          outlineStyle: style?.outlineStyle ?? '',
          outlineWidth: style?.outlineWidth ?? '',
          hasFluentFocusMarker: active.hasAttribute('data-fui-focus-visible'),
        },
      };
    });

    if (reading) {
      measured[reading.testId] = reading.paint;
    }
  }

  return measured;
};

test.describe('CAP Button focus ring in a painting engine', () => {
  test('paints a focus ring on every appearance reached by the keyboard', async ({
    mount,
    page,
  }) => {
    test.setTimeout(coldStartBudget);

    await mount(<CapFocusRingProbe />);

    const measured = await walkTabOrder(page, tabPresses);

    // The precondition the rest of the test rests on: the keyboard walk actually
    // moved through the fixtures rather than finding nothing focusable.
    expect(Object.keys(measured).length).toBeGreaterThan(0);

    for (const appearance of capButtonAppearances) {
      expectRing(appearance, measured[`button-${appearance}-enabled`]);
    }
  });
});
