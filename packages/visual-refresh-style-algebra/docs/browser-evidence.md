# Browser and Storybook evidence

## Curated stories

- **Button Matrix** samples product, visual language, density, state, color mode, anatomy, composition, and direction without pretending to render all 27,840 valid cases.
- **Button Comparison** places layered and semantic results side by side and surfaces normalized differences.
- **Counterexamples** preserves cases that exposed focus, forced-color, density, accessibility, RTL padding, and split-corner faults.

## Browser assertions

Playwright component tests run the shared native-button renderer in Chromium, Firefox, and WebKit. They assert native disabled semantics, focus-visible styling, forced-color system-role mapping, icon-only accessible labels, reconstructed anatomy, conditional padding, split-button corners, and RTL behavior.

The browser suite is deliberately small and scenario-based. Property tests cover combinatorial semantics cheaply; browser tests verify that the renderer preserves selected semantics in actual engines.

## Boundary of evidence

These checks do not constitute visual-regression baselines, screen-reader certification, contrast measurement, or validation of production Fluent components. They test the clean-room renderer only.
