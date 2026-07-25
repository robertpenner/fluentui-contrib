import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import {
  CapFixtureProvider,
  CapToggleButtonFixtures,
  capButtonAppearances,
  observeButtonSurface,
  type CapButtonAppearance,
} from '../../src';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  fixtures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  table: {
    borderCollapse: 'collapse',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
  cell: {
    padding: tokens.spacingHorizontalS,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'left',
  },
  conflict: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  agreement: {
    color: tokens.colorPaletteGreenForeground1,
  },
});

interface SelectionReport {
  readonly appearance: CapButtonAppearance;
  readonly rest: string;
  readonly hover: string;
}

const BORDER = 'border-top-color';

/**
 * The classified counterexample: a checked, disabled toggle under forced colors.
 *
 * Fluent's checked high-contrast styling applies whenever `checked` is set, so a
 * disabled selected toggle carries both `Highlight` (selected) and `GrayText`
 * (disabled) boundary declarations. Neither `mergeClasses` nor specificity can
 * separate them, so the winner falls to insertion order — and differs between
 * the resting and hovered surfaces.
 */
const CheckedDisabledConflict: React.FC = () => {
  const styles = useStyles();
  const { targetDocument } = useFluent_unstable();
  const [reports, setReports] = React.useState<readonly SelectionReport[]>([]);

  React.useEffect(() => {
    if (!targetDocument) {
      return;
    }

    setReports(
      capButtonAppearances.map((appearance) => {
        const toggle = targetDocument.querySelector(
          `[data-testid="toggle-${appearance}-checkedDisabled"]`
        );

        if (!toggle) {
          return { appearance, rest: 'not rendered', hover: 'not rendered' };
        }

        const { effective } = observeButtonSurface(targetDocument, toggle);

        return {
          appearance,
          rest: effective.forcedColors.rest[BORDER] ?? 'undeclared',
          hover: effective.forcedColors.hover[BORDER] ?? 'undeclared',
        };
      })
    );
  }, [targetDocument]);

  return (
    <table className={styles.table}>
      <caption>
        Checked + disabled boundary colour under <code>forced-colors: active</code>
      </caption>
      <thead>
        <tr>
          <th className={styles.cell}>appearance</th>
          <th className={styles.cell}>resting</th>
          <th className={styles.cell}>hovered</th>
          <th className={styles.cell}>verdict</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.appearance}>
            <td className={styles.cell}>{report.appearance}</td>
            <td className={styles.cell}>{report.rest}</td>
            <td className={styles.cell}>{report.hover}</td>
            <td
              className={`${styles.cell} ${
                report.rest === report.hover
                  ? styles.agreement
                  : styles.conflict
              }`}
            >
              {report.rest === report.hover
                ? 'consistent'
                : 'selected at rest, disabled on hover'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Live evidence for the CAP ToggleButton specialization laws.
 *
 * Every appearance is shown unchecked, checked, disabled, checked-disabled, and
 * checked disabled-focusable — the same fixtures the law suite renders.
 */
export const ToggleButtonSpecializationLaws: React.FC = () => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <div className={styles.root}>
        <div className={styles.fixtures}>
          <CapToggleButtonFixtures />
        </div>
        <CheckedDisabledConflict />
      </div>
    </CapFixtureProvider>
  );
};
