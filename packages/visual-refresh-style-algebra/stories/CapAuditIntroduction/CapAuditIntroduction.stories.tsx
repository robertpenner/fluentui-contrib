import * as React from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import {
  buttonCaseAxes,
  buttonCaseCensus,
  buttonContentGroundingCensus,
} from '../../src';

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
});

const formatNumber = (value: number): string => value.toLocaleString('en-US');

const optionLabels: Readonly<Record<string, string>> = {
  fluent: 'Fluent',
  sharepoint: 'SharePoint',
  teams: 'Teams',
  fluent2: 'Fluent 2',
  visualRefresh: 'Visual Refresh',
  standard: 'Standard',
  compact: 'Compact',
  primary: 'Primary',
  subtle: 'Subtle',
  transparent: 'Transparent',
  tint: 'Tint',
  rest: 'Rest',
  hover: 'Hover',
  pressed: 'Pressed',
  focusVisible: 'Focus visible',
  disabled: 'Disabled',
  light: 'Light',
  dark: 'Dark',
  forcedColors: 'Forced colors',
  text: 'Text',
  iconOnly: 'Icon only',
  textAndIcon: 'Text and icon',
  none: 'No icon',
  before: 'Before',
  after: 'After',
  only: 'Icon only',
  fluentDefault: 'Fluent default',
  visualRefreshReconstructed: 'Visual Refresh reconstructed',
  standalone: 'Standalone',
  toolbar: 'Toolbar',
  splitButtonStart: 'Split button start',
  splitButtonEnd: 'Split button end',
  ltr: 'Left to right',
  rtl: 'Right to left',
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

export const CapAuditIntroduction = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="combination-heading">
        <h2 id="combination-heading" className={styles.heading}>
          138,240 possible combinations
        </h2>
        <p className={styles.lede}>
          Eleven dimensions can affect the button's structure, style,
          interaction, accessibility, or composition.
        </p>
        <div className={styles.axisGrid}>
          {buttonCaseAxes.map((axis) => (
            <div className={styles.axis} key={axis.key}>
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
            <span className={styles.equationLabel}>All choices multiplied</span>
            <span className={styles.equationDetail}>
              3 × 2 × 2 × 4 × 5 × 3 × 3 × 4 × 2 × 4 × 2
            </span>
          </div>
          <span className={styles.equationResult}>
            {formatNumber(buttonCaseCensus.rawTotal)}
          </span>
        </div>
        <div className={styles.validityQuestion}>
          <h3 className={styles.questionHeading}>How many are valid?</h3>
          <p className={styles.lede}>
            Possible does not mean valid. Some inputs may produce the same
            result, render nothing, or have no documented product support.
            Counting valid combinations requires evidence from both component
            behavior and product intent.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="first-slice-heading">
        <h2 id="first-slice-heading" className={styles.heading}>
          A first check: content and icons
        </h2>
        <p className={styles.lede}>
          The first audit covers all twelve combinations of icon, content, and
          icon position. Running them shows that nine render content, four CAP
          style effects recur, and three render empty.
        </p>
        <div className={styles.resultStrip}>
          <div className={styles.result}>
            <span className={styles.resultNumber}>
              {buttonContentGroundingCensus.productionScenarios}
            </span>
            <span className={styles.resultLabel}>combinations tested</span>
          </div>
          <div className={styles.result}>
            <span className={styles.resultNumber}>
              {buttonContentGroundingCensus.representedScenarios}
            </span>
            <span className={styles.resultLabel}>
              buttons that render content
            </span>
          </div>
          <div className={styles.result}>
            <span className={styles.resultNumber}>
              {buttonContentGroundingCensus.canonicalConfigurations}
            </span>
            <span className={styles.resultLabel}>
              recurring CAP style effects
            </span>
          </div>
          <div className={mergeClasses(styles.result, styles.resultGap)}>
            <span className={styles.resultNumber}>
              {buttonContentGroundingCensus.unrepresentedScenarios}
            </span>
            <span className={styles.resultLabel}>
              buttons that render empty
            </span>
          </div>
        </div>
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
