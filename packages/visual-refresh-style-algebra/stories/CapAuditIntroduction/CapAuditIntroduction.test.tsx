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
        )} basic authored scenarios`,
      })
    ).toBeTruthy();
    expectResult(
      'normalized state tuples',
      capButtonSemanticProfileCensus.normalizedStateTuples
    );
    expectResult(
      'semantic style profiles',
      capButtonSemanticProfileCensus.semanticProfiles
    );
    expectResult(
      'generated class profiles (diagnostic)',
      capButtonSemanticProfileCensus.generatedClassProfiles.count
    );
    expectResult(
      'product-support profiles',
      `${capButtonSemanticProfileCensus.productSupport.knownProfiles} known / ${capButtonSemanticProfileCensus.productSupport.unknownProfiles} unknown`
    );
    expectResult(
      'interaction conditions',
      capButtonInteractionConditionLedger.length
    );
    expectResult(
      'forced-colors observations',
      capButtonForcedColorsMatrix.length
    );
    expectResult('motion observations', capButtonMotionMatrix.length);
    expectResult(
      'direction scenario pairs',
      capButtonDirectionObservedEquivalence.scenarioCount
    );
    expectResult('theme fixtures', capButtonThemeFixtureNames.length);
    expect(screen.getAllByLabelText('Production evidence')).toHaveLength(8);
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
    expect(storySource).toContain(
      '138,240 raw tuples and 27,840 model-admitted cases are historical'
    );
  });
});
