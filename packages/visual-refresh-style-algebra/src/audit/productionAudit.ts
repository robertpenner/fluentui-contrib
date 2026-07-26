/**
 * The published record of the CAP Button-family production audit.
 *
 * Each entry names one thing the investigation established, says what *kind* of
 * thing it is, and — where a correction was made — points at the executable
 * regression and the minimized fixture that hold it in place. The companion test
 * enforces that pairing, so a correction cannot be reported here without
 * something in the repository that would fail if it were undone.
 */

/**
 * The five things an investigation of this sort can turn up.
 *
 * Keeping them apart is the whole point of the exercise. A browser difference
 * filed as a product bug wastes a fix; a product bug filed as a browser
 * difference ships a defect.
 */
export type AuditClassification =
  /** A confirmed defect in CAP's own style hooks. */
  | 'cap-defect'
  /** Upstream Fluent behaviour that CAP inherits and cannot fix at its layer. */
  | 'fluent-behavior'
  /** A difference between rendering engines, not between products. */
  | 'browser-difference'
  /** A deliberate or tolerated product choice, recorded rather than corrected. */
  | 'product-policy'
  /** A defect in the model or the instrument, not in the product. */
  | 'model-assumption';

export interface AuditFinding {
  readonly id: string;
  readonly family: 'Button' | 'ToggleButton' | 'SplitButton' | 'cross-engine';
  readonly classification: AuditClassification;
  readonly summary: string;
  /** How the defect or difference is produced, in mechanism terms. */
  readonly mechanism: string;
  /** The change that corrects it, or `null` where nothing was corrected. */
  readonly correction: string | null;
  /**
   * The executable regression holding the correction in place.
   *
   * Required whenever `correction` is non-null; the audit test enforces this.
   */
  readonly regression: {
    readonly file: string;
    readonly suite: string;
  } | null;
  /** The smallest fixture that reproduces the finding. */
  readonly fixture: string | null;
}

export const auditFindings: readonly AuditFinding[] = [
  {
    id: 'button-dropped-border-shorthands',
    family: 'Button',
    classification: 'cap-defect',
    summary:
      "CAP's Button focus boundary was never emitted, in ordinary or forced colors.",
    mechanism:
      'Griffel lists `borderColor`, `borderStyle` and `borderWidth` among its unsupported ' +
      'properties: it drops the declaration at build time and reports it through `console.error`. ' +
      'CAP wrote them directly, so three focus-boundary declarations silently never reached the ' +
      'stylesheet.',
    correction:
      'react-cap-theme Button styles now go through `shorthands.borderColor(...)`.',
    regression: {
      file: 'src/diagnostics/capButtonFamilyDiagnostics.test.tsx',
      suite: 'CAP Button-family Griffel diagnostics',
    },
    fixture: 'src/fixtures/capButtonFamily.tsx',
  },
  {
    id: 'button-erased-focus-ring',
    family: 'Button',
    classification: 'cap-defect',
    summary: 'No CAP Button drew a focus ring. WCAG 2.4.7 was unmet.',
    mechanism:
      "CAP restated `:focus-visible { outline: none }`, which Fluent's reset already applies. " +
      "The copy landed in Griffel's `:focus-visible` bucket, which comes *after* the bucket " +
      'holding the `[data-fui-focus-visible]` indicator; at equal specificity the later bucket ' +
      'wins, so the restatement erased the ring it was meant to be redundant with.',
    correction:
      'The redundant reset was deleted from `useRootBaseStyles.base`, with the bucket ordering ' +
      'written down at the site so it is not re-added. Guarded in jsdom by the Button focus laws ' +
      'and, because the fix is the *deletion* of an `outline: none`, in real engines by the spec ' +
      'cited below — jsdom cannot show that anything is painted.',
    regression: {
      file: 'src/observation/capButtonFocusRing.component-browser-spec.tsx',
      suite: 'CAP Button focus ring in a painting engine',
    },
    fixture: 'src/fixtures/CapFocusRingProbe.tsx',
  },
  {
    id: 'toggle-checked-disabled-contradiction',
    family: 'ToggleButton',
    classification: 'fluent-behavior',
    summary:
      'A checked, disabled ToggleButton reads as selected at rest and as disabled on hover, ' +
      'under forced colors.',
    mechanism:
      'Fluent applies its checked high-contrast styles whenever `checked` is set, disabled or ' +
      "not. CAP's disabled declarations and Fluent's checked ones carry different Griffel keys, " +
      'so `mergeClasses` collapses neither; both land in the same bucket at the same ' +
      'specificity, and the winner falls to insertion order — which differs between the rest and ' +
      'hover selectors.',
    correction: null,
    regression: {
      file: 'src/observation/capToggleButtonLaws.test.tsx',
      suite: 'CAP ToggleButton classified exceptions',
    },
    fixture: 'src/fixtures/capButtonFamily.tsx',
  },
  {
    id: 'toggle-order-dependent-substitution-policy',
    family: 'ToggleButton',
    classification: 'cap-defect',
    summary:
      "An unselected primary ToggleButton's forced-colors substitution policy was decided by " +
      'what else the page had rendered first.',
    mechanism:
      'Upstream opts primary ToggleButtons back into substitution with `forced-color-adjust: ' +
      'auto`. CAP replaced the block, restated its three system colours, and dropped that line. ' +
      "CAP's *Button* primary block contributes `forced-color-adjust: none` to the same root at " +
      'the same specificity; nothing deduped the pair, so Griffel insertion order decided it. ' +
      'The same button computed `auto` alone and `none` after another CAP fixture rendered.',
    correction:
      "CAP's primary ToggleButton forced-colors block restates `forcedColorAdjust: 'auto'`, " +
      'which also gives it the same Griffel key as the `none` so the pair now collapses.',
    regression: {
      file: 'src/observation/alternateAppearance.component-browser-spec.tsx',
      suite: 'alternate appearance under forced colors',
    },
    fixture: 'src/fixtures/AlternateAppearanceProbe.tsx',
  },
  {
    id: 'webkit-matches-without-substituting',
    family: 'cross-engine',
    classification: 'browser-difference',
    summary:
      'WebKit matches `(forced-colors: active)` under emulation without performing colour ' +
      'substitution.',
    mechanism:
      'A canary carrying authored colours and no forced-colors treatment survives untouched in ' +
      'WebKit and is replaced in Chromium and Firefox. Explicitly named system-colour keywords ' +
      'still resolve everywhere, so surfaces CAP treats explicitly move and untreated ones do ' +
      'not.',
    correction: null,
    regression: {
      file: 'src/observation/alternateAppearance.component-browser-spec.tsx',
      suite: 'alternate appearance under forced colors',
    },
    fixture: 'src/fixtures/AlternateAppearanceProbe.tsx',
  },
  {
    id: 'forced-colors-coverage-limited-to-primary',
    family: 'cross-engine',
    classification: 'product-policy',
    summary:
      'CAP declares forced-colors behaviour for `primary` and `tint` only, and relies on ' +
      'user-agent substitution for every other appearance.',
    mechanism:
      'The agreement between an unselected primary ToggleButton and a secondary Button in ' +
      "Chromium and Firefox is the engine's work, not a CAP guarantee: the secondary appearance " +
      'declares no forced-colors treatment at all. On an engine that does not substitute, the ' +
      'two separate.',
    correction: null,
    regression: {
      file: 'src/observation/alternateAppearance.component-browser-spec.tsx',
      suite: 'alternate appearance under forced colors',
    },
    fixture: 'src/fixtures/AlternateAppearanceProbe.tsx',
  },
  {
    id: 'splitbutton-no-defect',
    family: 'SplitButton',
    classification: 'product-policy',
    summary:
      'No CAP SplitButton defect was found. Every propagation, seam and RTL law holds.',
    mechanism:
      'Six appearances × three states × two writing directions × two colour modes were checked ' +
      'against the inherited Button guarantees, the disabled/disabled-focusable propagation ' +
      'rules, and the joined-edge geometry. The negative result is reported because a law suite ' +
      'that only reports failures cannot be trusted when it is silent.',
    correction: null,
    regression: {
      file: 'src/observation/capSplitButtonLaws.test.tsx',
      suite: 'CAP SplitButton joined-edge laws',
    },
    fixture: 'src/fixtures/capButtonFamily.tsx',
  },
  {
    id: 'splitbutton-hardcoded-menu-padding',
    family: 'SplitButton',
    classification: 'product-policy',
    summary:
      "The menu button's padding is hardcoded in pixels rather than derived from tokens.",
    mechanism:
      'The values are commented as "padding − 1px border", i.e. a token arithmetic that Griffel ' +
      'cannot express was resolved by hand. This is legible and deliberate, so it is recorded ' +
      'rather than corrected.',
    correction: null,
    regression: null,
    fixture: null,
  },
  {
    id: 'tint-appearance-outside-fluent-types',
    family: 'Button',
    classification: 'product-policy',
    summary:
      "CAP's `tint` appearance has no counterpart in the public Fluent `ButtonProps` union.",
    mechanism:
      'Fixtures have to widen the prop type to exercise it, which means the appearance is ' +
      'reachable at runtime but unreachable through the published types. Recorded as an ' +
      'evidence boundary rather than worked around silently.',
    correction: null,
    regression: null,
    fixture: 'src/fixtures/capButtonFamily.tsx',
  },
  {
    id: 'observer-folded-pseudo-elements',
    family: 'SplitButton',
    classification: 'model-assumption',
    summary:
      "The observer attributed `::after` declarations to the element's own box.",
    mechanism:
      "The SplitButton divider lives on the primary action's `::after`. Folding it into the own " +
      'surface made the button appear to paint a right border it does not have — and would have ' +
      'hidden a real regression behind a passing law.',
    correction:
      'Surfaces are selected per pseudo-element; a rule is attributed only when its tail matches ' +
      'the requested pseudo-element exactly.',
    regression: {
      file: 'src/observation/observeButtonSurface.test.ts',
      suite: 'summarizeButtonSurface',
    },
    fixture: null,
  },
  {
    id: 'observer-over-attributed-ancestors',
    family: 'SplitButton',
    classification: 'model-assumption',
    summary:
      'The observer attributed ancestor-scoped rules without checking the ancestor.',
    mechanism:
      'Griffel keys its direction-specific SplitButton rules on a *static* class and ' +
      'distinguishes LTR from RTL only by an ancestor class. Matching the key compound alone ' +
      'attributed both variants to the same element, reported every corner as squared, and made ' +
      'the RTL law pass vacuously.',
    correction:
      'The observer splits a selector at its key compound and confirms the ancestor part against ' +
      'the live DOM before attributing the rule.',
    regression: {
      file: 'src/observation/observeButtonSurface.test.ts',
      suite: 'summarizeButtonSurface',
    },
    fixture: null,
  },
];

/**
 * Style markers counted across every CAP component family, used to nominate the
 * next investigation from measurement rather than intuition.
 *
 * Each column is a marker for one of the defect mechanisms this audit actually
 * found, so the census asks "where else could the same three things happen?"
 * rather than "where does the code look complicated?".
 *
 * Produced by counting, per family, across `*.styles.ts` in
 * `packages/react-cap-theme/src/components`. Every column is re-derived from
 * disk by the companion test, so a number that has drifted fails rather than
 * quietly keeping the shape of a measurement:
 *
 * - `rawShorthands` — declarations of `borderColor` / `borderStyle` /
 *   `borderWidth` / `borderInline*` / `borderBlock*` written directly rather
 *   than through `shorthands.*`. This is the mechanism of the first defect: the
 *   declaration is dropped at build time, and the nomination's strongest claim
 *   is that exactly one family still carries them.
 * - `focusOverrides` — occurrences of `outline`, `:focus-visible`, or
 *   `createCustomFocusIndicatorStyle`. This is the surface area of the second
 *   defect: a restated reset that lands in a later bucket erases the indicator.
 * - `forcedColorsBlocks` — `@media (forced-colors: active)` blocks. This is the
 *   surface area of the third and fourth defects: accessibility-critical policy
 *   restated at equal specificity, decided by insertion order.
 * - `hardcodedPixels` — quoted `'<n>px'` literals, a weaker signal of
 *   hand-resolved token arithmetic.
 */
export interface StyleMarkerCensusRow {
  readonly family: string;
  readonly rawShorthands: number;
  readonly focusOverrides: number;
  readonly forcedColorsBlocks: number;
  readonly hardcodedPixels: number;
}

export const styleMarkerCensus: readonly StyleMarkerCensusRow[] = [
  {
    family: 'react-accordion',
    rawShorthands: 0,
    focusOverrides: 2,
    forcedColorsBlocks: 0,
    hardcodedPixels: 3,
  },
  {
    family: 'react-avatar',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-badge',
    rawShorthands: 0,
    focusOverrides: 8,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-button',
    rawShorthands: 0,
    focusOverrides: 24,
    forcedColorsBlocks: 15,
    hardcodedPixels: 31,
  },
  {
    family: 'react-card',
    rawShorthands: 0,
    focusOverrides: 3,
    forcedColorsBlocks: 3,
    hardcodedPixels: 2,
  },
  {
    family: 'react-carousel',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 4,
  },
  {
    family: 'react-checkbox',
    rawShorthands: 0,
    focusOverrides: 2,
    forcedColorsBlocks: 0,
    hardcodedPixels: 2,
  },
  {
    family: 'react-combobox',
    rawShorthands: 0,
    focusOverrides: 9,
    forcedColorsBlocks: 4,
    hardcodedPixels: 5,
  },
  {
    family: 'react-dialog',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-drawer',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-image',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-input',
    rawShorthands: 0,
    focusOverrides: 5,
    forcedColorsBlocks: 2,
    hardcodedPixels: 3,
  },
  {
    family: 'react-label',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-link',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-menu',
    rawShorthands: 0,
    focusOverrides: 2,
    forcedColorsBlocks: 7,
    hardcodedPixels: 6,
  },
  {
    family: 'react-popover',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-search',
    rawShorthands: 0,
    focusOverrides: 6,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
  {
    family: 'react-tabs',
    rawShorthands: 0,
    focusOverrides: 3,
    forcedColorsBlocks: 0,
    hardcodedPixels: 7,
  },
  {
    family: 'react-tags',
    rawShorthands: 2,
    focusOverrides: 47,
    forcedColorsBlocks: 7,
    hardcodedPixels: 22,
  },
  {
    family: 'react-teaching-popover',
    rawShorthands: 0,
    focusOverrides: 3,
    forcedColorsBlocks: 0,
    hardcodedPixels: 3,
  },
  {
    family: 'react-toolbar',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 1,
    hardcodedPixels: 0,
  },
  {
    family: 'react-tooltip',
    rawShorthands: 0,
    focusOverrides: 0,
    forcedColorsBlocks: 0,
    hardcodedPixels: 0,
  },
];

/** The family the evidence nominates for the next algebra-based investigation. */
export const nextInvestigation = {
  family: 'react-tags',
  measuredJustification:
    'It is the only remaining family carrying raw unsupported border shorthands (2), the ' +
    'mechanism of the first confirmed defect; it has the highest focus-override density in the ' +
    'theme (47 against the audited Button family\u2019s 24), the mechanism of the second; and it ' +
    'declares 7 forced-colors blocks, the mechanism of the third and fourth.',
  ownershipOverlap:
    'InteractionTag composes InteractionTagPrimary and InteractionTagSecondary into one visual ' +
    'control with a joined seam, shared disabled propagation, and per-action focus \u2014 the same ' +
    'shape as SplitButton. The SplitButton propagation and joined-edge laws transfer almost ' +
    'unchanged, so the marginal cost of the next investigation is the fixture, not the algebra.',
} as const;
