# Why this research exists

Visual Refresh can begin as a familiar design request: change a button's height, corner radius, spacing, or color. In a
shared component system, that visible change can cross a much larger implementation surface:

```text
Fluent default styles
  -> Visual Refresh changes
  -> derived-component changes
  -> product-specific requirements
  -> interaction and accessibility corrections
  -> effects on compound and composite components
```

Natalie Wainwright's UXE Crit presentation motivated this research with examples of that escalation. Fluent base
styles, Visual Refresh overrides, derived components, composition layers, product requirements, and forced-colors
rules accumulated around the same component family. A bug could be visible in one button yet originate in hundreds or
thousands of lines of layered styling, or propagate from a base component into toolbars, drawers, dialogs, and other
composites.

These are presentation observations and problem reports, not a complete Visual Refresh specification. This clean-room
package uses them to formulate testable questions without reproducing private implementation details.

## The two uncomfortable implementation choices

One strategy is to retain Fluent's supplied styling and place Visual Refresh and product changes on top. This preserves
valuable defaults, accessibility handling, browser workarounds, and future Fluent fixes. It works well while the desired
difference is small and the override boundary remains clear.

As differentiation grows, a product can end up maintaining two visual systems at once. The team must understand the
base styles, retain them, neutralize many declarations, maintain replacement declarations, and debug interactions
between all of those layers. Derived components can inherit the same cost and add another correction layer.

The other strategy is to retain the component's behavior while reimplementing much of its styling. This can make the
result easier to follow and give the product direct control over accessibility modes such as forced colors. It also
transfers responsibility: the product team must rediscover which Fluent decisions encode accessibility guarantees,
browser fixes, state behavior, anatomy, and unusual composition cases, and it no longer inherits styling fixes
automatically.

This research does not assume that either strategy is always correct. It asks what a useful shared foundation must
preserve when the default appearance is no longer the desired appearance.

## A technical problem and an alignment problem

Some of the difficulty is technical. Conditional declarations interact, inheritance obscures ownership, generated
media-query output repeats, and a base change can affect many descendants. Those concerns can be modeled, measured,
and tested.

Some of the difficulty requires product decisions. Visual direction continues to evolve, Teams and SharePoint can
have different constraints, and cross-product alignment may be incomplete. No test can decide what a product should
require. A model can make those requirements explicit, expose contradictions, and test an agreed policy, but it cannot
replace alignment.

The presentation also describes a delivery problem: the Visual Refresh aesthetic changed during implementation while
consumers needed stable code for general availability, protecting product code was important, and UXE capacity was
small. A styling architecture therefore has to absorb redesigns without repeatedly forcing design-system and feature
teams to reconstruct the same decisions.

The distinction matters:

- **Technical question:** Does an implementation preserve agreed behavior, accessibility, and composition guarantees?
- **Architecture question:** Which guarantees belong in the shared foundation, and which choices should be replaceable?
- **Alignment question:** What does each product actually require?

## The optimization target

The practical goal is not simply to reduce lines of CSS or make two implementations render the same screenshot. It is
to find the smallest shared component foundation that preserves universal behavioral and accessibility guarantees
while minimizing the cost of valid product differentiation and later redesign.

This suggests a way to evaluate a component foundation:

- If every product preserves a behavior, it is a candidate foundational guarantee.
- If a value changes with density, it may be a parameter rather than a fixed default.
- If products routinely replace a declaration, that declaration may be too opinionated for the shared layer.
- If removing a style repeatedly breaks accessibility, the underlying requirement should be explicit rather than
  hidden in CSS.
- If derived components require repeated corrective overrides, the inheritance or composition boundary may be wrong.

We use **override elasticity** as a name for this property: how far a product can legitimately depart from the default
appearance before the shared styling becomes more costly than useful. The current package does not calculate one
override-elasticity score. It establishes the inputs needed to investigate it: supported variation, explicit
guarantees, decision ownership, write overlap, counterexamples, and browser observations.

## How this experiment responds

The experiment represents a button situation as structured input and resolves it into an explicit statement of what
must remain true. It then:

1. compares a layered override implementation with an independently organized implementation;
2. records which layer wrote each decision and which owner it replaced;
3. states accessibility, behavior, geometry, and composition requirements as executable laws;
4. shrinks failures into small regression fixtures;
5. separates forced-colors requirements from the CSS-like rules used to emit them; and
6. preserves product differences as named policy rather than unexplained overrides.

The independently organized implementation is a research comparator, not a recommendation to bypass Fluent styles.
Agreement between the implementations shows that the modeled outcome can survive a change in organization. It does
not establish which production architecture Fluent or a product should adopt.

## What evidence would change a shared component

This research becomes actionable when it can connect repeated implementation friction to a clearer ownership
boundary. Candidate outcomes include:

- move a declaration from the shared base into product policy;
- expose density as a parameter;
- preserve an accessibility requirement in a behavioral or semantic contract rather than incidental CSS;
- replace style inheritance with composition for a derived component; or
- introduce one shared button-family policy that component and product specializations can consume.

Those are hypotheses to test against production evidence, not API recommendations from the clean-room model. The
smallest next step is to feed representative public Fluent and Griffel output into the existing comparison and
forced-colors experiments without weakening their laws.
