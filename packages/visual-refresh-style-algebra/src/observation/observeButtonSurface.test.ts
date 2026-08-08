import type { CapturedGriffelRule } from '../diagnostics/captureGriffelRules';
import {
  expandOutlineShorthand,
  projectSurface,
  resolveThemeValues,
  summarizeButtonSurface,
  surfaceColorProperties,
  surfaceGeometryProperties,
} from './observeButtonSurface';

const rule = (
  selector: string,
  declarations: Record<string, string>,
  { media = '', bucket = 'd' }: { media?: string; bucket?: string } = {}
): CapturedGriffelRule => ({
  media,
  bucket,
  selector,
  declarations,
  cssText: `${selector} {}`,
});

describe('summarizeButtonSurface', () => {
  it('classifies a bare class rule as the resting surface', () => {
    const observation = summarizeButtonSurface(
      [rule('.a', { color: 'red' })],
      ['a']
    );

    expect(observation.declared.ordinary.rest).toEqual({ color: 'red' });
  });

  it.each([
    ['.a:hover', 'hover'],
    ['.a:hover:active', 'active'],
    ['.a:active', 'active'],
    ['.a:focus', 'focus'],
    ['.a[data-fui-focus-visible]', 'focusVisible'],
    ['.a[data-fui-focus-visible]:focus', 'focusVisible'],
    ['.a:focus-visible', 'focusVisible'],
  ] as const)('classifies %s as the %s surface', (selector, state) => {
    const observation = summarizeButtonSurface(
      [rule(selector, { color: 'red' })],
      ['a']
    );

    expect(observation.declared.ordinary[state]).toEqual({ color: 'red' });
  });

  it('lets a later Griffel bucket win a conflict with an earlier one', () => {
    const observation = summarizeButtonSurface(
      [
        // Deliberately supplied in the order that would give the wrong answer if
        // the capture order were trusted instead of the bucket order.
        rule('.a:focus-visible', { 'outline-style': 'none' }, { bucket: 'i' }),
        rule(
          '.a[data-fui-focus-visible]',
          { 'outline-style': 'solid' },
          { bucket: 'd' }
        ),
      ],
      ['a']
    );

    expect(observation.declared.ordinary.focusVisible).toEqual({
      'outline-style': 'none',
    });
  });

  it('lets an atomic style win against a reset style', () => {
    const observation = summarizeButtonSurface(
      [
        rule('.a', { color: 'atomic' }, { bucket: 'd' }),
        rule('.a', { color: 'reset' }, { bucket: 'r' }),
      ],
      ['a']
    );

    expect(observation.declared.ordinary.rest).toEqual({ color: 'atomic' });
  });

  it('reads the focus indicator as focus-visible even though it also matches :focus', () => {
    const observation = summarizeButtonSurface(
      [
        rule('.a[data-fui-focus-visible]:focus', {
          'border-top-color': 'Highlight',
        }),
      ],
      ['a']
    );

    expect(observation.declared.ordinary.focus).toEqual({});
    expect(observation.declared.ordinary.focusVisible).toEqual({
      'border-top-color': 'Highlight',
    });
  });

  it('separates forced colors from ordinary rendering', () => {
    const observation = summarizeButtonSurface(
      [
        rule('.a', { color: 'red' }),
        rule(
          '.a',
          { color: 'ButtonText' },
          { media: '(forced-colors: active)' }
        ),
      ],
      ['a']
    );

    expect(observation.declared.ordinary.rest).toEqual({ color: 'red' });
    expect(observation.declared.forcedColors.rest).toEqual({
      color: 'ButtonText',
    });
  });

  it('ignores descendant rules, which belong to another surface', () => {
    const observation = summarizeButtonSurface(
      [
        rule('.a .fui-Button__icon', { color: 'inherit' }),
        rule('.a:hover .fui-Button__icon', { display: 'none' }),
        rule('.a > .divider', { 'border-left-width': '1px' }),
      ],
      ['a']
    );

    expect(observation.declared.ordinary.rest).toEqual({});
    expect(observation.declared.ordinary.hover).toEqual({});
  });

  it('ignores rules that only mention the class as an ancestor of another element', () => {
    const observation = summarizeButtonSurface(
      [rule('.other .a-child', { color: 'red' })],
      ['a']
    );
    expect(observation.declared.ordinary.rest).toEqual({});
  });

  it('reads a pseudo-element as a surface of its own', () => {
    const rules = [
      rule('.a', { 'border-right-color': 'own' }),
      rule('.a:after', { 'border-right-color': 'divider' }),
      rule('.a:hover::after', { 'border-right-color': 'dividerHover' }),
    ];

    expect(summarizeButtonSurface(rules, ['a']).declared.ordinary.rest).toEqual(
      {
        'border-right-color': 'own',
      }
    );

    const divider = summarizeButtonSurface(rules, ['a'], {
      pseudoElement: '::after',
    });

    expect(divider.declared.ordinary.rest).toEqual({
      'border-right-color': 'divider',
    });
    expect(divider.declared.ordinary.hover).toEqual({
      'border-right-color': 'dividerHover',
    });
  });

  it('ignores an ancestor-scoped rule unless the ancestor is confirmed', () => {
    // Griffel keys its direction-specific SplitButton rules on a static class
    // and distinguishes them only by an ancestor, so attributing them without
    // checking would apply the LTR and the RTL variant to the same element.
    const rules = [
      rule('.ltr .a', { 'border-top-right-radius': '0' }),
      rule('.rtl .a', { 'border-top-left-radius': '0' }),
    ];

    expect(summarizeButtonSurface(rules, ['a']).declared.ordinary.rest).toEqual(
      {}
    );

    const inLtr = summarizeButtonSurface(rules, ['a'], {
      hasAncestor: (selector) => selector === '.ltr',
    });

    expect(inLtr.declared.ordinary.rest).toEqual({
      'border-top-right-radius': '0',
    });
  });

  it('distinguishes a child combinator from a descendant one', () => {
    const rules = [rule('.parent > .a', { color: 'red' })];

    const asChild = summarizeButtonSurface(rules, ['a'], {
      hasAncestor: (selector, direct) => direct && selector === '.parent',
    });

    expect(asChild.declared.ordinary.rest).toEqual({ color: 'red' });

    const asDescendant = summarizeButtonSurface(rules, ['a'], {
      hasAncestor: (selector, direct) => !direct && selector === '.parent',
    });

    expect(asDescendant.declared.ordinary.rest).toEqual({});
  });

  describe('effective surface', () => {
    const observation = summarizeButtonSurface(
      [
        rule('.a', { color: 'rest', 'background-color': 'restBg' }),
        rule('.a:hover', { 'background-color': 'hoverBg' }),
        rule('.a:hover:active', { 'background-color': 'activeBg' }),
        rule('.a[data-fui-focus-visible]', { 'outline-color': 'focusRing' }),
        rule(
          '.a',
          { color: 'ButtonText' },
          { media: '(forced-colors: active)' }
        ),
      ],
      ['a']
    );

    it('flows the resting surface into hover', () => {
      expect(observation.effective.ordinary.hover).toEqual({
        color: 'rest',
        'background-color': 'hoverBg',
      });
    });

    it('keeps hover styling in force while the pointer is held down', () => {
      expect(observation.effective.ordinary.active).toEqual({
        color: 'rest',
        'background-color': 'activeBg',
      });
    });

    it('layers the focus indicator over the resting surface rather than replacing it', () => {
      expect(observation.effective.ordinary.focusVisible).toEqual({
        color: 'rest',
        'background-color': 'restBg',
        'outline-color': 'focusRing',
      });
    });

    it('treats forced colors as an override layer over ordinary rendering', () => {
      expect(observation.effective.forcedColors.hover).toEqual({
        color: 'ButtonText',
        'background-color': 'hoverBg',
      });
    });

    it('leaves the declared surfaces free of inherited noise', () => {
      expect(observation.declared.ordinary.hover).toEqual({
        'background-color': 'hoverBg',
      });
    });
  });
});

describe('projectSurface', () => {
  it('keeps only the requested properties, in the requested order', () => {
    expect(
      projectSurface(
        { color: 'red', 'padding-top': '4px', display: 'flex' },
        surfaceColorProperties
      )
    ).toEqual({ color: 'red' });

    expect(
      projectSurface(
        { color: 'red', 'padding-top': '4px', display: 'flex' },
        surfaceGeometryProperties
      )
    ).toEqual({ 'padding-top': '4px' });
  });

  it('omits properties the surface never declared', () => {
    expect(projectSurface({}, surfaceColorProperties)).toEqual({});
  });
});

describe('expandOutlineShorthand', () => {
  it('splits an outline shorthand into the longhands it sets', () => {
    expect(
      expandOutlineShorthand({ outline: '2px solid var(--colorStrokeFocus2)' })
    ).toEqual({
      'outline-width': '2px',
      'outline-style': 'solid',
      'outline-color': 'var(--colorStrokeFocus2)',
    });
  });

  it('recognizes a tokenized outline width', () => {
    expect(
      expandOutlineShorthand({
        outline: 'var(--strokeWidthThick) solid var(--colorStrokeFocus2)',
      })
    ).toEqual({
      'outline-width': 'var(--strokeWidthThick)',
      'outline-style': 'solid',
      'outline-color': 'var(--colorStrokeFocus2)',
    });
  });

  it('resets the longhands the shorthand leaves unnamed', () => {
    expect(expandOutlineShorthand({ outline: 'none' })).toEqual({
      'outline-width': 'medium',
      'outline-style': 'none',
      'outline-color': 'currentcolor',
    });
  });

  it('leaves declarations without an outline shorthand alone', () => {
    expect(expandOutlineShorthand({ 'outline-style': 'none' })).toEqual({
      'outline-style': 'none',
    });
  });
});

describe('resolveThemeValues', () => {
  it('substitutes the value a theme token carries', () => {
    expect(
      resolveThemeValues(
        { 'border-top-color': 'var(--colorTransparentStroke)' },
        { colorTransparentStroke: 'transparent' }
      )
    ).toEqual({ 'border-top-color': 'transparent' });
  });

  it('follows a token that aliases another token', () => {
    expect(
      resolveThemeValues({ color: 'var(--a)' }, { a: 'var(--b)', b: '#ffffff' })
    ).toEqual({ color: '#ffffff' });
  });

  it('falls back when the theme does not define the token', () => {
    expect(
      resolveThemeValues({ color: 'var(--missing, Highlight)' }, {})
    ).toEqual({ color: 'Highlight' });

    expect(resolveThemeValues({ color: 'var(--missing)' }, {})).toEqual({
      color: 'var(--missing)',
    });
  });

  it('reports two names for the same paint as equal', () => {
    const theme = { colorTransparentStroke: 'transparent' };

    expect(
      resolveThemeValues({ a: 'var(--colorTransparentStroke)' }, theme).a
    ).toBe(resolveThemeValues({ a: 'transparent' }, theme).a);
  });
});
