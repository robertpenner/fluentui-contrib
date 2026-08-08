import type { CapButtonContract } from './CapButtonContract';
import type { CapButtonObservation } from './CapButtonObservation';
import type { CapModelEvidence } from './evidence';

export interface CapButtonDifference {
  readonly path: string;
  readonly production: unknown;
  readonly cleanRoom: unknown;
  readonly evidence: readonly CapModelEvidence[];
}

export const compareCapButton = (
  production: CapButtonObservation,
  cleanRoom: CapButtonContract
): readonly CapButtonDifference[] => {
  const differences: CapButtonDifference[] = [];
  const compare = (
    path: string,
    productionValue: unknown,
    cleanRoomValue: unknown
  ): void => {
    if (productionValue !== cleanRoomValue) {
      differences.push({
        path,
        production: productionValue,
        cleanRoom: cleanRoomValue,
        evidence: cleanRoom.provenance,
      });
    }
  };

  compare(
    'normalized.appearance',
    production.normalized.appearance,
    cleanRoom.normalized.appearance
  );
  compare(
    'normalized.size',
    production.normalized.size,
    cleanRoom.normalized.size
  );
  compare(
    'normalized.shape',
    production.normalized.shape,
    cleanRoom.normalized.shape
  );
  compare(
    'normalized.disabled',
    production.normalized.disabled,
    cleanRoom.normalized.disabled
  );
  compare(
    'normalized.disabledFocusable',
    production.normalized.disabledFocusable,
    cleanRoom.normalized.disabledFocusable
  );
  compare(
    'normalized.iconPosition',
    production.normalized.iconPosition,
    cleanRoom.normalized.iconPosition
  );
  compare(
    'normalized.iconOnly',
    production.normalized.iconOnly,
    cleanRoom.normalized.iconOnly
  );
  compare(
    'normalized.hasIcon',
    production.normalized.hasIcon,
    cleanRoom.normalized.hasIcon
  );
  compare(
    'normalized.hasChildren',
    production.normalized.hasChildren,
    cleanRoom.normalized.hasChildren
  );
  compare(
    'normalized.childrenTruthy',
    production.normalized.childrenTruthy,
    cleanRoom.normalized.childrenTruthy
  );
  if (
    production.anatomy.length !== cleanRoom.anatomy.length ||
    production.anatomy.some((slot, index) => slot !== cleanRoom.anatomy[index])
  ) {
    differences.push({
      path: 'anatomy',
      production: production.anatomy,
      cleanRoom: cleanRoom.anatomy,
      evidence: cleanRoom.provenance,
    });
  }
  compare(
    'styleSelections.root.appearance',
    production.styleSelections.root.appearance,
    cleanRoom.styleSelections.root.appearance
  );
  compare(
    'styleSelections.root.size',
    production.styleSelections.root.size,
    cleanRoom.styleSelections.root.size
  );
  compare(
    'styleSelections.root.shape',
    production.styleSelections.root.shape,
    cleanRoom.styleSelections.root.shape
  );
  compare(
    'styleSelections.root.availability',
    production.styleSelections.root.availability,
    cleanRoom.styleSelections.root.availability
  );
  compare(
    'styleSelections.root.focus',
    production.styleSelections.root.focus,
    cleanRoom.styleSelections.root.focus
  );
  compare(
    'styleSelections.root.content',
    production.styleSelections.root.content,
    cleanRoom.styleSelections.root.content
  );
  compare(
    'styleSelections.icon.size',
    production.styleSelections.icon?.size,
    cleanRoom.styleSelections.icon?.size
  );
  compare(
    'styleSelections.icon.position',
    production.styleSelections.icon?.position,
    cleanRoom.styleSelections.icon?.position
  );

  return differences;
};
