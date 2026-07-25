# Research findings

## Measurements

The raw Cartesian input space contains 138,240 tuples. The explicit validity predicate admits 27,840 cases, or about 20.1%. `researchMetrics.test.ts` reproduces this census exhaustively.

Across all valid cases, the layered architecture records 38 to 51 field writes per resolution. Eighteen fields have multiple owners somewhere in the domain: anatomy, capabilities, supported appearance, validation obligations, focus visibility/color, four geometry fields, four logical corners, and three appearance color roles. These values are executable regression metrics, not performance benchmarks.

The program contains 16 named property laws and seven controlled mutations. The deep validation profile runs each property for 1,000 generated cases with a deterministic seed. Browser assertions cover eight scenarios in each of three engines.

The forced-colors refinement adds thirteen fast-check laws and six shrinking mutation checks. Its representative
five-case synthetic corpus contains four semantic decision categories and 25 emitted media-query rules across four
component/slot scopes. Five exact duplicates are safely removed. Fourteen local rule pairs are superficially similar
but remain separate because selector, slot, specificity, precedence, order, or declarations differ. No field is
written after forced-colors protection in the standard layered pipeline.

The runtime CAP/Griffel corpus captures 235 forced-colors CSS rules: 55 for Button root, 55 for ToggleButton root, 70
for SplitButton primary action, and 55 for SplitButton menu action. The one-to-one adapter preserves all 235 rules.
The normalizer removes none and reports 1,400 contextual lookalike pairs that remain separate. A focused Chromium test
locks those counts and verifies that modeled cascade evaluation is unchanged.

Differential Chromium capture compares primary enabled/disabled Button, primary unselected/selected ToggleButton, and
primary/secondary Button fixtures. Every pair changes generated classes and related forced-colors rule sets. Disabled
changes 116 to 128 classes and 55 to 62 rules; selected changes 117 to 121 classes and 55 to 57 rules; secondary changes
116 to 71 classes and 55 to 25 rules. The corresponding rule-set deltas are 47 added/40 removed, 23 added/21 removed,
and 5 added/35 removed. These dependency-sensitive counts are locked separately from the 235-rule normalization corpus.

## Response to the motivating UXE concerns

Natalie Wainwright's UXE Crit presentation described practical failure modes around layered Visual Refresh styling.
This clean-room program responds to those concerns unevenly by design. Some have executable evidence here; others need
production Fluent data or product decisions.

| Motivating concern                                                       | Evidence produced here                                                                                   | What remains unanswered                                                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A visible bug is difficult to trace through many style layers            | Field-level provenance, 38-51 recorded writes per case, 18 multiply owned fields, and minimized fixtures | Provenance from actual Fluent, Visual Refresh, and product styling                                           |
| Product dimensions diverge within one nominal system                     | Visual Refresh 36 px and Teams 32 px are represented as named, presentation-derived policy               | Complete and aligned requirements for Fluent, Teams, SharePoint, and other products                          |
| Derived components multiply inherited styling and corrective overrides   | ToggleButton and split-button preservation cases challenge shared guarantees                             | The real inheritance and composition cost of production Button-family components                             |
| High-contrast rules are difficult to override and do not compose cleanly | A protected forced-colors contract is tested separately from synthetic and runtime CAP/Griffel emission  | Browser paint-time behavior under operating-system high-contrast settings and complete production-app output |
| A base-component change propagates into composite components             | Composition context, direction, and split-button geometry are modeled explicitly                         | Propagation through production toolbars, drawers, dialogs, carousels, and other composites                   |
| Reimplementing styles can lose accessibility or browser fixes            | Explicit focus, boundary, naming, native-button, state, and composition obligations                      | A complete inventory of guarantees encoded by production Fluent styles                                       |
| Repeated media queries may represent waste or necessary context          | Synthetic duplicates normalize safely; none of 235 captured CAP/Griffel rules do                         | Whether other components, states, products, or production bundles contain safe normalization opportunities   |
| Redesigns can force design-system and feature-code rework                | Named policies and laws separate replaceable choices from guarantees that must survive                   | Change-cost measurements from actual Visual Refresh and consumer migrations                                  |

The package does not measure Natalie's reported source-line totals. Lines of CSS are useful motivation but an
incomplete complexity measure: one duplicated declaration, one hidden accessibility invariant, and one product
disagreement have very different risks. This experiment instead measures supported variation, decision ownership,
write overlap, order sensitivity, law coverage, and counterexamples.

## Forced-colors refinement report

### Before the refinement

Forced colors was already an environmental `colorMode`, ordinary roles were replaced with system roles, and the
layered resolver ran a final forced-colors stage. However, focus, visible-boundary, and disabled guarantees were not
represented together, protected writes were enforced only by conventional stage order, and the renderer translated
the result directly to inline styles without an inspectable media-query emission model.

### What changed

`ForcedColorsContract` now centralizes the accessibility policy. Both resolver architectures consume it. The layered
architecture protects appearance and focus fields and rejects later ordinary writes. A separate emitter retains
media, selector, component/slot ownership, declarations, precedence, order, specificity, semantic decision, and
provenance. A conservative normalizer and modeled-cascade evaluator test compression independently of semantics.

All thirteen forced-colors semantic and emission laws pass. The first development run reported two failures: one
idempotence oracle incorrectly included provenance, and one generated declaration mutation was sometimes a no-op.
Both were invalid tests, not implementation bugs. A separate implementation reporting gap, missing diagnostics for
preserved declaration conflicts, was fixed before the property run.

### Normalization result

The representative corpus safely normalizes 5 of 25 rules, all exact duplicates. Fourteen apparent duplicate pairs
remain separate. The blockers are different selectors, component/slot scope, specificity, precedence, order, or
conflicting declarations. Different textual media conditions also remain separate because the model has no CSS media
parser and cannot prove equivalence.

### Runtime Griffel capture result

The runtime instrument renders public Button, ToggleButton, and SplitButton components under public CAP style hooks.
It captures matching `@media (forced-colors: active)` CSSOM rules by generated class, preserves each CSS rule as one
`EmittedStyleRule`, and runs the existing normalizer unchanged. The current Chromium corpus contains 235 rules and no
safe reductions. Its 1,400 retained lookalike pairs differ by selector or another modeled cascade dimension.

This changes the interpretation of the synthetic result. Exact duplicates remain a demonstrated normalization
opportunity in the model, but they do not establish an optimization opportunity in the selected real Griffel output.
The captured repetition is presently evidence of atomic, state-specific, and component/slot context rather than safe
textual waste. Repeated appearance, boundary, and focus decisions across the Button family can still motivate a shared
semantic policy, but semantic repetition does not imply mergeable CSS.

### Differential capture and paint result

The differential instrument records three independent observations: generated class names, forced-colors rules related
to those classes, and selectors matching the fixture's resting DOM. This separation matters because selector matching
does not establish that the enclosing media query is active or that a declaration wins the browser cascade.

The disabled and selected comparisons each retain fourteen matching rules but replace twelve and thirteen of their
matching rule identities, respectively. The secondary Button has thirty related forced-colors rules but no selector
matching its resting state, compared with fourteen for primary. The initial hypothesis that disabled policy would be
expressed mainly by activating shared pseudo-class rules was therefore false for the current CAP hooks: all three
variants replace substantial atomic class and rule context.

In separate Chromium, Firefox, and WebKit checks with `forced-colors: active`, enabled primary Button and selected
primary ToggleButton share a computed paint profile, while disabled primary remains distinct. Chromium and Firefox
also map unselected primary ToggleButton and secondary Button to the same profile and reuse the disabled foreground as
its visible border. WebKit computes the unselected and secondary profiles differently. These are relational assertions
rather than hardcoded RGB values, so the test records engine behavior without treating one emulated palette as universal.

That last difference has since been reduced to a minimal fixture and split into two separate findings, one product
defect and one engine capability. CAP's primary ToggleButton forced-colors block restated upstream's three system
colours but dropped its `forced-color-adjust: auto`, while CAP's _Button_ primary block contributes
`forced-color-adjust: none` to the same root at the same specificity. Nothing deduped the pair, so the winning
declaration was decided by Griffel's insertion order: the same button computed `auto` alone and `none` when another CAP
fixture rendered first. Restating the opt-in fixes it and makes `mergeClasses` collapse the pair. With the policy
pinned, the remaining WebKit difference is that WebKit matches `(forced-colors: active)` under emulation without
performing substitution: the toggle lands on the system-colour keywords CAP names explicitly, while the secondary
Button, which has no forced-colors treatment of its own, keeps its authored values. The agreement seen in Chromium and
Firefox was therefore the engine's work, not a CAP guarantee. See `stories/AlternateAppearance/index.mdx`.

Candidate seams suggested by the evidence are: a shared internal Fluent button-family forced-colors policy; a CAP
specialization boundary that runs before protected accessibility resolution; and a Griffel diagnostic or conservative
normalization key containing canonical media, selector, cascade dimensions, and provenance. None is yet an API
recommendation.

The smallest valuable follow-up is now to exercise focus and hover transitions, add the remaining appearances, and
repeat selected paint checks in real operating-system high-contrast themes. That work should retain the same boundary:
emission diffs explain generated policy context, while browser and operating-system checks evaluate final paint.

## Results

The two architectures are observationally equivalent after provenance normalization for generated valid cases. This supports the hypothesis that a semantic algebra can replace layered computation without changing the modeled contract.

Equivalence does not make the architectures operationally identical. Layer history reveals substantial shared ownership and makes precedence inspectable. Semantic composition localizes most decisions and removes incidental ordering where concerns are independent.

Forced colors are order-sensitive: they must replace interaction and product colors after those stages. Context geometry and interaction coloring commute in this model. The contrast is useful because it distinguishes essential precedence from accidental sequence.

The validity-preserving generator matters as much as the properties. A naive generator would spend roughly four fifths of its samples on rejected tuples and obscure whether failures describe the supported system.

Every controlled mutation is detected and shrunk. The RTL split-corner experiment was especially valuable: logical corner names are easy to misread, and the minimized fixture became both a property regression and a browser scenario.

## Interpretation

The strongest practical result is not that one architecture universally wins. It is that a shared semantic contract, explicit domain, provenance, and executable laws let architecture choices be compared without conflating them with CSS or React details.

The semantic resolver is the clearer source of policy truth for this model. The layered resolver remains valuable as an audit instrument and as a representation of migration/override behavior. A production design could use semantic derivation for ownership and retain write-history tooling at adaptation boundaries.

### Product-alignment boundary

The model can represent that Fluent Visual Refresh and Teams require different button heights. It cannot decide that
they should differ, whether either value is final, or how another product should align. Those are product decisions.

The technical contribution is to keep an agreed difference named and local, reveal what else it affects, and test that
shared guarantees survive. Where requirements are missing or contradictory, the correct output is an explicit model
assumption or unsupported case, not a synthesized compromise disguised as a shared rule.

This boundary is central to override elasticity. A component foundation cannot make legitimate differentiation cheap
until products identify which differences are legitimate. Theory can expose the decision and estimate its technical
cost; it cannot supply the alignment.

## Limitations and next experiments

Policy values include clean-room assumptions. The renderer does not model the complete CSS cascade, font metrics, layout measurement, animation, full Fluent behavior, browser paint-time forced-color substitution, native accessibility APIs, or assistive-technology output. Random property checks are not exhaustive proofs, and the curated browser matrix is intentionally sparse. Passing semantic properties does not prove browser rendering correctness, and successful model normalization does not prove Griffel can apply the same optimization.

Next experiments should replace assumptions with cited public evidence, add contrast and high-zoom measurements, compare against production components only through public APIs, test bidirectional mixed content, and measure whether ownership overlap predicts real maintenance defects.

## Production audit

The clean-room work above has now been run against production. Every law in this package is asserted over the real
`@fluentui-contrib/react-cap-theme` styles, and the outcome is published as a classified audit: see the _CAP production
audit_ page in Storybook, backed by `src/audit/productionAudit.ts`.

Two things that the clean-room framing could not have produced are worth recording here. First, two of the four confirmed
defects are decided by _stylesheet insertion order_ rather than by any declaration a reader can point at: all Griffel
classes carry identical specificity, so two surviving declarations for the same property are resolved by what else the
page rendered first. A law asserted under a single render order reports either outcome as correct, which is why the
forced-colors laws are asserted under more than one order, each in its own page. Second, two findings are defects in the
_instrument_ rather than in the product, and both made a law pass rather than fail. They are published at the same rank
as the product defects, because a suite that passes vacuously converts silence into evidence.

The next-family nomination is measured rather than intuited, and it lets the last open question above be answered
concretely: the census counts, per family, the markers of the mechanisms this audit actually found, and `react-tags` is
nominated because it scores highest on those markers _and_ because `InteractionTag` is structurally the same object as
SplitButton — two actions, a joined seam, shared disabled propagation. Whether that ownership overlap predicts real
maintenance defects is now a testable prediction rather than a hypothesis, since the transferred laws either fail there
or they do not.
