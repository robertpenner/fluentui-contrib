import {
  buttonContentEvidenceRows,
  buttonContentGroundingCensus,
  buttonContentScenarios,
} from './contentAnatomyGrounding';
import { capButtonAppearances } from '../fixtures/capButtonFamily';

export const productionButtonSizes = ['small', 'medium', 'large'] as const;
export const productionButtonShapes = [
  'rounded',
  'circular',
  'square',
] as const;
export const productionBooleanValues = [false, true] as const;
export const productionIconPositionInputs = [
  'omitted',
  'before',
  'after',
] as const;

export const productionButtonAvailabilityInputs =
  productionBooleanValues.flatMap((disabled) =>
    productionBooleanValues.map((disabledFocusable) => ({
      disabled,
      disabledFocusable,
    }))
  );

const normalizedContentStateCount = new Set(
  buttonContentEvidenceRows.map(({ observation }) =>
    JSON.stringify(observation.normalizedState)
  )
).size;

const primaryAppearanceCount = capButtonAppearances.filter(
  (appearance) => appearance === 'primary' || appearance === 'tint'
).length;
const nonPrimaryAppearanceCount =
  capButtonAppearances.length - primaryAppearanceCount;

// Across the four disabled/disabledFocusable inputs, primary and tint select
// three distinct class sets; the other appearances select two.
const primaryAvailabilityProfileCount = 3;
const nonPrimaryAvailabilityProfileCount = 2;
const appearanceAvailabilityProfileCount =
  primaryAppearanceCount * primaryAvailabilityProfileCount +
  nonPrimaryAppearanceCount * nonPrimaryAvailabilityProfileCount;

export const productionButtonGeneratedClassCensus = {
  scope:
    'version-sensitive generated root and icon class selections for basic Button inputs',
  status: 'version-sensitive-diagnostic',
  factors: {
    appearances: capButtonAppearances.length,
    sizes: productionButtonSizes.length,
    shapes: productionButtonShapes.length,
    disabled: productionBooleanValues.length,
    disabledFocusable: productionBooleanValues.length,
    iconPresence: productionBooleanValues.length,
    childrenPresence: productionBooleanValues.length,
    authoredIconPositions: productionIconPositionInputs.length,
  },
  authoredScenarios:
    capButtonAppearances.length *
    productionButtonSizes.length *
    productionButtonShapes.length *
    productionButtonAvailabilityInputs.length *
    buttonContentScenarios.length,
  normalizedStateTuples:
    capButtonAppearances.length *
    productionButtonSizes.length *
    productionButtonShapes.length *
    productionButtonAvailabilityInputs.length *
    normalizedContentStateCount,
  generatedClassSelectionProfiles:
    appearanceAvailabilityProfileCount *
    productionButtonSizes.length *
    productionButtonShapes.length *
    buttonContentGroundingCensus.canonicalConfigurations,
} as const;
