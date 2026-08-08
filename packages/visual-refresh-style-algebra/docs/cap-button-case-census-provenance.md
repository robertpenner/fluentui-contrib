# CAP Button case census provenance

## Question

Is the count of 138,240 possible CAP Button combinations derived from the
production Fluent and CAP implementations, or from the clean-room research
model?

## Verdict

The 138,240 count is **arithmetically correct for the clean-room domain**, but
it is **not a production-derived CAP Button census**.

A separate, narrower production census is now executable. For the basic finite
inputs read by Fluent normalization and the CAP Button style hook, it observes
2,592 authored scenarios, 1,728 normalized state tuples, and 504 distinct CAP
style-selection profiles for the base CAP Button hook.

The clean-room model declares eleven arrays, then multiplies their lengths:

```text
3 x 2 x 2 x 4 x 5 x 3 x 3 x 4 x 2 x 4 x 2 = 138,240
```

[ButtonCase.ts](../src/domain/ButtonCase.ts) owns the arrays.
[census.ts](../src/domain/census.ts) constructs the axes and computes
`rawTotal`. [researchMetrics.test.ts](../src/testing/researchMetrics.test.ts)
proves that enumeration agrees with that arithmetic.

Those facts establish reproducibility, not provenance. Production source
corroborates some values, but other values are subsets, derived categories,
environmental conditions, or explicit research assumptions. Several axes are
also not independent production inputs.

## Evidence standard

This note uses these provenance classifications:

- **Production-backed:** the modeled values correspond closely to an owned
  production API, state, or style branch.
- **Partially production-backed:** production owns the underlying concept, but
  the modeled values, cardinality, independence, or interpretation differ.
- **Research-defined:** the axis or its domain is introduced by the clean-room
  research code rather than exposed by the production CAP Button pipeline.

These classifications do not establish product support. Production code can
accept or render an input without promising that a product intentionally
supports it.

## Axis-by-axis provenance

| Axis                  | Research values                                               | Status                                  | Production evidence and gap                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product (3)           | `fluent`, `sharepoint`, `teams`                               | Research-defined                        | The production package exports base `CAP_STYLE_HOOKS` and a `TEAMS_STYLE_HOOKS` specialization from [index.ts](../../react-cap-theme/src/index.ts). [teams/index.ts](../../react-cap-theme/src/teams/index.ts) says Teams builds on CAP and changes Button-family sizing. The package has some SharePoint-specific types in other component areas, but it exports no SharePoint Button style-hook set parallel to Teams. These exports do not derive the model's three-value product axis.                                                                                          |
| Visual language (2)   | `fluent2`, `visualRefresh`                                    | Research-defined                        | CAP is installed through FluentProvider custom style hooks. The CAP Button hook does not receive or branch on a `visualLanguage` value. Comparing unmodified Fluent styles with CAP styles is useful research framing, but it is not an independent runtime CAP Button parameter.                                                                                                                                                                                                                                                                                                   |
| Density (2)           | `standard`, `compact`                                         | Partially production-backed             | Production Fluent Button uses the sizes `small`, `medium`, and `large`, and CAP has three corresponding style branches. Teams also specializes those three sizes. No production Button `density` input establishes the model's binary domain or a canonical mapping from three sizes to two densities.                                                                                                                                                                                                                                                                              |
| Appearance (4)        | `primary`, `subtle`, `transparent`, `tint`                    | Partially production-backed             | All four exist in CAP, but CAP's [Button.types.ts](../../react-cap-theme/src/components/react-button/components/Button/Button.types.ts) and [useButtonStyles.styles.ts](../../react-cap-theme/src/components/react-button/components/Button/useButtonStyles.styles.ts) also implement `outline` and `secondary`. The research count is therefore a selected four-value subset, not the complete production CAP appearance domain. `tint` also extends the public Fluent Button union used by the pinned upstream baseline.                                                          |
| Interaction state (5) | `rest`, `hover`, `pressed`, `focusVisible`, `disabled`        | Production-backed as observation states | CAP styles contain a baseline, `:hover`, pressed/active selectors, a focus-visible indicator, and disabled branches. The research axis turns these observable conditions into five snapshots. Production does not make all of them mutually exclusive: focus-visible can coexist with hover, pressed, or disabled-focusable, and selected belongs to ToggleButton rather than plain Button.                                                                                                                                                                                         |
| Color mode (3)        | `light`, `dark`, `forcedColors`                               | Partially production-backed             | Light and dark are provider theme contexts. Forced colors is an environmental media condition handled by `@media (forced-colors: active)` in CAP styles. Forced colors can occur while an application has either theme, so production does not define one mutually exclusive three-value Button input.                                                                                                                                                                                                                                                                              |
| Content kind (3)      | `text`, `iconOnly`, `textAndIcon`                             | Partially production-backed             | These are derived research categories, not a `contentKind` prop. Fluent accepts `children`, an optional icon slot, and `iconPosition`. The production observation harness maps rendered outcomes into these categories.                                                                                                                                                                                                                                                                                                                                                             |
| Icon placement (4)    | `none`, `before`, `after`, `only`                             | Partially production-backed             | Fluent exposes only the `before` and `after` values for `iconPosition`; icon absence and icon-only anatomy are derived from icon and child presence. The four research values are useful canonical outcomes, but they are not the public prop domain.                                                                                                                                                                                                                                                                                                                               |
| Anatomy policy (2)    | `fluentDefault`, `visualRefreshReconstructed`                 | Research-defined                        | CAP supplies style hooks over Fluent's normalized state and rendering. No `anatomyPolicy` input or two-way anatomy branch exists in the observed production Button hook. The reconstructed value is a clean-room architecture experiment.                                                                                                                                                                                                                                                                                                                                           |
| Composition (4)       | `standalone`, `toolbar`, `splitButtonStart`, `splitButtonEnd` | Partially production-backed             | Production has separate ToolbarButton and SplitButton integrations. [useSplitButtonStyles.styles.ts](../../react-cap-theme/src/components/react-button/components/SplitButton/useSplitButtonStyles.styles.ts) styles primary-action and menu-button slots; [useToolbarButtonStyles.styles.ts](../../react-cap-theme/src/components/react-toolbar/components/ToolbarButton/useToolbarButtonStyles.styles.ts) composes CAP Button styles. A plain Button does not receive a four-value `compositionContext` parameter. This axis combines separate component boundaries and contexts. |
| Direction (2)         | `ltr`, `rtl`                                                  | Partially production-backed             | FluentProvider accepts `ltr` and `rtl` for `dir`, so both environmental directions are real. The reviewed CAP Button hook has no explicit direction branch. Direction is provider context, not a Button prop, and its independent behavioral effect still needs a focused production observation.                                                                                                                                                                                                                                                                                   |

## Primary production anchors

The local sibling Fluent repository supplies the upstream implementation used
to interpret CAP. These source paths are outside this repository, so they are
recorded as paths and stable symbols rather than repository-relative links:

- `/workspaces/fluentui/packages/react-components/react-button/library/src/components/Button/Button.types.ts`
  defines `ButtonSize`, the public Fluent appearances, `iconPosition`, and
  normalized `iconOnly` state.
- `/workspaces/fluentui/packages/react-components/react-button/library/src/components/Button/useButton.ts`
  defaults appearance, size, and icon position and derives `iconOnly` from icon
  and child presence.
- `/workspaces/fluentui/packages/react-components/react-provider/library/src/components/FluentProvider/FluentProvider.types.ts`
  owns provider direction.
- `/workspaces/fluentui/packages/react-components/react-provider/library/src/components/FluentProvider/renderFluentProvider.tsx`
  supplies that direction to Griffel's `TextDirectionProvider`.

The production CAP package supplies these local anchors:

- [CAP package exports](../../react-cap-theme/src/index.ts)
- [CAP Button state extension](../../react-cap-theme/src/components/react-button/components/Button/Button.types.ts)
- [CAP Button style hook](../../react-cap-theme/src/components/react-button/components/Button/useButtonStyles.styles.ts)
- [Teams Button-family specialization](../../react-cap-theme/src/teams/index.ts)
- [CAP SplitButton style hook](../../react-cap-theme/src/components/react-button/components/SplitButton/useSplitButtonStyles.styles.ts)
- [CAP ToolbarButton style hook](../../react-cap-theme/src/components/react-toolbar/components/ToolbarButton/useToolbarButtonStyles.styles.ts)

## Counterevidence to a production-derived claim

Four findings are sufficient to disprove the stronger claim that production
code directly defines this exact Cartesian product:

1. The research source itself labels the product and appearance policy a
   "Clean-room model assumption" in
   [SupportedDomain.ts](../src/domain/SupportedDomain.ts).
2. Production CAP has six Button appearances, while the census multiplies four.
3. Production Fluent and CAP use three Button sizes, while the census multiplies
   two research densities.
4. Light/dark theme and forced-colors media state are not one mutually exclusive
   production parameter, so multiplying them as one three-value axis is a
   modeling decision.

The remaining mismatches reinforce the same conclusion. They are not needed to
establish it.

## Production-derived Button style census

The corrected census starts from production Button inputs rather than the
eleven clean-room dimensions:

| Production input        | Values                                                 | Count |
| ----------------------- | ------------------------------------------------------ | ----: |
| CAP appearance          | primary, tint, outline, secondary, subtle, transparent |     6 |
| Fluent size             | small, medium, large                                   |     3 |
| Fluent shape            | rounded, circular, square                              |     3 |
| `disabled`              | false, true                                            |     2 |
| `disabledFocusable`     | false, true                                            |     2 |
| Icon presence           | absent, present                                        |     2 |
| Child presence          | absent, present                                        |     2 |
| Authored `iconPosition` | omitted, before, after                                 |     3 |

The authored scenario count is therefore:

```text
6 x 3 x 3 x 2 x 2 x 2 x 2 x 3 = 2,592
```

Fluent defaults an omitted `iconPosition` to `before`, reducing three authored
position values to two normalized values:

```text
6 x 3 x 3 x 2 x 2 x 2 x 2 x 2 = 1,728
```

The CAP hook then canonicalizes more states through its actual class-selection
conditions:

- The four `disabled` and `disabledFocusable` pairs produce three class sets for
  primary and tint, and two class sets for each other appearance.
- Basic icon and child inputs produce four recurring style effects: base,
  icon-only, text-and-icon before, and text-and-icon after.

That produces 14 appearance-and-availability branches and 504 style profiles:

```text
((2 primary appearances x 3) + (4 other appearances x 2))
   x 3 sizes x 3 shapes x 4 content effects
= 14 x 3 x 3 x 4
= 504
```

[productionButtonStyleCensus.ts](../src/grounding/productionButtonStyleCensus.ts)
records the factors. Its component-level integration test,
[productionButtonStyleCensus.test.tsx](../src/grounding/productionButtonStyleCensus.test.tsx),
runs all 2,592 authored scenarios through real Fluent normalization and
`CAP_STYLE_HOOKS.useButtonStyles_unstable`. The test observes exactly 1,728
normalized tuples and 504 distinct root-and-icon class signatures.

This remains a deliberately finite style census. It does not claim to count
arbitrary React children, slot objects, user classes, event handlers, ARIA
attributes, theme objects, or every possible polymorphic root.

## Content and icon evidence

Content and icon anatomy is the one axis pair with an implemented production
observation bridge.

[contentAnatomyGrounding.test.tsx](../src/grounding/contentAnatomyGrounding.test.tsx)
invokes the pinned public Fluent normalization and rendering functions together
with `CAP_STYLE_HOOKS.useButtonStyles_unstable`. The baseline recorded in
[contentAnatomyGrounding.ts](../src/grounding/contentAnatomyGrounding.ts) is
Fluent Button 9.70.0 plus CAP theme 0.5.1.

That audit starts with production-shaped inputs:

```text
icon present/absent x children present/absent x
iconPosition omitted/before/after = 12 scenarios
```

Its result is not twelve distinct supported content configurations:

- nine scenarios map to four canonical research configurations;
- three scenarios render an empty Button root and are unrepresented;
- all twelve retain `support: unknown`.

This is direct evidence that an equal raw factor count does not prove that the
research axes mirror independent production inputs. `contentKind x
iconPlacement` also has twelve pairs, but it is a different coordinate system
with a research validity predicate in [validity.ts](../src/domain/validity.ts).

## What is proven now

1. The eleven clean-room arrays have lengths `3, 2, 2, 4, 5, 3, 3, 4, 2, 4,
2`.
2. Multiplying those lengths produces 138,240.
3. Exhaustive clean-room enumeration produces exactly 138,240 tuples.
4. The clean-room validity predicate admits exactly 27,840 of those tuples.
5. A production integration test constructs all 2,592 scoped basic Button
   scenarios and observes 1,728 normalized tuples and 504 CAP class signatures.
6. The content slice maps nine of its twelve authored scenarios into four
   canonical content configurations; three render empty.
7. Production source supports several concepts represented by the model,
   including CAP appearances, Button size, interaction styles, forced-colors
   handling, composite Button variants, and provider direction.

Items 1 through 4 prove clean-room consistency. Items 5 and 6 prove the narrower
production style census. None proves that 138,240 is a production count or that
all 2,592 scoped scenarios are product-supported.

## What remains to prove

The production census intentionally remains scoped. Further audits should:

1. Exercise the Teams Button hook and compare its profile cardinality and style
   signatures with base CAP.
2. Audit ToggleButton, MenuButton, CompoundButton, SplitButton, and ToolbarButton
   as separate component boundaries rather than multiplying them into plain
   Button.
3. Observe direction, themes, forced colors, reduced motion, and browser support
   conditions independently instead of treating them as one exclusive axis.
4. Preserve React-child and slot edge cases that cannot be represented by the
   basic present/absent inputs.
5. Obtain explicit product decisions for support. Constructing, normalizing,
   rendering, or CAP-classifying a scenario does not prove intended support.

## Claim vocabulary

Future census reporting should keep these claims separate:

- **Constructible:** accepted by a named public TypeScript input surface.
- **Normalizable:** accepted and represented by Fluent component state.
- **Rendered:** produces observable DOM anatomy.
- **CAP-classified:** selects a relevant branch or style effect in CAP.
- **Product-supported:** intentionally supported by an explicit product or
  design-system contract.
- **Represented:** expressible in the clean-room domain.
- **Canonicalized:** one of several production inputs mapped to one research
  case because the modeled result is equivalent.

A test proves consistency with its inputs and oracle. It does not, by itself,
prove where that oracle came from or that a product supports its admitted cases.

For the production census, the test invokes the production normalizer and style
hook as the observation boundary rather than copying their branch decisions into
the expected class signatures.

## Storybook implication

The introductory page may accurately report **2,592 scoped authored scenarios,
1,728 normalized tuples, and 504 observed style profiles** for the basic
production CAP Button census. It must retain that finite scope and must not call
138,240 a production CAP count or 504 a product-support count.
