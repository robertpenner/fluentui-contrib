import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { Add20Regular } from '@fluentui/react-icons';
import {
  buttonContentEvidenceBaseline,
  buttonContentEvidenceRows,
  buttonContentGroundingCensus,
  reactChildEdgeCases,
  type ButtonContentObservationMapping,
  type ButtonContentScenario,
  type CapStyleEffect,
} from '../../src';
import { CapFixtureProvider } from '../../src/fixtures/capButtonFamily';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalXXL,
    maxWidth: '76rem',
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
    maxWidth: '72ch',
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  summaryItem: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalL,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  summaryCanonical: {
    borderTopColor: tokens.colorPaletteGreenBorder1,
  },
  summaryGap: {
    borderTopColor: tokens.colorPaletteYellowBorder1,
  },
  summaryNumber: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  summaryLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  cell: {
    minWidth: '8rem',
    padding: tokens.spacingHorizontalS,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'left',
    verticalAlign: 'top',
  },
  previewCell: {
    minWidth: '9rem',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  code: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
  tag: {
    display: 'inline-block',
    padding: `0 ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
    whiteSpace: 'nowrap',
  },
  represented: {
    color: tokens.colorPaletteGreenForeground1,
    backgroundColor: tokens.colorPaletteGreenBackground1,
  },
  canonicalized: {
    color: tokens.colorPaletteBlueForeground2,
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  unrepresented: {
    color: tokens.colorPaletteYellowForeground2,
    backgroundColor: tokens.colorPaletteYellowBackground2,
  },
  baseline: {
    padding: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
  },
});

const scenarioButtonProps = (
  scenario: ButtonContentScenario
): React.ComponentProps<typeof Button> => ({
  'aria-label':
    scenario.children === 'absent'
      ? scenario.icon === 'present'
        ? 'Add item'
        : 'Observed empty button'
      : undefined,
  children: scenario.children === 'present' ? 'Action' : undefined,
  icon: scenario.icon === 'present' ? <Add20Regular /> : undefined,
  iconPosition:
    scenario.iconPosition === 'omitted' ? undefined : scenario.iconPosition,
});

const edgeCaseChild = (
  id: (typeof reactChildEdgeCases)[number]['id']
): React.ReactNode => {
  switch (id) {
    case 'null':
      return null;
    case 'false':
      return false;
    case 'zero':
      return 0;
    case 'emptyString':
      return '';
    case 'emptyFragment':
      return <></>;
    case 'whitespace':
      return ' ';
  }
};

const edgeCaseInterpretation = {
  iconOnly: 'Matches icon-only anatomy',
  textAndIcon: 'Text-and-icon classification',
  classificationWithoutRenderedContent:
    'Text-and-icon classification, no rendered content',
} as const;

const capEffectLabels: Readonly<Record<CapStyleEffect, string>> = {
  base: 'base only',
  iconOnly: 'icon-only',
  textAndIconBefore: 'text + icon before',
  textAndIconAfter: 'text + icon after',
};

const mappingLabel = (mapping: ButtonContentObservationMapping): string =>
  mapping.status === 'represented' || mapping.status === 'canonicalized'
    ? `${mapping.content.contentKind} / ${mapping.content.iconPlacement}`
    : 'No clean-room case';

const mappingDetail = (mapping: ButtonContentObservationMapping): string => {
  if (mapping.status === 'canonicalized') {
    return mapping.discardedDistinctions.join('; ');
  }

  if (mapping.status === 'unrepresented' || mapping.status === 'excluded') {
    return mapping.reason;
  }

  return 'The model keeps this production distinction.';
};

const mappingStatusLabels = {
  represented: 'direct match',
  canonicalized: 'grouped with another input',
  excluded: 'excluded from model',
  unrepresented: 'outside the model',
} as const;

const MappingTag = ({
  mapping,
}: {
  mapping: ButtonContentObservationMapping;
}): React.ReactElement => {
  const styles = useStyles();
  const tone = {
    represented: styles.represented,
    canonicalized: styles.canonicalized,
    excluded: styles.unrepresented,
    unrepresented: styles.unrepresented,
  }[mapping.status];

  return (
    <span className={`${styles.tag} ${tone}`}>
      {mappingStatusLabels[mapping.status]}
    </span>
  );
};

export const ProductionGrounding = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="grounding-summary">
        <h2 id="grounding-summary" className={styles.heading}>
          One production slice, four useful counts
        </h2>
        <p className={styles.lede}>
          The audit runs all twelve combinations in this slice. Nine contain a
          content pattern the research model can describe. Grouping inputs that
          produce the same modeled result leaves four recurring patterns. The
          other three are empty buttons that pass through the production path
          but sit outside the model.
        </p>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryNumber}>
              {buttonContentGroundingCensus.productionScenarios}
            </span>
            <span className={styles.summaryLabel}>
              input combinations tested
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryNumber}>
              {buttonContentGroundingCensus.representedScenarios}
            </span>
            <span className={styles.summaryLabel}>
              inputs with a model counterpart
            </span>
          </div>
          <div className={`${styles.summaryItem} ${styles.summaryCanonical}`}>
            <span className={styles.summaryNumber}>
              {buttonContentGroundingCensus.canonicalConfigurations}
            </span>
            <span className={styles.summaryLabel}>
              recurring content patterns
            </span>
          </div>
          <div className={`${styles.summaryItem} ${styles.summaryGap}`}>
            <span className={styles.summaryNumber}>
              {buttonContentGroundingCensus.unrepresentedScenarios}
            </span>
            <span className={styles.summaryLabel}>
              observed empty-button gaps
            </span>
          </div>
        </div>
        <div className={styles.baseline}>
          baseline: {buttonContentEvidenceBaseline.id}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="grounding-table">
        <h2 id="grounding-table" className={styles.heading}>
          What the real path did
        </h2>
        <p className={styles.lede}>
          The middle columns show what Fluent normalized and rendered and which
          style branch the CAP hook selected. Only the final column asks how the
          later research model handles that result. Product support remains
          unknown for every row.
        </p>
        <div className={styles.tableWrap}>
          <CapFixtureProvider>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.cell}>Public input</th>
                  <th className={`${styles.cell} ${styles.previewCell}`}>
                    Live CAP result
                  </th>
                  <th className={styles.cell}>Fluent state</th>
                  <th className={styles.cell}>Rendered slots</th>
                  <th className={styles.cell}>CAP class effect</th>
                  <th className={styles.cell}>How the model handles it</th>
                </tr>
              </thead>
              <tbody>
                {buttonContentEvidenceRows.map((row) => (
                  <tr key={row.scenario.id}>
                    <th scope="row" className={`${styles.cell} ${styles.code}`}>
                      <div>icon: {row.scenario.icon}</div>
                      <div>children: {row.scenario.children}</div>
                      <div>position: {row.scenario.iconPosition}</div>
                    </th>
                    <td className={`${styles.cell} ${styles.previewCell}`}>
                      <Button {...scenarioButtonProps(row.scenario)} />
                    </td>
                    <td className={`${styles.cell} ${styles.code}`}>
                      <div>
                        position:{' '}
                        {row.observation.normalizedState.effectiveIconPosition}
                      </div>
                      <div>
                        iconOnly:{' '}
                        {String(row.observation.normalizedState.iconOnly)}
                      </div>
                    </td>
                    <td className={`${styles.cell} ${styles.code}`}>
                      {row.observation.renderedAnatomy.slots.length > 0
                        ? row.observation.renderedAnatomy.slots.join(' -> ')
                        : '(empty)'}
                    </td>
                    <td className={`${styles.cell} ${styles.code}`}>
                      {capEffectLabels[row.observation.capStyleEffect]}
                    </td>
                    <td className={styles.cell}>
                      <MappingTag mapping={row.mapping} />
                      <div className={styles.code}>
                        {mappingLabel(row.mapping)}
                      </div>
                      <div className={styles.muted}>
                        {mappingDetail(row.mapping)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CapFixtureProvider>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="react-child-edges">
        <h2 id="react-child-edges" className={styles.heading}>
          React children are not a text-presence flag
        </h2>
        <p className={styles.lede}>
          Fluent derives icon-only state from JavaScript truthiness, not from a
          DOM measurement. Most empty values become icon-only. An empty fragment
          is the important counterexample: it is truthy and selects CAP's
          text-and-icon branch, but it renders no content.
        </p>
        <div className={styles.tableWrap}>
          <CapFixtureProvider>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.cell}>Children value</th>
                  <th className={styles.cell}>JavaScript truthy</th>
                  <th className={`${styles.cell} ${styles.previewCell}`}>
                    Live CAP result
                  </th>
                  <th className={styles.cell}>Fluent iconOnly</th>
                  <th className={styles.cell}>CAP class effect</th>
                  <th className={styles.cell}>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {reactChildEdgeCases.map((edgeCase) => (
                  <tr key={edgeCase.id}>
                    <th scope="row" className={`${styles.cell} ${styles.code}`}>
                      {edgeCase.label}
                    </th>
                    <td className={`${styles.cell} ${styles.code}`}>
                      {String(edgeCase.inputTruthy)}
                    </td>
                    <td className={`${styles.cell} ${styles.previewCell}`}>
                      <Button
                        aria-label={`${edgeCase.label} child value`}
                        icon={<Add20Regular />}
                      >
                        {edgeCaseChild(edgeCase.id)}
                      </Button>
                    </td>
                    <td className={`${styles.cell} ${styles.code}`}>
                      {String(edgeCase.expectedIconOnly)}
                    </td>
                    <td className={`${styles.cell} ${styles.code}`}>
                      {capEffectLabels[edgeCase.expectedCapStyleEffect]}
                    </td>
                    <td className={styles.cell}>
                      {edgeCaseInterpretation[edgeCase.interpretation]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CapFixtureProvider>
        </div>
      </section>
    </div>
  );
};

ProductionGrounding.displayName = 'ProductionGrounding';
