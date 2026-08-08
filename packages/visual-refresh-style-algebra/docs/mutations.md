# Synthetic research mutation experiments

These controlled faults test the sensitivity of laws over the historical Button research domain. They do not mutate production CAP code or establish production support.

Mutations are teaching faults, disabled during normal resolution and activated only by `mutations.test.ts`. Each property uses `fc.check`, requires a failure, requires at least one shrink, and retains a serialized regression fixture.

| Mutation                           | Fault                                              | Detecting invariant                      |
| ---------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| `eraseFocusVisibility`             | Removes visible focus in the focus-visible state.  | Focus preservation                       |
| `loseAccessibleNameSource`         | Makes icon-only anatomy rely on absent text.       | Anatomy and accessible-name preservation |
| `failRtlPaddingMirror`             | Leaves text-and-icon padding unmirrored in RTL.    | Directional padding coherence            |
| `leakProductColorIntoForcedColors` | Emits a product role in forced colors.             | Forced-colors preservation               |
| `compactDensityChangesColor`       | Lets density alter semantic foreground.            | Density locality                         |
| `incorrectRtlSplitEndRadius`       | Removes the wrong outer RTL split-button radius.   | Compound-shape coherence                 |
| `unsupportedAppearanceFallback`    | Silently accepts an appearance outside the domain. | Supported-domain correctness             |

A mutation surviving would mean either the law is missing, the generator cannot reach the fault, or the oracle is too weak. Detection demonstrates sensitivity to these faults; it does not imply completeness against all regressions.

## Forced-colors refinement mutations

`forcedColorsMutations.test.ts` adds six shrinking checks across six categories. Product-role leakage reuses the
existing mutation; the other five are new operators.

| Category               | Teaching fault                                                       | Detecting law                     |
| ---------------------- | -------------------------------------------------------------------- | --------------------------------- |
| Protected precedence   | Product color replaces a system role after forced-colors resolution. | System-role restriction           |
| Extension focus        | ToggleButton or split output omits the focus rule.                   | Extension preservation            |
| Selector scope         | Normalizer merges equal declarations across selectors.               | Unsafe-merge rejection            |
| Declaration precedence | Normalizer merges rules at different precedence.                     | Unsafe-merge rejection            |
| Visible boundary       | Forced-colors policy loses its boundary guarantee.                   | Visible-boundary preservation     |
| Disabled state         | Disabled output matches enabled roles.                               | Disabled-state distinguishability |

All six checks fail under mutation, shrink at least once, and are paired with named regression fixtures. Across the
whole package there are thirteen mutation checks covering twelve distinct fault operators.
