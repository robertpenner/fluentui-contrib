import type { ButtonCase } from '../domain/ButtonCase';
import { compareContracts } from '../comparison/compareContracts';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';
import {
  resolveLayeredButtonInOrder,
  resolveLayeredButtonWithHistory,
  standardOverrideOrder,
} from './resolveLayeredButton';
import { normalizeContract } from '../comparison/normalizeContract';
import { fieldsWithOverlappingOwnership } from './writeHistory';

const discriminatingCase: ButtonCase = {
  product: 'teams',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'focusVisible',
  colorMode: 'forcedColors',
  contentKind: 'textAndIcon',
  iconPlacement: 'after',
  anatomyPolicy: 'visualRefreshReconstructed',
  compositionContext: 'splitButtonEnd',
  direction: 'rtl',
};

describe('resolveLayeredButton', () => {
  it('agrees with the semantic resolver for the cross-cutting discriminating case', () => {
    const layered = resolveLayeredButtonWithHistory(discriminatingCase);
    const semantic = resolveSemanticButton(discriminatingCase);

    expect(compareContracts(layered.contract, semantic)).toEqual([]);
  });

  it('reports overlapping ownership and replacements', () => {
    const { writeHistory } = resolveLayeredButtonWithHistory(discriminatingCase);
    const overlappingFields = fieldsWithOverlappingOwnership(writeHistory);

    expect(overlappingFields).toEqual(
      expect.arrayContaining([
        'geometry.blockSize',
        'shape.radiusStartStart',
        'appearance.foregroundRole',
        'focus.colorRole',
      ]),
    );
    expect(writeHistory).toContainEqual(
      expect.objectContaining({
        layer: 'forcedColors',
        field: 'appearance.foregroundRole',
        replacedLayer: 'interaction',
      }),
    );
  });

  it('allows independent context and interaction stages to commute', () => {
    const reordered = standardOverrideOrder.map(stage => stage);
    const contextIndex = reordered.indexOf('context');
    const interactionIndex = reordered.indexOf('interaction');
    reordered[contextIndex] = 'interaction';
    reordered[interactionIndex] = 'context';

    expect(normalizeContract(resolveLayeredButtonInOrder(discriminatingCase, reordered).contract)).toEqual(
      normalizeContract(resolveLayeredButtonWithHistory(discriminatingCase).contract),
    );
  });

  it('makes forced-colors precedence explicit rather than incidental', () => {
    const wrongOrder = standardOverrideOrder.filter(stage => stage !== 'forcedColors');
    wrongOrder.splice(wrongOrder.indexOf('interaction'), 0, 'forcedColors');

    expect(compareContracts(resolveLayeredButtonInOrder(discriminatingCase, wrongOrder).contract, resolveSemanticButton(discriminatingCase))).not.toEqual([]);
  });
});