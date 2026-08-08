import type { CapButtonContract } from './CapButtonContract';
import type {
  CapButtonAnatomySlot,
  CapButtonBorderColors,
  CapButtonGeometry,
  CapButtonNormalizedState,
  CapButtonRootAppearance,
  CapButtonStyleSelections,
} from './CapButtonObservation';
import type {
  CapButtonChildrenInput,
  CapButtonObservationConditions,
  CapButtonScenario,
  CapButtonShape,
  CapButtonSize,
} from './CapButtonScenario';
import type { CapButtonThemeInput } from './CapButtonTheme';
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

interface RestAppearance {
  readonly foreground: string;
  readonly background: string;
  readonly border: string;
}

const enabledAppearance = (
  theme: CapButtonThemeInput
): Readonly<Record<CapButtonScenario['appearance'], RestAppearance>> => ({
  primary: {
    foreground: theme.colorNeutralForegroundOnBrand,
    background: theme.colorBrandBackground,
    border: theme.colorTransparentStroke,
  },
  tint: {
    foreground: theme.colorCompoundBrandForeground1,
    background: theme.colorBrandBackground2,
    border: theme.colorBrandStroke2,
  },
  outline: {
    foreground: theme.colorNeutralForeground3,
    background: theme.colorTransparentBackground,
    border: theme.colorNeutralStroke4,
  },
  secondary: {
    foreground: theme.colorNeutralForeground3,
    background: theme.colorNeutralBackground3,
    border: theme.colorNeutralStroke4,
  },
  subtle: {
    foreground: theme.colorNeutralForeground3,
    background: theme.colorTransparentBackground,
    border: theme.colorTransparentStroke,
  },
  transparent: {
    foreground: theme.colorNeutralForeground3,
    background: theme.colorTransparentBackground,
    border: theme.colorTransparentStroke,
  },
});

const disabledAppearance = (
  theme: CapButtonThemeInput
): Readonly<Record<CapButtonScenario['appearance'], RestAppearance>> => ({
  primary: {
    foreground: theme.colorNeutralForegroundDisabled,
    background: theme.colorNeutralBackgroundDisabled,
    border: theme.colorTransparentStroke,
  },
  tint: {
    foreground: theme.colorNeutralForegroundDisabled,
    background: theme.colorNeutralBackgroundDisabled,
    border: theme.colorNeutralStrokeDisabled,
  },
  outline: {
    foreground: theme.colorNeutralForegroundDisabled,
    background: theme.colorTransparentBackground,
    border: theme.colorNeutralStrokeDisabled,
  },
  secondary: {
    foreground: theme.colorNeutralForegroundDisabled,
    background: theme.colorNeutralBackgroundDisabled,
    border: theme.colorNeutralStrokeDisabled,
  },
  subtle: {
    foreground: theme.colorNeutralForegroundDisabled,
    background: theme.colorTransparentBackground,
    border: theme.colorTransparentStroke,
  },
  transparent: {
    foreground: theme.colorNeutralForegroundDisabled,
    background: theme.colorTransparentBackground,
    border: theme.colorTransparentStroke,
  },
});

const uniformBorder = (color: string): CapButtonBorderColors => ({
  top: color,
  right: color,
  bottom: color,
  left: color,
});

const resolveRootAppearance = (
  normalized: CapButtonNormalizedState,
  theme: CapButtonThemeInput
): CapButtonRootAppearance => {
  const unavailable = normalized.disabled || normalized.disabledFocusable;
  const rest = (
    unavailable ? disabledAppearance(theme) : enabledAppearance(theme)
  )[normalized.appearance];
  const isPrimary =
    normalized.appearance === 'primary' || normalized.appearance === 'tint';

  return {
    foreground: rest.foreground,
    background: rest.background,
    border: uniformBorder(rest.border),
    focusTreatment: {
      selection:
        !normalized.disabledFocusable && isPrimary ? 'primary' : 'base',
      border: uniformBorder(theme.colorStrokeFocus2),
      outline: {
        color: theme.colorStrokeFocus2,
        style: 'solid',
        width: theme.strokeWidthThick,
      },
      innerShadow: `0 0 0 ${theme.strokeWidthThin} ${
        !normalized.disabledFocusable && isPrimary
          ? theme.colorNeutralStrokeOnBrand
          : theme.colorStrokeFocus1
      } inset`,
    },
  };
};

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
  normalized: CapButtonNormalizedState,
  direction: CapButtonObservationConditions['direction']
): CapButtonGeometry => {
  const size = geometryBySize[normalized.size];
  const radius = radiusForShape(normalized.shape, size.roundedRadius);
  const textAndIcon = normalized.hasIcon && normalized.childrenTruthy;
  const paddingInlineStart =
    textAndIcon && normalized.iconPosition === 'before'
      ? size.textAndIconPadding
      : size.paddingInline;
  const paddingInlineEnd =
    textAndIcon && normalized.iconPosition === 'after'
      ? size.textAndIconPadding
      : size.paddingInline;
  const paddingLeft =
    direction === 'rtl' ? paddingInlineEnd : paddingInlineStart;
  const paddingRight =
    direction === 'rtl' ? paddingInlineStart : paddingInlineEnd;

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
            textAndIcon &&
            ((direction === 'ltr' && normalized.iconPosition === 'after') ||
              (direction === 'rtl' && normalized.iconPosition === 'before'))
              ? size.iconSpacing
              : undefined,
          marginRight:
            textAndIcon &&
            ((direction === 'ltr' && normalized.iconPosition === 'before') ||
              (direction === 'rtl' && normalized.iconPosition === 'after'))
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
  conditions: CapButtonObservationConditions,
  theme: CapButtonThemeInput
): CapButtonContract => {
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
    geometry: resolveGeometry(normalized, conditions.direction),
    rootAppearance: resolveRootAppearance(normalized, theme),
    provenance: tracedCapButtonEvidence,
  };
};
