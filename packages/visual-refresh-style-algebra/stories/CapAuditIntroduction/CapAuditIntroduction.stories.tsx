import * as React from 'react';
import {
  Button,
  type ButtonProps,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { CheckmarkCircleRegular } from '@fluentui/react-icons';
import {
  capButtonAppearanceAvailabilityEvidence,
  capButtonDirectionObservedEquivalence,
  capButtonAuthoredIconPositions,
  capButtonBooleanValues,
  capButtonForcedColorsMatrix,
  capButtonForcedColorsRuntimeEvidence,
  capButtonGeometryEvidence,
  capButtonInteractionBrowserBaseline,
  capButtonInteractionConditionEvidence,
  capButtonInteractionConditionLedger,
  capButtonMotionMatrix,
  capButtonMotionRuntimeEvidence,
  capButtonScopedChildren,
  capButtonSemanticProfileCensus,
  capButtonThemeFixtureNames,
  type CapButtonGeometry,
  type CapButtonScenario,
  type CapModelEvidence,
  CapFixtureProvider,
  projectCapButtonThemeInput,
  productionCapButtonAppearances,
  productionCapButtonShapes,
  productionCapButtonSizes,
  resolveCleanRoomCapButton,
  resolveCapButtonMotion,
  tracedCapButtonEvidence,
} from '../../src';
import { capTheme } from '../../src/fixtures/capButtonFamily';

const capButtonStoryTheme = projectCapButtonThemeInput(capTheme);

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalXXL,
    maxWidth: '76rem',
  },
  section: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  lede: {
    margin: 0,
    maxWidth: '72ch',
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  auditPath: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  auditStep: {
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr',
    gap: tokens.spacingVerticalS,
    paddingBlock: tokens.spacingVerticalL,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  stepNumber: {
    fontFamily: tokens.fontFamilyMonospace,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  stepName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  stepDetail: {
    margin: 0,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
  },
  axisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
    gap: tokens.spacingHorizontalS,
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  axis: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  axisHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalXS,
  },
  axisCount: {
    fontFamily: tokens.fontFamilyMonospace,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
  },
  axisName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
  },
  axisOptions: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    margin: 0,
    paddingInlineStart: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
  },
  equation: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingHorizontalL,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteYellowBorder1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  equationText: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
  },
  equationLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
  equationDetail: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
  },
  equationResult: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
  },
  validityQuestion: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    paddingBlock: tokens.spacingVerticalL,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  questionHeading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  resultStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  result: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    paddingBlock: tokens.spacingVerticalL,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteGreenBorder1}`,
  },
  resultGap: {
    borderTopColor: tokens.colorPaletteYellowBorder1,
  },
  resultNumber: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  resultLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  geometryCases: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  geometryCase: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteGreenBorder1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  geometryPair: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'end',
    gap: tokens.spacingHorizontalXL,
  },
  geometrySample: {
    display: 'grid',
    justifyItems: 'start',
    gap: tokens.spacingVerticalXS,
  },
  geometryLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  geometryMetrics: {
    minWidth: 0,
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere',
  },
  evidence: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
    paddingInlineStart: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke2}`,
  },
  evidenceTitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    overflowWrap: 'anywhere',
  },
  evidenceDetail: {
    margin: 0,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere',
  },
});

const formatNumber = (value: number): string => value.toLocaleString('en-US');

const productionAxes = [
  {
    label: 'Appearance',
    values: productionCapButtonAppearances.map(
      (appearance) => appearance[0].toUpperCase() + appearance.slice(1)
    ),
  },
  {
    label: 'Size',
    values: productionCapButtonSizes.map(
      (size) => size[0].toUpperCase() + size.slice(1)
    ),
  },
  {
    label: 'Shape',
    values: productionCapButtonShapes.map(
      (shape) => shape[0].toUpperCase() + shape.slice(1)
    ),
  },
  {
    label: 'Disabled',
    values: capButtonBooleanValues.map((value) => String(value)),
  },
  {
    label: 'Disabled focusable',
    values: capButtonBooleanValues.map((value) => String(value)),
  },
  { label: 'Icon', values: capButtonScopedChildren },
  { label: 'Children', values: capButtonScopedChildren },
  { label: 'Icon position', values: capButtonAuthoredIconPositions },
] as const;

const authoredScenarioEquation = productionAxes
  .map((axis) => axis.values.length)
  .join(' × ');

const environmentProjections: ReadonlyArray<{
  readonly value: number;
  readonly label: string;
  readonly detail: string;
  readonly evidence: CapModelEvidence;
}> = [
  {
    value: capButtonInteractionConditionLedger.length,
    label: 'interactive states checked',
    detail: 'States we can trigger in the browser without forced colors.',
    evidence: capButtonInteractionConditionEvidence,
  },
  {
    value: capButtonForcedColorsMatrix.length,
    label: 'forced-colors checks',
    detail: 'Appearances, disabled states, and keyboard focus.',
    evidence: capButtonForcedColorsRuntimeEvidence,
  },
  {
    value: capButtonMotionMatrix.length,
    label: 'reduced-motion checks',
    detail: 'Appearances and disabled states with each motion preference.',
    evidence: capButtonMotionRuntimeEvidence,
  },
  {
    value: capButtonDirectionObservedEquivalence.scenarioCount,
    label: 'LTR/RTL comparisons',
    detail: 'The same Button inputs in both reading directions.',
    evidence: capButtonDirectionObservedEquivalence.evidence,
  },
];

const profileStages = [
  {
    value: capButtonSemanticProfileCensus.authoredScenarios,
    label: 'input combinations',
    diagnostic: false,
  },
  {
    value: capButtonSemanticProfileCensus.normalizedStateTuples,
    label: 'distinct states after Fluent applies defaults',
    diagnostic: false,
  },
  {
    value: capButtonSemanticProfileCensus.semanticProfiles,
    label: 'distinct visual results',
    diagnostic: false,
  },
  {
    value: capButtonSemanticProfileCensus.generatedClassProfiles.count,
    label: 'CSS class combinations (implementation detail)',
    diagnostic: true,
  },
  {
    value: `${capButtonSemanticProfileCensus.productSupport.knownProfiles} confirmed / ${capButtonSemanticProfileCensus.productSupport.unknownProfiles} not yet confirmed`,
    label: 'results covered by a product support contract',
    diagnostic: true,
  },
] as const;

const optionLabels: Readonly<Record<string, string>> = {
  primary: 'Primary',
  tint: 'Tint',
  outline: 'Outline',
  secondary: 'Secondary',
  subtle: 'Subtle',
  transparent: 'Transparent',
};

const optionLabel = (value: string): string => optionLabels[value] ?? value;

const auditSteps = [
  {
    name: 'Check the input',
    detail: 'Can public Button props express this combination?',
  },
  {
    name: 'Observe the result',
    detail:
      'Run Fluent with CAP and record the rendered content and style selected.',
  },
  {
    name: 'Confirm product intent',
    detail: 'Use a product contract or decision to establish intended support.',
  },
] as const;

const Evidence = ({
  evidence,
}: {
  readonly evidence: CapModelEvidence;
}): React.ReactElement => {
  const styles = useStyles();

  return (
    <aside className={styles.evidence} aria-label="Evidence source">
      <span className={styles.evidenceTitle}>
        Source checked: {evidence.productionBaseline} ·{' '}
        {evidence.productionSymbol}
      </span>
      <p className={styles.evidenceDetail}>{evidence.observation}</p>
    </aside>
  );
};

const geometryConditions = {
  hover: false,
  active: false,
  focusVisible: false,
  forcedColors: false,
  prefersReducedMotion: false,
  direction: 'ltr',
} as const;

const geometryEvidenceCases: ReadonlyArray<{
  readonly label: string;
  readonly scenario: CapButtonScenario;
}> = [
  {
    label: 'Small circular, icon only',
    scenario: {
      appearance: 'primary',
      size: 'small',
      shape: 'circular',
      disabled: false,
      disabledFocusable: false,
      content: {
        icon: 'present',
        children: 'absent',
        iconPosition: 'omitted',
      },
    },
  },
  {
    label: 'Medium rounded, icon before',
    scenario: {
      appearance: 'primary',
      size: 'medium',
      shape: 'rounded',
      disabled: false,
      disabledFocusable: false,
      content: {
        icon: 'present',
        children: 'present',
        iconPosition: 'before',
      },
    },
  },
  {
    label: 'Large square, icon after',
    scenario: {
      appearance: 'primary',
      size: 'large',
      shape: 'square',
      disabled: false,
      disabledFocusable: false,
      content: {
        icon: 'present',
        children: 'present',
        iconPosition: 'after',
      },
    },
  },
];

const motionEvidence = [
  {
    label: 'No preference',
    contract: resolveCapButtonMotion(false),
  },
  {
    label: 'Reduced motion',
    contract: resolveCapButtonMotion(true),
  },
] as const;

const rootGeometryStyle = (
  geometry: CapButtonGeometry['root']
): React.CSSProperties => ({
  paddingTop: geometry.paddingTop,
  paddingRight: geometry.paddingRight,
  paddingBottom: geometry.paddingBottom,
  paddingLeft: geometry.paddingLeft,
  borderTopLeftRadius: geometry.borderTopLeftRadius,
  borderTopRightRadius: geometry.borderTopRightRadius,
  borderBottomRightRadius: geometry.borderBottomRightRadius,
  borderBottomLeftRadius: geometry.borderBottomLeftRadius,
  minWidth: geometry.minWidth,
  maxWidth: geometry.maxWidth,
  fontSize: geometry.fontSize,
  fontWeight: Number(geometry.fontWeight),
  lineHeight: geometry.lineHeight,
});

const iconForScenario = (
  scenario: CapButtonScenario,
  geometry?: CapButtonGeometry['icon']
): ButtonProps['icon'] =>
  scenario.content.icon === 'present'
    ? {
        children: <CheckmarkCircleRegular />,
        style: geometry
          ? {
              fontSize: geometry.fontSize,
              marginLeft: geometry.marginLeft,
              marginRight: geometry.marginRight,
            }
          : undefined,
      }
    : undefined;

const contentForScenario = (scenario: CapButtonScenario): React.ReactNode =>
  scenario.content.children === 'present' ? 'Action' : undefined;

const geometryMetrics = (geometry: CapButtonGeometry): string => {
  const root = geometry.root;
  const icon = geometry.icon;

  return [
    `padding ${root.paddingTop} ${root.paddingRight} ${root.paddingBottom} ${root.paddingLeft}`,
    `radius ${root.borderTopLeftRadius}`,
    root.minWidth ? `width ${root.minWidth}` : undefined,
    icon ? `icon ${icon.fontSize}` : undefined,
    icon?.marginLeft ?? icon?.marginRight
      ? `spacing ${icon.marginLeft ?? icon.marginRight}`
      : undefined,
  ]
    .filter(Boolean)
    .join(' | ');
};

export const CapAuditIntroduction = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="combination-heading">
        <h2 id="combination-heading" className={styles.heading}>
          {formatNumber(capButtonSemanticProfileCensus.authoredScenarios)}{' '}
          Button input combinations
        </h2>
        <p className={styles.lede}>
          We vary the finite Button props that affect CAP styling, including
          appearance, size, shape, disabled state, and basic icon and text
          content. This gives us a repeatable set of inputs to check against the
          running component.
        </p>
        <div className={styles.axisGrid}>
          {productionAxes.map((axis) => (
            <div className={styles.axis} key={axis.label}>
              <div className={styles.axisHeader}>
                <span className={styles.axisName}>{axis.label}</span>
                <span className={styles.axisCount}>×{axis.values.length}</span>
              </div>
              <ul
                className={styles.axisOptions}
                aria-label={`${axis.label} options`}
              >
                {axis.values.map((value) => (
                  <li key={value}>{optionLabel(value)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.equation}>
          <div className={styles.equationText}>
            <span className={styles.equationLabel}>Combinations checked</span>
            <span className={styles.equationDetail}>
              {authoredScenarioEquation}
            </span>
          </div>
          <span className={styles.equationResult}>
            {formatNumber(capButtonSemanticProfileCensus.authoredScenarios)}
          </span>
        </div>
        <div className={styles.validityQuestion}>
          <h3 className={styles.questionHeading}>What this count includes</h3>
          <p className={styles.lede}>
            This is not a count of every possible Button prop. Free-form React
            content, event handlers, accessibility labels, custom classes, and
            arbitrary theme values cannot be usefully counted this way.
          </p>
        </div>
        <Evidence evidence={tracedCapButtonEvidence[0]} />
      </section>

      <section className={styles.section} aria-labelledby="profile-heading">
        <h2 id="profile-heading" className={styles.heading}>
          What Fluent and CAP produce
        </h2>
        <p className={styles.lede}>
          Fluent fills in defaults and derives the final Button state before CAP
          chooses styles. We count two inputs as the same result when they
          produce the same appearance, dimensions, and icon layout.
        </p>
        <div className={styles.resultStrip}>
          {profileStages.map((stage) => (
            <div
              className={mergeClasses(
                styles.result,
                stage.diagnostic && styles.resultGap
              )}
              key={stage.label}
            >
              <span className={styles.resultNumber}>
                {typeof stage.value === 'number'
                  ? formatNumber(stage.value)
                  : stage.value}
              </span>
              <span className={styles.resultLabel}>{stage.label}</span>
            </div>
          ))}
        </div>
        <p className={styles.lede}>
          After Fluent applies defaults, the appearance and disabled-state
          inputs produce{' '}
          {
            capButtonSemanticProfileCensus.semanticFactors
              .rootAppearanceAvailabilityOutputs
          }{' '}
          distinct appearances. Combining those with{' '}
          {capButtonSemanticProfileCensus.semanticFactors.sizes} sizes,{' '}
          {capButtonSemanticProfileCensus.semanticFactors.shapes} shapes, and{' '}
          {
            capButtonSemanticProfileCensus.semanticFactors
              .geometryContentOutputs
          }{' '}
          recurring size and content layouts produces{' '}
          {formatNumber(capButtonSemanticProfileCensus.semanticProfiles)}{' '}
          distinct visual results. The current build happens to emit{' '}
          {formatNumber(
            capButtonSemanticProfileCensus.generatedClassProfiles.count
          )}{' '}
          root-and-icon CSS class combinations. We track that number only to
          notice changes when dependencies are updated. Generated class names
          can change even when the Button looks and behaves exactly the same. We
          found no product support contract covering these{' '}
          {formatNumber(
            capButtonSemanticProfileCensus.productSupport.unknownProfiles
          )}{' '}
          results, so{' '}
          {capButtonSemanticProfileCensus.productSupport.knownProfiles} are
          confirmed and the rest are not yet confirmed.
        </p>
        <Evidence evidence={capButtonAppearanceAvailabilityEvidence[0]} />
      </section>

      <section className={styles.section} aria-labelledby="environment-heading">
        <h2 id="environment-heading" className={styles.heading}>
          Checks that depend on browser settings
        </h2>
        <p className={styles.lede}>
          Hover, focus, forced colors, reduced motion, reading direction, and
          theme can change the result around a Button. We test them separately
          instead of pretending they are additional Button props.
        </p>
        <div className={styles.resultStrip}>
          {environmentProjections.map(({ value, label, detail, evidence }) => (
            <div className={styles.result} key={label}>
              <span className={styles.resultNumber}>{formatNumber(value)}</span>
              <span className={styles.resultLabel}>{label}</span>
              <span className={styles.geometryMetrics}>{detail}</span>
              <Evidence evidence={evidence} />
            </div>
          ))}
          <div className={mergeClasses(styles.result, styles.resultGap)}>
            <span className={styles.resultNumber}>
              {capButtonThemeFixtureNames.length}
            </span>
            <span className={styles.resultLabel}>sample themes</span>
            <span className={styles.geometryMetrics}>
              {capButtonThemeFixtureNames.join(' | ')}
            </span>
          </div>
        </div>
        <p className={styles.lede}>
          The light and dark themes are representative samples, not a complete
          list of every theme an app can provide.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="geometry-heading">
        <h2 id="geometry-heading" className={styles.heading}>
          Side-by-side size and spacing checks
        </h2>
        <p className={styles.lede}>
          The left side renders the real Fluent Button with CAP styles. The
          right side uses a clean-room implementation for the same input. Their
          size, corner radius, icon size, and spacing should match.
        </p>
        <CapFixtureProvider>
          <div className={styles.geometryCases}>
            {geometryEvidenceCases.map(({ label, scenario }) => {
              const contract = resolveCleanRoomCapButton(
                scenario,
                geometryConditions,
                capButtonStoryTheme
              );
              const iconPosition =
                scenario.content.iconPosition === 'omitted'
                  ? undefined
                  : scenario.content.iconPosition;

              return (
                <article className={styles.geometryCase} key={label}>
                  <span className={styles.stepName}>{label}</span>
                  <div className={styles.geometryPair}>
                    <div className={styles.geometrySample}>
                      <span className={styles.geometryLabel}>Fluent + CAP</span>
                      <Button
                        appearance="primary"
                        size={scenario.size}
                        shape={scenario.shape}
                        icon={iconForScenario(scenario)}
                        iconPosition={iconPosition}
                        aria-label={
                          scenario.content.children === 'absent'
                            ? label
                            : undefined
                        }
                      >
                        {contentForScenario(scenario)}
                      </Button>
                    </div>
                    <div className={styles.geometrySample}>
                      <span className={styles.geometryLabel}>
                        Clean-room implementation
                      </span>
                      <Button
                        appearance="primary"
                        size={scenario.size}
                        shape={scenario.shape}
                        icon={iconForScenario(scenario, contract.geometry.icon)}
                        iconPosition={iconPosition}
                        style={rootGeometryStyle(contract.geometry.root)}
                        aria-label={
                          scenario.content.children === 'absent'
                            ? `${label}, clean-room implementation`
                            : undefined
                        }
                      >
                        {contentForScenario(scenario)}
                      </Button>
                    </div>
                  </div>
                  <span className={styles.geometryMetrics}>
                    {geometryMetrics(contract.geometry)}
                  </span>
                </article>
              );
            })}
          </div>
        </CapFixtureProvider>
        <Evidence evidence={capButtonGeometryEvidence[0]} />
      </section>

      <section className={styles.section} aria-labelledby="motion-heading">
        <h2 id="motion-heading" className={styles.heading}>
          Reduced-motion evidence
        </h2>
        <p className={styles.lede}>
          Production computed styles preserve the ordered transition properties
          background, border, and color. The reduced-motion media query changes
          only their aligned duration; it does not remove or rename them.
        </p>
        <div className={styles.resultStrip} aria-labelledby="motion-heading">
          {motionEvidence.map(({ label, contract }) => (
            <div className={styles.result} key={label}>
              <span className={styles.resultNumber}>
                {contract.transitions[0].durationMs}ms ×{' '}
                {contract.transitions.length}
              </span>
              <span className={styles.resultLabel}>{label}</span>
              <span className={styles.geometryMetrics}>
                {contract.transitions
                  .map((transition) => transition.property)
                  .join(' | ')}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.lede}>
          These {capButtonMotionMatrix.length} checks cover every appearance,
          disabled state, and motion preference in scope. They are kept separate
          from the Button input count above. The checks ran in{' '}
          {capButtonInteractionBrowserBaseline.engine}{' '}
          {capButtonInteractionBrowserBaseline.version} through Playwright{' '}
          {capButtonInteractionBrowserBaseline.playwright} on{' '}
          {capButtonInteractionBrowserBaseline.platform}. Playwright confirms
          that Chromium selects the expected media query and CSS values. It does
          not test a real operating-system setting, other browsers, how the
          motion feels to a person, or product support.
        </p>
        <Evidence evidence={capButtonMotionRuntimeEvidence} />
      </section>

      <section className={styles.section} aria-labelledby="audit-path-heading">
        <h2 id="audit-path-heading" className={styles.heading}>
          What can this audit conclude?
        </h2>
        <p className={styles.lede}>
          The public API tells us what an app can request. The running component
          tells us what the current code does. Only a product contract can tell
          us which results are deliberately supported.
        </p>
        <div className={styles.auditPath}>
          {auditSteps.map((step, index) => (
            <article className={styles.auditStep} key={step.name}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <span className={styles.stepName}>{step.name}</span>
              <p className={styles.stepDetail}>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

CapAuditIntroduction.displayName = 'CapAuditIntroduction';
