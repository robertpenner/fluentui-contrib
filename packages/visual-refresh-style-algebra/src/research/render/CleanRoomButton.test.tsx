import * as React from 'react';
import { render, screen } from '@testing-library/react';
import type { ButtonCase } from '../domain/ButtonCase';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';
import { assertAccessibleLabel, CleanRoomButton } from './CleanRoomButton';

const iconOnlyCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'focusVisible',
  colorMode: 'forcedColors',
  contentKind: 'iconOnly',
  iconPlacement: 'only',
  anatomyPolicy: 'visualRefreshReconstructed',
  compositionContext: 'standalone',
  direction: 'ltr',
};

describe('CleanRoomButton', () => {
  it('renders native disabled semantics and stable assertion attributes', () => {
    const buttonCase: ButtonCase = {
      ...iconOnlyCase,
      interactionState: 'disabled',
    };
    render(
      <CleanRoomButton
        architecture="semantic"
        buttonCase={buttonCase}
        contract={resolveSemanticButton(buttonCase)}
        ariaLabel="Add item"
      />
    );

    const button = screen.getByRole('button', {
      name: 'Add item',
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('data-color-mode')).toBe('forcedColors');
    expect(button.getAttribute('data-anatomy')).toBe(
      'visualRefreshReconstructed'
    );
  });

  it('requires an accessible label when the anatomy contract names ariaLabel', () => {
    expect(() =>
      assertAccessibleLabel(resolveSemanticButton(iconOnlyCase), undefined)
    ).toThrow('require ariaLabel');
  });
});
