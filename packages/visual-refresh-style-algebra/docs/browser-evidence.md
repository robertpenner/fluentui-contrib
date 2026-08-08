# Browser and Storybook evidence

## Curated stories

- **Synthetic Button Matrix** samples research axes without pretending to render all 27,840 model-admitted cases.
- **Synthetic Button Comparison** places the layered and semantic research results side by side and surfaces normalized differences.
- **Synthetic Counterexamples** preserves cases that exposed faults in the research architectures and laws.
- **Content anatomy audit** exercises twelve public icon, children, and position scenarios, separates Fluent
  normalization and rendered order from clean-room interpretation, and records four distinct VR CAP class effects.
- **Synthetic forced-colors emission** shows five compact reference cases spanning modeled Fluent 2, Visual Refresh, Fluent,
  SharePoint, Teams, standard/compact density, all supported appearance families, focus/disabled states,
  Button/ToggleButton/split targets, and LTR/RTL. Each case exposes the semantic contract, synthetic unnormalized
  emission, normalized emission, diagnostics, rendered output, and layered provenance/write history.
- **Real Griffel capture** renders public CAP Button, ToggleButton, and SplitButton fixtures, reads their runtime
  forced-colors CSSOM rules, adapts them into the same emission model, and displays captured, normalized, and
  differential output for disabled, selected, and alternate-appearance fixtures.

## Browser assertions

Playwright component tests run the shared native-button renderer in Chromium, Firefox, and WebKit. They assert native disabled semantics, focus-visible styling, forced-color system-role mapping, icon-only accessible labels, reconstructed anatomy, conditional padding, split-button corners, and RTL behavior. Runtime capture laws run in all three engines; Chromium additionally locks the dependency-sensitive corpus and differential counts. Forced-colors emulation in all three engines verifies that selected primary paint matches enabled primary paint and disabled paint remains distinct. Chromium and Firefox also map unselected ToggleButton and secondary Button to the same profile; WebKit computes those profiles differently.

The browser suite is deliberately small and scenario-based. Property tests cover combinatorial semantics cheaply; browser tests verify that the renderer preserves selected semantics in actual engines.

The synthetic stories and browser renderer checks do not establish CAP Button support. Production-conformance browser baselines are maintained separately under `src/cap-model/button/tests/`.

### CAP Button forced-colors baseline

The production-faithful CAP Button model has a separate 48-case forced-colors
projection. It is not a third theme fixture and does not alter the six ordinary
interaction conditions:

- 18 inactive rest cases: six appearances by enabled, disabled, and
  disabled-focusable availability;
- 18 active rest cases over the same appearance and availability product;
- 12 active focus-visible cases: six appearances by enabled and
  disabled-focusable availability. Native disabled Buttons cannot receive this
  keyboard focus condition.

The test-only production probe renders the real Fluent Button through the CAP
theme and style hooks. For the 30 active cases it reads matching forced-colors
declarations from the live Griffel CSSOM, then separately reads computed paint.
The clean-room resolver has no Fluent or CAP runtime imports and reproduces both
observations with literal values.

The authored contract records only CSSOM-proven system-color keywords and an
explicit `forced-color-adjust: none`; null means that CAP authored no matching
forced-colors declaration. The effective contract records computed RGB values,
the computed `auto | none` policy, media-query match, a substitution canary,
four border colors, and focus outline/shadow paint. It does not infer a system
keyword from an RGB value. Chromium maps the observed focus-border keywords to
the pinned palette after transitions settle, and may suppress a box shadow that
remains present in CSSOM.

The pinned baseline is Playwright 1.56.1 with Chromium 141.0.7390.37, Linux
headless. Its observed system-color paints are `ButtonBorder #000000`,
`ButtonFace #ffffff`, `GrayText #600000`, `Highlight #050049`, and
`HighlightText #ffffff`. These values are version-, engine-, platform-, and
palette-sensitive. Firefox and WebKit are intentionally unavailable for this
contract, and Playwright media emulation is not a real Windows high-contrast
session. Other operating-system palettes and platform substitution outcomes
remain unknown. Product support also remains unknown.

Hover and active under forced colors are not included: the issue requires
appearance, availability, substitution, and producible focus-visible coverage,
not a multiplication of the ordinary pointer-state matrix. Direction belongs
to the separate direction scope, and transition/reduced-motion behavior belongs
to the separate motion scope.

### CAP Button reduced-motion baseline

The motion projection contains 36 cases: six appearances by enabled, disabled,
and disabled-focusable availability under `no-preference` and `reduce`. In every
case Chromium computes the ordered transition properties `background`,
`border`, and `color`. Their structurally aligned durations are `100ms` each at
`no-preference` and `0.01ms` each at `reduce`. Normal and reduced motion are
therefore observed to differ only in duration; the model does not manufacture a
zero duration or remove transition properties.

The production probe renders real Fluent Buttons with CAP theme/style hooks and
projects computed `transition-property` and `transition-duration` comma lists
into ordered `{ property, durationMs }` entries. CSS duration lists are aligned
to property lists using CSS list-cycling rules, and both `s` and `ms` browser
serializations are normalized to milliseconds. The clean-room resolver contains
literal observed values and has no Fluent or CAP imports.

A separate representative matrix repeats both preferences across light and dark
named theme adapters, LTR and RTL, and forced colors active and inactive. These
conditions do not change the motion contract and are not inputs to the motion
resolver. Hover, active, focus-visible, delay, and timing-function axes are not
needed to observe the effective declarations and are outside this motion scope.

The pinned baseline is Playwright 1.56.1 with Chromium 141.0.7390.37, Linux
headless. `page.emulateMedia()` proves that Chromium matches the requested media
query and exposes the resulting computed declarations. It is not a real
operating-system reduced-motion setting, does not establish animation perception
or assistive-technology behavior, and provides no Firefox, WebKit, or product
support claim. Product support remains unknown.

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
