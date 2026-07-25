import * as React from 'react';
import { render } from '@testing-library/react';
import {
  CapButtonFamilyFixtures,
  CapFixtureProvider,
} from '../fixtures/capButtonFamily';
import {
  collectGriffelShorthandDiagnostics,
  formatGriffelShorthandDiagnostics,
} from './collectGriffelShorthandDiagnostics';
import {
  type GriffelShorthandDiagnostic,
  summarizeGriffelShorthandDiagnostics,
} from './GriffelDiagnostic';

/**
 * Griffel memoizes each `makeStyles` definition for the lifetime of the module
 * registry, so the diagnostics are only observable on the very first render that
 * reaches them. Everything is collected once, in this file, before any assertion.
 */
const collectOnce = (): readonly GriffelShorthandDiagnostic[] =>
  collectGriffelShorthandDiagnostics(() => {
    render(
      <CapFixtureProvider>
        <CapButtonFamilyFixtures />
      </CapFixtureProvider>
    );
    render(
      <CapFixtureProvider dir="rtl">
        <CapButtonFamilyFixtures />
      </CapFixtureProvider>
    );
  });

/**
 * Flattens every rule Griffel inserted into the document, including the bodies of
 * `@media` blocks, so an assertion can show that a corrected declaration really
 * reaches the stylesheet instead of merely no longer being reported.
 */
const insertedStyleRules = (): readonly string[] => {
  const flatten = (rules: CSSRuleList): string[] =>
    [...rules].flatMap((rule) =>
      rule instanceof CSSMediaRule
        ? flatten(rule.cssRules).map(
            (nested) => `@media ${rule.conditionText} { ${nested} }`
          )
        : [rule.cssText]
    );

  return [...document.querySelectorAll('style')].flatMap((element) =>
    element.sheet ? flatten(element.sheet.cssRules) : []
  );
};

describe('CAP Button-family Griffel diagnostics', () => {
  const diagnostics = collectOnce();

  it('renders the production Button family without dropping declarations', () => {
    expect(formatGriffelShorthandDiagnostics(diagnostics)).toBe('');
    expect(summarizeGriffelShorthandDiagnostics(diagnostics)).toEqual({});
  });

  it('emits the focus boundary colour the dropped declaration intended', () => {
    const rules = insertedStyleRules();

    expect(
      rules.filter(
        (rule) =>
          rule.includes('data-fui-focus-visible') &&
          rule.includes('border-top-color: var(--colorStrokeFocus2)')
      )
    ).not.toHaveLength(0);
  });

  it('emits the forced-colors focus boundary the dropped declaration intended', () => {
    const rules = insertedStyleRules();

    expect(
      rules.filter(
        (rule) =>
          rule.includes('data-fui-focus-visible') &&
          rule.includes('border-top-color: Highlight')
      )
    ).not.toHaveLength(0);
  });
});
