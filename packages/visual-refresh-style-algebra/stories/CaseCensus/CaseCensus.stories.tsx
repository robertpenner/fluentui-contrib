import * as React from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import {
  CheckmarkCircle20Filled,
  DismissCircle20Regular,
} from '@fluentui/react-icons';
import {
  buttonContentGroundingCensus,
  syntheticButtonResearchAnatomyPolicies as anatomyPolicies,
  syntheticButtonResearchAppearances as appearances,
  syntheticButtonResearchAxes as buttonCaseAxes,
  syntheticButtonResearchCensus as buttonCaseCensus,
  syntheticButtonResearchContentConstructionCensus as contentConstructionCensus,
  syntheticButtonResearchContentKinds as contentKinds,
  syntheticButtonResearchIconPlacements as iconPlacements,
  syntheticButtonResearchProductPolicyCensus as productPolicyCensus,
  syntheticButtonResearchProducts as products,
  syntheticButtonResearchVisualLanguages as visualLanguages,
} from '../../src';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalXXL,
    maxWidth: '72rem',
  },
  section: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  sectionHeading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  lede: {
    margin: 0,
    maxWidth: '68ch',
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  summaryItem: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalL,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  summaryValid: {
    borderColor: tokens.colorPaletteGreenBorder1,
    backgroundColor: tokens.colorPaletteGreenBackground1,
  },
  summaryNumber: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero800,
  },
  summaryLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  axisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
    gap: tokens.spacingHorizontalS,
  },
  axis: {
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr',
    gap: tokens.spacingVerticalXS,
    minHeight: '8rem',
    padding: tokens.spacingHorizontalM,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  axisCount: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  axisLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
  axisValues: {
    alignSelf: 'end',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100,
  },
  equation: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
    gap: tokens.spacingHorizontalM,
    alignItems: 'stretch',
  },
  factor: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalL,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteMarigoldBorder1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  factorValid: {
    borderLeftColor: tokens.colorPaletteGreenBorder1,
  },
  factorName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  factorValue: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  factorDetail: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  resultEquation: {
    margin: 0,
    padding: tokens.spacingHorizontalL,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorPaletteGreenBorder1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorPaletteGreenBackground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    textAlign: 'center',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: tokens.fontSizeBase200,
  },
  cell: {
    minWidth: '8rem',
    padding: tokens.spacingHorizontalM,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'center',
    verticalAlign: 'middle',
    '@media (max-width: 480px)': {
      minWidth: 0,
      padding: tokens.spacingHorizontalXS,
    },
  },
  rowHeading: {
    textAlign: 'left',
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
    '@media (max-width: 480px)': {
      minWidth: '5.5rem',
    },
  },
  valid: {
    color: tokens.colorPaletteGreenForeground1,
    backgroundColor: tokens.colorPaletteGreenBackground1,
  },
  invalid: {
    color: tokens.colorPaletteRedForeground1,
    backgroundColor: tokens.colorPaletteRedBackground1,
  },
  verdict: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontWeight: tokens.fontWeightSemibold,
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      gap: 0,
    },
  },
  policyGroups: {
    display: 'grid',
    gap: tokens.spacingVerticalXL,
  },
  policyGroup: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  policyHeading: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  policyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  policyCell: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  policyTopLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalM,
  },
  productName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  contribution: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorPaletteGreenForeground1,
  },
  dimension: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
  },
  dimensionLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  pill: {
    padding: `0 ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
  },
  pillInvalid: {
    color: tokens.colorNeutralForegroundDisabled,
    textDecorationLine: 'line-through',
  },
});

const labels: Readonly<Record<string, string>> = {
  fluent: 'Fluent',
  sharepoint: 'SharePoint',
  teams: 'Teams',
  fluent2: 'Fluent 2',
  visualRefresh: 'Visual Refresh',
  text: 'Text',
  iconOnly: 'Icon only',
  textAndIcon: 'Text and icon',
  none: 'No icon',
  before: 'Before',
  after: 'After',
  only: 'Only',
  fluentDefault: 'Fluent default',
  visualRefreshReconstructed: 'Reconstructed',
};

const label = (value: string): string => labels[value] ?? value;
const formatNumber = (value: number): string => value.toLocaleString('en-US');

export const CaseCensus = (): React.ReactElement => {
  const styles = useStyles();
  const admittedPercent =
    (buttonCaseCensus.validTotal / buttonCaseCensus.rawTotal) * 100;

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="census-at-a-glance">
        <h2 id="census-at-a-glance" className={styles.sectionHeading}>
          The whole census at a glance
        </h2>
        <p className={styles.lede}>
          Imagine a form with eleven independent choices. Taking every value
          from every menu creates the raw space. Applying three explicit model
          rules leaves the cases the clean-room resolvers promise to handle.
        </p>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryNumber}>
              {formatNumber(buttonCaseCensus.rawTotal)}
            </span>
            <span className={styles.summaryLabel}>all possible tuples</span>
          </div>
          <div
            className={mergeClasses(styles.summaryItem, styles.summaryValid)}
          >
            <span className={styles.summaryNumber}>
              {formatNumber(buttonCaseCensus.validTotal)}
            </span>
            <span className={styles.summaryLabel}>
              model-admitted cases ({admittedPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="raw-space">
        <h2 id="raw-space" className={styles.sectionHeading}>
          1. Eleven choices make the raw space
        </h2>
        <p className={styles.lede}>
          Each tile is one axis of a button case. The large number is how many
          values that axis offers. Multiplying the eleven large numbers gives
          138,240.
        </p>
        <div className={styles.axisGrid}>
          {buttonCaseAxes.map((axis) => (
            <div className={styles.axis} key={axis.key}>
              <span className={styles.axisCount}>{axis.values.length}</span>
              <span className={styles.axisLabel}>{axis.label}</span>
              <span className={styles.axisValues}>
                {axis.values.map(label).join(', ')}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.resultEquation}>
          3 × 2 × 2 × 4 × 5 × 3 × 3 × 4 × 2 × 4 × 2 = 138,240
        </p>
      </section>

      <section className={styles.section} aria-labelledby="content-rule">
        <h2 id="content-rule" className={styles.sectionHeading}>
          2. The model begins with an anatomy hypothesis
        </h2>
        <p className={styles.lede}>
          The raw space pairs every content kind with every icon placement: 3 ×
          4 = 12 abstract pairs. The original clean-room rule admits four. This
          is a resolver precondition, not evidence that production CAP rejects
          the other eight.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.lede}>
              Four model-admitted content and icon-placement pairs out of twelve
            </caption>
            <thead>
              <tr>
                <th className={mergeClasses(styles.cell, styles.rowHeading)}>
                  Content
                </th>
                {iconPlacements.map((placement) => (
                  <th className={styles.cell} scope="col" key={placement}>
                    {label(placement)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contentKinds.map((contentKind) => (
                <tr key={contentKind}>
                  <th
                    className={mergeClasses(styles.cell, styles.rowHeading)}
                    scope="row"
                  >
                    {label(contentKind)}
                  </th>
                  {iconPlacements.map((iconPlacement) => {
                    const cell = contentConstructionCensus.find(
                      (candidate) =>
                        candidate.contentKind === contentKind &&
                        candidate.iconPlacement === iconPlacement
                    );
                    const valid = cell?.valid ?? false;

                    return (
                      <td
                        className={mergeClasses(
                          styles.cell,
                          valid ? styles.valid : styles.invalid
                        )}
                        key={iconPlacement}
                      >
                        <span className={styles.verdict}>
                          {valid ? (
                            <CheckmarkCircle20Filled aria-hidden="true" />
                          ) : (
                            <DismissCircle20Regular aria-hidden="true" />
                          )}
                          {valid ? 'Admitted' : 'Excluded'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.lede}>
          The production-shaped observation also exercises{' '}
          {buttonContentGroundingCensus.productionScenarios} scenarios, but it
          reaches four differently:{' '}
          {buttonContentGroundingCensus.representedScenarios} scenarios have
          represented anatomy and canonicalize to{' '}
          {buttonContentGroundingCensus.canonicalConfigurations} semantic
          configurations. The{' '}
          {buttonContentGroundingCensus.unrepresentedScenarios} empty-button
          scenarios are observed gaps, not rejected inputs. See{' '}
          <a href="?path=/docs/packages-visual-refresh-style-algebra-content-anatomy-audit--docs">
            Content anatomy audit
          </a>{' '}
          for the executable table.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="policy-rule">
        <h2 id="policy-rule" className={styles.sectionHeading}>
          3. Assumed product policy contributes 29 combinations
        </h2>
        <p className={styles.lede}>
          In the clean-room policy, appearance support depends on product and
          visual language, while reconstructed anatomy is available only under
          Visual Refresh. These are replaceable research assumptions. Reading
          each cell separately avoids double-counting their overlapping rules.
        </p>
        <div className={styles.policyGroups}>
          {visualLanguages.map((visualLanguage) => (
            <section className={styles.policyGroup} key={visualLanguage}>
              <h3 className={styles.policyHeading}>{label(visualLanguage)}</h3>
              <div className={styles.policyGrid}>
                {products.map((product) => {
                  const cell = productPolicyCensus.find(
                    (candidate) =>
                      candidate.visualLanguage === visualLanguage &&
                      candidate.product === product
                  );
                  const validCombinations =
                    cell?.combinations.filter(({ valid }) => valid) ?? [];
                  const validAppearances = new Set(
                    validCombinations.map(({ appearance }) => appearance)
                  );
                  const validAnatomies = new Set(
                    validCombinations.map(({ anatomyPolicy }) => anatomyPolicy)
                  );

                  return (
                    <article className={styles.policyCell} key={product}>
                      <div className={styles.policyTopLine}>
                        <span className={styles.productName}>
                          {label(product)}
                        </span>
                        <span
                          className={styles.contribution}
                          aria-label={`${
                            cell?.validCount ?? 0
                          } valid combinations`}
                        >
                          +{cell?.validCount ?? 0}
                        </span>
                      </div>
                      <div className={styles.dimension}>
                        <span className={styles.dimensionLabel}>
                          Appearances
                        </span>
                        <div className={styles.pills}>
                          {appearances.map((appearance) => (
                            <span
                              className={mergeClasses(
                                styles.pill,
                                !validAppearances.has(appearance) &&
                                  styles.pillInvalid
                              )}
                              key={appearance}
                            >
                              {label(appearance)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.dimension}>
                        <span className={styles.dimensionLabel}>Anatomies</span>
                        <div className={styles.pills}>
                          {anatomyPolicies.map((anatomyPolicy) => (
                            <span
                              className={mergeClasses(
                                styles.pill,
                                !validAnatomies.has(anatomyPolicy) &&
                                  styles.pillInvalid
                              )}
                              key={anatomyPolicy}
                            >
                              {label(anatomyPolicy)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={styles.factorDetail}>
                        {validAppearances.size} appearances ×{' '}
                        {validAnatomies.size} anatomies
                      </span>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <p className={styles.resultEquation}>9 + 20 = 29</p>
      </section>

      <section className={styles.section} aria-labelledby="put-together">
        <h2 id="put-together" className={styles.sectionHeading}>
          4. Put the independent pieces back together
        </h2>
        <p className={styles.lede}>
          Density, state, color mode, composition, and direction are not
          restricted by the predicate. Their 240 contexts combine freely with
          each of the four model-admitted content constructions and 29 assumed
          product-policy combinations.
        </p>
        <div className={styles.equation}>
          <div className={mergeClasses(styles.factor, styles.factorValid)}>
            <span className={styles.factorName}>Unrestricted context</span>
            <span className={styles.factorValue}>
              {buttonCaseCensus.context.rawCount}
            </span>
            <span className={styles.factorDetail}>2 × 5 × 3 × 4 × 2</span>
          </div>
          <div className={mergeClasses(styles.factor, styles.factorValid)}>
            <span className={styles.factorName}>Content construction</span>
            <span className={styles.factorValue}>
              {buttonCaseCensus.contentConstruction.validCount}
            </span>
            <span className={styles.factorDetail}>
              4 model-admitted pairs out of 12
            </span>
          </div>
          <div className={mergeClasses(styles.factor, styles.factorValid)}>
            <span className={styles.factorName}>Product policy</span>
            <span className={styles.factorValue}>
              {buttonCaseCensus.productPolicy.validCount}
            </span>
            <span className={styles.factorDetail}>
              9 Fluent 2 + 20 Visual Refresh
            </span>
          </div>
        </div>
        <p className={styles.resultEquation}>
          240 × 4 × 29 = 27,840 model-admitted cases
        </p>
      </section>
    </div>
  );
};
