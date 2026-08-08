import type { ButtonCase } from '../domain/ButtonCase';
import { resolveForcedColorsContract } from './resolveForcedColorsContract';

const input: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'rest',
  colorMode: 'forcedColors',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
};

describe('resolveForcedColorsContract', () => {
  it('resolves enabled system roles and a visible boundary', () => {
    expect(resolveForcedColorsContract(input)).toEqual({
      foregroundRole: 'ButtonText',
      backgroundRole: 'ButtonFace',
      borderRole: 'ButtonBorder',
      focusRole: 'Highlight',
      focusVisible: false,
      disabledDistinguishable: false,
      visibleBoundary: true,
    });
  });

  it('preserves a system-color focus indicator', () => {
    expect(
      resolveForcedColorsContract({
        ...input,
        interactionState: 'focusVisible',
      })
    ).toMatchObject({
      focusRole: 'Highlight',
      focusVisible: true,
    });
  });

  it('distinguishes disabled controls without product roles', () => {
    expect(
      resolveForcedColorsContract({ ...input, interactionState: 'disabled' })
    ).toMatchObject({
      foregroundRole: 'GrayText',
      backgroundRole: 'ButtonFace',
      borderRole: 'GrayText',
      disabledDistinguishable: true,
    });
  });

  it('rejects use outside the forced-colors environment', () => {
    expect(() =>
      resolveForcedColorsContract({ ...input, colorMode: 'light' })
    ).toThrow('requires colorMode=forcedColors');
  });
});
