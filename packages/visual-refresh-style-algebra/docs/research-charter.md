# Research charter

## Question

Can Visual Refresh styling be modeled as composable transformations with explicit domains, invariants, and observable counterexamples, rather than as an informal sequence of CSS overrides?

## Hypotheses

1. A layered override resolver and an independent semantic resolver can produce equal normalized contracts over the supported domain.
2. Accessibility and behavioral guarantees can be stated as laws that survive product, density, state, color-mode, anatomy, composition, and direction transformations.
3. Layer write history can expose ownership overlap and order sensitivity that final CSS alone conceals.
4. Deliberate faults can be found and minimized by property-based tests into reviewable regression fixtures.

## Method

The package defines a finite `ButtonCase` input domain and a pure `ButtonStyleContract` output. Two independent resolver architectures consume the same cases. Deterministic fast-check properties compare them and enforce preservation laws. A shared native-button renderer, curated Storybook stories, and Playwright checks add browser evidence. Disabled-by-default mutations test whether the laws can detect plausible regressions.

## Evidence discipline

Every claim is one of: presentation observation, public CAP observation, model assumption, tested property, or browser observation. A passing property is evidence over generated cases, not mathematical proof. A validation obligation records work still required; it is never treated as evidence that the work passed.

## Isolation

This is a private research package. It is not published, imported by production packages, or permitted to alter production behavior. Policies are intentionally replaceable and must not be presented as private Fluent specifications.

## Exit criteria

The program is successful when both resolvers are total over valid generated inputs, normalized contracts agree, at least twelve independent laws pass deterministically, at least five mutations are detected and shrunk, curated browser scenarios pass in Chromium/Firefox/WebKit, and limitations remain explicit.
