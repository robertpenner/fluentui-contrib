import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { capButtonScenarios } from '../../src';
import {
  ChangeSpreadVisual,
  ContractVisual,
  PropertyBasedTestingExamples,
  RequestedChangeVisual,
} from './PropertyBasedTestingExamples';

describe('PropertyBasedTestingExamples', () => {
  it('grounds the explainer in current production-model examples', () => {
    render(<PropertyBasedTestingExamples />);

    expect(
      screen.getByText(capButtonScenarios.length.toLocaleString('en-US'))
    ).toBeTruthy();
    expect(screen.getByText('No visual change')).toBeTruthy();
    expect(
      screen.getByText('Fill and text preserved; focus added')
    ).toBeTruthy();
    expect(screen.getByText('disabled + hover')).toBeTruthy();
  });

  it('renders production CAP specimens for the practitioner workflow', () => {
    const { rerender } = render(<RequestedChangeVisual />);

    expect(
      screen
        .getByRole('button', { name: 'Submit request' })
        .hasAttribute('disabled')
    ).toBe(true);

    rerender(<ChangeSpreadVisual />);

    expect(screen.getByText('Disabled, focusable')).toBeTruthy();
    expect(screen.getByText('ToggleButton')).toBeTruthy();
    expect(screen.getByText('SplitButton')).toBeTruthy();
    expect(screen.getByText('Outline appearance')).toBeTruthy();

    rerender(<ContractVisual />);

    expect(screen.getByText('MAY CHANGE')).toBeTruthy();
    expect(screen.getByText('MUST REMAIN')).toBeTruthy();
  });
});
