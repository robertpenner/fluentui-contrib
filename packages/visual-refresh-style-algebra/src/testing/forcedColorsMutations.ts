import type { ButtonCase } from '../domain/ButtonCase';
import type { ForcedColorsContract } from '../domain/ForcedColorsContract';
import { emitForcedColors } from '../emission/emitForcedColors';
import type {
  EmissionResult,
  ForcedColorsEmissionTarget,
} from '../emission/ForcedColorsEmission';
import { normalizeForcedColorsEmission } from '../emission/normalizeForcedColorsEmission';
import { resolveForcedColorsContract } from '../semantic/resolveForcedColorsContract';

export type ForcedColorsSemanticMutation =
  | 'none'
  | 'loseVisibleBoundary'
  | 'disabledMatchesEnabled';

export type ForcedColorsEmissionMutation =
  | 'none'
  | 'extensionOmitsFocus'
  | 'mergeDifferentSelectors'
  | 'mergeConflictingPrecedence';

export const resolveForcedColorsWithMutation = (
  input: ButtonCase,
  mutation: ForcedColorsSemanticMutation
): ForcedColorsContract => {
  const contract = resolveForcedColorsContract(input);

  switch (mutation) {
    case 'none':
      return contract;
    case 'loseVisibleBoundary':
      return { ...contract, visibleBoundary: false };
    case 'disabledMatchesEnabled':
      return input.interactionState === 'disabled'
        ? {
            ...contract,
            foregroundRole: 'ButtonText',
            borderRole: 'ButtonBorder',
            disabledDistinguishable: false,
          }
        : contract;
  }
};

export const emitForcedColorsWithMutation = (
  contract: ForcedColorsContract,
  target: ForcedColorsEmissionTarget,
  mutation: ForcedColorsEmissionMutation
): EmissionResult => {
  const emitted = emitForcedColors(contract, target);
  if (mutation === 'extensionOmitsFocus' && target.component !== 'Button') {
    return {
      ...emitted,
      rules: emitted.rules.filter(
        (rule) => rule.semanticDecision !== 'focusIndicator'
      ),
    };
  }
  return emitted;
};

export const normalizeForcedColorsWithMutation = (
  result: EmissionResult,
  mutation: ForcedColorsEmissionMutation
): EmissionResult => {
  if (
    (mutation !== 'mergeDifferentSelectors' &&
      mutation !== 'mergeConflictingPrecedence') ||
    result.rules.length < 2
  ) {
    return normalizeForcedColorsEmission(result);
  }

  const [first, second, ...rest] = result.rules;
  return {
    rules: [
      {
        ...first,
        declarations: { ...first.declarations, ...second.declarations },
        sourceRules: [...first.sourceRules, ...second.sourceRules],
      },
      ...rest,
    ],
    diagnostics: [
      {
        kind: 'merged',
        ruleIndexes: [0, 1],
        blockedBy: [],
        explanation: `Teaching fault: ${mutation} discards a modeled cascade dimension.`,
      },
    ],
  };
};
