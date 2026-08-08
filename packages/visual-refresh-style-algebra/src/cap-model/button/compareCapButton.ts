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
  compare(
    'geometry.root.paddingTop',
    production.geometry.root.paddingTop,
    cleanRoom.geometry.root.paddingTop
  );
  compare(
    'geometry.root.paddingRight',
    production.geometry.root.paddingRight,
    cleanRoom.geometry.root.paddingRight
  );
  compare(
    'geometry.root.paddingBottom',
    production.geometry.root.paddingBottom,
    cleanRoom.geometry.root.paddingBottom
  );
  compare(
    'geometry.root.paddingLeft',
    production.geometry.root.paddingLeft,
    cleanRoom.geometry.root.paddingLeft
  );
  compare(
    'geometry.root.borderTopLeftRadius',
    production.geometry.root.borderTopLeftRadius,
    cleanRoom.geometry.root.borderTopLeftRadius
  );
  compare(
    'geometry.root.borderTopRightRadius',
    production.geometry.root.borderTopRightRadius,
    cleanRoom.geometry.root.borderTopRightRadius
  );
  compare(
    'geometry.root.borderBottomRightRadius',
    production.geometry.root.borderBottomRightRadius,
    cleanRoom.geometry.root.borderBottomRightRadius
  );
  compare(
    'geometry.root.borderBottomLeftRadius',
    production.geometry.root.borderBottomLeftRadius,
    cleanRoom.geometry.root.borderBottomLeftRadius
  );
  compare(
    'geometry.root.minWidth',
    production.geometry.root.minWidth,
    cleanRoom.geometry.root.minWidth
  );
  compare(
    'geometry.root.maxWidth',
    production.geometry.root.maxWidth,
    cleanRoom.geometry.root.maxWidth
  );
  compare(
    'geometry.root.fontSize',
    production.geometry.root.fontSize,
    cleanRoom.geometry.root.fontSize
  );
  compare(
    'geometry.root.fontWeight',
    production.geometry.root.fontWeight,
    cleanRoom.geometry.root.fontWeight
  );
  compare(
    'geometry.root.lineHeight',
    production.geometry.root.lineHeight,
    cleanRoom.geometry.root.lineHeight
  );
  compare(
    'geometry.icon.fontSize',
    production.geometry.icon?.fontSize,
    cleanRoom.geometry.icon?.fontSize
  );
  compare(
    'geometry.icon.marginLeft',
    production.geometry.icon?.marginLeft,
    cleanRoom.geometry.icon?.marginLeft
  );
  compare(
    'geometry.icon.marginRight',
    production.geometry.icon?.marginRight,
    cleanRoom.geometry.icon?.marginRight
  );
  compare(
    'rootAppearance.foreground',
    production.rootAppearance.foreground,
    cleanRoom.rootAppearance.foreground
  );
  compare(
    'rootAppearance.background',
    production.rootAppearance.background,
    cleanRoom.rootAppearance.background
  );
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    compare(
      `rootAppearance.border.${side}`,
      production.rootAppearance.border[side],
      cleanRoom.rootAppearance.border[side]
    );
  }
  compare(
    'rootAppearance.focusTreatment.selection',
    production.rootAppearance.focusTreatment.selection,
    cleanRoom.rootAppearance.focusTreatment.selection
  );
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    compare(
      `rootAppearance.focusTreatment.border.${side}`,
      production.rootAppearance.focusTreatment.border[side],
      cleanRoom.rootAppearance.focusTreatment.border[side]
    );
  }
  compare(
    'rootAppearance.focusTreatment.outline.color',
    production.rootAppearance.focusTreatment.outline.color,
    cleanRoom.rootAppearance.focusTreatment.outline.color
  );
  compare(
    'rootAppearance.focusTreatment.outline.style',
    production.rootAppearance.focusTreatment.outline.style,
    cleanRoom.rootAppearance.focusTreatment.outline.style
  );
  compare(
    'rootAppearance.focusTreatment.outline.width',
    production.rootAppearance.focusTreatment.outline.width,
    cleanRoom.rootAppearance.focusTreatment.outline.width
  );
  compare(
    'rootAppearance.focusTreatment.innerShadow',
    production.rootAppearance.focusTreatment.innerShadow,
    cleanRoom.rootAppearance.focusTreatment.innerShadow
  );

  return differences;
};
