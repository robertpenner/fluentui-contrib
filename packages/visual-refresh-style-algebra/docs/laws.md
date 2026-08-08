# Synthetic research executable laws

These properties exercise the historical Button research domain and its two architecture experiments. They are separate from the production-backed laws in `src/cap-model/button/laws.ts`; passing here does not establish CAP conformance or product support.

Property tests use fast-check with seed `0x5eed`, 100 runs by default, and `VISUAL_REFRESH_PBT_RUNS` for deeper runs. Generators preserve validity by selecting appearance only after product and visual language.

| Law | Claim                                                                          |
| --- | ------------------------------------------------------------------------------ |
| 1   | Both resolvers are total over valid cases.                                     |
| 2   | Visual specialization preserves native behavioral capabilities.                |
| 3   | `focusVisible` preserves a visible focus treatment.                            |
| 4   | Forced colors use system color roles.                                          |
| 5   | Every supported state has a complete appearance contract.                      |
| 6   | Density changes geometry, not semantic color.                                  |
| 7   | Product specialization preserves unrelated guarantees.                         |
| 8   | Compound corners remain coherent in LTR and RTL.                               |
| 9   | Applying forced-colors transformation twice is idempotent.                     |
| 10  | Required precedence and selected independent-stage commutativity are explicit. |
| 11  | Layered and semantic normalized contracts are observationally equivalent.      |
| 12  | Controlled mutations are detected and shrink to counterexamples.               |
| 13  | Accepted appearances exactly match the declared supported domain.              |
| 14  | Slot anatomy and accessible-name source remain coherent.                       |
| 15  | Conditional padding and directional mirroring remain coherent.                 |
| 16  | Specialization does not silently discard validation obligations.               |

The suite separates invariants from visual snapshots. It does not prove pixel identity, font metrics, assistive-technology output, or correctness of assumed policy values.

## Forced-colors refinement laws

Thirteen additional fast-check properties run entirely in forced-colors mode, which gives this environment deliberate
coverage rather than relying on its frequency in the general generator:

1. Semantic forced-colors totality.
2. Approved system-role restriction.
3. Interactive focus-visible preservation.
4. Visible-boundary preservation.
5. Disabled-state distinguishability.
6. Product and density preservation.
7. Button, ToggleButton, and split-slot extension preservation.
8. Layered semantic idempotence, excluding provenance.
9. Protected-precedence rejection.
10. Emission-semantic preservation within one declared scope.
11. Safe exact-duplicate reduction.
12. Rejection of unsafe selector, slot, precedence, and declaration merges.
13. Semantic-compression diagnostics without automatic cross-scope merging.

All thirteen pass. During development, idempotence initially failed because the test compared provenance, contrary to
the established equality boundary. Unsafe-merge generation also failed because one shrunk input did not actually
change a declaration. These were invalid test oracles, not semantic implementation failures; both were corrected
without weakening the laws.
