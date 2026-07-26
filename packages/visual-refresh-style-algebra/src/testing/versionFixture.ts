import type { ButtonCase } from '../domain/ButtonCase';
import type { ComparableButtonStyleContract } from '../comparison/normalizeContract';

export const frozenVersionCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'rest',
  colorMode: 'light',
  contentKind: 'textAndIcon',
  iconPlacement: 'before',
  anatomyPolicy: 'visualRefreshReconstructed',
  compositionContext: 'standalone',
  direction: 'ltr',
};

export const frozenVersionContract: ComparableButtonStyleContract = {
  modelVersion: 'visual-refresh-clean-room-v1',
  geometry: {
    blockSize: 36,
    minInlineSize: 36,
    paddingInlineStart: 10,
    paddingInlineEnd: 12,
    gap: 6,
  },
  shape: {
    radiusStartStart: 8,
    radiusStartEnd: 8,
    radiusEndStart: 8,
    radiusEndEnd: 8,
  },
  appearance: {
    foregroundRole: 'foregroundOnBrand',
    backgroundRole: 'brandBackground',
    borderRole: 'transparentBorder',
  },
  typography: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 20,
  },
  anatomy: {
    orderedSlots: ['icon', 'content'],
    iconPlacement: 'before',
    accessibleNameSource: 'text',
  },
  supportedDomain: {
    appearanceSupported: true,
    supportedStates: ['rest', 'hover', 'pressed', 'focusVisible', 'disabled'],
  },
  validationObligations: [
    'nativeButtonSemantics',
    'focusVisibility',
    'stateCompleteness',
    'textOverflow',
    'forcedColorsBehavior',
    'accessibleNaming',
  ],
  focus: {
    visible: false,
    colorRole: 'focusStroke',
    width: 2,
    offset: 2,
  },
  capabilities: {
    interactive: true,
    supportsKeyboardActivation: true,
    exposesDisabledState: false,
    semanticActionRole: 'button',
  },
};
