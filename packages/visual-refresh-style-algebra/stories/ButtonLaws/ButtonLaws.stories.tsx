import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import {
  CapButtonFixtures,
  CapFixtureProvider,
  capButtonAppearances,
  capTheme,
  observeButtonSurface,
  projectSurface,
  resolveThemeValues,
  surfaceColorProperties,
  type ButtonSurface,
  type CapButtonAppearance,
} from '../../src';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
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
    verticalAlign: 'top',
  },
  drawn: {
    color: tokens.colorPaletteGreenForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  suppressed: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface FocusReport {
  readonly appearance: CapButtonAppearance;
  readonly outlineStyle: string;
  readonly outlineColor: string;
  readonly forcedColorsOutlineColor: string;
  readonly restColors: ButtonSurface;
}

const themeValues = capTheme as unknown as Readonly<Record<string, string>>;

const colorsOf = (surface: ButtonSurface): ButtonSurface =>
  resolveThemeValues(
    projectSurface(surface, surfaceColorProperties),
    themeValues
  );

/**
 * Reads the focus indicator each CAP appearance actually declares.
 *
 * Griffel gives every atomic class the same specificity, so a `:focus-visible`
 * rule and a `[data-fui-focus-visible]` rule are separated only by which bucket
 * they landed in. This story reports the winner, which is the thing a snapshot
 * of the class list cannot tell you.
 */
const FocusIndicatorReport: React.FC = () => {
  const styles = useStyles();
  const { targetDocument } = useFluent_unstable();
  const [reports, setReports] = React.useState<readonly FocusReport[]>([]);

  React.useEffect(() => {
    if (!targetDocument) {
      return;
    }

    setReports(
      capButtonAppearances.map((appearance) => {
        const button = targetDocument.querySelector(
          `[data-testid="button-${appearance}-enabled"]`
        );

        if (!button) {
          return {
            appearance,
            outlineStyle: 'not rendered',
            outlineColor: 'not rendered',
            forcedColorsOutlineColor: 'not rendered',
            restColors: {},
          };
        }

        const { effective } = observeButtonSurface(targetDocument, button);
        const focus = effective.ordinary.focusVisible;
        const forcedColorsFocus = effective.forcedColors.focusVisible;

        return {
          appearance,
          outlineStyle: focus['outline-style'] ?? 'undeclared',
          outlineColor:
            resolveThemeValues(
              { value: focus['outline-color'] ?? 'undeclared' },
              themeValues
            ).value ?? 'undeclared',
          forcedColorsOutlineColor:
            forcedColorsFocus['outline-color'] ?? 'undeclared',
          restColors: colorsOf(effective.ordinary.rest),
        };
      })
    );
  }, [targetDocument]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.cell}>appearance</th>
          <th className={styles.cell}>outline-style</th>
          <th className={styles.cell}>outline-color</th>
          <th className={styles.cell}>forced colors</th>
          <th className={styles.cell}>resting colours</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.appearance}>
            <td className={styles.cell}>{report.appearance}</td>
            <td
              className={`${styles.cell} ${
                report.outlineStyle === 'solid'
                  ? styles.drawn
                  : styles.suppressed
              }`}
            >
              {report.outlineStyle}
            </td>
            <td className={styles.cell}>{report.outlineColor}</td>
            <td className={styles.cell}>{report.forcedColorsOutlineColor}</td>
            <td className={styles.cell}>
              {Object.entries(report.restColors)
                .map(([property, value]) => `${property}: ${value}`)
                .join('\n')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Live evidence for the CAP Button appearance and state laws.
 *
 * The buttons below are the same fixtures the law suite renders. Tab into them
 * to see the focus ring the table reports.
 */
export const ButtonAppearanceLaws: React.FC = () => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <div className={styles.root}>
        <CapButtonFixtures />
        <FocusIndicatorReport />
      </div>
    </CapFixtureProvider>
  );
};
