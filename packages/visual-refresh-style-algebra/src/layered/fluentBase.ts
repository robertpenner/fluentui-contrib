import { appearanceStatePolicy } from '../domain/appearancePolicy';
import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { DESIGN_LANGUAGE_VERSION, focusPolicy, shapePolicy, spacingPolicy, typographyPolicy } from '../domain/policies';
import { interactionStates } from '../domain/ButtonCase';
import { resolveAnatomy } from '../semantic/resolveAnatomy';
import { resolveCapabilities } from '../semantic/resolveCapabilities';
import type { LayeredState } from './writeHistory';

export const applyFluentBase = (input: ButtonCase): LayeredState => {
  const radius = shapePolicy.fluent2;
  const blockSize = 32;
  const textPadding = input.density === 'compact' ? spacingPolicy.textPadding - spacingPolicy.compactDelta : spacingPolicy.textPadding;
  const anatomy = resolveAnatomy(input);
  const contract: ButtonStyleContract = {
    modelVersion: DESIGN_LANGUAGE_VERSION,
    geometry: {
      blockSize,
      minInlineSize: blockSize,
      paddingInlineStart: input.contentKind === 'iconOnly' ? spacingPolicy.iconOnlyPadding : textPadding,
      paddingInlineEnd: input.contentKind === 'iconOnly' ? spacingPolicy.iconOnlyPadding : textPadding,
      gap: input.contentKind === 'textAndIcon' ? spacingPolicy.gap : 0,
    },
    shape: {
      radiusStartStart: radius,
      radiusStartEnd: radius,
      radiusEndStart: radius,
      radiusEndEnd: radius,
    },
    appearance: { ...appearanceStatePolicy.primary.rest },
    typography: { ...typographyPolicy[input.density] },
    anatomy,
    supportedDomain: {
      appearanceSupported: true,
      supportedStates: interactionStates,
    },
    validationObligations: ['nativeButtonSemantics', 'focusVisibility', 'stateCompleteness', 'textOverflow'],
    focus: {
      visible: false,
      colorRole: 'focusStroke',
      width: focusPolicy.width,
      offset: focusPolicy.offset,
    },
    capabilities: resolveCapabilities(input),
    provenance: [],
  };
  const state: LayeredState = { contract, writeHistory: [] };

  const record = (field: string, value: unknown): void => {
    state.writeHistory.push({ layer: 'fluentBase', field, value });
  };

  record('geometry.blockSize', contract.geometry.blockSize);
  record('geometry.minInlineSize', contract.geometry.minInlineSize);
  record('geometry.paddingInlineStart', contract.geometry.paddingInlineStart);
  record('geometry.paddingInlineEnd', contract.geometry.paddingInlineEnd);
  record('geometry.gap', contract.geometry.gap);
  for (const field of ['radiusStartStart', 'radiusStartEnd', 'radiusEndStart', 'radiusEndEnd'] as const) {
    record(`shape.${field}`, contract.shape[field]);
  }
  for (const field of ['foregroundRole', 'backgroundRole', 'borderRole'] as const) {
    record(`appearance.${field}`, contract.appearance[field]);
  }
  record('typography', contract.typography);
  record('anatomy', contract.anatomy);
  record('supportedDomain.appearanceSupported', true);
  record('supportedDomain.supportedStates', contract.supportedDomain.supportedStates);
  record('validationObligations', contract.validationObligations);
  record('focus.visible', false);
  record('focus.colorRole', contract.focus.colorRole);
  record('focus.width', contract.focus.width);
  record('focus.offset', contract.focus.offset);
  record('capabilities', contract.capabilities);

  return state;
};