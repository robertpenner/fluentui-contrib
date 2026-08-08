import type { CapButtonContract } from './CapButtonContract';
import type {
  CapButtonAnatomySlot,
  CapButtonNormalizedState,
  CapButtonStyleSelections,
} from './CapButtonObservation';
import type {
  CapButtonChildrenInput,
  CapButtonObservationConditions,
  CapButtonScenario,
} from './CapButtonScenario';
import { tracedCapButtonEvidence } from './evidence';

interface ChildSemantics {
  readonly hasChildren: boolean;
  readonly childrenTruthy: boolean;
  readonly rendersContent: boolean;
}

const resolveChildSemantics = (
  children: CapButtonChildrenInput
): ChildSemantics => {
  switch (children) {
    case 'absent':
      return {
        hasChildren: false,
        childrenTruthy: false,
        rendersContent: false,
      };
    case 'present':
    case 'react.whitespace':
      return {
        hasChildren: true,
        childrenTruthy: true,
        rendersContent: true,
      };
    case 'react.emptyFragment':
      return {
        hasChildren: true,
        childrenTruthy: true,
        rendersContent: false,
      };
    case 'react.null':
    case 'react.false':
    case 'react.zero':
    case 'react.emptyString':
      return {
        hasChildren: true,
        childrenTruthy: false,
        rendersContent: false,
      };
  }
};

const resolveAnatomy = (
  normalized: CapButtonNormalizedState,
  rendersContent: boolean
): readonly CapButtonAnatomySlot[] => {
  if (!normalized.hasIcon) {
    return rendersContent ? ['content'] : [];
  }

  if (!rendersContent) {
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
    : normalized.hasIcon && normalized.childrenTruthy
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
          position: normalized.childrenTruthy
            ? normalized.iconPosition
            : 'none',
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
  const childSemantics = resolveChildSemantics(scenario.content.children);
  const normalized: CapButtonNormalizedState = {
    appearance: scenario.appearance,
    size: scenario.size,
    shape: scenario.shape,
    disabled: scenario.disabled,
    disabledFocusable: scenario.disabledFocusable,
    iconPosition:
      scenario.content.iconPosition === 'omitted'
        ? 'before'
        : scenario.content.iconPosition,
    iconOnly: hasIcon && !childSemantics.childrenTruthy,
    hasIcon,
    hasChildren: childSemantics.hasChildren,
    childrenTruthy: childSemantics.childrenTruthy,
  };

  return {
    normalized,
    anatomy: resolveAnatomy(normalized, childSemantics.rendersContent),
    styleSelections: resolveStyleSelections(scenario, normalized),
    provenance: tracedCapButtonEvidence,
  };
};
