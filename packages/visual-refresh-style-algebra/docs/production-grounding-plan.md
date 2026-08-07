# Production grounding plan

## Status

In progress. The content/icon slice now has pinned source metadata, twelve executable production observations, an
observation-to-model mapper, parity and mutation tests, six React-child edge cases, a Storybook evidence table, and an
attributed census explanation. The remaining axes and any resulting type evolution are not yet complete. This work
does not change production packages or claim that current CAP behavior is the desired product contract.

## Motivation

The clean-room model currently starts from a finite `ButtonCase` domain and uses an explicit validity predicate to
reduce a raw Cartesian space of 138,240 tuples to 27,840 valid cases. Some reductions are research assumptions. In
particular, the content/icon matrix was prescribed by the initial experiment rather than inferred from the public
Fluent Button API or the VR CAP implementation.

This distinction is documented, but the census can still be read as an empirical inventory of production CAP. The
next phase should make the relationship executable: observe the real public pipeline, map those observations into the
research vocabulary, and identify every place where the model preserves, canonicalizes, excludes, or cannot represent
production behavior.

## Objective

Build an auditable bridge from public Fluent Button inputs through normalized state, rendered anatomy, and VR CAP
style selection into the clean-room semantic model.

The bridge should answer four questions for each modeled rule:

1. What public production behavior was observed?
2. How does the research model interpret that observation?
3. What information is lost or canonicalized by the interpretation?
4. Which part remains a product decision or model assumption?

The result should let the case census distinguish production evidence from research policy instead of presenting one
undifferentiated notion of validity.

## Non-goals

- Do not import the research package from a production package or alter production behavior.
- Do not copy private specifications or treat public implementation details as product requirements.
- Do not mechanically translate every CAP conditional into the semantic model.
- Do not claim that TypeScript constructibility proves product support, accessibility, or meaningful rendering.
- Do not replace runtime validation at JSON, URL, fixture, or Storybook-control boundaries.
- Do not expand all axes at once. Establish the method on content and icon anatomy first.
- Do not make the census number stable at the expense of stronger evidence. A grounded census may change 27,840.

## Evidence rules

Retain the evidence categories from the research charter and make their application more precise:

- **Production observation:** behavior obtained by exercising a named public Fluent or VR CAP boundary at a pinned
  dependency version or commit.
- **Derived interpretation:** the research vocabulary assigned to one or more production observations. This is a
  lossy mapping and must name what it discards.
- **Model assumption:** a replaceable policy not established by production behavior. It must include a rationale and a
  concrete observation that would falsify it.
- **Tested property:** a claim exercised over generated or exhaustive cases. Passing establishes consistency with the
  inputs and oracle, not provenance or product intent.
- **Browser observation:** rendered structure, selected CSS, or computed behavior observed in named browser engines.
- **Product decision:** an explicit support requirement supplied by the owning product or design-system team. Absence
  of a product decision must remain visible rather than being synthesized from implementation behavior.

Production evidence records should prefer package, exported symbol, dependency version or commit, scenario identity,
and observed behavior over line-number citations. Lines move; a focused observation test and stable symbol provide a
more durable anchor.

## Terms

Use distinct terms for distinct claims:

- **Constructible:** accepted by the public TypeScript input surface.
- **Normalizable:** accepted by Fluent normalization and represented as component state without failure.
- **Rendered:** produces an observable DOM anatomy.
- **CAP-classified:** selects a relevant branch in the VR CAP style hooks.
- **Product-supported:** intentionally supported according to an explicit product decision or public contract.
- **Represented:** has a corresponding clean-room case.
- **Canonicalized:** maps multiple production scenarios to one research case because their modeled semantics are
  equivalent.
- **Excluded:** intentionally outside the research domain, with evidence and rationale.
- **Unrepresented:** observed in production but not expressible by the current research domain.

Only use **invalid** when a public contract, runtime rejection, accessibility rule, or explicit product decision
establishes invalidity. A redundant or currently unmodeled input is not automatically invalid.

## Production pipeline under observation

The initial harness should observe four boundaries without reimplementing their decisions:

1. **Public input:** `ButtonProps` from `@fluentui/react-button` defines the typed construction surface inherited by
   VR CAP.
2. **Normalized state:** `useButtonBase_unstable` resolves slots, defaults `iconPosition`, and derives `iconOnly`.
3. **Rendered anatomy:** `renderButton_unstable` orders the icon and root children.
4. **VR CAP classification:** the public CAP Button style hook consumes normalized state and selects icon-only and
   text-and-icon style branches.

The harness should invoke the actual installed implementations through public or already-used package boundaries. It
must not duplicate their conditionals as its observation oracle.

## Proposed model boundary

Keep production observations separate from research cases:

```ts
type CapButtonObservation = {
  scenarioId: string;
  source: {
    fluentPackageVersion: string;
    capPackageVersion: string;
  };
  input: ObservedButtonInput;
  normalizedState: ObservedButtonState;
  renderedAnatomy: ObservedButtonAnatomy;
  capClassification: ObservedCapClassification;
};

type ObservationMapping =
  | {
      status: "represented";
      buttonCase: ButtonCase;
      evidence: readonly EvidenceReference[];
    }
  | {
      status: "canonicalized";
      buttonCase: ButtonCase;
      discardedDistinctions: readonly string[];
      evidence: readonly EvidenceReference[];
    }
  | {
      status: "excluded";
      reason: string;
      evidence: readonly EvidenceReference[];
    }
  | {
      status: "unrepresented";
      reason: string;
      evidence: readonly EvidenceReference[];
    };
```

These names are illustrative, not locked APIs. The implementation should reuse existing package concepts where that
keeps the boundary smaller.

The mapper should be a named, pure function. It may interpret observations, but it must not decide product support.
When support is unknown, the result should say so.

## First slice: content and icon anatomy

### Why this slice comes first

Content and icon anatomy currently causes the four-of-twelve reduction in the census. It is small enough to exercise
exhaustively, directly observable in Fluent and CAP, and already exposes the difference between accepted input,
normalized state, rendered effect, and research canonicalization.

### Scenario space

Start from production-shaped inputs rather than the research matrix:

- icon absent or present;
- children absent or present;
- `iconPosition` omitted, `before`, or `after`.

Use one stable non-empty icon and one stable non-empty child fixture. Add React-child edge cases only after the basic
table is established, because `null`, `false`, `0`, empty strings, fragments, and slot objects have distinct presence
semantics that can obscure the first result.

For every scenario, record:

- whether the input is TypeScript-constructible;
- normalized `iconPosition` and `iconOnly`;
- icon-slot and root-child presence;
- rendered slot order and empty output;
- whether CAP selects icon-only, text-and-icon position, and text-and-icon size styling;
- the proposed research mapping and any discarded distinction.

### Initial hypotheses

These are falsifiable starting points, not expected results:

1. Icon absent plus children present maps to research `text` regardless of an irrelevant `iconPosition` input.
2. Icon present plus children absent maps to research `iconOnly`; `before` and `after` canonicalize because the
   rendered anatomy contains only one slot.
3. Icon present plus children present maps to `textAndIcon`, preserving effective before/after ordering.
4. Icon absent plus children absent is constructible and normalizable but has no current research representation.
5. CAP style selection agrees with normalized state for the icon-only and text-and-icon scenarios.

Each hypothesis should have one focused test that fails if the installed Fluent or CAP behavior disagrees.

### React-child follow-up

After the basic table passes, add an explicit edge-case table for child values that challenge truthiness and rendering.
Do not label all root children as text. If production behavior distinguishes visual presence from JavaScript
truthiness, record that as an observation gap and reconsider `contentKind` terminology.

## Classification instead of one validity boolean

The current `isValidButtonCase` remains useful for resolver preconditions, but it should no longer carry every census
meaning. Introduce a richer classification for the production-grounding path:

```ts
type ProductionGrounding = {
  constructible: boolean;
  normalizable: boolean;
  rendered: boolean;
  capClassified: boolean;
  support: "documented" | "unknown" | "unsupported";
  modelMapping: "represented" | "canonicalized" | "excluded" | "unrepresented";
};
```

The exact shape should follow implementation needs. The important constraint is that no single boolean collapses these
claims.

## Differential test strategy

The grounding tests should compare the model against the real pipeline at semantic boundaries:

1. Generate or enumerate a finite production scenario.
2. Run the real Fluent normalization path.
3. Render through the real Fluent anatomy path.
4. Apply the real public VR CAP style hook in the supported test harness.
5. Project the result into a stable observation record.
6. Map the observation to the clean-room model.
7. Compare only the fields for which the mapping declares correspondence.

Examples of focused parity claims:

- A production `iconOnly` state maps to icon-only clean-room anatomy.
- Production after-position rendering maps to icon-after clean-room slot order.
- CAP icon-only classification corresponds to the model's icon-only geometry branch.
- An observed scenario without a representation is reported as a coverage gap rather than filtered out.

Avoid snapshots of generated Griffel class names unless the identity itself is under study. Prefer normalized state,
DOM slot order, selected semantic branches, and existing stable capture adapters. Dependency-sensitive snapshots must
be labeled as such and isolated from semantic parity tests.

## Census revision

After the first observation table is executable, revise the Case census page to show three related spaces:

1. **Theoretical Cartesian space:** every tuple implied by independent research axes.
2. **Production scenario space:** finite public-input scenarios exercised through Fluent and VR CAP.
3. **Canonical research space:** represented semantic cases after evidence-backed equivalence and explicit research
   policy.

Every reduction should be attributed to one of:

- public input contract;
- production normalization;
- observed semantic equivalence;
- explicit product support policy;
- research-only assumption;
- current model limitation.

The page must label the current 27,840 count as model-derived until the relevant axes are grounded. It should not imply
that production CAP rejects the remaining tuples. If the grounded model changes the count, preserve the old count only
as historical context, not as a compatibility target.

## Phased implementation

### Phase 0: lock vocabulary and provenance

Deliverables:

- Define the production observation and mapping records.
- Add durable source metadata using package versions or commit identifiers and exported symbols.
- Document which installed Fluent and CAP versions form the baseline.
- Add tests for evidence-record completeness.

Exit condition: every new grounding claim can identify its source boundary, scenario, interpretation, and evidence
category.

### Phase 1: content/icon observation harness

Deliverables:

- Add the finite basic scenario table.
- Exercise real Fluent normalization and rendering.
- Exercise real CAP style classification through the existing component-test environment.
- Publish a human-readable Storybook observation table with raw observation and interpretation separated.

Exit condition: every basic icon/children/position scenario is classified without using the research validity
predicate as the oracle.

### Phase 2: model mapping and parity tests

Deliverables:

- Implement the pure observation-to-model mapper.
- Record represented, canonicalized, excluded, and unrepresented outcomes.
- Add differential tests for anatomy, order, and relevant geometry semantics.
- Add React-child edge cases and document any vocabulary changes they require.

Exit condition: every production scenario has an explicit mapping outcome, and parity tests fail when a corresponding
production or model behavior is deliberately perturbed.

### Phase 3: census and documentation

Deliverables:

- Revise census calculations to expose theoretical, observed, and canonical spaces separately.
- Update the Case census Storybook page with evidence labels and attributed reductions.
- Update `model.md`, `findings.md`, and `browser-evidence.md` with the observed results and remaining assumptions.
- Preserve links from each displayed claim to its executable evidence.

Exit condition: a reader can explain each displayed count without treating model assumptions as production facts.

### Phase 4: expand one axis at a time

Candidate order:

1. appearance and its supported public domain;
2. size and the research density interpretation;
3. disabled and disabled-focusable interaction states;
4. direction and icon ordering;
5. Button-family composition, including ToggleButton and SplitButton;
6. forced-colors and other color-mode observations;
7. anatomy policy and other intentionally research-only axes.

Each axis must repeat the observation, mapping, differential-test, and census-attribution steps. Do not proceed merely
because a value has the same name in both systems.

## TypeScript model evolution

Do not strengthen `ButtonCase` into a discriminated union before Phase 2 establishes the intended mapping. Once the
content/icon cases are grounded, consider splitting the types:

```ts
type ButtonContent =
  | { kind: "text" }
  | { kind: "iconOnly" }
  | { kind: "textAndIcon"; iconPosition: "before" | "after" };

type GroundedButtonCase = CommonButtonCase & {
  content: ButtonContent;
};
```

This can prevent invalid research cases for typed callers while retaining a parser or validator for external data.
Keep the production observation type permissive enough to record every constructible scenario, including redundant or
unrepresented ones. Do not impose the research union directly on Fluent or CAP public props without a separate product
API decision.

## Validation matrix

Run the narrowest relevant checks during each phase:

- exhaustive unit tests for finite observation and mapping tables;
- type tests for compile-time construction rules if the model type changes;
- property tests for model invariants over grounded cases;
- React Testing Library tests for normalized state and rendered anatomy where browser layout is unnecessary;
- Playwright component tests for real VR CAP style hooks, DOM, CSSOM, direction, and computed browser behavior;
- Storybook review for explanation quality and evidence labeling;
- package lint, type-check, test, build, and component-test targets before completion.

At least one mutation should prove each observation or parity test can fail for the intended reason. A test that only
repeats the implementation's own predicate does not establish grounding.

## Risks and controls

| Risk                                                          | Control                                                                                                               |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Production internals change with dependencies                 | Pin source versions in observations and make dependency updates produce an intentional evidence diff.                 |
| The harness copies production logic                           | Invoke real hooks/renderers; keep projections descriptive and small.                                                  |
| Constructibility is mistaken for support                      | Preserve separate support status and require an explicit product source.                                              |
| Generated class names create brittle tests                    | Compare semantic state and normalized observations; isolate dependency-sensitive captures.                            |
| React child truthiness produces misleading anatomy labels     | Add a dedicated edge-case table and revise vocabulary when falsified.                                                 |
| The census becomes more complicated than explanatory          | Show three spaces and attributed reductions progressively; keep raw evidence available outside the introductory view. |
| Research types reject observations before they can be studied | Keep production observation types independent from constrained research types.                                        |
| Existing tests validate only internal consistency             | Add differential and mutation checks against real production boundaries.                                              |

## Completion criteria

The initial grounding effort is complete when:

- every basic icon/children/position scenario has an executable production observation;
- observations identify the installed Fluent and VR CAP source versions and stable boundaries;
- every observation is represented, canonicalized, excluded, or explicitly unrepresented;
- no exclusion is justified only by the current `isValidButtonCase` implementation;
- parity tests compare real production outcomes with declared clean-room semantics;
- at least one deliberate perturbation demonstrates that each parity family fails meaningfully;
- the census separates theoretical, production-observed, and canonical research counts;
- Storybook and package documentation label assumptions and product decisions without ambiguity;
- package lint, type-check, unit tests, build, and component tests pass.

## Open decisions

These decisions should be made from Phase 1 evidence rather than locked in advance:

1. Whether `text` should be renamed to a broader `content` concept because Fluent children are arbitrary React nodes.
2. Whether icon-only before/after inputs are canonicalized or retained as observable but semantically redundant cases.
3. Whether an empty button is unrepresented, explicitly unsupported, or represented for diagnostic completeness.
4. Whether CAP branch selection can be observed through a stable semantic adapter or requires a narrowly scoped
   dependency-sensitive class/CSSOM capture.
5. Whether production scenario counts belong in the introductory census or in a linked evidence view.
6. Which team artifact is sufficient to classify a behavior as product-supported rather than merely implemented.

## First implementation checkpoint

Before changing `ButtonCase` or the census arithmetic, produce one reviewed table containing the basic content/icon
scenarios, their real normalized state, rendered anatomy, CAP classification, and proposed model mapping. That table is
the cheapest test of this plan: if the distinctions are not useful there, revise the observation boundary before
expanding the model.
