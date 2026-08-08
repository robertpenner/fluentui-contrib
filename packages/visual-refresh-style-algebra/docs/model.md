# Synthetic research Button model

This document describes the historical eleven-axis research ontology, not the production CAP Button contract. Its validity rules and counts are assumptions used to compare two architecture experiments. Production conformance lives in `src/cap-model/button/`, and the retained experiment inventory is in `docs/synthetic-button-research-inventory.md`.

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

The content/icon rule is now accompanied by a separate production-grounding table. The public Fluent input shape
admits twelve basic icon, children, and position scenarios. Nine render anatomy represented by this model and
canonicalize to the same four content configurations; three empty-button scenarios are observed but unrepresented.
This does not retroactively turn the validity predicate into a production support rule. Production reaches four by
normalization and modeled semantic equivalence, while the clean-room predicate reaches four by excluding eight
abstract pairs. Product support remains unknown for every observed row.

React children also prevent `contentKind` from acting as a complete runtime anatomy discriminator. With an icon,
`null`, `false`, `0`, and an empty string normalize as icon-only. Whitespace normalizes as text-and-icon. An empty
fragment is truthy, so Fluent and CAP classify it as text-and-icon even though it renders no content node. The model
keeps its simpler semantic vocabulary, but the production observation boundary records this counterexample instead of
calling the public input invalid.

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

## Production-faithful CAP Button environment inputs

The production-faithful CAP Button resolver accepts a `CapButtonThemeInput`, not a Fluent `Theme` or a light/dark
label. Its static paint and focus projection contains exactly these token keys:

- `colorBrandBackground`, `colorBrandBackground2`, `colorBrandStroke2`, and
  `colorCompoundBrandForeground1`;
- `colorNeutralBackground3`, `colorNeutralBackgroundDisabled`, `colorNeutralForeground3`,
  `colorNeutralForegroundDisabled`, and `colorNeutralForegroundOnBrand`;
- `colorNeutralStroke4`, `colorNeutralStrokeDisabled`, and `colorNeutralStrokeOnBrand`;
- `colorStrokeFocus1`, `colorStrokeFocus2`, `colorTransparentBackground`, and `colorTransparentStroke`;
- `strokeWidthThick` and `strokeWidthThin`.

`web-light-with-cap` and `web-dark-with-cap` are evidence fixtures. They project those keys from Fluent's named web
themes plus `CAP_THEME_TOKENS`; their names never enter `CapButtonScenario` or the resolver. The pinned production
baseline remains Fluent Button 9.70.0 and CAP theme 0.5.1, and product support is unknown.

Provider direction is also observation context rather than an authored Button input. Physical padding, icon margins,
and corner radii are projected to logical block/inline fields before comparison. Across the grounded matrix of three
sizes, three shapes, and five content effects, the LTR and RTL projections are an observed equivalence. This statement
is scoped to static plain-Button output and does not infer equivalence for composite controls.

Forced colors remains a separate environmental contract. Theme input contains no forced-colors selector, direction
contains no theme or forced-colors mode, and the static ordinary-color resolver does not select the forced-colors
contract.

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

The runtime capture is a separate evidence source. It renders public Button, ToggleButton, and SplitButton components
under `CAP_STYLE_HOOKS`, associates their generated class names with accessible CSSOM rules, and adapts matching
forced-colors rules one-to-one into `EmittedStyleRule`. Stylesheet index supplies modeled precedence and source order
supplies modeled order. The adapter calculates selector specificity but does not reproduce the complete browser
cascade, stylesheet origin, layers, or paint-time forced-color substitution. Specificity is ordered relative to the
captured corpus; selector lists retain their maximum branch specificity rather than the specificity of a particular
matching branch.

Fixture capture additionally records the element's generated classes and indexes of captured selectors for which
`Element.matches()` is true in the resting DOM. Differential capture compares class, rule, and matching-selector
multisets independently. A selector match does not prove that its enclosing media query is active or that its
declarations win the browser cascade; paint-time checks are a separate browser experiment.

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
