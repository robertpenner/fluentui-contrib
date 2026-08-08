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
  { label: 'Authored icon position', values: capButtonAuthoredIconPositions },
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
    label: 'interaction conditions',
    detail: 'Browser-producible ordinary-color conditions.',
    evidence: capButtonInteractionConditionEvidence,
  },
  {
    value: capButtonForcedColorsMatrix.length,
    label: 'forced-colors observations',
    detail: 'Appearance, availability, and focus projection.',
    evidence: capButtonForcedColorsRuntimeEvidence,
  },
  {
    value: capButtonMotionMatrix.length,
    label: 'motion observations',
    detail: 'Appearance, availability, and preference projection.',
    evidence: capButtonMotionRuntimeEvidence,
  },
  {
    value: capButtonDirectionObservedEquivalence.scenarioCount,
    label: 'direction scenario pairs',
    detail: 'Each scenario is observed in LTR and RTL.',
    evidence: capButtonDirectionObservedEquivalence.evidence,
  },
];

const profileStages = [
  {
    value: capButtonSemanticProfileCensus.authoredScenarios,
    label: 'basic authored scenarios',
    diagnostic: false,
  },
  {
    value: capButtonSemanticProfileCensus.normalizedStateTuples,
    label: 'normalized state tuples',
    diagnostic: false,
  },
  {
    value: capButtonSemanticProfileCensus.semanticProfiles,
    label: 'semantic style profiles',
    diagnostic: false,
  },
  {
    value: capButtonSemanticProfileCensus.generatedClassProfiles.count,
    label: 'generated class profiles (diagnostic)',
    diagnostic: true,
  },
  {
    value: `${capButtonSemanticProfileCensus.productSupport.knownProfiles} known / ${capButtonSemanticProfileCensus.productSupport.unknownProfiles} unknown`,
    label: 'product-support profiles',
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
    <aside className={styles.evidence} aria-label="Production evidence">
      <span className={styles.evidenceTitle}>
        Evidence · {evidence.productionBaseline} · {evidence.productionSymbol}
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
          {formatNumber(capButtonSemanticProfileCensus.authoredScenarios)} basic
          authored scenarios
        </h2>
        <p className={styles.lede}>
          This finite census starts with the inputs that Fluent normalization
          and the production CAP Button style hook actually read. It varies
          basic icon and child presence, not arbitrary React content.
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
            <span className={styles.equationLabel}>
              Production inputs multiplied
            </span>
            <span className={styles.equationDetail}>
              {authoredScenarioEquation}
            </span>
          </div>
          <span className={styles.equationResult}>
            {formatNumber(capButtonSemanticProfileCensus.authoredScenarios)}
          </span>
        </div>
        <div className={styles.validityQuestion}>
          <h3 className={styles.questionHeading}>This is a scoped census</h3>
          <p className={styles.lede}>
            It is not a count of every possible Button prop. Arbitrary React
            children, slot objects, user classes, event handlers, ARIA props,
            and theme values do not form useful finite axes for this audit.
          </p>
        </div>
        <Evidence evidence={tracedCapButtonEvidence[0]} />
      </section>

      <section className={styles.section} aria-labelledby="profile-heading">
        <h2 id="profile-heading" className={styles.heading}>
          What production does with them
        </h2>
        <p className={styles.lede}>
          Fluent supplies defaults and derives state before CAP selects style
          declarations. Profiles compare effective root and icon geometry plus
          root appearance, never generated class identity.
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
          Production observations collapse the authored appearance and
          availability inputs to{' '}
          {
            capButtonSemanticProfileCensus.semanticFactors
              .rootAppearanceAvailabilityOutputs
          }{' '}
          effective root appearances. Across{' '}
          {capButtonSemanticProfileCensus.semanticFactors.sizes} sizes,{' '}
          {capButtonSemanticProfileCensus.semanticFactors.shapes} shapes, and{' '}
          {
            capButtonSemanticProfileCensus.semanticFactors
              .geometryContentOutputs
          }{' '}
          recurring geometry/content outputs, that produces{' '}
          {formatNumber(capButtonSemanticProfileCensus.semanticProfiles)}{' '}
          semantic profiles. The pinned implementation also emits{' '}
          {formatNumber(
            capButtonSemanticProfileCensus.generatedClassProfiles.count
          )}{' '}
          root-and-icon class signatures. That is a version-sensitive
          diagnostic, not semantic identity. Product support is unknown for all{' '}
          {formatNumber(
            capButtonSemanticProfileCensus.productSupport.unknownProfiles
          )}{' '}
          profiles;{' '}
          {capButtonSemanticProfileCensus.productSupport.knownProfiles} are
          known supported.
        </p>
        <Evidence evidence={capButtonAppearanceAvailabilityEvidence[0]} />
      </section>

      <section className={styles.section} aria-labelledby="environment-heading">
        <h2 id="environment-heading" className={styles.heading}>
          Environment conditions are separate projections
        </h2>
        <p className={styles.lede}>
          These observations test runtime context around the authored Button.
          They are not Button axes and are not summed or multiplied into one
          ontology count.
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
            <span className={styles.resultLabel}>theme fixtures</span>
            <span className={styles.geometryMetrics}>
              {capButtonThemeFixtureNames.join(' | ')}
            </span>
          </div>
        </div>
        <p className={styles.lede}>
          Theme remains an open input rather than a finite Button axis. The
          fixtures pin light and dark correspondence checks; they are not an
          exhaustive theme census.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="geometry-heading">
        <h2 id="geometry-heading" className={styles.heading}>
          Geometry evidence
        </h2>
        <p className={styles.lede}>
          Each production CAP Button is paired with the same Fluent Button whose
          root and icon geometry is projected by the clean-room resolver.
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
                      <span className={styles.geometryLabel}>
                        Production CAP
                      </span>
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
                        Clean-room projection
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
                            ? `${label}, clean-room projection`
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
          {capButtonMotionMatrix.length} observations cover the exported
          appearance, availability, and preference projection. These factors are
          not added to the authored scenario census. The pinned evidence is{' '}
          {capButtonInteractionBrowserBaseline.engine}{' '}
          {capButtonInteractionBrowserBaseline.version} through Playwright{' '}
          {capButtonInteractionBrowserBaseline.playwright} on{' '}
          {capButtonInteractionBrowserBaseline.platform}. Playwright media
          emulation confirms query matching and computed declarations, not a
          real operating-system preference, other browser engines, perceived
          animation, or product support. Product support remains unknown.
        </p>
        <Evidence evidence={capButtonMotionRuntimeEvidence} />
      </section>

      <section className={styles.section} aria-labelledby="history-heading">
        <h2 id="history-heading" className={styles.heading}>
          Historical model boundary
        </h2>
        <p className={styles.lede}>
          138,240 raw tuples and 27,840 model-admitted cases are historical
          synthetic-model results. Neither is a production CAP Button count.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="audit-path-heading">
        <h2 id="audit-path-heading" className={styles.heading}>
          How do we determine which are valid?
        </h2>
        <p className={styles.lede}>
          First, define what valid means. Public props show what can be
          expressed, the running component shows what happens, and product
          intent shows what is deliberately supported.
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
