import type { ButtonCase } from '../domain/ButtonCase';
import { blockSizePolicy } from '../domain/policies';
import { isAppearanceSupported } from '../domain/SupportedDomain';
import { addDecision, type LayeredState, writeField } from './writeHistory';

export const applyProductOverrides = (
  state: LayeredState,
  input: ButtonCase
): LayeredState => {
  const blockSize =
    blockSizePolicy[input.visualLanguage][input.product][input.density];
  writeField(
    state,
    'product',
    'geometry.blockSize',
    blockSize,
    (contract, value) => {
      contract.geometry.blockSize = value;
    }
  );
  writeField(
    state,
    'product',
    'geometry.minInlineSize',
    blockSize,
    (contract, value) => {
      contract.geometry.minInlineSize = value;
    }
  );
  writeField(
    state,
    'product',
    'supportedDomain.appearanceSupported',
    isAppearanceSupported(input),
    (contract, value) => {
      contract.supportedDomain.appearanceSupported = value;
    }
  );
  addDecision(state, {
    rule: 'product-specialization-override',
    fields: [
      'geometry.blockSize',
      'geometry.minInlineSize',
      'supportedDomain.appearanceSupported',
    ],
    explanation: `${input.product} patches shared geometry and accepted appearance state`,
    evidence:
      input.product === 'teams' && input.visualLanguage === 'visualRefresh'
        ? 'presentationObservation'
        : 'modelAssumption',
  });
  return state;
};
