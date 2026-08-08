# Production-faithful CAP clean-room model plan

## Status

Proposed. This plan replaces the current eleven-dimensional `ButtonCase` as the
foundation for claims about production CAP. It does not preserve the 138,240 or
27,840 counts as compatibility targets.

## Decision

Build a new clean-room model from executable production observations, one CAP
Button-family module at a time.

The model will be independent of the CAP implementation at runtime, but its
declared behavior must remain observationally equivalent to a pinned production
baseline over an explicit finite scope. Production code is the test oracle, not
an implementation dependency and not a source to translate line by line.

The existing clean-room model may remain temporarily as an architecture
experiment. It must not supply domains, validity rules, census numbers, or
expected results to the replacement model.

## Why replacement is necessary

The existing model began with a conceptual Cartesian product. Several axes are
not production Button inputs, several values do not match production domains,
and some conditions can coexist rather than form an exclusive choice. Its
validity predicate therefore proves consistency with research assumptions, not
fidelity to CAP.

The production census established a better starting point for base CAP Button:

```text
2,592 scoped authored scenarios
  -> 1,728 normalized state tuples
  -> 504 observed CAP style-selection profiles
```

These counts describe different stages. None is a product-support count. The
new model must preserve those distinctions rather than collapsing them into one
notion of validity.

## Definition of accuracy

The clean-room model is accurate for a declared scope when all of the following
hold:

1. Every modeled input is owned by a named production prop, normalized state
   field, provider context, browser condition, or component seam.
2. Every modeled output corresponds to a stable production observation such as
   anatomy, semantic style selection, computed declaration, or interaction
   behavior.
3. Exhaustive or generated differential tests compare clean-room results with
   the production adapter over the declared scope.
4. Every canonicalization is demonstrated by equivalent production
   observations rather than chosen for convenience.
5. Every excluded input is attributed to scope, an explicit product contract,
   or a production limitation. Unknown support remains unknown.
6. A production mutation that changes an observed behavior causes a focused
   differential failure.
7. The model states what it does not represent.

Accuracy does not require reproducing CAP's function structure, Griffel class
names, declaration order, or incidental implementation details. It requires
equivalence at the observation surfaces declared by the model.

## Scope

### Initial scope

Model the base CAP plain `Button` hook for the pinned Fluent and CAP versions.
Begin with the finite production domain already exercised by the census:

- six CAP appearances;
- three Fluent sizes;
- three Fluent shapes;
- `disabled` and `disabledFocusable`;
- basic icon presence;
- basic child presence;
- authored and normalized icon position.

Then add selector and environment observations without pretending they are
additional Button props:

- rest, hover, active, focus-visible, and their supported combinations;
- forced-colors active or inactive;
- reduced-motion preference;
- provider direction;
- theme token values required by the observed declarations.

### Later scopes

Treat each of these as a separate module with its own production adapter,
domain, observations, and census:

1. Teams Button specialization;
2. ToggleButton;
3. MenuButton;
4. CompoundButton;
5. SplitButton;
6. ToolbarButton.

Do not encode these modules as a `product` or `composition` axis on plain
Button. Add a shared abstraction only after two production-grounded modules
demonstrate the same invariant.

### Non-goals

- Do not preserve the old `ButtonCase` interface.
- Do not preserve old counts.
- Do not infer product support from constructibility or rendering.
- Do not enumerate arbitrary React nodes, event handlers, ARIA attributes,
  custom classes, slot implementations, or theme objects.
- Do not compare raw Griffel class names as the long-term semantic oracle.
- Do not import production CAP or Fluent modules into the clean-room runtime.
- Do not model every Button-family module in one migration.

## Model architecture

The replacement should expose one deep module whose interface hides
normalization and style-policy complexity:

```ts
type CleanRoomCapButtonModel = {
  resolve(input: CapButtonScenario): CapButtonContract;
};
```

Callers should not need to know CAP's hook ordering or Griffel composition.
Tests and callers cross the same `resolve` interface.

### Authored scenario

Represent only finite authored distinctions in scope:

```ts
type CapButtonScenario = {
  appearance: "primary" | "tint" | "outline" | "secondary" | "subtle" | "transparent";
  size: "small" | "medium" | "large";
  shape: "rounded" | "circular" | "square";
  disabled: boolean;
  disabledFocusable: boolean;
  content: {
    icon: "absent" | "present";
    children: "absent" | "present";
    iconPosition: "omitted" | "before" | "after";
  };
};
```

This type describes the initial audit fixture, not every public `ButtonProps`
value. Its name and documentation must retain that scope.

### Observation conditions

Represent selector and environment conditions separately because they can
coexist:

```ts
type CapButtonObservationConditions = {
  hover: boolean;
  active: boolean;
  focusVisible: boolean;
  forcedColors: boolean;
  prefersReducedMotion: boolean;
  direction: "ltr" | "rtl";
};
```

The legal condition generator must follow browser and component behavior. It
must not blindly multiply booleans when a combination cannot be produced or
observed reliably.

Theme should enter through the semantic token values needed for comparison, not
through a hard-coded `light | dark` label. Named light and dark themes can be
fixtures that supply token values.

### Resolved contract

Return semantic observations rather than generated class identities:

```ts
type CapButtonContract = {
  normalized: {
    iconPosition: "before" | "after";
    iconOnly: boolean;
    hasIcon: boolean;
    hasChildren: boolean;
  };
  anatomy: readonly ("icon" | "content")[];
  root: CapButtonRootStyleContract;
  icon?: CapButtonIconStyleContract;
  provenance: readonly CapModelEvidence[];
};
```

The root and icon contracts should contain only properties proven necessary by
production observations. Candidate groups include geometry, border, foreground,
background, focus treatment, forced-colors behavior, icon spacing, and motion.
Do not add a field merely because the old model had one.

### Evidence ledger

Every clean-room rule must carry durable provenance:

```ts
type CapModelEvidence = {
  productionBaseline: string;
  productionSymbol: string;
  scenarioProjection: string;
  observation: string;
  interpretation: string;
  support: "documented" | "unknown" | "unsupported";
};
```

The exact shape may change, but each rule must identify the production baseline,
observation, interpretation, and support status. Line numbers alone are not
sufficient provenance.

## Module seams

### Production observation adapter

Create a test-only adapter that invokes real Fluent normalization, rendering,
and CAP style hooks:

```ts
interface CapButtonProductionAdapter {
  observe(
    scenario: CapButtonScenario,
    conditions: CapButtonObservationConditions,
  ): Promise<CapButtonObservation>;
}
```

The adapter owns React rendering, provider setup, browser setup, Griffel capture,
and projection into stable observations. The clean-room model never imports it.

### Clean-room model

The clean-room implementation accepts the same scenario and condition types and
returns a semantic contract without calling Fluent, CAP, React, Griffel, or a
browser.

### Comparator

Create one comparator that projects production observations and clean-room
contracts into the same semantic comparison shape:

```ts
type CapButtonDifference = {
  path: string;
  production: unknown;
  cleanRoom: unknown;
  evidence: readonly CapModelEvidence[];
};

function compareCapButton(
  production: CapButtonObservation,
  cleanRoom: CapButtonContract,
): readonly CapButtonDifference[];
```

The comparator is the correspondence seam. Tests must not scatter one-off
assertions that silently define different notions of parity.

## Observation strategy

Use the narrowest stable observation for each claim:

| Claim                             | Preferred observation                                         |
| --------------------------------- | ------------------------------------------------------------- |
| Fluent defaults and derived state | normalized state fields                                       |
| Icon/content order                | rendered slot anatomy                                         |
| CAP branch selection              | normalized declaration or rule projection                     |
| Geometry                          | computed or normalized CSS values                             |
| Semantic colors                   | token role plus resolved value where needed                   |
| Focus treatment                   | effective declarations under focus-visible                    |
| Disabled suppression              | equality of effective rest/hover/active surfaces              |
| Forced colors                     | effective system-color and adjustment declarations            |
| Motion                            | effective transition declarations under preference conditions |

Generated class names may remain a version-sensitive diagnostic for detecting
profile cardinality. They must not be the only parity oracle because equivalent
styles can receive different class identities.

## Implementation phases

### Phase 0: quarantine the old model

Deliverables:

- Mark `ButtonCase`, its validity predicate, 138,240, and 27,840 as legacy
  research artifacts in public exports and documentation.
- Remove old-model imports from production audit stories.
- Add a repository rule that new production-fidelity claims cannot depend on
  `domain/ButtonCase.ts`, `domain/census.ts`, or `domain/validity.ts`.
- Record the pinned Fluent and CAP package versions and source symbols.

Exit condition: no introductory or production-audit path uses the old model as
an oracle, domain, or count.

### Phase 1: lock the base Button correspondence seam

Deliverables:

- Introduce `CapButtonScenario`, `CapButtonObservationConditions`,
  `CapButtonObservation`, and `CapButtonContract`.
- Move the current 2,592-scenario census behind a named production-domain
  enumerator.
- Implement the production adapter for normalization, anatomy, and CAP class
  selection.
- Replace anonymous JSON signatures with typed stable observation projections.

Exit condition: all 2,592 scoped scenarios produce typed production
observations without consulting the old model.

### Phase 2: reproduce normalization and anatomy

Deliverables:

- Implement clean-room defaults for authored icon position.
- Implement icon-only derivation and slot ordering.
- Preserve empty, redundant, and React-child edge cases as observations rather
  than filtering them through validity rules.
- Add exhaustive differential tests for normalized state and anatomy.
- Add deliberate production-observation mutations proving each comparison field
  can fail independently.

Exit condition: the clean-room model is observationally equivalent for all
declared normalization and anatomy fields over the scoped domain.

### Phase 3: reproduce static CAP style selection

Deliverables:

- Define the minimal semantic root and icon style contracts from captured
  production declarations.
- Implement appearance, size, shape, availability, icon-only, and text/icon
  spacing rules in the clean-room resolver.
- Compare normalized declaration sets or effective property projections, not
  only class signatures.
- Explain every reduction from 1,728 normalized tuples to semantic style
  profiles.

Exit condition: every scoped static style difference has zero unexplained
production-versus-clean-room differences.

### Phase 4: add interaction conditions

Deliverables:

- Observe rest, hover, active, focus-visible, disabled, and
  disabled-focusable behavior through browser-backed fixtures.
- Generate only producible condition combinations.
- Model focus-visible independently of selected or active state.
- Prove disabled hover and active suppression where production exhibits it.
- Add effective-surface comparisons for each appearance.

Exit condition: browser-backed differential tests pass for every declared
interaction condition in Chromium, with other engines added where selector or
computed-style behavior differs.

### Phase 5: add environment conditions

Deliverables:

- Add forced-colors observations and semantic system-color comparisons.
- Add reduced-motion observations.
- Add provider direction observations and verify whether any semantic output
  changes after logical-property normalization.
- Parameterize required theme tokens and verify at least the named light and
  dark fixtures without making theme name a Button axis.

Exit condition: each environmental dimension is independently observable,
modeled, and differentially tested without being conflated with authored props.

### Phase 6: prove resilience and version drift

Deliverables:

- Add a baseline manifest containing package versions and production symbols.
- Fail clearly when production observations change, distinguishing baseline
  drift from model regressions.
- Add mutation tests for every contract group.
- Add property-based tests for invariants discovered after parity is established.
- Lock any shrunk counterexample as a deterministic regression test.

Exit condition: a meaningful CAP or Fluent change produces a localized evidence
diff and a failing test that identifies the affected contract field.

### Phase 7: expand to the Button family

Repeat Phases 1 through 6 independently for Teams Button, ToggleButton,
MenuButton, CompoundButton, SplitButton, and ToolbarButton.

Only after at least two modules pass parity should shared policy move behind a
common module interface. Specialization must remain additive and explicit. For
example, ToggleButton selection is a persistent checked state, not another plain
Button interaction value.

Exit condition: each family module states its inherited invariants, additional
state, production adapter, census, parity status, and unsupported scope.

### Phase 8: retire or reframe the old implementation

Deliverables:

- Delete old code that duplicates the replacement without research value.
- Move retained layered-versus-semantic experiments under names that identify
  them as alternative architectures.
- Remove the old census from the introductory reading path.
- Rewrite Storybook pages around production observations, correspondence, and
  remaining unknowns.

Exit condition: a reader cannot mistake a synthetic architecture experiment for
the production-faithful CAP model.

## Test strategy

Use tests in this order:

1. Production adapter characterization tests.
2. Exhaustive differential tests over finite authored scenarios.
3. Browser-backed differential tests for selector and environment conditions.
4. Mutation tests proving comparison sensitivity.
5. Property-based tests for established invariants.
6. Visual regression tests only for representative cases where computed
   declarations do not capture the meaningful outcome.

Do not use the clean-room model to generate expected production observations.
Do not use production implementation branches copied into test helpers as an
oracle. Expected correspondence comes from captured observations and typed
semantic projections.

## Migration strategy

Keep old and new modules side by side only while the replacement earns parity:

1. Add the new production scenario and observation types without changing old
   resolver callers.
2. Build the production adapter and clean-room resolver behind new exports.
3. Migrate production-audit stories and evidence documents first.
4. Migrate laws only when their premises are observed in production.
5. Compare old and new outputs for diagnostic interest, never as acceptance
   criteria.
6. Remove old public exports after all retained callers have moved or been
   explicitly reclassified as architecture experiments.

Do not add adapters that make the old `ButtonCase` look like the new scenario
type. Such an adapter would preserve the failed ontology and obscure missing
production distinctions.

## Deliverable structure

Use a dedicated replacement tree so production fidelity is visible in the
filesystem:

```text
src/cap-model/
  button/
    CapButtonScenario.ts
    CapButtonObservation.ts
    CapButtonContract.ts
    enumerateCapButtonScenarios.ts
    resolveCleanRoomCapButton.ts
    compareCapButton.ts
    evidence.ts
    tests/
      productionAdapter.tsx
      normalizationParity.test.tsx
      anatomyParity.test.tsx
      staticStyleParity.test.tsx
      interactionParity.component-browser-spec.tsx
      environmentParity.component-browser-spec.tsx
```

The production adapter remains test-only. The runtime interface exports the
scenario, conditions, contract, resolver, comparator, and evidence types.

## Acceptance criteria

The base Button replacement is complete when:

- all 2,592 scoped authored scenarios are enumerated from production-owned
  domains;
- all normalization and anatomy observations have zero unexplained differences;
- all modeled static style properties have zero unexplained differences;
- every declared interaction and environment condition has browser-backed
  parity evidence;
- class signatures are diagnostic rather than the sole semantic oracle;
- every rule links to a pinned production observation;
- support remains unknown unless a product contract establishes it;
- no replacement module imports the old `ButtonCase`, census, or validity
  predicate;
- no replacement runtime module imports Fluent, CAP, React, Griffel, or browser
  globals;
- deliberate mutations fail focused differential tests;
- Storybook accurately states scope, parity status, and remaining unknowns.

## Stop conditions

Pause implementation and revise the plan when:

- a proposed finite axis cannot be tied to a production owner;
- two supposedly distinct cases have no observable semantic difference;
- a comparison requires generated class identity rather than stable behavior;
- an expected rule is based only on product intuition or the old model;
- a component-family specialization cannot be represented without weakening the
  plain Button interface;
- production behavior appears accidental, inaccessible, or too unstable to
  promote into the clean-room contract.

In those cases, record the observation as unknown or version-sensitive rather
than filling the gap with a model assumption.
