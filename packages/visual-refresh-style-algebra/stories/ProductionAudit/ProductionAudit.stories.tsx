import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import {
  type AuditClassification,
  auditFindings,
  nextInvestigation,
  styleMarkerCensus,
} from '../../src';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalXXL,
    maxWidth: '68rem',
  },
  section: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  lede: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
  table: {
    borderCollapse: 'collapse',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  cell: {
    padding: tokens.spacingHorizontalS,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'left',
    verticalAlign: 'top',
  },
  numeric: {
    textAlign: 'right',
    fontFamily: tokens.fontFamilyMonospace,
  },
  code: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
  },
  tag: {
    display: 'inline-block',
    padding: `0 ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
    whiteSpace: 'nowrap',
  },
  capDefect: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  fluentBehavior: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  browserDifference: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
    color: tokens.colorNeutralForeground1,
  },
  productPolicy: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
  },
  modelAssumption: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
    color: tokens.colorNeutralForeground1,
  },
  nominated: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
  },
  none: {
    color: tokens.colorNeutralForeground3,
  },
});

const classificationLabel: Record<AuditClassification, string> = {
  'cap-defect': 'CAP defect',
  'fluent-behavior': 'Fluent behaviour',
  'browser-difference': 'Browser difference',
  'product-policy': 'Product policy',
  'model-assumption': 'Model assumption',
};

const classificationMeaning: Record<AuditClassification, string> = {
  'cap-defect': 'CAP\u2019s own styles are wrong. Fixable here, and fixed.',
  'fluent-behavior':
    'Inherited from upstream Fluent. Not fixable at CAP\u2019s layer; locked as a classified exception so it cannot drift unnoticed.',
  'browser-difference':
    'The engines disagree. Nothing to fix in either product; the law is stated over the capability instead.',
  'product-policy':
    'A deliberate or tolerated choice. Recorded so a later reader does not mistake it for an oversight.',
  'model-assumption':
    'The instrument or the model was wrong, not the product. The most dangerous class: it makes a law pass vacuously.',
};

const ClassificationTag: React.FC<{ value: AuditClassification }> = ({
  value,
}) => {
  const styles = useStyles();
  const tone = {
    'cap-defect': styles.capDefect,
    'fluent-behavior': styles.fluentBehavior,
    'browser-difference': styles.browserDifference,
    'product-policy': styles.productPolicy,
    'model-assumption': styles.modelAssumption,
  }[value];

  return (
    <span className={`${styles.tag} ${tone}`}>
      {classificationLabel[value]}
    </span>
  );
};

/**
 * The audit rendered as navigable evidence: what was found, what kind of thing
 * it is, what was changed, and which executable regression holds it.
 */
export const ProductionAudit: React.FC = () => {
  const styles = useStyles();
  const auditedFocusOverrides =
    styleMarkerCensus.find((row) => row.family === 'react-button')
      ?.focusOverrides ?? 0;

  return (
    <div className={styles.root}>
      <section className={styles.section}>
        <h2 className={styles.heading}>How findings are classified</h2>
        <p className={styles.lede}>
          Five kinds of thing came out of this investigation, and keeping them
          apart is most of its value. A browser difference filed as a product
          bug wastes a fix; a product bug filed as a browser difference ships a
          defect.
        </p>
        <table className={styles.table}>
          <tbody>
            {(
              Object.keys(classificationLabel) as readonly AuditClassification[]
            ).map((classification) => (
              <tr key={classification}>
                <th scope="row" className={styles.cell}>
                  <ClassificationTag value={classification} />
                </th>
                <td className={styles.cell}>
                  {classificationMeaning[classification]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Findings</h2>
        <p className={styles.lede}>
          Every correction names the executable regression that would fail if it
          were undone, and the minimized fixture that reproduces it. That
          pairing is enforced by a test, so this table cannot quietly become a
          story about work that no longer holds.
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.cell}>Finding</th>
              <th className={styles.cell}>Class</th>
              <th className={styles.cell}>Mechanism</th>
              <th className={styles.cell}>Correction</th>
              <th className={styles.cell}>Executable regression</th>
            </tr>
          </thead>
          <tbody>
            {auditFindings.map((finding) => (
              <tr key={finding.id}>
                <th scope="row" className={styles.cell}>
                  {finding.summary}
                  <div className={styles.code}>{finding.family}</div>
                </th>
                <td className={styles.cell}>
                  <ClassificationTag value={finding.classification} />
                </td>
                <td className={styles.cell}>{finding.mechanism}</td>
                <td className={styles.cell}>
                  {finding.correction ?? (
                    <span className={styles.none}>none (recorded only)</span>
                  )}
                </td>
                <td className={`${styles.cell} ${styles.code}`}>
                  {finding.regression ? (
                    <>
                      <div>{finding.regression.suite}</div>
                      <div className={styles.none}>
                        {finding.regression.file}
                      </div>
                      {finding.fixture ? (
                        <div className={styles.none}>{finding.fixture}</div>
                      ) : null}
                    </>
                  ) : (
                    <span className={styles.none}>not applicable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Where to look next</h2>
        <p className={styles.lede}>
          Each column counts a marker for one of the mechanisms this audit
          actually found, so the census asks where the same three things could
          happen again rather than where the code looks complicated.
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.cell}>Family</th>
              <th className={styles.cell}>Raw border shorthands</th>
              <th className={styles.cell}>Focus overrides</th>
              <th className={styles.cell}>Forced-colors blocks</th>
              <th className={styles.cell}>Hardcoded px</th>
            </tr>
          </thead>
          <tbody>
            {styleMarkerCensus.map((row) => (
              <tr
                key={row.family}
                className={
                  row.family === nextInvestigation.family
                    ? styles.nominated
                    : undefined
                }
              >
                <th scope="row" className={`${styles.cell} ${styles.code}`}>
                  {row.family}
                </th>
                <td className={`${styles.cell} ${styles.numeric}`}>
                  {row.rawShorthands}
                </td>
                <td className={`${styles.cell} ${styles.numeric}`}>
                  {row.focusOverrides}
                </td>
                <td className={`${styles.cell} ${styles.numeric}`}>
                  {row.forcedColorsBlocks}
                </td>
                <td className={`${styles.cell} ${styles.numeric}`}>
                  {row.hardcodedPixels}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.lede}>
          <strong className={styles.code}>{nextInvestigation.family}</strong> is
          nominated. {nextInvestigation.measuredJustification} For comparison,
          the family this audit covered carries {auditedFocusOverrides} focus
          overrides.
        </p>
        <p className={styles.lede}>{nextInvestigation.ownershipOverlap}</p>
      </section>
    </div>
  );
};

ProductionAudit.displayName = 'ProductionAudit';
