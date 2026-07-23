# Resolver architectures

## The production tradeoff behind the experiment

Natalie Wainwright's UXE Crit examples described two uncomfortable choices when a product diverges substantially from
Fluent's default appearance:

| Strategy                                               | Value retained                                                                  | Cost introduced                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Layer Visual Refresh and product changes over Fluent   | Existing defaults, accessibility handling, browser workarounds, and later fixes | The product must understand, neutralize, and debug interactions among increasingly broad style layers            |
| Reimplement styling while retaining component behavior | Direct ownership and a result that can be easier to follow                      | The product must rediscover styling obligations and no longer inherits future Fluent styling fixes automatically |

The experiment adds a third analytical possibility: describe the required outcome independently of either
implementation, then test both implementations against it. This does not eliminate the production tradeoff. It makes
the inherited guarantees, replaceable choices, and effects of each strategy easier to inspect.

## A: layered overrides

`resolveLayeredButtonWithHistory` starts from a complete Fluent base contract, then applies Visual Refresh, product, context, interaction, and forced-colors stages in an explicit order. Every field write records its layer and replaced owner. This architecture resembles an override system and makes precedence observable.

Strengths:

- represents migration from a stable base naturally;
- exposes which layers contend for a field;
- supports direct order and commutativity experiments.

Risks:

- correctness can depend on stage order;
- unrelated responsibilities can accumulate in one stage;
- a correct final value can hide repeated ownership transfer.

## B: semantic composition

`resolveSemanticButton` derives geometry, shape, appearance, typography, anatomy, supported domain, obligations, focus, and capabilities independently, then assembles one contract. Concern resolvers depend on the input case and named policy data rather than a partially mutated contract.

This resolver is a clean-room comparator, not a proposal to bypass Fluent styles in production. Its role is to test
whether the same modeled outcome can be expressed without depending on the layered resolver's write order.

Strengths:

- localizes policy decisions by semantic concern;
- avoids incidental write order for independent concerns;
- makes focused laws and substitutions straightforward.

Risks:

- cross-concern constraints must be modeled deliberately;
- composition can conceal precedence requirements if concerns are split incorrectly;
- shared input policies can still couple apparently independent resolvers.

## Equality boundary

`normalizeContract` removes provenance before comparison. The experiment asks whether the architectures agree on semantic output, not whether they explain or compute it identically. Both then feed `CleanRoomButton`, preventing renderer differences from confounding the comparison.

Equality is necessary but not sufficient. Two implementations can agree on an incomplete or incorrect policy. The
independent laws, mutation checks, browser scenarios, and evidence labels challenge the shared outcome from different
directions.

## Order result

Forced colors must follow interaction and product coloring because it replaces product roles with system roles. The
layered model now protects appearance and focus fields after that stage; an ordinary later write is rejected rather
than allowed to corrupt the accessibility result. Context geometry and interaction colors commute in the present
model because they write disjoint concerns. These are tested facts about this model, not universal CSS claims.

## Semantic policy versus emission

`resolveForcedColorsContract` answers what the accessibility outcome must be. `emitForcedColors` answers how one
component/slot target could represent that result as media-query rules. The semantic contract can remain equal while
emission differs legitimately by selector, slot, specificity, precedence, or order. Consequently, emitter equality is
never used as the oracle for semantic equivalence.

The normalizer is conservative. It can expose repeated semantic decisions without erasing contextual variation. This
separates three explanations for repeated media blocks: an emitter may repeat truly equivalent rules; an accessibility
policy may be copied because no semantic boundary exists; or similar declarations may encode necessary contextual
differences. The synthetic corpus demonstrates the first and third. The first runtime CAP/Griffel capture demonstrates
the third: none of its 235 captured rules can be removed under the modeled equivalence key. That result applies to the
selected fixtures and loaded style hooks, not Griffel output universally.

Differential capture then compares generated classes, related forced-colors rules, and currently matching selectors
as separate sets. Disabled, selected, and alternate-appearance fixtures all replace atomic classes and rule context;
they are not represented solely by activating a shared pseudo-class rule. This describes the current CAP hooks and
dependency versions, not a required Griffel architecture.
