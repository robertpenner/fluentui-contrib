import type { ButtonCase } from '../domain/ButtonCase';
import { resolveSemanticButton } from './resolveSemanticButton';

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

describe('resolveSemanticButton', () => {
  it('resolves the cross-cutting discriminating case without losing protected behavior', () => {
    const contract = resolveSemanticButton(discriminatingCase);

    expect(contract.geometry.blockSize).toBe(32);
    expect(contract.geometry.paddingInlineStart).toBeLessThan(contract.geometry.paddingInlineEnd);
    expect(contract.shape).toEqual({
      radiusStartStart: 8,
      radiusStartEnd: 0,
      radiusEndStart: 8,
      radiusEndEnd: 0,
    });
    expect(contract.appearance).toEqual({
      foregroundRole: 'ButtonText',
      backgroundRole: 'ButtonFace',
      borderRole: 'ButtonBorder',
    });
    expect(contract.focus).toMatchObject({ visible: true, colorRole: 'Highlight' });
    expect(contract.anatomy.accessibleNameSource).toBe('text');
    expect(contract.validationObligations).toEqual(
      expect.arrayContaining(['forcedColorsBehavior', 'accessibleNaming', 'compoundGeometry']),
    );
    expect(contract.capabilities.supportsKeyboardActivation).toBe(true);
  });

  it('fails explicitly for an unsupported appearance', () => {
    expect(() => resolveSemanticButton({ ...discriminatingCase, product: 'teams', appearance: 'tint' })).toThrow(
      'unsupportedAppearance',
    );
  });
});