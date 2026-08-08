import {
  capButtonInteractionConditionExclusions,
  capButtonInteractionConditionLedger,
  capButtonInteractionConditions,
} from '../enumerateCapButtonInteractionConditions';

describe('CAP Button interaction observation conditions', () => {
  it('enumerates the six browser-producible ordinary-color combinations', () => {
    expect(capButtonInteractionConditions).toEqual([
      {
        hover: false,
        active: false,
        focusVisible: false,
        forcedColors: false,
        prefersReducedMotion: false,
        direction: 'ltr',
      },
      {
        hover: true,
        active: false,
        focusVisible: false,
        forcedColors: false,
        prefersReducedMotion: false,
        direction: 'ltr',
      },
      {
        hover: true,
        active: true,
        focusVisible: false,
        forcedColors: false,
        prefersReducedMotion: false,
        direction: 'ltr',
      },
      {
        hover: false,
        active: false,
        focusVisible: true,
        forcedColors: false,
        prefersReducedMotion: false,
        direction: 'ltr',
      },
      {
        hover: true,
        active: false,
        focusVisible: true,
        forcedColors: false,
        prefersReducedMotion: false,
        direction: 'ltr',
      },
      {
        hover: true,
        active: true,
        focusVisible: true,
        forcedColors: false,
        prefersReducedMotion: false,
        direction: 'ltr',
      },
    ]);
  });

  it('keeps focus-visible independent while requiring active to coexist with hover', () => {
    expect(
      capButtonInteractionConditions.filter(
        (conditions) => conditions.focusVisible
      )
    ).toHaveLength(3);
    expect(
      capButtonInteractionConditions.every(
        (conditions) => !conditions.active || conditions.hover
      )
    ).toBe(true);
  });

  it('pins evidence and explicit scope exclusions without claiming product support', () => {
    expect(capButtonInteractionConditionLedger).toHaveLength(6);
    expect(
      capButtonInteractionConditionLedger.every(
        (entry) =>
          entry.evidence.support === 'unknown' &&
          entry.evidence.productionBaseline.length > 0
      )
    ).toBe(true);
    expect(capButtonInteractionConditionExclusions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'active-without-hover' }),
        expect.objectContaining({ id: 'pointer-focus-visible' }),
        expect.objectContaining({ id: 'forced-colors' }),
        expect.objectContaining({ id: 'reduced-motion' }),
        expect.objectContaining({ id: 'rtl' }),
        expect.objectContaining({ id: 'non-chromium' }),
      ])
    );
    expect(
      capButtonInteractionConditionExclusions.every(
        (entry) => entry.evidence.support === 'unknown'
      )
    ).toBe(true);
  });
});
