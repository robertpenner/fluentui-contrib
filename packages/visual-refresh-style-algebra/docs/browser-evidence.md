# Browser and Storybook evidence

## Curated stories

- **Button Matrix** samples product, visual language, density, state, color mode, anatomy, composition, and direction without pretending to render all 27,840 valid cases.
- **Button Comparison** places layered and semantic results side by side and surfaces normalized differences.
- **Counterexamples** preserves cases that exposed focus, forced-color, density, accessibility, RTL padding, and split-corner faults.
- **Content anatomy grounding** exercises twelve public icon, children, and position scenarios, separates Fluent
  normalization and rendered order from clean-room interpretation, and records four distinct VR CAP class effects.
- **Forced-colors emission** shows five compact reference cases spanning Fluent 2, Visual Refresh, Fluent,
  SharePoint, Teams, standard/compact density, all supported appearance families, focus/disabled states,
  Button/ToggleButton/split targets, and LTR/RTL. Each case exposes the semantic contract, synthetic unnormalized
  emission, normalized emission, diagnostics, rendered output, and layered provenance/write history.
- **Real Griffel capture** renders public CAP Button, ToggleButton, and SplitButton fixtures, reads their runtime
  forced-colors CSSOM rules, adapts them into the same emission model, and displays captured, normalized, and
  differential output for disabled, selected, and alternate-appearance fixtures.

## Browser assertions

Playwright component tests run the shared native-button renderer in Chromium, Firefox, and WebKit. They assert native disabled semantics, focus-visible styling, forced-color system-role mapping, icon-only accessible labels, reconstructed anatomy, conditional padding, split-button corners, and RTL behavior. Runtime capture laws run in all three engines; Chromium additionally locks the dependency-sensitive corpus and differential counts. Forced-colors emulation in all three engines verifies that selected primary paint matches enabled primary paint and disabled paint remains distinct. Chromium and Firefox also map unselected ToggleButton and secondary Button to the same profile; WebKit computes those profiles differently.

The browser suite is deliberately small and scenario-based. Property tests cover combinatorial semantics cheaply; browser tests verify that the renderer preserves selected semantics in actual engines.

The content-anatomy table is verified primarily by a twelve-scenario component integration test running in the unit-test
harness, not by a browser-paint assertion. The test invokes public Fluent normalization and rendering APIs, renders public Button components with and without the
real CAP style hooks, and compares class-effect relationships without publishing generated class identities. The
Storybook page renders the same twelve fixtures and six React-child edge cases live. A deliberate mutation test
changes each recorded observation boundary and verifies that the comparator names the changed field. This establishes
normalized structure and style selection in a simulated DOM, not layout or pixel equivalence, accessibility
certification, or product support.

## Boundary of evidence

These checks do not constitute visual-regression baselines, screen-reader certification, contrast measurement, or validation of a production application. Most test the clean-room renderer; the CSSOM capture separately inspects public Fluent components with CAP style hooks.

Playwright component testing in this package does not faithfully reproduce OS high-contrast settings and browser
paint-time forced-color substitution across all three engines. The browser checks therefore assert deterministic
system-role mapping and rendered structure, while semantic and emission properties carry the normalization argument.
The synthetic media-query rules are inspection artifacts and are not injected into the rendered button. The real
capture reads generated rules loaded for selected elements and identifies selectors matching the resting DOM. It does
not prove which declarations win in every pseudo-state. Browser forced-colors emulation exercises substitution and
computed styles, but it is not a real operating-system high-contrast session and does not certify equivalent paint
across engines or every system palette.

The live development story currently emits Griffel diagnostics for `borderColor` shorthand in the loaded CAP style
hooks. The capture experiment does not suppress or reinterpret those diagnostics; they are an observed input-version
limitation rather than evidence that capture or normalization failed.
