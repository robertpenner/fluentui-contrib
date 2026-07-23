import * as React from 'react';
import { expect, test } from '@playwright/experimental-ct-react';
import {
  evaluateEmission,
  normalizeForcedColorsEmission,
} from './normalizeForcedColorsEmission';
import { RealGriffelCapture } from '../../stories/ForcedColors/RealGriffelCapture';

function expectUnsafeDiagnosticCount(
  projectName: string,
  actual: number,
  chromiumExpected: number
): void {
  expect(actual).toBeGreaterThan(0);
  if (projectName === 'chromium') {
    expect(actual).toBe(chromiumExpected);
  }
}

function expectChromiumMetrics(
  projectName: string,
  actual: Record<string, number>,
  chromiumExpected: Record<string, number>
): void {
  Object.values(actual).forEach((value) =>
    expect(value).toBeGreaterThanOrEqual(0)
  );
  if (projectName === 'chromium') {
    expect(actual).toEqual(chromiumExpected);
  }
}

interface PaintProfile {
  color: string | undefined;
  backgroundColor: string | undefined;
  borderColor: string | undefined;
  forcedColorAdjust: string | undefined;
}

function expectForcedColorsPaint(
  browserName: string,
  mediaMatches: boolean,
  profiles: readonly PaintProfile[]
): void {
  const [enabled, disabled, unselected, selected, secondary] = profiles;

  expect(enabled).toEqual(selected);
  expect(disabled.color).not.toBe(enabled.color);
  expect(disabled.backgroundColor).not.toBe(enabled.backgroundColor);

  if (browserName === 'webkit') {
    expect(unselected).not.toEqual(secondary);
    return;
  }

  expect(unselected).toEqual(secondary);
  expect(enabled.forcedColorAdjust).toBe('none');
  expect(unselected.forcedColorAdjust).toBe('auto');
  expect(disabled.forcedColorAdjust).toBe('none');
  expect(disabled.color).toBe(disabled.borderColor);
}

test('captures real Button-family forced-colors output without changing modeled cascade behavior', async ({
  mount,
}, testInfo) => {
  const component = await mount(<RealGriffelCapture />);
  const output = component.getByTestId('griffel-capture-data');
  await expect(output).not.toHaveText('[]');
  const captures = JSON.parse((await output.textContent()) ?? '[]');
  const observedDecisions = new Set<string>();
  const expectedMetrics = new Map([
    ['Button/root', { rules: 55, unsafePairs: 296 }],
    ['ToggleButton/root', { rules: 55, unsafePairs: 296 }],
    ['SplitButton/primaryAction', { rules: 70, unsafePairs: 512 }],
    ['SplitButton/menuAction', { rules: 55, unsafePairs: 296 }],
  ]);

  expect(captures).toHaveLength(4);
  for (const { target, original } of captures) {
    const normalized = normalizeForcedColorsEmission(original);
    const expected = expectedMetrics.get(`${target.component}/${target.slot}`);

    expect(expected).toBeDefined();
    expect(original.rules).toHaveLength(expected?.rules ?? 0);
    expect(normalized.rules).toHaveLength(expected?.rules ?? 0);
    const unsafeDiagnostics = normalized.diagnostics.filter(
      (diagnostic) => diagnostic.kind === 'unsafeToMerge'
    );
    expectUnsafeDiagnosticCount(
      testInfo.project.name,
      unsafeDiagnostics.length,
      expected?.unsafePairs ?? 0
    );
    expect(
      original.rules.every((rule) =>
        rule.sourceRules.every((sourceRule) => sourceRule.includes('{'))
      )
    ).toBe(true);
    expect(
      original.rules.every((rule) => rule.media === '(forced-colors: active)')
    ).toBe(true);
    expect(evaluateEmission(normalized.rules)).toEqual(
      evaluateEmission(original.rules)
    );
    original.rules.forEach((rule) =>
      observedDecisions.add(rule.semanticDecision)
    );
    expect(target).toEqual(
      expect.objectContaining({ component: expect.any(String) })
    );
  }

  expect(observedDecisions).toEqual(
    new Set(['appearance', 'focusIndicator', 'visibleBoundary'])
  );
});

test('differential capture distinguishes state and appearance policy classes', async ({
  mount,
}, testInfo) => {
  const component = await mount(<RealGriffelCapture />);
  const output = component.getByTestId('griffel-differential-data');
  await expect(output).not.toHaveText('[]');
  const differences = JSON.parse((await output.textContent()) ?? '[]');
  const expectedMetrics = new Map<string, Record<string, number>>([
    [
      'Disabled state',
      {
        baselineClasses: 116,
        candidateClasses: 128,
        baselineRules: 55,
        candidateRules: 62,
        baselineMatching: 14,
        candidateMatching: 14,
        addedClasses: 64,
        removedClasses: 52,
        addedRules: 47,
        removedRules: 40,
        activatedRules: 12,
        deactivatedRules: 12,
      },
    ],
    [
      'Selected state',
      {
        baselineClasses: 117,
        candidateClasses: 121,
        baselineRules: 55,
        candidateRules: 57,
        baselineMatching: 14,
        candidateMatching: 14,
        addedClasses: 27,
        removedClasses: 23,
        addedRules: 23,
        removedRules: 21,
        activatedRules: 13,
        deactivatedRules: 13,
      },
    ],
    [
      'Alternate appearance',
      {
        baselineClasses: 116,
        candidateClasses: 71,
        baselineRules: 55,
        candidateRules: 25,
        baselineMatching: 14,
        candidateMatching: 0,
        addedClasses: 22,
        removedClasses: 67,
        addedRules: 5,
        removedRules: 35,
        activatedRules: 0,
        deactivatedRules: 14,
      },
    ],
  ]);

  expect(differences).toHaveLength(3);
  for (const { title, baseline, candidate, difference } of differences) {
    const actual = {
      baselineClasses: baseline.classNames.length,
      candidateClasses: candidate.classNames.length,
      baselineRules: baseline.rules.length,
      candidateRules: candidate.rules.length,
      baselineMatching: baseline.matchingRuleIndexes.length,
      candidateMatching: candidate.matchingRuleIndexes.length,
      addedClasses: difference.addedClassNames.length,
      removedClasses: difference.removedClassNames.length,
      addedRules: difference.addedRules.length,
      removedRules: difference.removedRules.length,
      activatedRules: difference.activatedRules.length,
      deactivatedRules: difference.deactivatedRules.length,
    };

    expect(expectedMetrics.has(title)).toBe(true);
    expect(actual.baselineClasses).toBeGreaterThan(0);
    expect(actual.candidateClasses).toBeGreaterThan(0);
    expect(actual.baselineRules).toBeGreaterThan(0);
    expect(actual.candidateRules).toBeGreaterThan(0);
    expect(actual.addedClasses + actual.removedClasses).toBeGreaterThan(0);
    expect(actual.addedRules + actual.removedRules).toBeGreaterThan(0);
    expectChromiumMetrics(
      testInfo.project.name,
      actual,
      expectedMetrics.get(title) ?? {}
    );
  }
});

test.describe('forced-colors paint outcomes', () => {
  test('preserves disabled, selected, and alternate-appearance distinctions', async ({
    browserName,
    mount,
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    const component = await mount(<RealGriffelCapture />);
    const mediaMatches = await page.evaluate(
      () => globalThis.matchMedia('(forced-colors: active)').matches
    );
    expect(mediaMatches).toBe(true);
    const testIds = [
      'enabled-primary-button',
      'disabled-primary-button',
      'unselected-toggle-button',
      'selected-toggle-button',
      'secondary-button',
    ];
    const profiles = await Promise.all(
      testIds.map((testId) =>
        component.getByTestId(testId).evaluate((element) => {
          const style =
            element.ownerDocument.defaultView?.getComputedStyle(element);
          return {
            color: style?.color,
            backgroundColor: style?.backgroundColor,
            borderColor: style?.borderTopColor,
            forcedColorAdjust: style?.forcedColorAdjust,
          };
        })
      )
    );

    expectForcedColorsPaint(browserName, mediaMatches, profiles);
  });
});
