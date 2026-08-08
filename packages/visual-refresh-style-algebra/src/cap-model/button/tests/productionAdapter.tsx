import * as React from 'react';
import { renderHook } from '@testing-library/react';
import {
  type ButtonProps,
  useButton_unstable,
} from '@fluentui/react-components';
import { CAP_STYLE_HOOKS } from '@fluentui-contrib/react-cap-theme';
import type {
  CapButtonObservation,
  CapButtonStyleSelections,
} from '../CapButtonObservation';
import type {
  CapButtonObservationConditions,
  CapButtonScenario,
} from '../CapButtonScenario';
import { capButtonProductionBaseline } from '../evidence';

export const tracedCapButtonScenario: CapButtonScenario = {
  appearance: 'primary',
  size: 'medium',
  shape: 'rounded',
  disabled: false,
  disabledFocusable: false,
  content: {
    icon: 'present',
    children: 'present',
    iconPosition: 'omitted',
  },
};

export const tracedCapButtonConditions: CapButtonObservationConditions = {
  hover: false,
  active: false,
  focusVisible: false,
  forcedColors: false,
  prefersReducedMotion: false,
  direction: 'ltr',
};

const classNames = (className: string | undefined): ReadonlySet<string> =>
  new Set(className?.split(/\s+/).filter(Boolean));

const hasAddedClass = (
  before: ReadonlySet<string>,
  after: ReadonlySet<string>
): boolean => [...after].some((className) => !before.has(className));

const observeStyleSelections = (
  scenario: CapButtonScenario,
  state: ReturnType<typeof useButton_unstable>
): CapButtonStyleSelections => {
  const isPrimary =
    scenario.appearance === 'primary' || scenario.appearance === 'tint';
  const hasChildren = state.root.children !== undefined;
  const content = state.iconOnly
    ? 'iconOnly'
    : state.icon && hasChildren
    ? (`textAndIcon.${state.iconPosition}` as const)
    : 'base';

  return {
    root: {
      appearance: scenario.appearance,
      size: state.size,
      shape: state.shape,
      availability:
        state.disabled || state.disabledFocusable ? 'disabled' : 'enabled',
      focus: !state.disabledFocusable && isPrimary ? 'primary' : 'base',
      content,
    },
    icon: state.icon
      ? {
          size: state.size,
          position: hasChildren ? state.iconPosition : 'none',
        }
      : undefined,
  };
};

export const observeCapButtonProduction = (
  scenario: CapButtonScenario,
  conditions: CapButtonObservationConditions
): CapButtonObservation => {
  const props: ButtonProps = {
    appearance: scenario.appearance as ButtonProps['appearance'],
    size: scenario.size,
    shape: scenario.shape,
    disabled: scenario.disabled,
    disabledFocusable: scenario.disabledFocusable,
    icon:
      scenario.content.icon === 'present' ? (
        <span aria-hidden="true" />
      ) : undefined,
    children: scenario.content.children === 'present' ? 'Action' : undefined,
    iconPosition:
      scenario.content.iconPosition === 'omitted'
        ? undefined
        : scenario.content.iconPosition,
  };
  const { result, unmount } = renderHook(() => {
    const state = useButton_unstable(props, React.createRef());
    const rootClassesBeforeCap = classNames(state.root.className);
    const iconClassesBeforeCap = classNames(state.icon?.className);

    CAP_STYLE_HOOKS.useButtonStyles_unstable?.(state);

    return { state, rootClassesBeforeCap, iconClassesBeforeCap };
  });
  const { state, rootClassesBeforeCap, iconClassesBeforeCap } = result.current;

  if (!hasAddedClass(rootClassesBeforeCap, classNames(state.root.className))) {
    unmount();
    throw new Error('CAP Button styling did not add a root class');
  }
  if (
    state.icon &&
    !hasAddedClass(iconClassesBeforeCap, classNames(state.icon.className))
  ) {
    unmount();
    throw new Error('CAP Button styling did not add an icon class');
  }

  const hasIcon = state.icon !== undefined;
  const hasChildren = state.root.children !== undefined;
  const observation: CapButtonObservation = {
    productionBaseline: capButtonProductionBaseline.id,
    scenario,
    conditions,
    normalized: {
      iconPosition: state.iconPosition,
      iconOnly: state.iconOnly,
      hasIcon,
      hasChildren,
    },
    anatomy:
      hasIcon && hasChildren
        ? state.iconPosition === 'before'
          ? ['icon', 'content']
          : ['content', 'icon']
        : hasIcon
        ? ['icon']
        : hasChildren
        ? ['content']
        : [],
    styleSelections: observeStyleSelections(scenario, state),
  };

  unmount();
  return observation;
};
