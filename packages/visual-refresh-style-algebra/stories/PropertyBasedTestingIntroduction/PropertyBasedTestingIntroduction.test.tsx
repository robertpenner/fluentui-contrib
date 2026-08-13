import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  ButtonDimensionMatrix,
  PropertyBasedTestingIntroduction,
} from './PropertyBasedTestingIntroduction';

describe('PropertyBasedTestingIntroduction', () => {
  it('shows all 11 matrix values against a shared baseline', () => {
    render(<ButtonDimensionMatrix />);

    const matrix = screen.getByRole('region', {
      name: 'Button matrix dimensions',
    });

    expect(matrix.querySelectorAll('button')).toHaveLength(11);
    expect(
      screen.getByRole('list', { name: 'Appearance values' })
    ).toBeTruthy();
    expect(screen.getByRole('list', { name: 'Size values' })).toBeTruthy();
    expect(
      screen.getByRole('list', { name: 'Content layout values' })
    ).toBeTruthy();
    expect(screen.getByRole('list', { name: 'State values' })).toBeTruthy();
    expect(
      screen.getByText('Baseline: Primary · Medium · Text only · Enabled')
    ).toBeTruthy();
  });

  it('shows executable laws, valid variation, and a clearly labeled narrowing demo', () => {
    render(<PropertyBasedTestingIntroduction />);

    expect(
      screen.getByText('When a Button becomes disabled, its colors may change.')
    ).toBeTruthy();
    expect(
      screen.getByText(
        'When that Button becomes disabled, its size and content alignment must remain unchanged.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Permission law')).toBeTruthy();
    expect(screen.getByText('Preservation law')).toBeTruthy();
    expect(
      screen.getByText('What may change, and what must remain?')
    ).toBeTruthy();
    expect(screen.queryByText('One property, two laws')).toBeNull();
    expect(
      screen.getByRole('list', { name: 'Generated Button choices' })
    ).toBeTruthy();
    expect(
      screen.getByText('IMAGINED BUG, NOT CURRENT CAP BEHAVIOR')
    ).toBeTruthy();
    expect(screen.getAllByText('Still fails')).toHaveLength(3);
    expect(screen.getAllByText('Same height and alignment')).toHaveLength(5);
    expect(screen.getAllByText('Height changed')).toHaveLength(4);
    expect(screen.getByText('enabled/disabled')).toBeTruthy();
    expect(screen.getByText('Smallest useful example')).toBeTruthy();
    expect(screen.queryByText(/hover|pointer/i)).toBeNull();
  });
});
