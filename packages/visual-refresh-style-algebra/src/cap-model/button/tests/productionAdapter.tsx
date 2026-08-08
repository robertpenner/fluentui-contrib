import * as React from 'react';
import { render } from '@testing-library/react';
import {
  renderButton_unstable,
  type ButtonProps,
  useButton_unstable,
} from '@fluentui/react-components';
import { CAP_STYLE_HOOKS } from '@fluentui-contrib/react-cap-theme';
import { capTheme } from '../../../fixtures/capButtonFamily';
import {
  capColors,
  capGeometry,
  observeCapSurface,
} from '../../../observation/capSurface';
import {
  resolveThemeValues,
  type ButtonSurfaceObservation,
} from '../../../observation/observeButtonSurface';
import type {
  CapButtonAnatomySlot,
  CapButtonBorderColors,
  CapButtonGeometry,
  CapButtonNormalizedState,
  CapButtonObservation,
  CapButtonRootAppearance,
  CapButtonStyleSelections,
} from '../CapButtonObservation';
import type {
  CapButtonChildrenInput,
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

const observationIndexAttribute = 'data-cap-model-observation-index';
const normalizedAttribute = 'data-cap-model-normalized';
const styleSelectionsAttribute = 'data-cap-model-style-selections';
const slotAttribute = 'data-cap-model-slot';

const capThemeValues = capTheme as unknown as Readonly<Record<string, string>>;

const classNames = (className: string | undefined): ReadonlySet<string> =>
  new Set(className?.split(/\s+/).filter(Boolean));

const hasAddedClass = (
  before: ReadonlySet<string>,
  after: ReadonlySet<string>
): boolean => [...after].some((className) => !before.has(className));

const childNode = (children: CapButtonChildrenInput): React.ReactNode => {
  switch (children) {
    case 'absent':
      return undefined;
    case 'present':
      return <span {...{ [slotAttribute]: 'content' }}>Action</span>;
    case 'react.null':
      return null;
    case 'react.false':
      return false;
    case 'react.zero':
      return 0;
    case 'react.emptyString':
      return '';
    case 'react.emptyFragment':
      return <></>;
    case 'react.whitespace':
      return ' ';
  }
};

const scenarioProps = (scenario: CapButtonScenario): ButtonProps => ({
  appearance: scenario.appearance as ButtonProps['appearance'],
  size: scenario.size,
  shape: scenario.shape,
  disabled: scenario.disabled,
  disabledFocusable: scenario.disabledFocusable,
  icon:
    scenario.content.icon === 'present' ? (
      <span {...{ [slotAttribute]: 'icon' }} aria-hidden="true" />
    ) : undefined,
  children: childNode(scenario.content.children),
  iconPosition:
    scenario.content.iconPosition === 'omitted'
      ? undefined
      : scenario.content.iconPosition,
});

const observeStyleSelections = (
  scenario: CapButtonScenario,
  state: ReturnType<typeof useButton_unstable>
): CapButtonStyleSelections => {
  const isPrimary =
    scenario.appearance === 'primary' || scenario.appearance === 'tint';
  const childrenTruthy = Boolean(state.root.children);
  const content = state.iconOnly
    ? 'iconOnly'
    : state.icon && childrenTruthy
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
          position: childrenTruthy ? state.iconPosition : 'none',
        }
      : undefined,
  };
};

interface ProductionObservationProbeProps {
  readonly scenario: CapButtonScenario;
  readonly index: number;
}

const ProductionObservationProbe = (
  props: ProductionObservationProbeProps
): React.ReactElement => {
  const { scenario, index } = props;
  const state = useButton_unstable(scenarioProps(scenario), React.createRef());
  const rootClassesBeforeCap = classNames(state.root.className);
  const iconClassesBeforeCap = classNames(state.icon?.className);

  CAP_STYLE_HOOKS.useButtonStyles_unstable?.(state);

  if (!hasAddedClass(rootClassesBeforeCap, classNames(state.root.className))) {
    throw new Error('CAP Button styling did not add a root class');
  }
  if (
    state.icon &&
    !hasAddedClass(iconClassesBeforeCap, classNames(state.icon.className))
  ) {
    throw new Error('CAP Button styling did not add an icon class');
  }

  const normalized: CapButtonNormalizedState = {
    appearance: scenario.appearance,
    size: state.size,
    shape: state.shape,
    disabled: state.disabled,
    disabledFocusable: state.disabledFocusable,
    iconPosition: state.iconPosition,
    iconOnly: state.iconOnly,
    hasIcon: state.icon !== undefined,
    hasChildren: state.root.children !== undefined,
    childrenTruthy: Boolean(state.root.children),
  };

  Object.assign(state.root, {
    [observationIndexAttribute]: String(index),
    [normalizedAttribute]: JSON.stringify(normalized),
    [styleSelectionsAttribute]: JSON.stringify(
      observeStyleSelections(scenario, state)
    ),
  });

  return renderButton_unstable(state);
};

const parseAttribute = <T,>(element: HTMLElement, name: string): T => {
  const value = element.getAttribute(name);

  if (value === null) {
    throw new Error(`Production Button observation is missing ${name}`);
  }

  return JSON.parse(value) as T;
};

const observeAnatomy = (
  button: HTMLElement
): readonly CapButtonAnatomySlot[] => {
  const icon = button.querySelector(`[${slotAttribute}="icon"]`)?.parentElement;

  return [...button.childNodes].flatMap(
    (node): readonly CapButtonAnatomySlot[] => {
      if (node === icon) {
        return ['icon'];
      }

      return (node.textContent ?? '').length > 0 ? ['content'] : [];
    }
  );
};

const normalizedGeometryDeclarations = (
  element: HTMLElement,
  observation: ButtonSurfaceObservation = observeCapSurface(element)
): Readonly<Record<string, string>> => {
  const effective = observation.effective.ordinary.rest;
  const themeResolved = resolveThemeValues(effective, capThemeValues);
  const customProperties = Object.fromEntries(
    Object.entries(themeResolved)
      .filter(([property]) => property.startsWith('--'))
      .map(([property, value]) => [property.slice(2), value])
  );

  const declarations = resolveThemeValues(capGeometry(effective), {
    ...capThemeValues,
    ...customProperties,
  });
  const padding = declarations.padding?.split(/\s+/);

  if (padding === undefined) {
    return declarations;
  }

  const [top, right = top, bottom = top, left = right] = padding;

  return {
    ...declarations,
    'padding-top': declarations['padding-top'] ?? top,
    'padding-right': declarations['padding-right'] ?? right,
    'padding-bottom': declarations['padding-bottom'] ?? bottom,
    'padding-left': declarations['padding-left'] ?? left,
  };
};

const requiredDeclaration = (
  declarations: Readonly<Record<string, string>>,
  property: string
): string => {
  const value = declarations[property];

  if (value === undefined) {
    throw new Error(`Production Button geometry is missing ${property}`);
  }

  return value;
};

const radiusDeclaration = (
  declarations: Readonly<Record<string, string>>,
  property: string
): string =>
  declarations[property] ?? requiredDeclaration(declarations, 'border-radius');

const borderColors = (
  declarations: Readonly<Record<string, string>>
): CapButtonBorderColors => {
  const borderColor = declarations['border']?.split(/\s+/).at(-1);
  const shorthand =
    declarations['border-color']?.split(/\s+/) ??
    (borderColor === undefined ? undefined : [borderColor]);
  const [top, right = top, bottom = top, left = right] = shorthand ?? [];

  return {
    top:
      declarations['border-top-color'] ?? requiredDeclaration({ top }, 'top'),
    right:
      declarations['border-right-color'] ??
      requiredDeclaration({ right }, 'right'),
    bottom:
      declarations['border-bottom-color'] ??
      requiredDeclaration({ bottom }, 'bottom'),
    left:
      declarations['border-left-color'] ??
      requiredDeclaration({ left }, 'left'),
  };
};

const observeRootAppearance = (
  observation: ButtonSurfaceObservation,
  focusSelection: CapButtonStyleSelections['root']['focus']
): CapButtonRootAppearance => {
  const restSurface = observation.effective.ordinary.rest;
  const rest = capColors(restSurface);
  const resolvedRest = resolveThemeValues(restSurface, capThemeValues);
  const focusVisible = observation.effective.ordinary.focusVisible;
  const focusColors = capColors(focusVisible);
  const resolvedFocus = resolveThemeValues(focusVisible, capThemeValues);

  return {
    foreground: requiredDeclaration(rest, 'color'),
    background: requiredDeclaration(rest, 'background-color'),
    border: borderColors({ ...resolvedRest, ...rest }),
    focusTreatment: {
      selection: focusSelection,
      border: borderColors({ ...resolvedFocus, ...focusColors }),
      outline: {
        color: requiredDeclaration(focusColors, 'outline-color'),
        style: requiredDeclaration(resolvedFocus, 'outline-style'),
        width: requiredDeclaration(resolvedFocus, 'outline-width'),
      },
      innerShadow: requiredDeclaration(resolvedFocus, 'box-shadow'),
    },
  };
};

const observeGeometry = (
  button: HTMLElement,
  rootObservation: ButtonSurfaceObservation
): CapButtonGeometry => {
  const root = normalizedGeometryDeclarations(button, rootObservation);
  const iconElement = button.querySelector<HTMLElement>(
    `[${slotAttribute}="icon"]`
  )?.parentElement;
  const icon = iconElement
    ? normalizedGeometryDeclarations(iconElement)
    : undefined;

  return {
    root: {
      paddingTop: requiredDeclaration(root, 'padding-top'),
      paddingRight: requiredDeclaration(root, 'padding-right'),
      paddingBottom: requiredDeclaration(root, 'padding-bottom'),
      paddingLeft: requiredDeclaration(root, 'padding-left'),
      borderTopLeftRadius: radiusDeclaration(root, 'border-top-left-radius'),
      borderTopRightRadius: radiusDeclaration(root, 'border-top-right-radius'),
      borderBottomRightRadius: radiusDeclaration(
        root,
        'border-bottom-right-radius'
      ),
      borderBottomLeftRadius: radiusDeclaration(
        root,
        'border-bottom-left-radius'
      ),
      minWidth: root['min-width'],
      maxWidth: root['max-width'],
      fontSize: requiredDeclaration(root, 'font-size'),
      fontWeight: requiredDeclaration(root, 'font-weight'),
      lineHeight: requiredDeclaration(root, 'line-height'),
    },
    icon: icon
      ? {
          fontSize: requiredDeclaration(icon, 'font-size'),
          marginLeft: icon['margin-left'],
          marginRight: icon['margin-right'],
        }
      : undefined,
  };
};

export const observeCapButtonProductionScenarios = (
  scenarios: readonly CapButtonScenario[],
  conditions: CapButtonObservationConditions
): readonly CapButtonObservation[] => {
  const rendered = render(
    <>
      {scenarios.map((scenario, index) => (
        <ProductionObservationProbe
          key={`${index}-${scenario.appearance}-${scenario.size}-${scenario.shape}`}
          scenario={scenario}
          index={index}
        />
      ))}
    </>
  );
  const buttons = [
    ...rendered.container.querySelectorAll<HTMLElement>(
      `[${observationIndexAttribute}]`
    ),
  ];

  if (buttons.length !== scenarios.length) {
    rendered.unmount();
    throw new Error(
      `Observed ${buttons.length} production Buttons for ${scenarios.length} scenarios`
    );
  }

  const observations = buttons.map((button): CapButtonObservation => {
    const index = Number(button.getAttribute(observationIndexAttribute));
    const styleSelections = parseAttribute<CapButtonStyleSelections>(
      button,
      styleSelectionsAttribute
    );
    const rootObservation = observeCapSurface(button);

    return {
      productionBaseline: capButtonProductionBaseline.id,
      scenario: scenarios[index],
      conditions,
      normalized: parseAttribute<CapButtonNormalizedState>(
        button,
        normalizedAttribute
      ),
      anatomy: observeAnatomy(button),
      styleSelections,
      geometry: observeGeometry(button, rootObservation),
      rootAppearance: observeRootAppearance(
        rootObservation,
        styleSelections.root.focus
      ),
    };
  });

  rendered.unmount();
  return observations;
};

export const observeCapButtonProduction = (
  scenario: CapButtonScenario,
  conditions: CapButtonObservationConditions
): CapButtonObservation =>
  observeCapButtonProductionScenarios([scenario], conditions)[0];
