import type { ButtonCase } from '../domain/ButtonCase';
import { blockSizePolicy, shapePolicy } from '../domain/policies';
import { resolveAnatomy } from '../semantic/resolveAnatomy';
import { deriveValidationObligations } from '../semantic/deriveValidationObligations';
import { addDecision, type LayeredState, writeField } from './writeHistory';

export const applyVisualRefreshOverrides = (state: LayeredState, input: ButtonCase): LayeredState => {
  if (input.visualLanguage !== 'visualRefresh') {
    return state;
  }

  const radius = shapePolicy.visualRefresh;
  const blockSize = blockSizePolicy.visualRefresh.fluent[input.density];
  writeField(state, 'visualRefresh', 'geometry.blockSize', blockSize, (contract, value) => {
    contract.geometry.blockSize = value;
  });
  writeField(state, 'visualRefresh', 'geometry.minInlineSize', blockSize, (contract, value) => {
    contract.geometry.minInlineSize = value;
  });
  for (const field of ['radiusStartStart', 'radiusStartEnd', 'radiusEndStart', 'radiusEndEnd'] as const) {
    writeField(state, 'visualRefresh', `shape.${field}`, radius, (contract, value) => {
      contract.shape[field] = value;
    });
  }
  if (input.anatomyPolicy === 'visualRefreshReconstructed') {
    writeField(state, 'visualRefresh', 'anatomy', resolveAnatomy(input), (contract, value) => {
      contract.anatomy = value;
    });
  }
  writeField(state, 'visualRefresh', 'validationObligations', deriveValidationObligations(input), (contract, value) => {
    contract.validationObligations = value;
  });
  addDecision(state, {
    rule: 'visual-refresh-override',
    fields: ['geometry', 'shape', 'anatomy', 'validationObligations'],
    explanation: 'Visual Refresh patches a complete Fluent base contract',
    evidence: 'presentationObservation',
  });
  return state;
};