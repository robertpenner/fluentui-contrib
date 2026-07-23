# Follow-up Prompt: Forced-Colors Semantics and Griffel Media-Query Emission

## Context

Continue the Visual Refresh style-algebra research already underway in my fork of `microsoft/fluentui-contrib`.

Do **not** restart the project, discard completed work, or broadly restructure the package before inspecting what the current agent has implemented. Treat this prompt as a focused addendum to the existing research program.

The motivating observation comes from Natalie Wainwright's Visual Refresh presentation and discussion:

- The "Override Fluent" strategy could retain existing Fluent styling, bug fixes, and some accessibility fixes.
- However, broad overrides and component extension became complex.
- High-contrast support was particularly difficult because the relevant media-query styling could not be overridden cleanly.
- Natalie also noted that Griffel did not deduplicate the media queries used for high-contrast support.
- Replacing Fluent styling made high-contrast styling easier to control, but transferred responsibility for every state, condition, niche case, bug fix, and accessibility requirement to the replacement implementation.

This refinement asks whether the media-query duplication is merely an emitter inefficiency, or evidence that one semantic accessibility policy is represented repeatedly and too low in the styling stack.

## Primary research question

> Can forced-colors behavior be modeled once as a protected semantic transformation, then emitted into CSS or Griffel rules without changing cascade behavior, selector scope, component specialization, or accessibility outcomes?

Treat this as a falsifiable question. Do not assume that all duplicated media queries are safely deduplicable.

## Required distinction

Introduce and preserve a strict distinction between these two levels.

### 1. Semantic accessibility policy

This describes the intended forced-colors outcome for a button configuration, including:

- foreground system-color role
- background system-color role
- border or visible-boundary role
- focus-indicator visibility and system-color role
- disabled-state distinguishability
- semantic behavior that must survive Visual Refresh and product specialization

This level should be independent of Griffel, media-query syntax, generated class names, and CSS ordering.

### 2. CSS or Griffel emission

This translates the semantic result into implementation artifacts, including:

- `@media (forced-colors: active)` blocks
- selectors and generated classes
- declaration grouping
- component and slot scope
- cascade order
- specificity
- style-hook boundaries
- duplicated or normalized media-query output

Do not use emitter-level equality as a substitute for semantic equivalence.

## First action: inspect current work

Before editing:

1. Inspect the current branch and working tree.
2. Review the existing clean-room domain model, layered resolver, semantic resolver, renderer, property tests, stories, and documentation.
3. Identify whether forced colors is already represented and at which abstraction level.
4. Report any conflict between this addendum and the existing implementation.
5. Prefer a narrow extension over a redesign.
6. Do not overwrite uncommitted work.

If the current milestone is nearly complete, finish or stabilize it before integrating this refinement, unless doing so would preserve a known conceptual error.

## Domain-model refinement

Represent forced colors as an environmental mode, not as another product theme.

A suitable starting point is:

```ts
type ColorMode = "light" | "dark" | "forcedColors";

type SystemColorRole =
  | "Canvas"
  | "CanvasText"
  | "ButtonFace"
  | "ButtonText"
  | "GrayText"
  | "Highlight"
  | "HighlightText";

interface ForcedColorsContract {
  foregroundRole: SystemColorRole;
  backgroundRole: SystemColorRole;
  borderRole: SystemColorRole;
  focusRole: SystemColorRole;
  focusVisible: boolean;
  disabledDistinguishable: boolean;
  visibleBoundary: boolean;
}
```

Adapt the names to existing conventions. Keep the allowed roles deliberately small and document every role used.

Do not claim that this model exhaustively reproduces browser behavior. The model represents the accessibility contract being tested.

## Semantic transformation

If the current architecture exposes transformations, model forced-colors adaptation explicitly:

```ts
function applyForcedColorsPolicy(
  contract: ButtonStyleContract,
  input: ButtonCase,
): ButtonStyleContract;
```

If the current semantic resolver is direct rather than transformational, keep the direct resolver and expose the forced-colors decision as a named sub-resolution step:

```ts
function resolveForcedColorsContract(input: ButtonCase): ForcedColorsContract;
```

Avoid adding transformations solely to make the algebra look elegant.

## Protected precedence

Treat forced-colors outcomes as protected accessibility decisions.

Visual Refresh, product density, appearance, component extension, content configuration, and composition context may influence the correct semantic result, but ordinary product colors must not overwrite the final forced-colors contract.

Make precedence explicit in named rules. Do not depend on incidental function order.

Candidate conceptual ordering:

```text
component contract
→ visual-language specialization
→ product specialization
→ interaction and composition resolution
→ forced-colors accessibility resolution
→ CSS or Griffel emission
```

This ordering is a hypothesis. If the current implementation demonstrates a legitimate exception, document it and refine the model.

## Emission model

Add an explicit emission representation separate from the semantic style contract.

For example:

```ts
interface EmittedStyleRule {
  media?: string;
  selectorScope: string;
  declarations: Readonly<Record<string, string>>;
  precedence: number;
  sourceRule: string;
  component: string;
  slot?: string;
}

interface EmissionResult {
  rules: readonly EmittedStyleRule[];
}
```

Adapt this to the repository's existing style or Griffel abstractions. Do not build a full CSS parser.

The representation must retain enough information to determine whether two apparent duplicate rules are actually mergeable.

## Safe normalization experiment

Implement an experimental normalizer for forced-colors media-query output.

```ts
function normalizeForcedColorsEmission(result: EmissionResult): EmissionResult;
```

Normalization may merge or deduplicate rules only when doing so preserves all relevant dimensions, including:

- media condition
- selector or semantic scope
- component and slot ownership
- declarations
- declaration precedence
- cascade order where order is observable
- specificity assumptions represented by the model
- provenance needed for debugging

If the model cannot establish safety, keep the rules separate.

The goal is not maximum compression. The goal is the smallest emission that preserves declared semantics and modeled cascade behavior.

## Candidate laws and properties

Add named property-based tests for the following.

### 1. Forced-colors totality

Every valid forced-colors button case resolves to a complete forced-colors contract.

### 2. System-role restriction

Forced-colors output uses only approved system-color roles. Ordinary product color roles must not leak into the result.

### 3. Focus preservation

Every valid, interactive, focus-visible forced-colors case has a visible focus indicator with an approved system-color role.

### 4. Visible-boundary preservation

If ordinary styling relies on effects that may disappear in forced-colors mode, the forced-colors contract must still provide a visible component boundary where the model requires one.

### 5. Disabled-state distinguishability

Disabled controls remain semantically and visually distinguishable under the model's forced-colors contract.

### 6. Product-specialization preservation

Changing product or density must not remove forced-colors focus, system-role validity, visible boundaries, or disabled-state distinguishability.

### 7. Extension preservation

Extending a Button into modeled variants such as ToggleButton or split-button segments must preserve the foundational forced-colors guarantees unless the variant explicitly strengthens them.

### 8. Semantic idempotence

If forced-colors is represented as a transformation:

```text
F(F(C)) = F(C)
```

Compare normalized semantic contracts and exclude provenance from equality.

Do not apply this law if the architecture uses direct resolution rather than a transformation.

### 9. Protected-precedence law

Ordinary product styling applied after forced-colors resolution must either be rejected by the model or leave protected forced-colors fields unchanged.

### 10. Emission-semantic preservation

Rendering the normalized emission must produce the same modeled semantic outcome as rendering the original emission over the declared comparison subset.

Define the comparison subset and observable fields explicitly.

### 11. Safe-deduplication law

If normalization merges two forced-colors rules, the merge must preserve media condition, selector scope, declarations, precedence, and modeled cascade outcome.

### 12. Unsafe-merge rejection

Rules that look textually similar but differ in selector scope, slot ownership, precedence, or declaration behavior must not be merged.

### 13. Semantic-compression diagnostic

If many emitted rules correspond to one identical semantic decision, report this as a candidate missing abstraction or emitter optimization. Do not automatically convert the observation into an API recommendation.

## Property-based generators

Extend the existing `fast-check` model rather than creating a parallel test framework.

Generate valid combinations across the dimensions already present in the research package, including where available:

- component or variant
- product
- visual language
- appearance
- interaction state
- density
- composition context
- content and icon placement
- direction
- color mode

Bias some runs toward forced-colors configurations so that the mode receives meaningful coverage.

Generate emission-rule sets for normalization tests with controlled variations in:

- selector scope
- component and slot
- declarations
- precedence
- ordering
- equivalent and non-equivalent media-query text

Preserve minimized counterexamples as named regression fixtures.

## Deliberate fault injections

Add opt-in mutations, disabled by default, for at least these scenarios:

1. A product color override runs after forced-colors resolution and replaces a system-color role.
2. A ToggleButton or split-button extension omits the forced-colors focus rule.
3. A normalizer merges rules whose selectors differ.
4. A normalizer merges rules with conflicting declaration precedence.
5. A forced-colors rule loses the visible boundary when a box shadow is unavailable.
6. A disabled button resolves to the same modeled visual roles as an enabled button.

For each mutation, document the minimized counterexample and which law detected it.

## Storybook and visual checks

Extend the current visual program with a compact forced-colors section.

Include:

- Fluent baseline and Visual Refresh
- SharePoint and Teams product specializations if those products exist in the current model
- standard and compact density
- primary, subtle, tint, and any supported transparent appearance
- focus-visible and disabled states
- Button plus at least one extended or compound variant
- LTR and RTL where compound geometry is involved

Show side by side:

- semantic contract
- unnormalized emission
- normalized emission
- rendered output
- provenance or write history
- a field-level explanation of any rule that could not be deduplicated

Do not render the full Cartesian product in one story.

Where the existing test infrastructure supports forced-colors emulation, use it. If browser or Storybook infrastructure cannot faithfully emulate forced colors without unrelated changes, document the limitation and keep deterministic semantic and emission tests.

## Metrics

Add these metrics to the existing research report:

- number of semantic forced-colors decisions
- number of emitted forced-colors media-query rules
- number of exact duplicate rules
- number of safely normalized rules
- number of superficially similar but unsafe-to-merge rules
- number of fields overwritten after forced-colors resolution
- number of component or slot scopes requiring distinct output
- number of minimized counterexamples by category

Treat reduced rule count as useful only when semantic and cascade preservation tests continue to pass.

## Documentation updates

Update the existing research documents rather than creating redundant parallel documentation.

Add a focused section or document covering:

### Semantic policy versus CSS emission

Explain why "forced colors should preserve focus and visible boundaries" is a semantic property, while repeated `@media (forced-colors: active)` blocks are an implementation artifact.

### What the Griffel observation may indicate

Discuss three possibilities:

1. **Emitter limitation:** equivalent media queries are emitted repeatedly even though the semantic model is adequate.
2. **Abstraction gap:** one accessibility policy is copied across components, states, or slots because no first-class semantic seam exists.
3. **Necessary contextual variation:** the rules appear duplicated but differ in selector scope, precedence, component extension, or state behavior and must remain separate.

The experiment should distinguish these rather than assuming one explanation.

### Limits of the model

State clearly that:

- passing semantic properties does not prove browser rendering correctness
- normalized model output does not prove Griffel can safely perform the same optimization
- actual CSS cascade, browser paint-time forced-color behavior, native element semantics, and accessibility APIs require integration and browser validation
- media-query deduplication is not itself a substitute for better semantics

## Acceptance criteria

This addendum is complete when:

1. The existing branch and package remain intact.
2. Semantic forced-colors policy is clearly separated from CSS or Griffel emission.
3. Forced-colors precedence is explicit and protected.
4. At least ten relevant properties run under `fast-check`.
5. At least four unsafe or broken scenarios shrink to useful counterexamples.
6. The normalizer merges only rules proven equivalent under the model.
7. Unsafe apparent duplicates remain separate and have an explanation.
8. The visual or Storybook program includes forced-colors reference cases.
9. Documentation explains whether observed duplication appears to be emitter inefficiency, abstraction gap, necessary contextual variation, or a mixture.
10. All applicable lint, type-check, test, and build commands pass.
11. No unrelated package behavior or public exports change.
12. The final report recommends the smallest next step without presupposing a Griffel change, Fluent API change, or CAP-theme refactor.

## Required final report

Report:

1. How forced colors was represented before this refinement
2. What changed
3. Which semantic laws passed or failed
4. Which failures indicated implementation bugs versus invalid laws
5. How many emitted rules were safely normalized
6. Which apparent duplicates were not safe to merge and why
7. Whether the evidence points primarily to emitter duplication, missing semantics, legitimate contextual differences, or a combination
8. Any candidate Fluent, CAP, or Griffel seam suggested by the evidence
9. The smallest valuable follow-up experiment

## Final instruction

Integrate this as a focused refinement of the current research program. Do not restart the work. The central purpose is to separate **one semantic accessibility policy** from **the many media-query rules used to emit that policy**, then test where compression is valid, where composition breaks, and where apparent duplication encodes real contextual differences.
