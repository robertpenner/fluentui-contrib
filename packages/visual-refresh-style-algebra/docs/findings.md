# Research findings

## Measurements

The raw Cartesian input space contains 138,240 tuples. The explicit validity predicate admits 27,840 cases, or about 20.1%. `researchMetrics.test.ts` reproduces this census exhaustively.

Across all valid cases, the layered architecture records 38 to 50 field writes per resolution. Eighteen fields have multiple owners somewhere in the domain: anatomy, capabilities, supported appearance, validation obligations, focus visibility/color, four geometry fields, four logical corners, and three appearance color roles. These values are executable regression metrics, not performance benchmarks.

The program contains 16 named property laws and seven controlled mutations. The deep validation profile runs each property for 1,000 generated cases with a deterministic seed. Browser assertions cover five scenarios in each of three engines.

## Results

The two architectures are observationally equivalent after provenance normalization for generated valid cases. This supports the hypothesis that a semantic algebra can replace layered computation without changing the modeled contract.

Equivalence does not make the architectures operationally identical. Layer history reveals substantial shared ownership and makes precedence inspectable. Semantic composition localizes most decisions and removes incidental ordering where concerns are independent.

Forced colors are order-sensitive: they must replace interaction and product colors after those stages. Context geometry and interaction coloring commute in this model. The contrast is useful because it distinguishes essential precedence from accidental sequence.

The validity-preserving generator matters as much as the properties. A naive generator would spend roughly four fifths of its samples on rejected tuples and obscure whether failures describe the supported system.

Every controlled mutation is detected and shrunk. The RTL split-corner experiment was especially valuable: logical corner names are easy to misread, and the minimized fixture became both a property regression and a browser scenario.

## Interpretation

The strongest practical result is not that one architecture universally wins. It is that a shared semantic contract, explicit domain, provenance, and executable laws let architecture choices be compared without conflating them with CSS or React details.

The semantic resolver is the clearer source of policy truth for this model. The layered resolver remains valuable as an audit instrument and as a representation of migration/override behavior. A production design could use semantic derivation for ownership and retain write-history tooling at adaptation boundaries.

## Limitations and next experiments

Policy values include clean-room assumptions. The renderer does not model the CSS cascade, font metrics, layout measurement, animation, full Fluent behavior, or assistive-technology output. Random property checks are not exhaustive proofs, and the curated browser matrix is intentionally sparse.

Next experiments should replace assumptions with cited public evidence, add contrast and high-zoom measurements, compare against production components only through public APIs, test bidirectional mixed content, and measure whether ownership overlap predicts real maintenance defects.
