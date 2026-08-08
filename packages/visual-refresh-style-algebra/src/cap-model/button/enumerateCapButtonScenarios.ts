import {
  capButtonAppearances,
  capButtonAuthoredIconPositions,
  capButtonBooleanValues,
  capButtonScopedChildren,
  capButtonShapes,
  capButtonSizes,
  type CapButtonScenario,
} from './CapButtonScenario';

const contentScenarios: readonly CapButtonScenario['content'][] =
  capButtonBooleanValues.flatMap((hasIcon) =>
    capButtonScopedChildren.flatMap((children) =>
      capButtonAuthoredIconPositions.map((iconPosition) => ({
        icon: hasIcon ? 'present' : 'absent',
        children,
        iconPosition,
      }))
    )
  );

export const capButtonScenarios: readonly CapButtonScenario[] =
  capButtonAppearances.flatMap((appearance) =>
    capButtonSizes.flatMap((size) =>
      capButtonShapes.flatMap((shape) =>
        capButtonBooleanValues.flatMap((disabled) =>
          capButtonBooleanValues.flatMap((disabledFocusable) =>
            contentScenarios.map((content) => ({
              appearance,
              size,
              shape,
              disabled,
              disabledFocusable,
              content,
            }))
          )
        )
      )
    )
  );
