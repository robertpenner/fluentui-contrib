# Resolver architectures

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

## Order result

Forced colors must follow interaction and product coloring because it replaces product roles with system roles. Context geometry and interaction colors commute in the present model because they write disjoint concerns. These are tested facts about this model, not universal CSS claims.
