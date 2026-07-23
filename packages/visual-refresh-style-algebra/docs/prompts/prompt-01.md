# GitHub Copilot Prompt: Visual Refresh Style Algebra Research Program, Revised from Presentation Evidence

## Role

Act as a senior TypeScript research engineer working inside my fork of `microsoft/fluentui-contrib`.

Your task is to set up a small, rigorous, executable research program for studying Visual Refresh styling as a system of composable transformations. The first case study is button styling inspired by the concrete problems described by Natalie Wainwright in UXE Crit: Fluent base styling, Visual Refresh changes, product-specific specialization, interaction states, accessibility modes, and compound button variants can interact in ways that produce large override surfaces and hard-to-diagnose failures.

The research should test whether these styling layers contain a smaller implicit algebra that can be made explicit through:

- a clean-room semantic model
- a deliberately awkward layered-override model
- explicit modeling of component anatomy and supported appearances
- property-based testing with `fast-check`
- a small visual test matrix
- optional formalization notes that could later be translated into Lean

The motivating evidence is Natalie's Visual Refresh presentation. Treat the following presentation statements as source observations, not as requirements that have already been generalized:

- The simple concept was changing border radius and padding.
- The reported reality included a new appearance, conditional asymmetrical padding, spacing that did not conform to available tokens, alteration of every Fluent style, adding and deleting appearances, a new color option, restructuring children, reconstructing the icon slot, more than 12 font-color conditions, and accessibility reassessment.
- The presentation compared two button strategies: 600 lines of Fluent styles plus 340 lines of overrides, for 940 lines total, versus 400 lines for replacement styles.
- The override strategy retained existing Fluent styling and some upstream bug and accessibility fixes, but made broad overrides, extension, and high-contrast media-query handling difficult.
- The replacement strategy made styles, extension, and high-contrast handling cleaner, but transferred responsibility for every state, condition, niche case, bug fix, and accessibility concern.
- The product-alignment example showed a 36 px Visual Refresh treatment and a 32 px Teams treatment, making product density a concrete specialization case rather than a hypothetical axis.
- The scaling questions were how to minimize design-system rework, minimize feature-code rework, and prevent further product misalignment.

Do not infer unlisted pixel values or private implementation details from these observations. Where the presentation does not specify an exact rule, encode a documented model assumption and make it easy to replace.

This is an exploratory research package, not a production replacement for `@fluentui-contrib/react-cap-theme`.

## Primary objectives

1. Create a self-contained research package in this monorepo.
2. Model a realistic but minimal button styling problem.
3. Implement two competing architectures:
   - a layered override pipeline resembling the practical structure of Fluent base styles plus Visual Refresh and product overrides
   - a semantic resolver that computes the result from explicit concepts rather than patching prior output
4. Express candidate preservation laws as executable properties.
5. Use property-based testing to search a broad configuration space and shrink failures to minimal counterexamples.
6. Add a small Storybook matrix for human inspection and visual regression.
7. Document findings, assumptions, limitations, and candidate design-system abstractions.
8. Keep the package isolated so that no production package behavior changes.
9. Measure complexity in more than lines of code, while retaining the presentation's 940-line versus 400-line comparison as an empirical motivation.
10. Determine whether anatomy, supported-appearance domains, density, state resolution, and protected accessibility handling are missing first-class abstractions.

## Non-goals

Do not:

- modify `@fluentui-contrib/react-cap-theme` behavior
- claim to reproduce the private or complete Visual Refresh specification
- copy private production source into the model
- clone the full Fluent Button implementation
- model every CSS property or browser behavior
- treat line count alone as a sufficient measure of complexity
- assume the 400-line replacement strategy is automatically superior to the 940-line layered strategy
- introduce a new public API for consumers
- publish the package to npm
- use AI-generated invariants as unquestioned truth
- treat object equality as equivalent to visual or behavioral correctness without documenting the limitation
- add Lean as a build dependency in the first iteration

## Repository and branch setup

First inspect the repository rather than assuming its current commands or folder conventions.

1. Read:
   - the root `README.md`
   - `CONTRIBUTING.md`
   - `AGENTS.md`, if present
   - the root `package.json`
   - `nx.json`
   - the package and project configuration for `packages/react-cap-theme`
   - current test and Storybook conventions in nearby packages
2. Determine the repository's actual package generator, naming conventions, task names, lint rules, test framework, Storybook format, and change-file requirements.
3. Report the findings briefly before editing.
4. Confirm the working tree is clean. If it is not clean, do not discard or overwrite existing work. Report the conflict and continue only with changes that are clearly isolated.
5. Fetch remotes if network access is available. If not, proceed from the current local state and state that the branch point was not refreshed.
6. Create and switch to this branch unless it already exists:

```text
research/visual-refresh-style-algebra
```

7. Do not force-push, rewrite history, or delete branches.
8. Make small, coherent commits after each successful phase. Suggested commit sequence:

```text
chore(research): scaffold visual refresh style algebra package
feat(research): add clean-room button domain model
feat(research): add layered and semantic resolvers
 test(research): add preservation properties with fast-check
feat(research): add visual matrix and counterexample stories
docs(research): document hypotheses and findings
```

Correct the accidental leading space in the fourth suggested commit message if using it.

## Package placement and name

Prefer a new private, non-published package under:

```text
packages/visual-refresh-style-algebra
```

If repository naming rules require a React prefix or another form, select the closest compliant name and document the deviation.

The package should be clearly labeled as experimental research. Configure it so that it cannot be accidentally published. Do not change public exports from other packages.

## Research question

Use this as the central question:

> Can a small semantic model reproduce the meaningful outcomes of layered and replacement-style Visual Refresh button implementations while requiring fewer overlapping decisions, exposing clearer customization seams, and preserving shared behavioral, accessibility, anatomy, appearance-domain, and composition guarantees across product, state, and context?

Treat this as a falsifiable hypothesis, not a conclusion.

## Motivating scenario

Model the following pressures without copying production code:

- Fluent supplies a baseline component contract and baseline visual treatment.
- The initial Visual Refresh concept looks like a small border-radius and padding transformation.
- The concrete presentation says the real transformation may change shape, spacing, height, typography, colors, appearances, child structure, and icon-slot construction.
- Conditional asymmetrical padding means spacing can depend on content and slot placement, not merely on one horizontal-padding token.
- Some requested spacing is not expressible through the available token system.
- Supported appearances can be added or removed, so the valid input domain itself can change by visual language and product.
- Font-color resolution can involve more than 12 conditions, making state and contextual color resolution a central case study.
- A product may need a compact density that differs from the shared Visual Refresh treatment. Use 36 px versus 32 px as a documented presentation-derived reference scenario, not as a universal Fluent rule.
- Styling varies by interaction state.
- forced-colors mode must preserve meaningful system-color behavior and visible focus.
- icon-only and text-containing buttons may require different spacing.
- icon-before, icon-after, and reconstructed icon-slot cases may require different anatomy and directional behavior.
- a button may participate in a compound control such as a split button.
- specialization must not silently erase foundational guarantees.
- order-sensitive override layers can create failures that are difficult to see in ordinary example tests.
- replacement styling may reduce local code and improve control while losing inherited knowledge, so the experiment must compare ownership and obligations rather than assuming one strategy wins.

## Minimal configuration space

Start with these axes. Keep the model small enough to understand, but do not collapse the dimensions that create the motivating interactions.

```ts
type Product = "fluent" | "sharepoint" | "teams";
type VisualLanguage = "fluent2" | "visualRefresh";
type Density = "standard" | "compact";
type Appearance = "primary" | "subtle" | "transparent" | "tint";
type InteractionState = "rest" | "hover" | "pressed" | "focusVisible" | "disabled";
type ColorMode = "light" | "dark" | "forcedColors";
type ContentKind = "text" | "iconOnly" | "textAndIcon";
type IconPlacement = "none" | "before" | "after" | "only";
type AnatomyPolicy = "fluentDefault" | "visualRefreshReconstructed";
type CompositionContext = "standalone" | "toolbar" | "splitButtonStart" | "splitButtonEnd";
type Direction = "ltr" | "rtl";

interface ButtonCase {
  product: Product;
  visualLanguage: VisualLanguage;
  density: Density;
  appearance: Appearance;
  interactionState: InteractionState;
  colorMode: ColorMode;
  contentKind: ContentKind;
  iconPlacement: IconPlacement;
  anatomyPolicy: AnatomyPolicy;
  compositionContext: CompositionContext;
  direction: Direction;
}
```

Do not generate impossible cases indiscriminately. Implement an explicit validity predicate or constraint-aware arbitrary. Document every excluded combination and why it is excluded.

Add an explicit supported-domain function:

```ts
function supportedAppearances(
  input: Pick<ButtonCase, "product" | "visualLanguage">,
): readonly Appearance[];
```

The generator must select appearances from this function rather than generate an appearance first and filter most cases afterward. This models the presentation's observation that Visual Refresh can add and delete appearances.

Validate relationships between `contentKind` and `iconPlacement`, including:

- `text` requires `none`
- `iconOnly` requires `only`
- `textAndIcon` permits `before` or `after`

If the model later finds that these constraints are too strict for a real case, record the counterexample and revise the domain explicitly.

## Semantic output contract

The theory layer should return a typed semantic contract before any CSS is emitted. Use semantic roles where practical rather than raw color literals.

Begin with a structure like this, refining names as needed:

```ts
interface ButtonStyleContract {
  geometry: {
    blockSize: number;
    minInlineSize: number;
    paddingInlineStart: number;
    paddingInlineEnd: number;
    gap: number;
  };
  shape: {
    radiusStartStart: number;
    radiusStartEnd: number;
    radiusEndStart: number;
    radiusEndEnd: number;
  };
  appearance: {
    foregroundRole: SemanticColorRole;
    backgroundRole: SemanticColorRole;
    borderRole: SemanticColorRole;
  };
  typography: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };
  anatomy: {
    orderedSlots: readonly ButtonSlot[];
    iconPlacement: IconPlacement;
    accessibleNameSource: "text" | "ariaLabel";
  };
  supportedDomain: {
    appearanceSupported: boolean;
    supportedStates: readonly InteractionState[];
  };
  validationObligations: readonly ValidationObligation[];
  focus: {
    visible: boolean;
    colorRole: SemanticColorRole;
    width: number;
    offset: number;
  };
  capabilities: {
    interactive: boolean;
    supportsKeyboardActivation: boolean;
    exposesDisabledState: boolean;
  };
  provenance: readonly StyleDecision[];
}
```

`provenance` should make the model explainable. Each important decision should record the conceptual rule that selected it, such as product density, Visual Refresh shape, conditional content-aware padding, supported-appearance selection, anatomy reconstruction, interaction-state color resolution, compound-edge geometry, or forced-colors protection.

`validationObligations` should identify aspects requiring downstream validation because the transformation changed structure or responsibility. Candidate obligations include focus visibility, forced-colors behavior, accessible naming after slot reconstruction, state completeness, text overflow, and compound-control geometry. Do not treat obligation generation as proof that the obligation has been satisfied.

Do not let provenance affect semantic equality comparisons.

## Architecture A: layered override model

Implement a deliberately explicit pipeline that resembles the operational pressure of existing systems:

```ts
resolveLayeredButton(buttonCase)
  |> applyFluentBase
  |> applyVisualRefreshOverrides
  |> applyProductOverrides
  |> applyContextOverrides
  |> applyInteractionOverrides
  |> applyForcedColorsOverrides
```

Use a complete intermediate style object so that later stages overwrite earlier values. Keep the code readable and avoid contrived bugs in the initial implementation.

The purpose is to expose:

- order sensitivity
- overlapping ownership of properties
- duplicated conditions
- accidental coupling
- the difficulty of knowing which guarantees remain valid

Instrument the implementation so a test can report which layers wrote each field and where a later layer replaced a prior decision.

## Architecture B: semantic resolver

Implement a resolver that derives output from explicit concepts rather than mutating a prior complete style object:

```ts
function resolveSemanticButton(input: ButtonCase): ButtonStyleContract {
  return {
    geometry: resolveGeometry(input),
    shape: resolveShape(input),
    appearance: resolveAppearance(input),
    typography: resolveTypography(input),
    anatomy: resolveAnatomy(input),
    supportedDomain: resolveSupportedDomain(input),
    validationObligations: deriveValidationObligations(input),
    focus: resolveFocus(input),
    capabilities: resolveCapabilities(input),
    provenance: collectDecisions(input),
  };
}
```

Separate independent concerns where the evidence supports separation. If two concerns cannot be separated without losing accuracy, document the coupling rather than forcing an elegant abstraction.

The semantic resolver is the candidate theory. It must earn credibility through tests and explanatory value.

## CSS and rendering adapter

Create a thin rendering layer that maps `ButtonStyleContract` to either CSS custom properties or Griffel styles, based on the most natural existing repository convention.

Requirements:

- Keep semantic resolution independent from React and CSS.
- Use the same renderer for contracts produced by both architectures.
- Render a small accessible button or button-like test component.
- Preserve native button semantics.
- Do not recreate Fluent's behavioral implementation.
- Add stable `data-*` attributes for visual and DOM assertions.
- Ensure forced-colors rules can be inspected in Storybook and browser tests.

## Candidate preservation laws

Implement the following as named, documented properties. Distinguish universal laws from provisional hypotheses.

### 1. Totality over valid cases

Every valid `ButtonCase` resolves to a complete style contract with no missing, `NaN`, infinite, or invalid values.

### 2. Behavioral preservation

Changing visual language, product, density, appearance, or composition context must not remove keyboard activation or native disabled semantics.

### 3. Focus preservation

For `focusVisible`, every valid interactive case must resolve to a visible focus treatment. Product specialization, Visual Refresh, compact density, and compound composition must not erase it.

### 4. Forced-colors preservation

In `forcedColors`, foreground, background, border, and focus treatments must resolve only to the approved system-color roles defined by the model. Ordinary product color roles must not leak into the forced-colors result.

### 5. State completeness

Every supported appearance must resolve all supported interaction states. A state must not be represented by an undefined fallback that silently inherits an unrelated prior rule.

### 6. Density locality

Changing density may affect geometry and tightly related typography, but must not change semantic role, interaction capability, disabled behavior, or forced-colors guarantees.

Start with a narrower version if typography coupling makes the stronger claim false.

### 7. Product-specialization preservation

Changing product may specialize allowed visual dimensions, but it must preserve behavior, accessibility capabilities, state coverage, and semantic action role.

### 8. Compound-shape coherence

For split-button segments, internal joined edges should compose without a doubled exterior radius, while the outer edges retain the product and visual-language shape policy. Include RTL.

### 9. Idempotence where applicable

If a transformation is modeled as an operation, applying the same policy twice should not change the semantic result after the first application.

Do not assert idempotence for a resolver that does not expose transformations. State precisely which function the property governs.

### 10. Explicit precedence

If two policies legitimately affect the same field, the winner must be defined by a named rule rather than incidental function order. Add a test that fails if reordering independent pipeline stages changes output unexpectedly.

### 11. Observational equivalence

For an agreed subset of supported cases, the layered resolver and semantic resolver should render equivalent meaningful output.

Define equivalence explicitly. It may compare semantic contracts with normalized provenance removed, selected computed styles, DOM geometry, or screenshots. Do not claim full equivalence if the comparison is partial.

### 12. Minimality experiments

For selected semantic decisions, test whether removing a rule causes some valid case to violate a preservation law or reference expectation. Treat this as an experiment in rule necessity, not a formal proof of global minimality.

### 13. Supported-domain correctness

Each product and visual-language pair must expose exactly the appearances declared by `supportedAppearances`. Unsupported appearances must fail explicitly rather than accidentally inheriting baseline styles.

### 14. Anatomy and accessible-name preservation

Reconstructing or reordering children must preserve a valid slot structure and an accessible-name source. For icon-only buttons, the model must require an explicit accessible label.

### 15. Conditional-padding coherence

Content and icon placement may alter inline padding asymmetrically, but the rule must remain direction-aware, preserve minimum geometry, and avoid unexplained product-specific literals. Mirrored LTR and RTL cases should produce logically mirrored start and end decisions where the composition permits it.

### 16. Validation-obligation monotonicity

A transformation that assumes more styling or structural responsibility must not silently reduce required validation obligations. For example, replacing baseline styling or reconstructing slots should add or retain relevant accessibility and state-coverage obligations.

### 17. Version-boundary stability

A frozen design-language version must resolve deterministically for the same valid input. Experimental redesign changes should be represented as a new explicit policy or version fixture rather than silently rewriting historical expectations.

Start with a lightweight fixture-based representation rather than a generalized versioning framework.

## Property-based testing

Use `fast-check` and follow current repository testing conventions.

Create:

- reusable arbitraries for every axis
- a constraint-aware `buttonCaseArbitrary`
- metamorphic tests that modify one dimension at a time
- differential tests between the two resolvers
- deterministic seeds for checked-in regression cases
- readable counterexample formatting

When a property fails:

1. Preserve the minimized counterexample in test output.
2. Add the smallest important failure as a named regression fixture.
3. Explain whether the failure indicates:
   - an implementation bug
   - an invalid law
   - a missing semantic dimension
   - an incorrect validity constraint
   - a true order dependency
4. Do not weaken a property merely to make the suite pass without documenting the decision.

Start with moderate run counts appropriate for local and CI execution. Provide a documented command or environment variable for a deeper research run.

Suggested distinction:

- normal CI: fast deterministic property suite
- deep run: higher `numRuns`, intentionally invoked

Use the repository's package manager and scripts, not assumed global commands.

## Deliberate mutation experiments

After the correct baseline passes, add a small opt-in mutation or fault-injection mechanism that can demonstrate the value of the laws. Examples:

- product override erases focus visibility
- a deleted appearance silently inherits Fluent baseline styling
- icon-slot reconstruction loses the accessible-name source
- asymmetric padding fails to mirror under RTL
- forced-colors stage runs before a product color override
- compact density accidentally changes a semantic color role
- split-button end radius is incorrect in RTL
- one appearance lacks a pressed-state mapping

These mutations must be disabled by default and clearly marked as teaching or research fixtures. A normal test run must pass.

Document the minimum counterexample each mutation produces.

## Visual test program

Add Storybook stories that render both architectures side by side.

### Curated matrix

Include a deliberately small matrix covering:

- Fluent baseline versus Visual Refresh
- SharePoint and Teams specialization
- standard and compact density
- primary, subtle, and tint appearances
- rest, hover, pressed, focus-visible, and disabled states
- light, dark, and forced-colors modes
- text, icon-only, and text-plus-icon content
- icon-before and icon-after cases with conditional asymmetrical padding
- baseline and reconstructed anatomy
- supported and intentionally unsupported appearance cases
- standalone, toolbar, and split-button composition
- RTL for at least the compound-control cases

Do not render the entire Cartesian product in a single story.

### Counterexample story

Add a story that accepts or imports serialized minimized `ButtonCase` fixtures and displays:

- the input dimensions
- layered output
- semantic output
- field-level differences
- provenance or write history
- the rendered buttons

### Visual assertions

Use the repository's existing visual-test mechanism if one exists and can be used without changing unrelated infrastructure.

Focus assertions on relationships rather than brittle, arbitrary pixels:

- label remains visually centered
- focus indicator is not clipped
- text does not overflow within supported cases
- compact controls are not taller than standard controls for the same size policy
- split-button outer shape remains coherent
- forced-colors mode exposes visible boundaries and focus
- 36 px and 32 px reference cases render as distinct, intentional density policies
- icon-slot reconstruction preserves accessible naming
- directional asymmetric padding mirrors coherently in RTL

If automated screenshot infrastructure cannot be added locally without unrelated changes, still add deterministic Storybook stories and document the missing automation precisely.

## Connection to the existing CAP implementation

Treat `packages/react-cap-theme` and `packages/cap-foundations` as empirical reference points, not as code to duplicate.

Inspect them for:

- package structure
- Storybook conventions
- style-hook architecture
- current button-related customization concepts
- token and foundation organization
- tests and visual examples

Document similarities and differences in research notes.

Do not import internal implementation modules merely to make the clean-room model pass. A limited public-package integration story may be added later, but keep it out of the theory core.

## Optional reference adapter

If it is straightforward and does not compromise isolation, add a separate adapter or Storybook story that renders the public Fluent Button and the current CAP theme next to the clean-room renderers.

This is an observational reference only. Do not characterize the clean-room model as equivalent to production based on a few screenshots.

Skip this adapter if it creates dependency instability or significant scope expansion. Record the reason.

## Documentation

Create the following documents inside the package.

### `README.md`

Include:

- purpose
- research question
- relationship to Visual Refresh and `react-cap-theme`
- why two implementations exist
- how to run unit tests, property tests, deep property tests, Storybook, and visual tests
- current status
- non-goals
- warning that this is research code

### `docs/model.md`

Explain:

- configuration axes
- validity constraints
- semantic output contract
- layered override pipeline
- semantic resolver
- renderer boundary
- what has intentionally been omitted

### `docs/laws.md`

For every law, include:

- name
- plain-language statement
- formal-ish statement or pseudocode
- classification: invariant, metamorphic relation, equivalence claim, or optimization hypothesis
- evidence source
- test location
- confidence level
- known counterexamples or unresolved questions

### `docs/experiments.md`

Keep a research log containing:

- hypothesis
- setup
- result
- minimized counterexample
- interpretation
- next question

Start it with the deliberate mutation experiments.

### `docs/abstraction-candidates.md`

Record abstractions suggested by repeated rules or failures, such as:

- density as a first-class policy, grounded by the 36 px versus 32 px product example
- supported appearance domains by visual language and product
- anatomy and slot policy, including icon-slot reconstruction
- content-aware and direction-aware asymmetric spacing
- semantic foreground resolution by appearance and state
- protected accessibility resolution
- joined versus independent shape semantics
- content-aware spacing
- explicit product specialization seams

For each candidate state whether the evidence suggests a token, component prop, context, style hook, variant, composition API, or merely internal implementation structure.

Do not turn tentative findings into API recommendations without evidence.

### `docs/lean-roadmap.md`

Do not add Lean yet. Instead identify which abstractions are sufficiently discrete for later formalization, for example:

- finite configuration types
- valid-case predicate
- supported-appearance domain
- semantic style and anatomy contract
- forced-colors preservation
- density locality
- compound-shape coherence
- resolver determinism

Explain what Lean could prove about the abstract model and what it cannot prove about CSS, browser rendering, accessibility APIs, or the production implementation without a validated correspondence layer.

### `docs/research-charter.md`

Include:

- motivating problem
- falsifiable hypothesis
- success and failure criteria
- clean-room rules
- scope boundaries
- how evidence will be collected
- presentation-derived observations, including the 940-line layered and 400-line replacement comparison
- why line count is an input to the study but not the optimization objective by itself
- how findings may inform `react-cap-theme`, CAP foundations, Fluent APIs, tokens, or future RFCs without presupposing those outcomes

## Suggested source layout

Adapt to repository conventions, but aim for this separation:

```text
packages/visual-refresh-style-algebra/
  README.md
  docs/
    research-charter.md
    model.md
    laws.md
    experiments.md
    abstraction-candidates.md
    lean-roadmap.md
  src/
    domain/
      ButtonCase.ts
      ButtonStyleContract.ts
      ButtonAnatomy.ts
      SupportedDomain.ts
      ValidationObligation.ts
      SemanticColorRole.ts
      validity.ts
    layered/
      fluentBase.ts
      visualRefreshOverrides.ts
      productOverrides.ts
      contextOverrides.ts
      interactionOverrides.ts
      forcedColorsOverrides.ts
      resolveLayeredButton.ts
      writeHistory.ts
    semantic/
      resolveGeometry.ts
      resolveShape.ts
      resolveAppearance.ts
      resolveTypography.ts
      resolveAnatomy.ts
      resolveSupportedDomain.ts
      deriveValidationObligations.ts
      resolveFocus.ts
      resolveCapabilities.ts
      resolveSemanticButton.ts
    render/
      contractToStyles.ts
      CleanRoomButton.tsx
    comparison/
      normalizeContract.ts
      compareContracts.ts
      formatCounterexample.ts
    testing/
      arbitraries.ts
      fixtures.ts
      mutations.ts
    index.ts
  stories/
    ButtonComparison.stories.tsx
    ButtonMatrix.stories.tsx
    Counterexamples.stories.tsx
  tests/
    totality.property.test.ts
    behavior.property.test.ts
    focus.property.test.ts
    forcedColors.property.test.ts
    stateCompleteness.property.test.ts
    densityLocality.property.test.ts
    productSpecialization.property.test.ts
    compoundShape.property.test.ts
    precedence.property.test.ts
    equivalence.property.test.ts
    supportedDomain.property.test.ts
    anatomy.property.test.ts
    conditionalPadding.property.test.ts
    validationObligations.property.test.ts
    versionBoundary.test.ts
    regression.test.ts
```

## Implementation quality requirements

- Use strict TypeScript.
- Prefer exhaustive switches with `assertNever` or the repository equivalent.
- Avoid `any`.
- Make units explicit for numeric style values.
- Keep domain functions pure.
- Keep React and CSS out of the semantic model.
- Use named rules, not unexplained conditionals.
- Comment the reason for a rule, not the syntax.
- Make invalid states unrepresentable where reasonable, but do not over-engineer the initial types.
- Keep the initial source small enough for a human to audit.
- Avoid generic framework-building that is not needed for the button case.
- Preserve repository formatting, linting, licensing, and test conventions.
- Do not introduce unrelated dependency upgrades.

## Evidence and epistemic discipline

Label claims in documentation as one of:

- observed in the clean-room implementation
- observed in Natalie's Visual Refresh presentation
- observed in the existing public CAP package
- derived from a stated model assumption
- supported by a property test
- supported by a visual test
- conjectured abstraction
- unresolved

Never describe a passing property test as a mathematical proof. Never describe a Lean proof about the abstract model as proof that browsers or production CSS behave correctly unless a correspondence argument has been established.

AI may propose candidate laws and abstractions, but a human design-system owner must decide whether a property represents a real product requirement, an incidental property of current code, a historical workaround, or an obsolete constraint.

## Comparative research metrics

Collect these metrics for both architectures. Treat them as descriptive evidence, not as a universal score:

- source lines in the research implementation
- number of named rules
- number of conditions
- number of fields written by more than one layer
- number of order-sensitive stage pairs
- number of supported and rejected configuration cases
- number and category of validation obligations emitted
- number of property failures and minimized counterexamples
- number of visual regression fixtures
- degree of agreement between layered and semantic outputs over the declared equivalence subset
- whether a product difference is expressed once as policy or repeated across component rules

Include the presentation's 940-line override total and 400-line replacement total only as external motivating observations. Do not compare these production-scale figures directly to clean-room line counts as if the scopes were equal.

## Initial acceptance criteria

The first complete milestone should satisfy all of the following:

1. New research branch exists and is checked out.
2. New private package builds without changing production package exports.
3. Domain model and validity predicate are documented.
4. Layered and semantic resolvers both exist.
5. Both resolvers use the same rendering adapter.
6. At least twelve named preservation properties run with `fast-check`, including supported-domain, anatomy, and conditional-padding properties.
7. At least five opt-in mutation experiments demonstrate useful shrinking, including one unsupported-appearance and one anatomy failure.
8. Curated Storybook comparison and matrix stories render.
9. At least one split-button case covers RTL.
10. At least one forced-colors focus-visible case is covered by both PBT and Storybook.
11. The 36 px Visual Refresh and 32 px Teams reference scenario is represented as explicit policy data with a cited model note, not scattered literals.
12. Conditional asymmetrical padding is covered for icon-before, icon-after, LTR, and RTL.
13. A reconstructed icon-slot case preserves accessible naming and emits validation obligations.
14. Supported appearance addition and deletion are explicit and tested.
15. Regression fixtures preserve meaningful minimized counterexamples.
16. Documentation distinguishes presentation observations, public-package observations, model assumptions, tested properties, and conjectures.
17. Complexity reporting includes rule count, overlapping field ownership, condition count, unsupported-domain handling, validation obligations, and code size. Do not rank architectures by line count alone.
18. All applicable lint, type-check, unit-test, and build commands pass.
19. No unrelated files are modified.
20. Final report lists changed files, commands run, results, unresolved issues, and recommended next experiment.

## Execution sequence

Proceed in phases and validate after each phase.

### Phase 0: inspect and plan

- inspect repository conventions
- inspect `react-cap-theme` and `cap-foundations`
- identify exact commands
- create branch
- propose final package name and layout

### Phase 1: scaffold

- generate or create the package using repository-supported mechanisms
- mark it private and non-published
- add minimal build, test, lint, and Storybook wiring
- validate package tasks

### Phase 2: model

- implement finite configuration types
- implement validity constraints and supported-appearance domains
- implement semantic style, anatomy, and validation-obligation contracts
- encode the 36 px versus 32 px reference scenario as named policy data
- implement content-aware asymmetric-padding assumptions with explicit provenance
- add exhaustive unit tests for validity boundaries

### Phase 3: two architectures

- implement layered override pipeline with write history
- implement semantic resolver with provenance
- add normalization and comparison utilities

### Phase 4: properties

- add fast-check arbitraries
- implement preservation laws
- capture failures as regression fixtures
- add deep-run command

### Phase 5: visual program

- add shared renderer
- add comparison matrix
- add counterexample viewer
- add visual tests using existing infrastructure where practical

### Phase 6: controlled failures

- add opt-in mutations
- verify that relevant laws detect and shrink each mutation
- document minimized cases

### Phase 7: documentation and review

- complete all research documents
- audit claims for evidence level
- run all relevant checks
- report results and open questions

## Required progress reporting

Before making edits, print:

- branch point and current branch
- relevant repository conventions found
- proposed package path
- exact commands you intend to use
- any deviations from this prompt

After each phase, print:

- files changed
- checks run
- whether checks passed
- significant findings or counterexamples
- the next phase

At the end, print a concise research report with:

1. What was implemented
2. What passed
3. What failed or remains unresolved
4. Which laws appear useful
5. Which laws were too strong or underspecified
6. What minimized counterexamples revealed
7. Candidate semantic tokens, anatomy contracts, supported-domain APIs, or customization seams suggested by the experiment
8. How the results compare with the presentation's override-versus-replacement tradeoff, without using line count as the sole criterion
9. Whether the clean-room model should remain in Contrib, move to a separate research repo, inform `react-cap-theme`, or motivate a Fluent RFC
10. The smallest valuable next experiment

## Stop conditions

Stop and report rather than improvising if:

- repository instructions conflict with this prompt
- the package generator would modify extensive unrelated infrastructure
- required dependencies cannot be added without broad version churn
- existing uncommitted work would be overwritten
- tests reveal that the model needs a new semantic dimension before further work is meaningful
- implementing browser visual automation would require unrelated CI changes

Do not stop merely because a property fails. A minimized failure may be the most valuable research output.

## Final instruction

Begin with Phase 0. Inspect first, state the plan grounded in the repository as it exists, then execute the setup. Keep the first implementation deliberately small, auditable, and falsifiable. The purpose is not to prove that a preferred abstraction is correct. The purpose is to create an executable environment in which layered styling assumptions, preservation laws, and better semantic structures can be challenged with concrete counterexamples.
