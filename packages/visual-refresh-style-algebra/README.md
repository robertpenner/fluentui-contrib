# Visual Refresh style algebra

A button refresh can begin with a new height or radius and end in a difficult system problem: Fluent defaults,
Visual Refresh changes, derived components, product requirements, interaction states, forced colors, and composite
controls can all influence the result. This private, clean-room package investigates how to preserve the useful shared
foundation while making legitimate product differences cheaper to express and easier to debug.

The historical synthetic experiment models a finite button domain, resolves it through two implementations, compares their user-facing
contracts, renders both through one native-button adapter, and challenges the model with properties, controlled
mutations, stories, and browser assertions. A focused refinement separates forced-colors accessibility requirements
from CSS/Griffel-like emission and tests conservative media-query normalization.

A separate production-conformance path under `src/cap-model/button/` starts from pinned Fluent and CAP observations. It does not import the synthetic ontology, and it keeps product support unknown. See the [synthetic research inventory](docs/synthetic-button-research-inventory.md) for the boundary and disposition of each retained experiment.

This package is an experiment, not a production dependency or a statement of private Fluent specifications. Policy assumptions are named and replaceable. It must remain private and isolated from published package behavior.

## Research map

- [Why this research exists](docs/motivation.md): UXE motivation, implementation tradeoffs, product alignment, and
  override elasticity.
- [Research charter](docs/research-charter.md): question, hypotheses, method, and evidence rules.
- [Synthetic research model](docs/model.md): historical domain, validity assumptions, contract, policies, and omissions.
- [Production grounding plan](docs/production-grounding-plan.md): staged observation, mapping, differential testing,
  and census revision against public Fluent and VR CAP behavior.
- [Synthetic research inventory](docs/synthetic-button-research-inventory.md): production boundary, retained experiments, migrations, and removal targets.
- [Synthetic resolver architectures](docs/architectures.md): layered overrides versus semantic composition.
- [Synthetic executable laws](docs/laws.md): sixteen deterministic fast-check properties.
- [Synthetic mutation experiments](docs/mutations.md): seven teaching faults and minimized regressions.
- [Browser evidence](docs/browser-evidence.md): curated stories and cross-engine assertions.
- [Findings](docs/findings.md): metrics, interpretation, limitations, and next experiments.

## Structure

In the synthetic research facade, `SyntheticButtonResearchCase` separates product, visual language, density, appearance, interaction state, color mode, content, icon placement, anatomy, composition, and direction. Its counts and admission rules are not CAP facts. The layered resolver applies named stages with field-level write history; the semantic resolver derives independent concerns. Provenance is excluded from equality, and both research contracts feed the same renderer.

`ForcedColorsContract` separately captures system roles, focus, visible boundaries, and disabled distinguishability. `EmittedStyleRule` then represents media, selector, component/slot scope, declarations, precedence, order, specificity, and provenance. A synthetic emission experiment demonstrates safe exact deduplication. A second instrument captures real runtime Griffel output from public CAP Button-family style hooks, feeds it into the same normalizer, and compares enabled, disabled, selected, and alternate-appearance fixtures without conflating emission with browser paint.

The production-faithful CAP Button path accepts only the semantic token values used by its grounded static paint and
focus rules. Named Fluent light and dark themes are fixture adapters, not Button axes. Provider direction is observed
separately and physical declarations are normalized to logical geometry; the current 45-case plain-Button matrix
records LTR and RTL as equivalent after that normalization. Forced colors remains independently resolvable.

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

Storybook runs at <http://localhost:4400>. The command remains active while the development server is running.

The default property profile uses seed `0x5eed` and 100 runs. The program now contains 29 named laws, including 13 focused forced-colors semantic/emission laws. Mutation experiments are opt-in transformations exercised by their own test files; normal resolvers and emitters never activate them.
