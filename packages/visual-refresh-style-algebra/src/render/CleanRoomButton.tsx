import * as React from 'react';
import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { contractToStyles } from './contractToStyles';

export interface CleanRoomButtonProps {
  architecture: 'layered' | 'semantic';
  buttonCase: ButtonCase;
  contract: ButtonStyleContract;
  label?: string;
  ariaLabel?: string;
}

export const assertAccessibleLabel = (
  contract: ButtonStyleContract,
  ariaLabel: string | undefined
): void => {
  if (contract.anatomy.accessibleNameSource === 'ariaLabel' && !ariaLabel) {
    throw new Error('Icon-only clean-room buttons require ariaLabel');
  }
};

const renderSlot = (
  slot: ButtonStyleContract['anatomy']['orderedSlots'][number],
  label: string
): React.ReactNode =>
  slot === 'icon' ? (
    <span key="icon" aria-hidden="true" data-slot="icon">
      +
    </span>
  ) : (
    <span key="content" data-slot="content">
      {label}
    </span>
  );

export const CleanRoomButton = React.forwardRef<
  HTMLButtonElement,
  CleanRoomButtonProps
>(
  (
    { architecture, ariaLabel, buttonCase, contract, label = 'Action' },
    ref
  ) => {
    assertAccessibleLabel(contract, ariaLabel);

    return (
      <button
        ref={ref}
        type="button"
        disabled={contract.capabilities.exposesDisabledState}
        aria-label={
          contract.anatomy.accessibleNameSource === 'ariaLabel'
            ? ariaLabel
            : undefined
        }
        data-architecture={architecture}
        data-product={buttonCase.product}
        data-visual-language={buttonCase.visualLanguage}
        data-density={buttonCase.density}
        data-appearance={buttonCase.appearance}
        data-interaction-state={buttonCase.interactionState}
        data-color-mode={buttonCase.colorMode}
        data-anatomy={buttonCase.anatomyPolicy}
        data-composition={buttonCase.compositionContext}
        data-direction={buttonCase.direction}
        dir={buttonCase.direction}
        style={contractToStyles(contract)}
      >
        {contract.anatomy.orderedSlots.map((slot) => renderSlot(slot, label))}
      </button>
    );
  }
);

CleanRoomButton.displayName = 'CleanRoomButton';
