import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import {
  CapFixtureProvider,
  CapSplitButtonFixtures,
  capButtonAppearances,
  observeButtonSurface,
  resolveThemeValues,
  capTheme,
  type CapButtonAppearance,
} from '../../src';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  direction: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  fixtures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  heading: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
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
  held: {
    color: tokens.colorPaletteGreenForeground1,
  },
  broken: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

type Direction = 'ltr' | 'rtl';

const directions: readonly Direction[] = ['ltr', 'rtl'];

/** The edge the divider is drawn on, and the outer corner that must survive. */
const geometryOf: Record<
  Direction,
  { readonly divider: string; readonly outerCorner: string }
> = {
  ltr: { divider: 'border-right-color', outerCorner: 'border-top-left-radius' },
  rtl: { divider: 'border-left-color', outerCorner: 'border-top-right-radius' },
};

interface JoinReport {
  readonly appearance: CapButtonAppearance;
  readonly joinedCorner: string;
  readonly outerCorner: string;
  readonly divider: string;
}

const themeValues = capTheme as unknown as Readonly<Record<string, string>>;

/**
 * Reads the joined edge out of the live CSSOM.
 *
 * A SplitButton is two buttons pretending to be one, so its correctness is
 * mostly a claim about a seam: the inner corners flat, the outer corners intact,
 * and a visible boundary drawn between the actions. All three are readable
 * without paint — and all three flip with the writing direction.
 */
const JoinReportTable: React.FC<{ direction: Direction }> = ({ direction }) => {
  const styles = useStyles();
  const { targetDocument } = useFluent_unstable();
  const [reports, setReports] = React.useState<readonly JoinReport[]>([]);

  React.useEffect(() => {
    if (!targetDocument) {
      return;
    }

    const { divider, outerCorner } = geometryOf[direction];
    const joinedCorner =
      direction === 'ltr'
        ? 'border-top-right-radius'
        : 'border-top-left-radius';

    setReports(
      capButtonAppearances.map((appearance) => {
        const primary = targetDocument.querySelector(
          `[data-testid="${direction}-${appearance}-enabled-primary"]`
        );

        if (!primary) {
          return {
            appearance,
            joinedCorner: 'not rendered',
            outerCorner: 'not rendered',
            divider: 'not rendered',
          };
        }

        const own = observeButtonSurface(targetDocument, primary).effective
          .ordinary.rest;
        const seam = observeButtonSurface(targetDocument, primary, {
          pseudoElement: '::after',
        }).effective.ordinary.rest;
        const resolved = resolveThemeValues(own, themeValues);

        return {
          appearance,
          joinedCorner: resolved[joinedCorner] ?? 'undeclared',
          outerCorner:
            resolved[outerCorner] ?? resolved['border-radius'] ?? 'undeclared',
          divider:
            resolveThemeValues(seam, themeValues)[divider] ?? 'undeclared',
        };
      })
    );
  }, [direction, targetDocument]);

  return (
    <table className={styles.table}>
      <caption>{direction.toUpperCase()} seam</caption>
      <thead>
        <tr>
          <th className={styles.cell}>appearance</th>
          <th className={styles.cell}>joined corner</th>
          <th className={styles.cell}>outer corner</th>
          <th className={styles.cell}>divider</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.appearance}>
            <td className={styles.cell}>{report.appearance}</td>
            <td
              className={`${styles.cell} ${
                report.joinedCorner === '0' ? styles.held : styles.broken
              }`}
            >
              {report.joinedCorner}
            </td>
            <td
              className={`${styles.cell} ${
                report.outerCorner === '0' ? styles.broken : styles.held
              }`}
            >
              {report.outerCorner}
            </td>
            <td
              className={`${styles.cell} ${
                report.divider === 'undeclared' ? styles.broken : styles.held
              }`}
            >
              {report.divider}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/** Live evidence for the CAP SplitButton propagation and RTL laws. */
export const SplitButtonPropagationLaws: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {directions.map((direction) => (
        <CapFixtureProvider key={direction} dir={direction}>
          <div className={styles.direction}>
            <div className={styles.heading}>dir=&quot;{direction}&quot;</div>
            <div className={styles.fixtures}>
              <CapSplitButtonFixtures prefix={direction} />
            </div>
            <JoinReportTable direction={direction} />
          </div>
        </CapFixtureProvider>
      ))}
    </div>
  );
};
