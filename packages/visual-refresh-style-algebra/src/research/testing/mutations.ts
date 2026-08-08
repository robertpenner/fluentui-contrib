import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';

export type ResearchMutation =
  | 'none'
  | 'eraseFocusVisibility'
  | 'unsupportedAppearanceFallback'
  | 'loseAccessibleNameSource'
  | 'failRtlPaddingMirror'
  | 'leakProductColorIntoForcedColors'
  | 'compactDensityChangesColor'
  | 'incorrectRtlSplitEndRadius';

export const resolveButtonWithMutation = (
  input: ButtonCase,
  mutation: ResearchMutation = 'none'
): ButtonStyleContract => {
  if (mutation === 'unsupportedAppearanceFallback') {
    try {
      return resolveSemanticButton(input);
    } catch {
      const fallback = resolveSemanticButton({
        ...input,
        appearance: 'primary',
      });
      fallback.provenance = [
        ...fallback.provenance,
        {
          rule: 'mutation-unsupported-appearance-fallback',
          fields: ['supportedDomain.appearanceSupported', 'appearance'],
          explanation:
            'Teaching fault: silently reuse primary when the requested appearance is unsupported',
          evidence: 'modelAssumption',
        },
      ];
      return fallback;
    }
  }

  const contract = resolveSemanticButton(input);
  switch (mutation) {
    case 'none':
      return contract;
    case 'eraseFocusVisibility':
      if (input.interactionState === 'focusVisible') {
        contract.focus.visible = false;
      }
      return contract;
    case 'loseAccessibleNameSource':
      if (input.contentKind === 'iconOnly') {
        contract.anatomy.accessibleNameSource = 'text';
      }
      return contract;
    case 'failRtlPaddingMirror':
      if (input.direction === 'rtl' && input.contentKind === 'textAndIcon') {
        const ltrGeometry = resolveSemanticButton({
          ...input,
          direction: 'ltr',
        }).geometry;
        contract.geometry.paddingInlineStart = ltrGeometry.paddingInlineStart;
        contract.geometry.paddingInlineEnd = ltrGeometry.paddingInlineEnd;
      }
      return contract;
    case 'leakProductColorIntoForcedColors':
      if (input.colorMode === 'forcedColors') {
        contract.appearance.backgroundRole = 'brandBackground';
      }
      return contract;
    case 'compactDensityChangesColor':
      if (input.density === 'compact') {
        contract.appearance.foregroundRole = 'focusStroke';
      }
      return contract;
    case 'incorrectRtlSplitEndRadius':
      if (
        input.direction === 'rtl' &&
        input.compositionContext === 'splitButtonEnd'
      ) {
        contract.shape.radiusStartStart = 0;
        contract.shape.radiusEndStart = 0;
      }
      return contract;
  }
};
