import type { ButtonCase, CompositionContext } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { shapePolicy } from '../domain/policies';

type Shape = ButtonStyleContract['shape'];

const standaloneShape = (radius: number): Shape => ({
  radiusStartStart: radius,
  radiusStartEnd: radius,
  radiusEndStart: radius,
  radiusEndEnd: radius,
});

const joinedShape = (
  radius: number,
  compositionContext: Extract<
    CompositionContext,
    'splitButtonStart' | 'splitButtonEnd'
  >,
  direction: ButtonCase['direction']
): Shape => {
  const outerEdgeIsStart =
    (compositionContext === 'splitButtonStart' && direction === 'ltr') ||
    (compositionContext === 'splitButtonEnd' && direction === 'rtl');

  return outerEdgeIsStart
    ? {
        radiusStartStart: radius,
        radiusStartEnd: 0,
        radiusEndStart: radius,
        radiusEndEnd: 0,
      }
    : {
        radiusStartStart: 0,
        radiusStartEnd: radius,
        radiusEndStart: 0,
        radiusEndEnd: radius,
      };
};

export const resolveShape = (input: ButtonCase): Shape => {
  const radius = shapePolicy[input.visualLanguage];

  return input.compositionContext === 'splitButtonStart' ||
    input.compositionContext === 'splitButtonEnd'
    ? joinedShape(radius, input.compositionContext, input.direction)
    : standaloneShape(radius);
};
