import * as fc from 'fast-check';
import { isSystemColorRole } from '../domain/SemanticColorRole';
import { shapePolicy } from '../domain/policies';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';
import { buttonCaseArbitrary } from './arbitraries';
import {
  anatomyMutationRegression,
  compactDensityMutationRegression,
  focusMutationRegression,
  forcedColorsMutationRegression,
  rtlPaddingMutationRegression,
  rtlSplitShapeRegression,
  unsupportedAppearanceRegression,
} from './fixtures';
import { resolveButtonWithMutation } from './mutations';
import { propertyParameters } from './propertyConfig';

const mutationParameters = { ...propertyParameters, numRuns: 250 };

const expectShrunkFailure = (property: fc.IProperty<unknown[]>): void => {
  const result = fc.check(property, mutationParameters);
  expect(result.failed).toBe(true);
  expect(result.counterexample).not.toBeNull();
  expect(result.numShrinks).toBeGreaterThan(0);
};

describe('opt-in mutation experiments', () => {
  it('Law 12: focus law finds and shrinks focus erasure', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (input) =>
        input.interactionState !== 'focusVisible'
          ? true
          : resolveButtonWithMutation(input, 'eraseFocusVisibility').focus
              .visible
      )
    );
    expect(
      resolveButtonWithMutation(focusMutationRegression, 'eraseFocusVisibility')
        .focus.visible
    ).toBe(false);
  });

  it('Law 12: anatomy law finds and shrinks accessible-name loss', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (input) =>
        input.contentKind !== 'iconOnly'
          ? true
          : resolveButtonWithMutation(input, 'loseAccessibleNameSource').anatomy
              .accessibleNameSource === 'ariaLabel'
      )
    );
    expect(
      resolveButtonWithMutation(
        anatomyMutationRegression,
        'loseAccessibleNameSource'
      ).anatomy.accessibleNameSource
    ).toBe('text');
  });

  it('Law 12: padding law finds and shrinks a missing RTL mirror', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (input) => {
        if (input.direction !== 'rtl' || input.contentKind !== 'textAndIcon') {
          return true;
        }
        const ltr = resolveSemanticButton({
          ...input,
          direction: 'ltr',
        }).geometry;
        const rtl = resolveButtonWithMutation(
          input,
          'failRtlPaddingMirror'
        ).geometry;
        return (
          ltr.paddingInlineStart === rtl.paddingInlineEnd &&
          ltr.paddingInlineEnd === rtl.paddingInlineStart
        );
      })
    );
    const mutated = resolveButtonWithMutation(
      rtlPaddingMutationRegression,
      'failRtlPaddingMirror'
    ).geometry;
    expect(mutated.paddingInlineStart).not.toBe(mutated.paddingInlineEnd);
  });

  it('Law 12: forced-colors law finds and shrinks product color leakage', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (input) => {
        if (input.colorMode !== 'forcedColors') {
          return true;
        }
        const contract = resolveButtonWithMutation(
          input,
          'leakProductColorIntoForcedColors'
        );
        return isSystemColorRole(contract.appearance.backgroundRole);
      })
    );
    expect(
      isSystemColorRole(
        resolveButtonWithMutation(
          forcedColorsMutationRegression,
          'leakProductColorIntoForcedColors'
        ).appearance.backgroundRole
      )
    ).toBe(false);
  });

  it('Law 12: density law finds and shrinks semantic color drift', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (input) => {
        if (input.density !== 'compact') {
          return true;
        }
        const standard = resolveSemanticButton({
          ...input,
          density: 'standard',
        });
        const compact = resolveButtonWithMutation(
          input,
          'compactDensityChangesColor'
        );
        return (
          standard.appearance.foregroundRole ===
          compact.appearance.foregroundRole
        );
      })
    );
    expect(
      resolveButtonWithMutation(
        compactDensityMutationRegression,
        'compactDensityChangesColor'
      ).appearance.foregroundRole
    ).toBe('focusStroke');
  });

  it('Law 12: compound law finds and shrinks an RTL outer-radius loss', () => {
    expectShrunkFailure(
      fc.property(buttonCaseArbitrary, (input) => {
        if (
          input.direction !== 'rtl' ||
          input.compositionContext !== 'splitButtonEnd'
        ) {
          return true;
        }
        const shape = resolveButtonWithMutation(
          input,
          'incorrectRtlSplitEndRadius'
        ).shape;
        return shape.radiusStartStart === shapePolicy[input.visualLanguage];
      })
    );
    expect(
      resolveButtonWithMutation(
        rtlSplitShapeRegression,
        'incorrectRtlSplitEndRadius'
      ).shape.radiusStartStart
    ).toBe(0);
  });

  it('Law 12: supported-domain law catches silent unsupported fallback', () => {
    expect(() =>
      resolveSemanticButton(unsupportedAppearanceRegression)
    ).toThrow('unsupportedAppearance');
    expect(() =>
      resolveButtonWithMutation(
        unsupportedAppearanceRegression,
        'unsupportedAppearanceFallback'
      )
    ).not.toThrow();
  });
});
