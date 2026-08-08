# Synthetic Button research inventory

The package contains two deliberately separate Button boundaries:

- `src/cap-model/button/` is production conformance work. It starts from pinned Fluent and CAP observations, keeps product support unknown, and may not import the synthetic research implementation.
- `src/research/legacyButtonResearch.ts` is the facade for the historical eleven-axis model and its architecture experiments. Its 138,240 raw tuples and 27,840 admitted cases are synthetic research results. They do not count production CAP inputs or establish product support.

The executable `legacyButtonConsumerInventory` assigns each consumer to one of four dispositions. Its test scans source and story imports so a new legacy consumer cannot remain unclassified.

| Classification | Retained surface | Purpose and limit |
| --- | --- | --- |
| Production conformance | `src/cap-model/`, CAP audit stories | Compare typed semantic observations against a pinned production baseline. Legacy imports are prohibited. |
| Synthetic research | `src/domain/`, `src/layered/`, `src/semantic/`, research tests, renderers, and stories | Compare ordered overrides with semantic composition, exercise mutation sensitivity, and study conservative forced-colors emission. Results apply only to the declared synthetic domain. |
| Migration | The content-anatomy grounding type dependency | Replace borrowed synthetic labels with production-owned terms before legacy removal. |
| Removal | Raw legacy exports from `src/index.ts` | Remove in the final migration after retained callers use the explicit research facade. |

## Retained experiments

The layered resolver is retained because it makes write order, ownership transfer, and precedence visible. The semantic resolver is retained as an independently organized comparator for the same research contract. Their equality tests evaluate architecture organization, not production CAP conformance.

The property and mutation suites are retained because they demonstrate whether the synthetic generators and oracles detect controlled faults. The clean-room renderer and Storybook matrices make those contracts inspectable. The forced-colors emission experiment remains useful for distinguishing exact duplicates from rules whose selector, slot, specificity, precedence, or order differs.

Production CAP evidence has separate types, counts, tests, and output labels. No passing synthetic law, accepted synthetic case, or architecture agreement changes the replacement model's `unknown` product-support status.