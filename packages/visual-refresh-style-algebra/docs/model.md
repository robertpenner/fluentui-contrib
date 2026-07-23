# Clean-room button model

## Evidence labels

The package uses these labels to keep observations separate from assumptions:

- **Presentation observation:** Visual Refresh can alter shape, spacing, height, typography, color, appearances,
  child structure, and icon-slot construction. The presentation also supplies the 36 px Visual Refresh and 32 px
  Teams reference scenario.
- **Public CAP observation:** `react-cap-theme` applies component custom style hooks and a Teams specialization applies
  a later button-size override. Its button styles include appearance, state, focus, forced-colors, icon-only, and
  compound-control rules.
- **Model assumption:** A replaceable clean-room rule chosen because the presentation does not specify an exact rule.
- **Tested property:** A claim exercised over generated valid cases. Passing tests are evidence, not proof.

## Configuration axes

`ButtonCase` keeps product, visual language, density, appearance, interaction state, color mode, content anatomy,
anatomy policy, composition context, and direction independent. The finite values are exported from
`src/domain/ButtonCase.ts` so exhaustive tests and property generators use the same declarations.

The interaction state is a resolved snapshot, not a behavioral state machine. A `disabled` snapshot represents a
native disabled button. Other snapshots represent an enabled button in the named state.

## Validity constraints

The validity predicate excludes only documented combinations:

| Constraint            | Excluded combinations                                                                                                     | Reason                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Content and icon      | `text` with anything but `none`; `iconOnly` with anything but `only`; `textAndIcon` with anything but `before` or `after` | These relationships are the initial anatomy hypothesis requested for the experiment.                        |
| Appearance domain     | Any appearance not returned by `supportedAppearances(product, visualLanguage)`                                            | Appearance addition and deletion are modeled as changes to the accepted input domain, not fallback styling. |
| Reconstructed anatomy | `visualRefreshReconstructed` with `fluent2`                                                                               | Reconstruction is treated as a Visual Refresh responsibility in version 1 of the model.                     |

No case is excluded by density, state, color mode, composition context, or direction. If a real example contradicts
these constraints, it should be recorded as a counterexample before changing the domain.

The supported-appearance table is a **model assumption**. Visual Refresh Fluent adds `tint`; Visual Refresh
SharePoint removes `transparent`; Visual Refresh Teams does not add `tint`. These choices test domain evolution and
are not claims about a private specification.

## Semantic output contract

`ButtonStyleContract` is the theory boundary. It contains:

- logical geometry in CSS pixel units;
- logical corner radii for direction-aware composition;
- semantic foreground, background, border, and focus roles;
- typography;
- ordered slots and accessible-name source;
- supported appearance and state declarations;
- downstream validation obligations;
- focus and native-button capability guarantees;
- provenance records that name the rules responsible for decisions.

Provenance explains a result but is excluded from semantic equality. Validation obligations identify work that still
requires testing; emitting an obligation does not satisfy it.

## Forced-colors accessibility contract

`ForcedColorsContract` is a named semantic sub-resolution for the forced-colors environment. It owns foreground,
background, visible-boundary, and focus system roles plus explicit focus visibility, boundary visibility, and disabled
distinguishability guarantees. Both button resolvers consume this policy; it does not know about selectors, media
queries, generated classes, or CSS ordering.

The approved role vocabulary is `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `ButtonBorder`, `Highlight`,
`HighlightText`, and `GrayText`. The current button policy uses `ButtonFace` for the background, `ButtonText` and
`ButtonBorder` for enabled content and boundaries, `Highlight` for focus, and `GrayText` for disabled content and
boundaries. The remaining approved roles are reserved for experiments and are not emitted by the current policy.

Forced colors is an environmental mode, not a product theme. Product and interaction stages may determine the input
snapshot, but layered forced-colors fields become protected after resolution. A later ordinary write is rejected.

## CSS emission boundary

`EmittedStyleRule` represents media condition, selector scope, component and slot, declarations, precedence, order,
specificity, semantic decision, and provenance. `normalizeForcedColorsEmission` merges exact duplicates or compatible
declarations only when all modeled scope and cascade dimensions agree. Different media text is preserved because this
experiment deliberately does not parse CSS media queries.

The synthetic emission corpus models repeated style-hook output for experimentation. It is not captured Griffel CSS
and must not be used as evidence about Griffel's exact behavior.

## Named policy data

`blockSizePolicy` is the only location for product and density block sizes. The Visual Refresh Fluent/SharePoint
standard value of 36 px and Teams standard value of 32 px are **presentation observations represented as policy**.
Fluent 2 and compact values are **model assumptions** intended to be replaced when stronger evidence exists.

Spacing, radius, typography, and focus dimensions are also model assumptions. Their purpose is to produce coherent,
auditable test outputs, not to infer unlisted Visual Refresh values.

## Decision-ownership rubric

The model makes a styling decision explicit so evidence can challenge where it belongs. The following rubric connects
the experiment to the practical goal of reducing fragile overrides:

| Observed pattern                                                               | Candidate interpretation                                               |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Every product preserves a behavior or accessibility result                     | Shared foundational guarantee                                          |
| A value varies predictably with density, direction, state, or composition      | Parameter or named policy                                              |
| Products routinely replace a declaration to express legitimate differentiation | Product-owned visual policy                                            |
| Removing a style repeatedly breaks accessibility                               | Explicit accessibility obligation rather than incidental CSS           |
| Derived components repeatedly correct inherited styles                         | Inheritance or composition boundary may be wrong                       |
| Similar declarations differ only because of selector or cascade context        | Possibly necessary emission detail, not automatically safe duplication |

This rubric generates hypotheses, not automatic refactors. Production ownership decisions require evidence from real
components and agreement about product requirements.

## Architecture boundaries

The layered resolver will write a complete intermediate contract through ordered stages and retain field-level write
history. The semantic resolver will derive each concern from named policy functions. Both will feed one rendering
adapter. React and CSS do not participate in validity or semantic resolution.

## Intentional omissions

This first model does not represent browser layout, font metrics, text measurement, animations, pointer mechanics,
full Fluent behavior, CSS cascade specificity, theme token implementation, or assistive-technology output. Object
equality therefore cannot establish visual or behavioral correctness. Storybook and later browser checks provide
separate observational evidence for a curated subset.
