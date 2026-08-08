import type { ButtonCase, ContentKind, IconPlacement } from './ButtonCase';
import { isAppearanceSupported } from './SupportedDomain';

const validIconPlacements: Readonly<
  Record<ContentKind, readonly IconPlacement[]>
> = {
  text: ['none'],
  iconOnly: ['only'],
  textAndIcon: ['before', 'after'],
};

export type InvalidButtonCaseReason =
  | 'unsupportedAppearance'
  | 'contentIconMismatch'
  | 'reconstructedAnatomyRequiresVisualRefresh';

export const invalidButtonCaseReasons = (
  input: ButtonCase
): readonly InvalidButtonCaseReason[] => {
  const reasons: InvalidButtonCaseReason[] = [];

  if (!isAppearanceSupported(input)) {
    reasons.push('unsupportedAppearance');
  }

  if (!validIconPlacements[input.contentKind].includes(input.iconPlacement)) {
    reasons.push('contentIconMismatch');
  }

  if (
    input.anatomyPolicy === 'visualRefreshReconstructed' &&
    input.visualLanguage !== 'visualRefresh'
  ) {
    reasons.push('reconstructedAnatomyRequiresVisualRefresh');
  }

  return reasons;
};

export const isValidButtonCase = (input: ButtonCase): boolean =>
  invalidButtonCaseReasons(input).length === 0;

export const assertValidButtonCase = (input: ButtonCase): void => {
  const reasons = invalidButtonCaseReasons(input);

  if (reasons.length > 0) {
    throw new Error(
      `Invalid ButtonCase (${reasons.join(', ')}): ${JSON.stringify(input)}`
    );
  }
};
