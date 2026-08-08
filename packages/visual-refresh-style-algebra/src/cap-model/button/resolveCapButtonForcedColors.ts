import type { CapButtonInteractionAvailability } from './CapButtonInteraction';
import type {
  CapButtonForcedColorsAuthoredContract,
  CapButtonForcedColorsCondition,
  CapButtonForcedColorsContract,
  CapButtonForcedColorsEffectiveContract,
  CapButtonSystemColorKeyword,
} from './CapButtonForcedColors';
import type { CapButtonAppearance } from './CapButtonScenario';
import { capButtonForcedColorsRuntimeEvidence } from './evidence';

const uniform = <Value>(value: Value) => ({
  top: value,
  right: value,
  bottom: value,
  left: value,
});

const primaryAppearances: ReadonlySet<CapButtonAppearance> = new Set([
  'primary',
  'tint',
]);

export const capButtonChromiumSystemColorPaint: Readonly<
  Record<CapButtonSystemColorKeyword, string>
> = {
  ButtonBorder: '#000000',
  ButtonFace: '#ffffff',
  GrayText: '#600000',
  Highlight: '#050049',
  HighlightText: '#ffffff',
};

const authoredContract = (
  appearance: CapButtonAppearance,
  availability: CapButtonInteractionAvailability,
  focusVisible: boolean
): CapButtonForcedColorsAuthoredContract => {
  const primary = primaryAppearances.has(appearance);
  const disabled = availability !== 'enabled';
  const focused = focusVisible && availability !== 'disabled';
  const restBorder: CapButtonSystemColorKeyword | null = disabled
    ? 'GrayText'
    : primary
    ? 'Highlight'
    : null;
  const focusBorder: CapButtonSystemColorKeyword =
    availability === 'enabled' && primary ? 'ButtonFace' : 'Highlight';

  return {
    forcedColorAdjust: primary ? 'none' : null,
    foreground: disabled ? 'GrayText' : primary ? 'HighlightText' : null,
    background: disabled ? 'ButtonFace' : primary ? 'Highlight' : null,
    border: uniform(focused ? focusBorder : restBorder),
    focus: {
      outline: focused
        ? availability === 'enabled' && primary
          ? 'ButtonBorder'
          : 'Highlight'
        : null,
      innerShadow: focused ? 'ButtonFace' : null,
    },
  };
};

const effectiveContract = (
  appearance: CapButtonAppearance,
  availability: CapButtonInteractionAvailability,
  focusVisible: boolean
): CapButtonForcedColorsEffectiveContract => {
  const primary = primaryAppearances.has(appearance);
  const disabled = availability !== 'enabled';
  const focused = focusVisible && availability !== 'disabled';
  const foreground = disabled
    ? capButtonChromiumSystemColorPaint.GrayText
    : primary
    ? capButtonChromiumSystemColorPaint.HighlightText
    : '#000000';
  const background =
    disabled || !primary
      ? capButtonChromiumSystemColorPaint.ButtonFace
      : capButtonChromiumSystemColorPaint.Highlight;
  const restBorder = disabled
    ? capButtonChromiumSystemColorPaint.GrayText
    : primary
    ? capButtonChromiumSystemColorPaint.Highlight
    : capButtonChromiumSystemColorPaint.ButtonBorder;
  const focusBorder =
    availability === 'enabled' && primary
      ? capButtonChromiumSystemColorPaint.ButtonFace
      : capButtonChromiumSystemColorPaint.Highlight;
  const outlineColor =
    availability === 'enabled' && primary
      ? capButtonChromiumSystemColorPaint.ButtonBorder
      : capButtonChromiumSystemColorPaint.Highlight;

  return {
    mediaMatches: true,
    substitutesSystemColors: true,
    forcedColorAdjust: primary ? 'none' : 'auto',
    foreground,
    background,
    border: uniform(focused ? focusBorder : restBorder),
    focus: {
      visible: focused,
      outlineColor: focused ? outlineColor : foreground,
      outlineStyle: focused ? 'solid' : 'none',
      outlineWidth: focused ? '2px' : '0px',
      outlineOffset: '0px',
      innerShadow: focused && primary ? '0 0 0 1px #ffffff inset' : 'none',
    },
  };
};

export const resolveCapButtonForcedColors = (
  appearance: CapButtonAppearance,
  availability: CapButtonInteractionAvailability,
  conditions: CapButtonForcedColorsCondition
): CapButtonForcedColorsContract => {
  const common = {
    appearance,
    availability,
    conditions,
    evidence: capButtonForcedColorsRuntimeEvidence,
  };

  if (!conditions.forcedColors) {
    return {
      ...common,
      applies: false,
      authored: null,
      effective: null,
    };
  }

  return {
    ...common,
    applies: true,
    authored: authoredContract(
      appearance,
      availability,
      conditions.focusVisible
    ),
    effective: effectiveContract(
      appearance,
      availability,
      conditions.focusVisible
    ),
  };
};
