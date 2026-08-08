import type { CapButtonContract } from './CapButtonContract';
import type {
  CapButtonAnatomySlot,
  CapButtonNormalizedState,
  CapButtonStyleSelections,
} from './CapButtonObservation';
import type {
  CapButtonObservationConditions,
  CapButtonScenario,
} from './CapButtonScenario';
import { tracedCapButtonEvidence } from './evidence';

const resolveAnatomy = (
  normalized: CapButtonNormalizedState
): readonly CapButtonAnatomySlot[] => {
  if (!normalized.hasIcon) {
    return normalized.hasChildren ? ['content'] : [];
  }

  if (!normalized.hasChildren) {
    return ['icon'];
  }

  return normalized.iconPosition === 'before'
    ? ['icon', 'content']
    : ['content', 'icon'];
};

const resolveStyleSelections = (
  scenario: CapButtonScenario,
  normalized: CapButtonNormalizedState
): CapButtonStyleSelections => {
  const isPrimary =
    scenario.appearance === 'primary' || scenario.appearance === 'tint';
  const content = normalized.iconOnly
    ? 'iconOnly'
    : normalized.hasIcon && normalized.hasChildren
    ? (`textAndIcon.${normalized.iconPosition}` as const)
    : 'base';

  return {
    root: {
      appearance: scenario.appearance,
      size: scenario.size,
      shape: scenario.shape,
      availability:
        scenario.disabled || scenario.disabledFocusable
          ? 'disabled'
          : 'enabled',
      focus: !scenario.disabledFocusable && isPrimary ? 'primary' : 'base',
      content,
    },
    icon: normalized.hasIcon
      ? {
          size: scenario.size,
          position: normalized.hasChildren ? normalized.iconPosition : 'none',
        }
      : undefined,
  };
};

export const resolveCleanRoomCapButton = (
  scenario: CapButtonScenario,
  conditions: CapButtonObservationConditions
): CapButtonContract => {
  void conditions;
  const hasIcon = scenario.content.icon === 'present';
  const hasChildren = scenario.content.children === 'present';
  const normalized: CapButtonNormalizedState = {
    iconPosition:
      scenario.content.iconPosition === 'omitted'
        ? 'before'
        : scenario.content.iconPosition,
    iconOnly: hasIcon && !hasChildren,
    hasIcon,
    hasChildren,
  };

  return {
    normalized,
    anatomy: resolveAnatomy(normalized),
    styleSelections: resolveStyleSelections(scenario, normalized),
    provenance: tracedCapButtonEvidence,
  };
};
