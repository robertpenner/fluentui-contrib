import * as React from 'react';
import { type Locator, expect, test } from '@playwright/experimental-ct-react';
import { AlternateAppearanceProbe } from '../fixtures/AlternateAppearanceProbe';

/**
 * The properties that decide whether two buttons look alike under forced colors.
 *
 * Forced colors discards authored colour and substitutes system colour, so the
 * only honest comparison is of *computed* values. `forced-color-adjust` is kept
 * out of this list: it is not a paint outcome but the declaration that says
 * whether the platform is allowed to substitute at all.
 */
const paintProperties = [
  'color',
  'background-color',
  'border-top-color',
  'border-top-style',
  'border-top-width',
] as const;

type PaintProfile = Record<string, string>;

const profileOf = (root: Locator, testId: string): Promise<PaintProfile> =>
  root.getByTestId(testId).evaluate(
    (element, properties) => {
      const style = element.ownerDocument.defaultView?.getComputedStyle(element);

      return Object.fromEntries(
        properties.map((property) => [
          property,
          style?.getPropertyValue(property) ?? '',
        ])
      );
    },
    [...paintProperties]
  );

const substitutionPolicyOf = (root: Locator, testId: string): Promise<string> =>
  root
    .getByTestId(testId)
    .evaluate(
      (element) =>
        element.ownerDocument.defaultView?.getComputedStyle(element)
          .forcedColorAdjust ?? ''
    );

/**
 * Whether the engine actually performs forced-colors *substitution*, as opposed
 * to merely matching `(forced-colors: active)`.
 *
 * The canary carries authored colours and no forced-colors treatment. An engine
 * that substitutes replaces them; an engine that only matches the query leaves
 * them intact. Deriving the capability this way keeps the laws below stated over
 * observable engine behaviour rather than over a browser name, and stops one
 * emulated system palette from being treated as universal.
 */
const substitutesSystemColors = async (root: Locator): Promise<boolean> => {
  const canary = await profileOf(root, 'probe-substitution-canary');

  return canary['background-color'] !== 'rgb(1, 2, 3)';
};

/**
 * The outcome the two alternate appearances are allowed to have, given what the
 * engine does.
 *
 * The branch lives here rather than inside a test body so that the law is stated
 * once, over an observed capability, instead of being spelled out per browser
 * name at each call site.
 */
function expectAlternateAppearanceOutcome({
  substitutes,
  divergent,
  unselected,
  secondary,
  reference,
}: {
  substitutes: boolean;
  divergent: readonly string[];
  unselected: PaintProfile;
  secondary: PaintProfile;
  reference: PaintProfile;
}): void {
  if (substitutes) {
    // The agreement is the engine's doing, not CAP's: the secondary appearance
    // declares no forced-colors treatment, so it resembles the unselected toggle
    // only because the engine substitutes system colours into it. Compared
    // within one engine, never across engines.
    expect(divergent).toEqual([]);

    return;
  }

  // An engine that matches `(forced-colors: active)` without substituting — as
  // WebKit does under emulation — separates the two. The declarations that name
  // system colours explicitly, which is CAP's forced-colors block on the toggle,
  // still resolve; the untreated secondary Button keeps its authored values. The
  // divergence is therefore a statement about *coverage*: CAP gives its
  // non-primary appearances no forced-colors treatment of their own.
  expect(divergent).toEqual(['color', 'background-color', 'border-top-color']);

  // And the reason is checkable rather than asserted. The toggle sits on the
  // system-colour keywords CAP names explicitly, which every engine resolves;
  // the secondary Button does not, because no rule ever treated it.
  const systemColored = (['color', 'background-color'] as const).filter(
    (property) => unselected[property] === reference[property]
  );

  expect(systemColored).toEqual(['color', 'background-color']);
  expect(secondary['background-color']).not.toBe(
    reference['background-color']
  );
}

/**
 * WebKit's first page in this container is slow to come up, and the shared
 * config timeout is tuned for the other specs in this package.
 */
const coldStartBudget = 60_000;

/**
 * Each render order gets its own mount, because Griffel's cascade *is* its
 * insertion order: mounting both orders on one page would let the first mount
 * decide the outcome for the second, and the comparison would prove nothing.
 */
const renderOrders = [
  { name: 'as the first thing on the page', perturbOrder: false },
  { name: 'after every other appearance has rendered', perturbOrder: true },
] as const;

test.describe('alternate appearance under forced colors', () => {
  for (const { name, perturbOrder } of renderOrders) {
    test(`states one substitution policy per surface, ${name}`, async ({
      mount,
      page,
    }) => {
      test.setTimeout(coldStartBudget);
      await page.emulateMedia({ forcedColors: 'active' });

      const probe = await mount(
        <AlternateAppearanceProbe perturbOrder={perturbOrder} />
      );

      expect(
        await page.evaluate(
          () => globalThis.matchMedia('(forced-colors: active)').matches
        )
      ).toBe(true);

      const supportsPolicy = await page.evaluate(() =>
        globalThis.CSS?.supports('forced-color-adjust', 'auto')
      );

      // The engine's own report, not a browser-name lookup: `forced-color-adjust`
      // is only meaningful where it is implemented.
      // eslint-disable-next-line playwright/no-skipped-test -- an engine without the property has no policy to state
      test.skip(
        !supportsPolicy,
        'the engine does not implement forced-color-adjust'
      );

      // Upstream Fluent opts primary ToggleButtons *back into* substitution so
      // that selected and unselected stay distinguishable. CAP replaces that
      // block, so CAP has to restate the opt-in; when it did not, the
      // `forced-color-adjust: none` contributed by CAP's *Button* primary block
      // still matched the same root at the same specificity, nothing deduped the
      // two, and the winner was whichever rule Griffel inserted last. The
      // perturbed render order is here to keep that from coming back.
      expect(await substitutionPolicyOf(probe, 'probe-unselected-toggle')).toBe(
        'auto'
      );
      expect(await substitutionPolicyOf(probe, 'probe-selected-toggle')).toBe(
        'none'
      );
      expect(await substitutionPolicyOf(probe, 'probe-secondary-button')).toBe(
        'auto'
      );
    });

    test(`resolves the alternate appearances the same way, ${name}`, async ({
      browserName,
      mount,
      page,
    }) => {
      test.setTimeout(coldStartBudget);
      await page.emulateMedia({ forcedColors: 'active' });

      const probe = await mount(
        <AlternateAppearanceProbe perturbOrder={perturbOrder} />
      );

      const substitutes = await substitutesSystemColors(probe);
      const unselected = await profileOf(probe, 'probe-unselected-toggle');
      const secondary = await profileOf(probe, 'probe-secondary-button');
      const reference = await profileOf(probe, 'probe-system-color-reference');
      const divergent = paintProperties.filter(
        (property) => unselected[property] !== secondary[property]
      );

      // The precondition the rest of the test rests on: whatever the engine does
      // about substitution, it has at least been told forced colors are on.
      expect(
        await page.evaluate(
          () => globalThis.matchMedia('(forced-colors: active)').matches
        )
      ).toBe(true);

      // Recorded so a future engine change reads as a described difference
      // rather than a bare red boolean.
      console.log(
        `${browserName} (${name}): substitutes=${substitutes} unselected=${JSON.stringify(
          unselected
        )} secondary=${JSON.stringify(secondary)} divergent=${JSON.stringify(
          divergent
        )}`
      );

      expectAlternateAppearanceOutcome({
        substitutes,
        divergent,
        unselected,
        secondary,
        reference,
      });
    });
  }

  test('keeps the selected toggle distinguishable from the unselected one', async ({
    mount,
    page,
  }) => {
    test.setTimeout(coldStartBudget);
    await page.emulateMedia({ forcedColors: 'active' });

    const probe = await mount(<AlternateAppearanceProbe />);
    const unselected = await profileOf(probe, 'probe-unselected-toggle');
    const selected = await profileOf(probe, 'probe-selected-toggle');

    // This is what upstream's `forced-color-adjust: auto` protects, and what the
    // order-dependent `none` was quietly putting at risk.
    expect(selected['background-color']).not.toBe(
      unselected['background-color']
    );
  });
});
