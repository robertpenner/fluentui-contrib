# Mutation experiments

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
