import * as React from 'react';
import {
  Button,
  makeStyles,
  SplitButton,
  ToggleButton,
  tokens,
} from '@fluentui/react-components';

import {
  capButtonInteractionConditionLedger,
  capButtonScenarios,
  compareCapButtonInteraction,
  resolveCapButtonInteraction,
} from '../../src';
import {
  asButtonAppearance,
  CapFixtureProvider,
} from '../../src/fixtures/capButtonFamily';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalXXL,
  },
  visual: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  visualIntro: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    maxWidth: '68ch',
  },
  visualTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  visualBody: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  specimenGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  specimen: {
    display: 'grid',
    alignContent: 'space-between',
    justifyItems: 'start',
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  specimenWide: {
    gridColumn: '1 / -1',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  specimenLabel: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
  },
  specimenName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  specimenDetail: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
  },
  buttonStage: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    minHeight: '3rem',
  },
  permission: {
    borderTopColor: tokens.colorPaletteBlueBorderActive,
  },
  preserve: {
    borderTopColor: tokens.colorPaletteGreenBorder1,
  },
  lawTag: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  summaryItem: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalXS,
    paddingBlock: tokens.spacingVerticalL,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  number: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  label: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
  },
  examples: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  example: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteGreenBorder1}`,
  },
  exampleLabel: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  body: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  comparison: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalS,
  },
  condition: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
    padding: tokens.spacingHorizontalS,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke2}`,
  },
  renderedComparison: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalS,
  },
  renderedCondition: {
    display: 'grid',
    justifyItems: 'start',
    alignContent: 'space-between',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
    minHeight: '6.5rem',
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  liveHint: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  conditionName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  conditionDetail: {
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    overflowWrap: 'anywhere',
  },
  result: {
    color: tokens.colorPaletteGreenForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  shrink: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  shrinkStep: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    paddingInlineStart: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke2}`,
  },
  shrinkValue: {
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere',
  },
});

const conditionById = (
  id: (typeof capButtonInteractionConditionLedger)[number]['id']
) => {
  const entry = capButtonInteractionConditionLedger.find(
    (candidate) => candidate.id === id
  );

  if (!entry) {
    throw new Error(`Missing CAP Button interaction condition: ${id}`);
  }

  return entry.conditions;
};

const rest = conditionById('rest');
const hover = conditionById('hover');
const focusVisible = conditionById('focus-visible');

const disabledAtRest = resolveCapButtonInteraction('primary', 'disabled', rest);
const disabledAtHover = resolveCapButtonInteraction(
  'primary',
  'disabled',
  hover
);
const disabledHoverDifferences = compareCapButtonInteraction(
  disabledAtRest,
  disabledAtHover
);

const enabledAtRest = resolveCapButtonInteraction('primary', 'enabled', rest);
const enabledAtFocus = resolveCapButtonInteraction(
  'primary',
  'enabled',
  focusVisible
);
const focusFillAndTextDifferences = compareCapButtonInteraction(
  enabledAtRest,
  enabledAtFocus
).filter((difference) =>
  ['surface.foreground', 'surface.background'].includes(difference.path)
);

export const RequestedChangeVisual = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <div className={styles.visual}>
        <div className={styles.visualIntro}>
          <span className={styles.lawTag}>THE REQUESTED FIELD</span>
          <h3 className={styles.visualTitle}>
            Change this background, not every disabled style
          </h3>
          <p className={styles.visualBody}>
            This is the current production CAP result. The request gives the
            product permission to replace its background; it does not yet
            approve a new color or a wider component change.
          </p>
        </div>
        <div className={`${styles.specimen} ${styles.specimenWide}`}>
          <div className={styles.specimenLabel}>
            <span className={styles.specimenName}>Disabled Primary Button</span>
            <span className={styles.specimenDetail}>
              Proposed scope: ordinary-color background only
            </span>
          </div>
          <div className={styles.buttonStage}>
            <Button appearance="primary" disabled>
              Submit request
            </Button>
          </div>
        </div>
      </div>
    </CapFixtureProvider>
  );
};

RequestedChangeVisual.displayName = 'RequestedChangeVisual';

export const ChangeSpreadVisual = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <div className={styles.visual}>
        <div className={styles.visualIntro}>
          <span className={styles.lawTag}>THE NEIGHBORHOOD</span>
          <h3 className={styles.visualTitle}>
            One disabled rule can reach several real components
          </h3>
          <p className={styles.visualBody}>
            These specimens share Fluent Button foundations or CAP styling
            decisions. Their proximity is why the original request needs a
            boundary.
          </p>
        </div>
        <div className={styles.specimenGrid}>
          <div className={styles.specimen}>
            <div className={styles.specimenLabel}>
              <span className={styles.specimenName}>Disabled</span>
              <span className={styles.specimenDetail}>Target state</span>
            </div>
            <Button appearance="primary" disabled>
              Save
            </Button>
          </div>
          <div className={styles.specimen}>
            <div className={styles.specimenLabel}>
              <span className={styles.specimenName}>Disabled, focusable</span>
              <span className={styles.specimenDetail}>Must retain focus</span>
            </div>
            <Button appearance="primary" disabledFocusable>
              Save
            </Button>
          </div>
          <div className={styles.specimen}>
            <div className={styles.specimenLabel}>
              <span className={styles.specimenName}>ToggleButton</span>
              <span className={styles.specimenDetail}>Related component</span>
            </div>
            <ToggleButton appearance="primary" disabled checked>
              Pinned
            </ToggleButton>
          </div>
          <div className={styles.specimen}>
            <div className={styles.specimenLabel}>
              <span className={styles.specimenName}>SplitButton</span>
              <span className={styles.specimenDetail}>Two action surfaces</span>
            </div>
            <SplitButton appearance="primary" disabled>
              Share
            </SplitButton>
          </div>
          <div className={styles.specimen}>
            <div className={styles.specimenLabel}>
              <span className={styles.specimenName}>Outline appearance</span>
              <span className={styles.specimenDetail}>
                Outside current scope
              </span>
            </div>
            <Button appearance={asButtonAppearance('outline')} disabled>
              Save
            </Button>
          </div>
        </div>
      </div>
    </CapFixtureProvider>
  );
};

ChangeSpreadVisual.displayName = 'ChangeSpreadVisual';

export const ContractVisual = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <div className={styles.specimenGrid}>
        <div className={`${styles.visual} ${styles.permission}`}>
          <span className={styles.lawTag}>MAY CHANGE</span>
          <div className={styles.specimenLabel}>
            <span className={styles.specimenName}>
              Disabled Primary background
            </span>
            <span className={styles.specimenDetail}>
              Ordinary colors, target product only
            </span>
          </div>
          <Button appearance="primary" disabled>
            Submit request
          </Button>
        </div>
        <div className={`${styles.visual} ${styles.preserve}`}>
          <span className={styles.lawTag}>MUST REMAIN</span>
          <div className={styles.specimenLabel}>
            <span className={styles.specimenName}>
              Text, boundary, and keyboard focus
            </span>
            <span className={styles.specimenDetail}>
              Press Tab to inspect the focusable disabled specimen
            </span>
          </div>
          <Button appearance="primary" disabledFocusable>
            Submit request
          </Button>
        </div>
      </div>
    </CapFixtureProvider>
  );
};

ContractVisual.displayName = 'ContractVisual';

export const PropertyBasedTestingExamples = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <div className={styles.root}>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.number}>
              {capButtonScenarios.length.toLocaleString('en-US')}
            </span>
            <span className={styles.label}>
              finite Button input combinations already checked exhaustively
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.number}>1 change</span>
            <span className={styles.label}>
              per generated comparison, so a failure points to a useful cause
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.number}>1 small repro</span>
            <span className={styles.label}>
              saved after a failure, so it stays understandable and testable
            </span>
          </div>
        </div>

        <div className={styles.examples}>
          <article className={styles.example}>
            <span className={styles.exampleLabel}>PAIRED CHECK</span>
            <h3 className={styles.heading}>Disabled ignores pointer hover</h3>
            <p className={styles.body}>
              Generate a valid disabled Button, then change only whether the
              pointer is over it. Its surface should stay the same.
            </p>
            <div className={styles.renderedComparison}>
              <div className={styles.renderedCondition}>
                <div className={styles.specimenLabel}>
                  <span className={styles.conditionName}>At rest</span>
                  <span className={styles.conditionDetail}>hover: false</span>
                </div>
                <Button appearance="primary" disabled>
                  Save
                </Button>
              </div>
              <div className={styles.renderedCondition}>
                <div className={styles.specimenLabel}>
                  <span className={styles.conditionName}>
                    Pointer over Button
                  </span>
                  <span className={styles.conditionDetail}>hover: true</span>
                </div>
                <Button appearance="primary" disabled>
                  Save
                </Button>
                <span className={styles.liveHint}>Move pointer here</span>
              </div>
            </div>
            <span className={styles.result}>
              {disabledHoverDifferences.length === 0
                ? 'No visual change'
                : `${disabledHoverDifferences.length} unexpected changes`}
            </span>
          </article>

          <article className={styles.example}>
            <span className={styles.exampleLabel}>ONE RESPONSIBILITY</span>
            <h3 className={styles.heading}>
              Keyboard focus preserves fill and text
            </h3>
            <p className={styles.body}>
              Starting from the same enabled Button, add keyboard focus. The
              focus border should appear without replacing the existing fill or
              text color.
            </p>
            <div className={styles.renderedComparison}>
              <div className={styles.renderedCondition}>
                <div className={styles.specimenLabel}>
                  <span className={styles.conditionName}>Before</span>
                  <span className={styles.conditionDetail}>
                    focus visible: false
                  </span>
                </div>
                <Button appearance="primary">Continue</Button>
              </div>
              <div className={styles.renderedCondition}>
                <div className={styles.specimenLabel}>
                  <span className={styles.conditionName}>After Tab</span>
                  <span className={styles.conditionDetail}>
                    focus visible: true
                  </span>
                </div>
                <Button appearance="primary">Continue</Button>
                <span className={styles.liveHint}>Use Tab to focus</span>
              </div>
            </div>
            <span className={styles.result}>
              {focusFillAndTextDifferences.length === 0 &&
              enabledAtFocus.focusTreatment.visible
                ? 'Fill and text preserved; focus added'
                : 'Unexpected result'}
            </span>
          </article>

          <article className={styles.example}>
            <span className={styles.exampleLabel}>SMALLER FAILURE</span>
            <h3 className={styles.heading}>
              Remove details that do not matter
            </h3>
            <p className={styles.body}>
              If a faulty rule changes a disabled Button on hover, the test tool
              keeps simplifying the failing input until the cause is clear.
            </p>
            <div className={styles.shrink}>
              <div className={styles.shrinkStep}>
                <span className={styles.conditionName}>First failure</span>
                <span className={styles.shrinkValue}>
                  large + circular + primary + icon after + disabled + hover
                </span>
              </div>
              <div className={styles.shrinkStep}>
                <span className={styles.conditionName}>
                  Smallest useful repro
                </span>
                <span className={styles.shrinkValue}>disabled + hover</span>
              </div>
            </div>
            <span className={styles.result}>
              The report names the rule, not the noise
            </span>
          </article>
        </div>
      </div>
    </CapFixtureProvider>
  );
};

PropertyBasedTestingExamples.displayName = 'PropertyBasedTestingExamples';
