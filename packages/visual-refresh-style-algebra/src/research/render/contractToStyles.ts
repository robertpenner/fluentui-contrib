import { tokens } from '@fluentui/react-components';
import type * as React from 'react';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import type {
  ProductColorRole,
  SemanticColorRole,
} from '../domain/SemanticColorRole';
import { isSystemColorRole } from '../domain/SemanticColorRole';

const productRoleValues: Readonly<Record<ProductColorRole, string>> = {
  neutralForeground: tokens.colorNeutralForeground1,
  neutralForegroundHover: tokens.colorNeutralForeground1Hover,
  neutralForegroundPressed: tokens.colorNeutralForeground1Pressed,
  neutralForegroundDisabled: tokens.colorNeutralForegroundDisabled,
  foregroundOnBrand: tokens.colorNeutralForegroundOnBrand,
  brandForeground: tokens.colorCompoundBrandForeground1,
  brandForegroundHover: tokens.colorCompoundBrandForeground1Hover,
  brandForegroundPressed: tokens.colorCompoundBrandForeground1Pressed,
  neutralBackground: tokens.colorNeutralBackground1,
  neutralBackgroundHover: tokens.colorNeutralBackground1Hover,
  neutralBackgroundPressed: tokens.colorNeutralBackground1Pressed,
  neutralBackgroundDisabled: tokens.colorNeutralBackgroundDisabled,
  brandBackground: tokens.colorBrandBackground,
  brandBackgroundHover: tokens.colorBrandBackgroundHover,
  brandBackgroundPressed: tokens.colorBrandBackgroundPressed,
  brandBackgroundTint: tokens.colorBrandBackground2,
  brandBackgroundTintHover: tokens.colorBrandBackground2Hover,
  brandBackgroundTintPressed: tokens.colorBrandBackground2Pressed,
  transparentBackground: tokens.colorTransparentBackground,
  neutralBorder: tokens.colorNeutralStroke1,
  neutralBorderHover: tokens.colorNeutralStroke1Hover,
  neutralBorderPressed: tokens.colorNeutralStroke1Pressed,
  neutralBorderDisabled: tokens.colorNeutralStrokeDisabled,
  brandBorder: tokens.colorBrandStroke1,
  transparentBorder: tokens.colorTransparentStroke,
  focusStroke: tokens.colorStrokeFocus2,
};

const resolveRole = (role: SemanticColorRole): string =>
  isSystemColorRole(role) ? role : productRoleValues[role];

export const contractToStyles = (
  contract: ButtonStyleContract
): React.CSSProperties => ({
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'inline-flex',
  justifyContent: 'center',
  blockSize: contract.geometry.blockSize,
  minInlineSize: contract.geometry.minInlineSize,
  paddingInlineStart: contract.geometry.paddingInlineStart,
  paddingInlineEnd: contract.geometry.paddingInlineEnd,
  gap: contract.geometry.gap,
  borderStartStartRadius: contract.shape.radiusStartStart,
  borderStartEndRadius: contract.shape.radiusStartEnd,
  borderEndStartRadius: contract.shape.radiusEndStart,
  borderEndEndRadius: contract.shape.radiusEndEnd,
  borderStyle: 'solid',
  borderWidth: tokens.strokeWidthThin,
  borderColor: resolveRole(contract.appearance.borderRole),
  color: resolveRole(contract.appearance.foregroundRole),
  backgroundColor: resolveRole(contract.appearance.backgroundRole),
  fontFamily: tokens.fontFamilyBase,
  fontSize: contract.typography.fontSize,
  fontWeight: contract.typography.fontWeight,
  lineHeight: `${contract.typography.lineHeight}px`,
  outlineStyle: contract.focus.visible ? 'solid' : 'none',
  outlineColor: resolveRole(contract.focus.colorRole),
  outlineWidth: contract.focus.visible ? contract.focus.width : 0,
  outlineOffset: contract.focus.offset,
  forcedColorAdjust: isSystemColorRole(contract.appearance.foregroundRole)
    ? 'none'
    : undefined,
});
