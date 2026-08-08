import type { CapButtonContract } from './CapButtonContract';
import type {
  CapButtonAnatomySlot,
  CapButtonGeometry,
  CapButtonNormalizedState,
  CapButtonStyleSelections,
} from './CapButtonObservation';
import type {
  CapButtonChildrenInput,
  CapButtonObservationConditions,
  CapButtonScenario,
  CapButtonShape,
  CapButtonSize,
} from './CapButtonScenario';
import { tracedCapButtonEvidence } from './evidence';

interface ChildSemantics {
  readonly hasChildren: boolean;
  readonly childrenTruthy: boolean;
  readonly rendersContent: boolean;
}

interface SizeGeometry {
  readonly paddingBlock: string;
  readonly paddingInline: string;
  readonly textAndIconPadding: string;
  readonly iconOnlyWidth: string;
  readonly rootFontSize: string;
  readonly rootLineHeight: string;
  readonly iconFontSize: string;
  readonly iconSpacing: string;
  readonly roundedRadius: string;
}

const geometryBySize: Readonly<Record<CapButtonSize, SizeGeometry>> = {
  small: {
    paddingBlock: '5px',
    paddingInline: '10px',
    textAndIconPadding: '8px',
    iconOnlyWidth: '28px',
    rootFontSize: '12px',
    rootLineHeight: '16px',
    iconFontSize: '16px',
    iconSpacing: '4px',
    roundedRadius: '8px',
  },
  medium: {
    paddingBlock: '7px',
    paddingInline: '12px',
    textAndIconPadding: '10px',
    iconOnlyWidth: '36px',
    rootFontSize: '14px',
    rootLineHeight: '20px',
    iconFontSize: '20px',
    iconSpacing: '6px',
    roundedRadius: '12px',
  },
  large: {
    paddingBlock: '9px',
    paddingInline: '16px',
    textAndIconPadding: '14px',
    iconOnlyWidth: '44px',
    rootFontSize: '16px',
    rootLineHeight: '22px',
    iconFontSize: '24px',
    iconSpacing: '8px',
    roundedRadius: '12px',
  },
};

const radiusForShape = (
  shape: CapButtonShape,
  roundedRadius: string
): string => {
  switch (shape) {
    case 'rounded':
      return roundedRadius;
    case 'circular':
      return '10000px';
    case 'square':
      return '0';
  }
};

const resolveGeometry = (
  normalized: CapButtonNormalizedState
): CapButtonGeometry => {
  const size = geometryBySize[normalized.size];
  const radius = radiusForShape(normalized.shape, size.roundedRadius);
  const textAndIcon = normalized.hasIcon && normalized.childrenTruthy;
  const paddingLeft =
    textAndIcon && normalized.iconPosition === 'before'
      ? size.textAndIconPadding
      : size.paddingInline;
  const paddingRight =
    textAndIcon && normalized.iconPosition === 'after'
      ? size.textAndIconPadding
      : size.paddingInline;

  return {
    root: {
      paddingTop: size.paddingBlock,
      paddingRight: normalized.iconOnly ? size.paddingBlock : paddingRight,
      paddingBottom: size.paddingBlock,
      paddingLeft: normalized.iconOnly ? size.paddingBlock : paddingLeft,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      minWidth: normalized.iconOnly ? size.iconOnlyWidth : undefined,
      maxWidth: normalized.iconOnly ? size.iconOnlyWidth : undefined,
      fontSize: size.rootFontSize,
      fontWeight: '600',
      lineHeight: size.rootLineHeight,
    },
    icon: normalized.hasIcon
      ? {
          fontSize: size.iconFontSize,
          marginLeft:
            textAndIcon && normalized.iconPosition === 'after'
              ? size.iconSpacing
              : undefined,
          marginRight:
            textAndIcon && normalized.iconPosition === 'before'
              ? size.iconSpacing
              : undefined,
        }
      : undefined,
  };
};

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
    geometry: resolveGeometry(normalized),
    provenance: tracedCapButtonEvidence,
  };
};
