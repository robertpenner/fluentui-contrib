import type { ButtonCase } from '../domain/ButtonCase';
import type { ValidationObligation } from '../domain/ValidationObligation';

export const deriveValidationObligations = (
  input: ButtonCase
): readonly ValidationObligation[] => {
  const obligations = new Set<ValidationObligation>([
    'nativeButtonSemantics',
    'focusVisibility',
    'stateCompleteness',
    'textOverflow',
  ]);

  if (
    input.colorMode === 'forcedColors' ||
    input.visualLanguage === 'visualRefresh'
  ) {
    obligations.add('forcedColorsBehavior');
  }
  if (
    input.contentKind === 'iconOnly' ||
    input.anatomyPolicy === 'visualRefreshReconstructed'
  ) {
    obligations.add('accessibleNaming');
  }
  if (
    input.compositionContext === 'splitButtonStart' ||
    input.compositionContext === 'splitButtonEnd'
  ) {
    obligations.add('compoundGeometry');
  }

  return [...obligations];
};
