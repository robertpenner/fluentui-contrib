import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { blockSizePolicy, spacingPolicy } from '../domain/policies';

type Geometry = ButtonStyleContract['geometry'];

const resolvePadding = (
  input: Pick<
    ButtonCase,
    'contentKind' | 'density' | 'direction' | 'iconPlacement'
  >
): Pick<Geometry, 'paddingInlineStart' | 'paddingInlineEnd'> => {
  const compactAdjustment =
    input.density === 'compact' ? spacingPolicy.compactDelta : 0;

  if (input.contentKind === 'iconOnly') {
    const padding = spacingPolicy.iconOnlyPadding - compactAdjustment;
    return { paddingInlineStart: padding, paddingInlineEnd: padding };
  }

  const textPadding = spacingPolicy.textPadding - compactAdjustment;
  if (input.contentKind === 'text') {
    return { paddingInlineStart: textPadding, paddingInlineEnd: textPadding };
  }

  const adjacentPadding = spacingPolicy.iconAdjacentPadding - compactAdjustment;
  const iconIsAtLogicalStart =
    (input.iconPlacement === 'before' && input.direction === 'ltr') ||
    (input.iconPlacement === 'after' && input.direction === 'rtl');

  return iconIsAtLogicalStart
    ? { paddingInlineStart: adjacentPadding, paddingInlineEnd: textPadding }
    : { paddingInlineStart: textPadding, paddingInlineEnd: adjacentPadding };
};

export const resolveGeometry = (input: ButtonCase): Geometry => ({
  blockSize:
    blockSizePolicy[input.visualLanguage][input.product][input.density],
  minInlineSize: Math.max(
    spacingPolicy.minInlineSize,
    blockSizePolicy[input.visualLanguage][input.product][input.density]
  ),
  ...resolvePadding(input),
  gap: input.contentKind === 'textAndIcon' ? spacingPolicy.gap : 0,
});
