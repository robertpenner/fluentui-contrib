# CAP Button versioned verification

The base CAP Button correspondence is pinned to production package versions and
verified without using generated class profiles as a semantic oracle. Product
support remains unknown.

## Baseline manifest

The typed manifest is `src/cap-model/button/versionedVerification.ts`:

| Package                             | Pinned version |
| ----------------------------------- | -------------- |
| `@fluentui/react-components`        | `9.70.0`       |
| `@fluentui-contrib/react-cap-theme` | `0.5.1`        |

Its `contractOwners` record attributes production symbols to normalization,
anatomy, geometry, appearance, interaction, forced colors, theme, direction,
and motion. `versionedVerification.test.ts` checks the pinned values against the
installed package manifests.

## Failure taxonomy

`production-baseline-drift` means the pinned package version, owning symbol
manifest, or observed production semantics changed. `clean-room-regression`
means production still matches the pinned observation but a clean-room
resolver or contract mutation differs. Both failures retain the localized paths
reported by the existing field comparators.

The central mutation matrix is
`src/cap-model/button/tests/verificationMatrix.test.tsx`:

| Contract group | Deliberate mutation path     |
| -------------- | ---------------------------- |
| normalization  | `normalized.appearance`      |
| anatomy        | `anatomy`                    |
| geometry       | `geometry.root.paddingTop`   |
| appearance     | `rootAppearance.background`  |
| interaction    | `surface.background`         |
| forced colors  | `authored.forcedColorAdjust` |
| theme          | `theme.colorBrandBackground` |
| direction      | `root.paddingInlineStart`    |
| motion         | `transitions.0.durationMs`   |

## Semantic profile changes

`compareCapButtonSemanticProfileCensuses` reports baseline and actual profile
counts, added and removed semantic profile keys, added and removed authored
observation keys, and field-level differences for changed observations. Profile
keys project semantic geometry and appearance only. Generated class signatures
remain a version-sensitive diagnostic.

The finite-domain suites exhaust the 2,592 authored scenarios, 1,728 normalized
tuples, and 396 semantic profiles. Focused resolver suites exhaust the grounded
interaction, forced-colors, direction, and motion matrices, while comparator
tests mutate every established field independently.

## Verification command

Run from the repository root:

```sh
yarn nx run visual-refresh-style-algebra:verify-cap-button
```

The aggregate Nx target runs all CAP Button unit parity and invariant tests plus
the interaction, forced-colors, and motion component tests in pinned Chromium.
