import type { ButtonCase } from '../domain/ButtonCase';
import { deriveValidationObligations } from '../semantic/deriveValidationObligations';
import { resolveGeometry } from '../semantic/resolveGeometry';
import { resolveShape } from '../semantic/resolveShape';
import { addDecision, type LayeredState, writeField } from './writeHistory';

export const applyContextOverrides = (state: LayeredState, input: ButtonCase): LayeredState => {
  const geometry = resolveGeometry(input);
  for (const field of ['paddingInlineStart', 'paddingInlineEnd', 'gap'] as const) {
    writeField(state, 'context', `geometry.${field}`, geometry[field], (contract, value) => {
      contract.geometry[field] = value;
    });
  }

  const shape = resolveShape(input);
  for (const field of ['radiusStartStart', 'radiusStartEnd', 'radiusEndStart', 'radiusEndEnd'] as const) {
    writeField(state, 'context', `shape.${field}`, shape[field], (contract, value) => {
      contract.shape[field] = value;
    });
  }
  writeField(state, 'context', 'validationObligations', deriveValidationObligations(input), (contract, value) => {
    contract.validationObligations = value;
  });
  addDecision(state, {
    rule: 'content-and-composition-override',
    fields: [
      'geometry.paddingInlineStart',
      'geometry.paddingInlineEnd',
      'geometry.gap',
      'shape',
      'validationObligations',
    ],
    explanation: `${input.contentKind}/${input.iconPlacement}/${input.direction}/${input.compositionContext} patches spacing and corners`,
    evidence: 'modelAssumption',
  });
  return state;
};