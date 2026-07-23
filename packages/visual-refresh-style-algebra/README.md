# Visual Refresh style algebra

A button refresh can begin with a new height or radius and end in a difficult system problem: Fluent defaults,
Visual Refresh changes, derived components, product requirements, interaction states, forced colors, and composite
controls can all influence the result. This private, clean-room package investigates how to preserve the useful shared
foundation while making legitimate product differences cheaper to express and easier to debug.

The experiment models a finite button domain, resolves it through two implementations, compares their user-facing
contracts, renders both through one native-button adapter, and challenges the model with properties, controlled
mutations, stories, and browser assertions. A focused refinement separates forced-colors accessibility requirements
from CSS/Griffel-like emission and tests conservative media-query normalization.

This package is an experiment, not a production dependency or a statement of private Fluent specifications. Policy assumptions are named and replaceable. It must remain private and isolated from published package behavior.

## Research map

- [Why this research exists](docs/motivation.md): UXE motivation, implementation tradeoffs, product alignment, and
  override elasticity.
- [Research charter](docs/research-charter.md): question, hypotheses, method, and evidence rules.
- [Clean-room model](docs/model.md): domain, validity, contract, policies, and omissions.
- [Resolver architectures](docs/architectures.md): layered overrides versus semantic composition.
- [Executable laws](docs/laws.md): sixteen deterministic fast-check properties.
- [Mutation experiments](docs/mutations.md): seven teaching faults and minimized regressions.
- [Browser evidence](docs/browser-evidence.md): curated stories and cross-engine assertions.
- [Findings](docs/findings.md): metrics, interpretation, limitations, and next experiments.

## Structure

`ButtonCase` separates product, visual language, density, appearance, interaction state, color mode, content, icon placement, anatomy, composition, and direction. `ButtonStyleContract` is the semantic boundary. The layered resolver applies named stages with field-level write history; the semantic resolver derives independent concerns. Provenance is excluded from equality, and both contracts feed `CleanRoomButton`.

`ForcedColorsContract` separately captures system roles, focus, visible boundaries, and disabled distinguishability. `EmittedStyleRule` then represents media, selector, component/slot scope, declarations, precedence, order, specificity, and provenance. The synthetic emission experiment demonstrates both safe exact deduplication and unsafe contextual lookalikes; it is not captured Griffel output.

## Run the program

Run commands from the repository root:

```sh
yarn nx run visual-refresh-style-algebra:lint
yarn nx run visual-refresh-style-algebra:type-check
yarn nx run visual-refresh-style-algebra:test
VISUAL_REFRESH_PBT_RUNS=1000 yarn nx run visual-refresh-style-algebra:test
yarn nx run visual-refresh-style-algebra:build
yarn nx run visual-refresh-style-algebra:build-storybook
yarn nx run visual-refresh-style-algebra:component-test --skipInstall
```

Start the inspection UI with:

```sh
yarn nx run visual-refresh-style-algebra:storybook
```

The default property profile uses seed `0x5eed` and 100 runs. The program now contains 29 named laws, including 13 focused forced-colors semantic/emission laws. Mutation experiments are opt-in transformations exercised by their own test files; normal resolvers and emitters never activate them.
