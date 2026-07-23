# Research charter

## Practical objective

Find the smallest shared component foundation that preserves universal behavioral and accessibility guarantees while
minimizing the cost of valid product differentiation.

The motivating problem is described in [Why this research exists](motivation.md). The research separates three
questions that are easy to conflate:

1. **Technical:** Does an implementation preserve agreed behavior, accessibility, and composition guarantees?
2. **Architectural:** Which guarantees belong in the shared foundation, and which choices should be replaceable
   policies?
3. **Organizational:** What does each product actually require?

The experiment can address the first question and produce evidence for the second. It can make the third explicit, but
it cannot substitute for product alignment.

## Research question

Can valid Fluent, Visual Refresh, and product-specific button outcomes be represented with explicit supported
combinations and must-always rules, rather than depending on an informal sequence of CSS overrides?

## Hypotheses

1. A layered override resolver and an independent semantic resolver can produce equal normalized contracts over the supported domain.
2. Accessibility and behavioral guarantees can be stated as laws that survive product, density, state, color-mode, anatomy, composition, and direction transformations.
3. Layer write history can expose ownership overlap and order sensitivity that final CSS alone conceals.
4. Deliberate faults can be found and minimized by property-based tests into reviewable regression fixtures.
5. Repeated product overrides, density-specific differences, and accessibility corrections can indicate that a decision
   belongs in a parameter, product policy, or explicit shared guarantee rather than a fixed base style.

## Method

The package defines a finite `ButtonCase` input domain and a pure `ButtonStyleContract` output. Two independent resolver architectures consume the same cases. Deterministic fast-check properties compare them and enforce preservation laws. A shared native-button renderer, curated Storybook stories, and Playwright checks add browser evidence. Disabled-by-default mutations test whether the laws can detect plausible regressions.

## Evidence discipline

Every claim is one of: presentation observation, public CAP observation, model assumption, tested property, or browser observation. A passing property is evidence over generated cases, not mathematical proof. A validation obligation records work still required; it is never treated as evidence that the work passed.

The independently organized resolver is a comparator, not a recommendation to bypass Fluent styling. Equal output
shows that the modeled outcome can survive a change in implementation organization; it does not choose a production
architecture. Similarly, an explicit product difference can be tested only after product teams agree that it is
required.

## Isolation

This is a private research package. It is not published, imported by production packages, or permitted to alter production behavior. Policies are intentionally replaceable and must not be presented as private Fluent specifications.

## Exit criteria

The program is successful when both resolvers are total over valid generated inputs, normalized contracts agree, at least twelve independent laws pass deterministically, at least five mutations are detected and shrunk, curated browser scenarios pass in Chromium/Firefox/WebKit, and limitations remain explicit.
