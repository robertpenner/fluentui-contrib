import * as React from 'react';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import {
  capButtonDirectionObservedEquivalence,
  capButtonForcedColorsMatrix,
  capButtonInteractionConditionLedger,
  capButtonMotionMatrix,
  capButtonSemanticProfileCensus,
  capButtonThemeFixtureNames,
} from '../../src';
import { CapAuditIntroduction } from './CapAuditIntroduction.stories';

const formatNumber = (value: number): string => value.toLocaleString('en-US');

const expectResult = (label: string, value: number | string): void => {
  expect(screen.getByText(label).previousSibling?.textContent).toContain(
    typeof value === 'number' ? formatNumber(value) : value
  );
};

describe('CapAuditIntroduction', () => {
  it('renders replacement production counts with separate environment and support results', () => {
    render(<CapAuditIntroduction />);

    expect(
      screen.getByRole('heading', {
        name: `${formatNumber(
          capButtonSemanticProfileCensus.authoredScenarios
        )} Button input combinations`,
      })
    ).toBeTruthy();
    expectResult(
      'distinct states after Fluent applies defaults',
      capButtonSemanticProfileCensus.normalizedStateTuples
    );
    expectResult(
      'distinct visual results',
      capButtonSemanticProfileCensus.semanticProfiles
    );
    expectResult(
      'CSS class combinations (implementation detail)',
      capButtonSemanticProfileCensus.generatedClassProfiles.count
    );
    expectResult(
      'results covered by a product support contract',
      `${capButtonSemanticProfileCensus.productSupport.knownProfiles} confirmed / ${capButtonSemanticProfileCensus.productSupport.unknownProfiles} not yet confirmed`
    );
    expectResult(
      'interactive states checked',
      capButtonInteractionConditionLedger.length
    );
    expectResult('forced-colors checks', capButtonForcedColorsMatrix.length);
    expectResult('reduced-motion checks', capButtonMotionMatrix.length);
    expectResult(
      'LTR/RTL comparisons',
      capButtonDirectionObservedEquivalence.scenarioCount
    );
    expectResult('sample themes', capButtonThemeFixtureNames.length);
    expect(screen.getAllByLabelText('Evidence source')).toHaveLength(8);
  });

  it('keeps production count literals out of the story source', () => {
    const storySource = readFileSync(
      `${__dirname}/CapAuditIntroduction.stories.tsx`,
      'utf8'
    );
    const docsSource = readFileSync(`${__dirname}/index.mdx`, 'utf8');

    expect(storySource).not.toMatch(/2,592|1,728|\b396\b|\b504\b/);
    expect(docsSource).not.toMatch(
      /2,592|1,728|\b396\b|\b504\b|twelve results/
    );
    expect(storySource).not.toMatch(/138,240|27,840|synthetic-model/);
    expect(docsSource).not.toMatch(/138,240|27,840|synthetic model/);
    expect(storySource).not.toContain(
      'version-sensitive diagnostic, not semantic identity'
    );
  });
});
