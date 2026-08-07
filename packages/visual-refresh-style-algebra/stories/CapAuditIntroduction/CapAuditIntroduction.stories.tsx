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
    gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
    gap: tokens.spacingHorizontalS,
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  axis: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  axisCount: {
    fontFamily: tokens.fontFamilyMonospace,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  axisName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
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
    fontSize: tokens.fontSizeBase200,
  },
  equationResult: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
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

const auditSteps = [
  {
    name: 'Set the inputs',
    detail: 'Choose the public Button props for one combination.',
  },
  {
    name: 'Run Fluent with CAP',
    detail: 'Use Fluent normalization and rendering with the CAP style hook.',
  },
  {
    name: 'Record the result',
    detail:
      'Capture the rendered slots, their order, and the CAP style selected.',
  },
] as const;

export const CapAuditIntroduction = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="audit-path-heading">
        <h2 id="audit-path-heading" className={styles.heading}>
          How the audit runs
        </h2>
        <p className={styles.lede}>
          Each case uses public Fluent Button props and the Visual Refresh CAP
          style hook.
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

      <section className={styles.section} aria-labelledby="combination-heading">
        <h2 id="combination-heading" className={styles.heading}>
          138,240 combinations
        </h2>
        <p className={styles.lede}>
          Eleven choices can affect the button's structure, style, interaction,
          accessibility, or composition.
        </p>
        <div className={styles.axisGrid}>
          {buttonCaseAxes.map((axis) => (
            <div className={styles.axis} key={axis.key}>
              <span className={styles.axisCount}>{axis.values.length}</span>
              <span className={styles.axisName}>{axis.label}</span>
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
      </section>

      <section className={styles.section} aria-labelledby="first-slice-heading">
        <h2 id="first-slice-heading" className={styles.heading}>
          Content and icons
        </h2>
        <p className={styles.lede}>
          The first audit covers all twelve combinations of icon, content, and
          icon position.
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
    </div>
  );
};

CapAuditIntroduction.displayName = 'CapAuditIntroduction';
