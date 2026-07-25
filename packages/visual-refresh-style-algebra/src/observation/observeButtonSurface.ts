import {
  byGriffelCascade,
  captureElementGriffelRules,
  type CapturedGriffelRule,
} from '../diagnostics/captureGriffelRules';

/**
 * The interaction states a button surface can be observed in.
 *
 * `focus` and `focusVisible` are kept apart because Fluent's focus indicator is
 * attached to a `[data-fui-focus-visible]` attribute rather than to `:focus`, so
 * collapsing them would hide whether the indicator is reachable at all.
 */
export type ButtonSurfaceState =
  | 'rest'
  | 'hover'
  | 'active'
  | 'focus'
  | 'focusVisible';

export const buttonSurfaceStates = [
  'rest',
  'hover',
  'active',
  'focus',
  'focusVisible',
] as const;

/** Ordinary rendering versus `forced-colors: active`. */
export type ButtonColorMode = 'ordinary' | 'forcedColors';

export const buttonColorModes = ['ordinary', 'forcedColors'] as const;

/** The declarations in force for one (colour mode, state) pair. */
export type ButtonSurface = Readonly<Record<string, string>>;

export interface ButtonSurfaceObservation {
  /**
   * Declarations written for exactly this (mode, state), with nothing inherited.
   * Answers "did the author say anything here?".
   */
  readonly declared: Readonly<
    Record<ButtonColorMode, Readonly<Record<ButtonSurfaceState, ButtonSurface>>>
  >;
  /**
   * Declarations actually in force once the cascade is applied: rest flows into
   * hover, hover into active, and ordinary rendering into forced colors.
   * Answers "what does the user see?".
   */
  readonly effective: Readonly<
    Record<ButtonColorMode, Readonly<Record<ButtonSurfaceState, ButtonSurface>>>
  >;
}

/**
 * Which box of an element to observe.
 *
 * A pseudo-element is a separate box, so its declarations must not be folded
 * into the element's own surface. The SplitButton divider is exactly this case:
 * it lives on `::after` and describes the boundary *between* the two actions,
 * not the boundary of either one.
 */
export interface SurfaceSelection {
  /** A pseudo-element such as `'::after'`; omit to read the element's own box. */
  readonly pseudoElement?: string;
  /**
   * Whether the element has an ancestor matching a selector, so that rules
   * scoped by a parent can be attributed correctly.
   *
   * Griffel emits direction-specific rules keyed on a *static* class — the
   * SplitButton squares its joined edge through
   * `.f14uur2j .fui-SplitButton__primaryActionButton`, where only `.f14uur2j`
   * says which writing direction it is for. Matching on the key compound alone
   * would attribute both the LTR and the RTL variant to the same element and
   * report every corner as squared.
   *
   * Defaults to rejecting ancestor-scoped rules, which is the safe reading when
   * no live DOM is available to ask.
   */
  readonly hasAncestor?: (selector: string, direct: boolean) => boolean;
}

/**
 * Colour-carrying properties. A change here is an appearance change, which the
 * laws treat as legitimately appearance-dependent.
 */
export const surfaceColorProperties = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
] as const;

/**
 * Size- and shape-carrying properties. These are appearance-*invariant*: changing
 * `appearance` must not move the button, only recolour it.
 */
export const surfaceGeometryProperties = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'min-width',
  'max-width',
  'font-size',
  'font-weight',
  'line-height',
] as const;

/** Narrows a surface to the given properties, dropping those never declared. */
export const projectSurface = (
  surface: ButtonSurface,
  properties: readonly string[]
): ButtonSurface =>
  Object.fromEntries(
    properties
      .filter((property) => surface[property] !== undefined)
      .map((property) => [property, surface[property]])
  );

const customPropertyPattern = /var\(\s*--([-_a-zA-Z0-9]+)\s*(?:,([^()]*))?\)/g;

/**
 * Substitutes theme custom properties for the values they carry.
 *
 * Two declarations that name different tokens can still paint the same pixels —
 * `colorTransparentStroke` *is* `transparent`. A law about what the user sees
 * has to compare resolved values, or it reports a rename as a visual change.
 */
export const resolveThemeValues = (
  surface: ButtonSurface,
  theme: Readonly<Record<string, string>>
): ButtonSurface => {
  const resolve = (value: string, depth: number): string =>
    depth === 0
      ? value
      : value.replace(customPropertyPattern, (matched, token, fallback) => {
          const declared = theme[token];

          if (declared !== undefined) {
            // Some theme entries are numbers — `fontWeightSemibold` is `600`.
            return resolve(String(declared), depth - 1);
          }

          return fallback === undefined ? matched : resolve(fallback.trim(), depth - 1);
        });

  return Object.fromEntries(
    Object.entries(surface).map(([property, value]) => [
      property,
      // Tokens alias other tokens; the bound keeps a cyclic theme from hanging.
      resolve(value, 8),
    ])
  );
};

const emptyStates = (): Record<ButtonSurfaceState, Record<string, string>> => ({
  rest: {},
  hover: {},
  active: {},
  focus: {},
  focusVisible: {},
});

const escapeRegularExpression = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pseudoElementPattern =
  /::?(after|before|first-line|first-letter|placeholder|backdrop|marker|selection)\b/;

/** The pseudo-element a selector tail addresses, or `''` for the element itself. */
const pseudoElementOf = (tail: string): string => {
  const match = pseudoElementPattern.exec(tail);

  return match ? `::${match[1]}` : '';
};

/**
 * Splits a selector into the compound that names the element and everything that
 * qualifies it through an ancestor.
 *
 * Brackets and parentheses are respected, so a combinator inside `[data-x="a b"]`
 * or `:is(a > b)` is not mistaken for the structural one.
 */
const splitAtKeyCompound = (
  subject: string
): { ancestor: string; direct: boolean; key: string } => {
  let depth = 0;
  let cut = -1;

  for (let index = 0; index < subject.length; index++) {
    const character = subject[index];

    if (character === '[' || character === '(') {
      depth++;
    } else if (character === ']' || character === ')') {
      depth--;
    } else if (depth === 0 && /[\s>+~]/.test(character)) {
      cut = index;
    }
  }

  if (cut === -1) {
    return { ancestor: '', direct: false, key: subject };
  }

  const separator = subject.slice(0, cut + 1);

  return {
    ancestor: separator.replace(/[\s>+~]+$/, ''),
    direct: /[>+~]/.test(separator),
    key: subject.slice(cut + 1),
  };
};

/**
 * A rule describes a surface when the compound that names the element mentions
 * one of its classes, addresses the requested pseudo-element (or none, for the
 * element's own box), and any ancestor qualification actually holds. Griffel
 * also emits descendant rules for icon slots; those name a different element and
 * would otherwise be misread as root declarations.
 */
const targetsOwnSurface = (
  selector: string,
  className: string,
  pseudoElement: string,
  hasAncestor: (ancestorSelector: string, direct: boolean) => boolean
): boolean => {
  const { ancestor, direct, key } = splitAtKeyCompound(
    selector.split(',')[0].trim()
  );
  const token = new RegExp(
    `\\.${escapeRegularExpression(className)}(?![-_a-zA-Z0-9])`,
    'g'
  );
  const match = token.exec(key);

  if (!match) {
    return false;
  }

  if (pseudoElementOf(key.slice(match.index + match[0].length)) !== pseudoElement) {
    return false;
  }

  return ancestor === '' || hasAncestor(ancestor, direct);
};

const classifyState = (selector: string): ButtonSurfaceState => {
  // Fluent draws its own indicator on a `[data-fui-focus-visible]` attribute and
  // suppresses the native `:focus-visible` ring. Both describe the same moment,
  // so they share a state; which one wins is a cascade question, not a
  // classification question, and is settled by bucket order.
  if (
    selector.includes('[data-fui-focus-visible]') ||
    selector.includes(':focus-visible')
  ) {
    return 'focusVisible';
  }

  if (selector.includes(':active')) {
    return 'active';
  }

  if (selector.includes(':hover')) {
    return 'hover';
  }

  if (selector.includes(':focus')) {
    return 'focus';
  }

  return 'rest';
};

const classifyMode = (media: string): ButtonColorMode =>
  media.includes('forced-colors') ? 'forcedColors' : 'ordinary';

/**
 * Which states a state inherits from, nearest last so later writes win.
 *
 * Hover styling stays in force while the pointer is held down, and the focus
 * indicator is layered over the resting surface rather than replacing it.
 */
const inheritanceChain: Record<
  ButtonSurfaceState,
  readonly ButtonSurfaceState[]
> = {
  rest: ['rest'],
  hover: ['rest', 'hover'],
  active: ['rest', 'hover', 'active'],
  focus: ['rest', 'focus'],
  focusVisible: ['rest', 'focus', 'focusVisible'],
};

const outlineStyleKeywords = new Set([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
  'auto',
]);

const outlineWidthPattern = /^(thin|medium|thick|[\d.]+[a-z%]*)$/;

const splitTopLevel = (value: string): readonly string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const character of value) {
    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
    }

    if (depth === 0 && /\s/.test(character)) {
      if (current !== '') {
        parts.push(current);
        current = '';
      }
      continue;
    }

    current += character;
  }

  if (current !== '') {
    parts.push(current);
  }

  return parts;
};

/**
 * Rewrites an `outline` shorthand into the longhands it sets.
 *
 * jsdom leaves `outline` unexpanded while expanding the reset style's
 * `outlineStyle`, so a surface can end up carrying both `outline-style: none`
 * and a later `outline: 2px solid …` with no way to tell which one the browser
 * would honour. Expanding restores the shorthand's real effect: it overwrites
 * every outline longhand, whether or not the shorthand names them.
 */
export const expandOutlineShorthand = (
  declarations: Readonly<Record<string, string>>
): Readonly<Record<string, string>> => {
  const outline = declarations['outline'];

  if (outline === undefined) {
    return declarations;
  }

  const expanded: Record<string, string> = {
    'outline-width': 'medium',
    'outline-style': 'none',
    'outline-color': 'currentcolor',
  };

  for (const part of splitTopLevel(outline)) {
    if (outlineStyleKeywords.has(part)) {
      expanded['outline-style'] = part;
    } else if (outlineWidthPattern.test(part)) {
      expanded['outline-width'] = part;
    } else {
      expanded['outline-color'] = part;
    }
  }

  const withoutShorthand = Object.entries(declarations).filter(
    ([property]) => property !== 'outline'
  );

  return { ...Object.fromEntries(withoutShorthand), ...expanded };};

/**
 * Reduces the rules Griffel inserted for an element into what the element's own
 * surface declares in each state and colour mode.
 *
 * Every Griffel class carries the same specificity, so a conflict between two of
 * them is decided by stylesheet order alone. The rules are therefore sorted into
 * Griffel's bucket order before they are folded together: reading them in
 * document order, or in the order the CSSOM happens to expose them, would report
 * losers as winners.
 */
export const summarizeButtonSurface = (
  rules: readonly CapturedGriffelRule[],
  classNames: readonly string[],
  { pseudoElement = '', hasAncestor = () => false }: SurfaceSelection = {}
): ButtonSurfaceObservation => {
  const declared: Record<
    ButtonColorMode,
    Record<ButtonSurfaceState, Record<string, string>>
  > = {
    ordinary: emptyStates(),
    forcedColors: emptyStates(),
  };

  const ownRules = rules
    .filter((rule) =>
      classNames.some((className) =>
        targetsOwnSurface(rule.selector, className, pseudoElement, hasAncestor)
      )
    )
    .sort(byGriffelCascade);

  for (const rule of ownRules) {
    Object.assign(
      declared[classifyMode(rule.media)][classifyState(rule.selector)],
      expandOutlineShorthand(rule.declarations)
    );
  }

  const effective: Record<
    ButtonColorMode,
    Record<ButtonSurfaceState, Record<string, string>>
  > = {
    ordinary: emptyStates(),
    forcedColors: emptyStates(),
  };

  for (const state of buttonSurfaceStates) {
    for (const source of inheritanceChain[state]) {
      Object.assign(effective.ordinary[state], declared.ordinary[source]);
    }

    // Forced colors is an override layer, not a replacement: author styling still
    // applies except where the media block restates it.
    Object.assign(effective.forcedColors[state], effective.ordinary[state]);

    for (const source of inheritanceChain[state]) {
      Object.assign(
        effective.forcedColors[state],
        declared.forcedColors[source]
      );
    }
  }

  return { declared, effective };
};

/** Observes the surface of a rendered element from the live CSSOM. */
export const observeButtonSurface = (
  targetDocument: Document,
  element: Element,
  selection: SurfaceSelection = {}
): ButtonSurfaceObservation =>
  summarizeButtonSurface(
    captureElementGriffelRules(targetDocument, element),
    [...element.classList],
    {
      hasAncestor: (ancestorSelector, direct) =>
        direct
          ? Boolean(element.parentElement?.matches(ancestorSelector))
          : Boolean(element.parentElement?.closest(ancestorSelector)),
      ...selection,
    }
  );
