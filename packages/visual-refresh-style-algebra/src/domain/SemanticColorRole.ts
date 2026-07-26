export const systemColorRoles = [
  'Canvas',
  'CanvasText',
  'ButtonFace',
  'ButtonText',
  'ButtonBorder',
  'Highlight',
  'HighlightText',
  'GrayText',
] as const;

export type SystemColorRole = (typeof systemColorRoles)[number];

export type ProductColorRole =
  | 'neutralForeground'
  | 'neutralForegroundHover'
  | 'neutralForegroundPressed'
  | 'neutralForegroundDisabled'
  | 'foregroundOnBrand'
  | 'brandForeground'
  | 'brandForegroundHover'
  | 'brandForegroundPressed'
  | 'neutralBackground'
  | 'neutralBackgroundHover'
  | 'neutralBackgroundPressed'
  | 'neutralBackgroundDisabled'
  | 'brandBackground'
  | 'brandBackgroundHover'
  | 'brandBackgroundPressed'
  | 'brandBackgroundTint'
  | 'brandBackgroundTintHover'
  | 'brandBackgroundTintPressed'
  | 'transparentBackground'
  | 'neutralBorder'
  | 'neutralBorderHover'
  | 'neutralBorderPressed'
  | 'neutralBorderDisabled'
  | 'brandBorder'
  | 'transparentBorder'
  | 'focusStroke';

export type SemanticColorRole = ProductColorRole | SystemColorRole;

export const isSystemColorRole = (
  role: SemanticColorRole
): role is SystemColorRole =>
  (systemColorRoles as readonly SemanticColorRole[]).includes(role);
