# Research findings

## Measurements

The raw Cartesian input space contains 138,240 tuples. The explicit validity predicate admits 27,840 cases, or about 20.1%. `researchMetrics.test.ts` reproduces this census exhaustively.

Across all valid cases, the layered architecture records 38 to 51 field writes per resolution. Eighteen fields have multiple owners somewhere in the domain: anatomy, capabilities, supported appearance, validation obligations, focus visibility/color, four geometry fields, four logical corners, and three appearance color roles. These values are executable regression metrics, not performance benchmarks.

The program contains 16 named property laws and seven controlled mutations. The deep validation profile runs each property for 1,000 generated cases with a deterministic seed. Browser assertions cover five scenarios in each of three engines.

The forced-colors refinement adds thirteen fast-check laws and six shrinking mutation checks. Its representative
five-case synthetic corpus contains four semantic decision categories and 25 emitted media-query rules across four
component/slot scopes. Five exact duplicates are safely removed. Fourteen local rule pairs are superficially similar
but remain separate because selector, slot, specificity, precedence, order, or declarations differ. No field is
written after forced-colors protection in the standard layered pipeline.

## Response to the motivating UXE concerns

Natalie Wainwright's UXE Crit presentation described practical failure modes around layered Visual Refresh styling.
This clean-room program responds to those concerns unevenly by design. Some have executable evidence here; others need
production Fluent data or product decisions.

| Motivating concern                                                       | Evidence produced here                                                                                   | What remains unanswered                                                                               |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| A visible bug is difficult to trace through many style layers            | Field-level provenance, 38-51 recorded writes per case, 18 multiply owned fields, and minimized fixtures | Provenance from actual Fluent, Visual Refresh, and product styling                                    |
| Product dimensions diverge within one nominal system                     | Visual Refresh 36 px and Teams 32 px are represented as named, presentation-derived policy               | Complete and aligned requirements for Fluent, Teams, SharePoint, and other products                   |
| Derived components multiply inherited styling and corrective overrides   | ToggleButton and split-button preservation cases challenge shared guarantees                             | The real inheritance and composition cost of production Button-family components                      |
| High-contrast rules are difficult to override and do not compose cleanly | One protected forced-colors contract is separated from contextual CSS-like emission and tested with laws | Captured Griffel output and browser paint-time behavior under operating-system high-contrast settings |
| A base-component change propagates into composite components             | Composition context, direction, and split-button geometry are modeled explicitly                         | Propagation through production toolbars, drawers, dialogs, carousels, and other composites            |
| Reimplementing styles can lose accessibility or browser fixes            | Explicit focus, boundary, naming, native-button, state, and composition obligations                      | A complete inventory of guarantees encoded by production Fluent styles                                |
| Repeated media queries may represent waste or necessary context          | Five exact duplicates are removed while fourteen contextual lookalikes are retained                      | Whether the same proportions or normalization opportunities occur in real Griffel output              |
| Redesigns can force design-system and feature-code rework                | Named policies and laws separate replaceable choices from guarantees that must survive                   | Change-cost measurements from actual Visual Refresh and consumer migrations                           |

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

### Interpretation of the Griffel observation

The evidence points to a combination, not one universal cause. Exact duplicates demonstrate an emitter-optimization
opportunity under the model. Repetition of the same semantic decisions across Button, ToggleButton, and split slots
suggests a possible semantic abstraction gap. Many lookalikes are legitimate contextual variation and cannot be
merged. Because the corpus is synthetic, this experiment does not establish the proportions in actual Griffel CSS.

Candidate seams suggested by the evidence are: a shared internal Fluent button-family forced-colors policy; a CAP
specialization boundary that runs before protected accessibility resolution; and a Griffel diagnostic or conservative
normalization key containing canonical media, selector, cascade dimensions, and provenance. None is yet an API
recommendation.

The smallest valuable follow-up is to capture actual Griffel output for one Button, one ToggleButton, and one split
button fixture through public style hooks, adapt those rules into `EmissionResult`, and rerun the existing normalizer
and laws unchanged. That experiment can classify real duplication before proposing any Fluent, CAP, or Griffel change.

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
