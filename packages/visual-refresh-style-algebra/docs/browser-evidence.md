# Browser and Storybook evidence

## Curated stories

- **Button Matrix** samples product, visual language, density, state, color mode, anatomy, composition, and direction without pretending to render all 27,840 valid cases.
- **Button Comparison** places layered and semantic results side by side and surfaces normalized differences.
- **Counterexamples** preserves cases that exposed focus, forced-color, density, accessibility, RTL padding, and split-corner faults.
- **Forced-colors emission** shows five compact reference cases spanning Fluent 2, Visual Refresh, Fluent,
  SharePoint, Teams, standard/compact density, all supported appearance families, focus/disabled states,
  Button/ToggleButton/split targets, and LTR/RTL. Each case exposes the semantic contract, synthetic unnormalized
  emission, normalized emission, diagnostics, rendered output, and layered provenance/write history.

## Browser assertions

Playwright component tests run the shared native-button renderer in Chromium, Firefox, and WebKit. They assert native disabled semantics, focus-visible styling, forced-color system-role mapping, icon-only accessible labels, reconstructed anatomy, conditional padding, split-button corners, and RTL behavior.

The browser suite is deliberately small and scenario-based. Property tests cover combinatorial semantics cheaply; browser tests verify that the renderer preserves selected semantics in actual engines.

## Boundary of evidence

These checks do not constitute visual-regression baselines, screen-reader certification, contrast measurement, or validation of production Fluent components. They test the clean-room renderer only.

Playwright component testing in this package does not faithfully reproduce OS high-contrast settings and browser
paint-time forced-color substitution across all three engines. The browser checks therefore assert deterministic
system-role mapping and rendered structure, while semantic and emission properties carry the normalization argument.
The synthetic media-query rules are inspection artifacts and are not injected into the rendered button.
