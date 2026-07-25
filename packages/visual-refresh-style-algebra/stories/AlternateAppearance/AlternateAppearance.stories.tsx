import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import { AlternateAppearanceProbe } from '../../src';

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
  note: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  swatch: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    marginRight: tokens.spacingHorizontalXS,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    verticalAlign: 'middle',
  },
});

const surfaces = [
  {
    testId: 'probe-unselected-toggle',
    label: 'ToggleButton, primary, unselected',
  },
  { testId: 'probe-selected-toggle', label: 'ToggleButton, primary, selected' },
  { testId: 'probe-secondary-button', label: 'Button, secondary' },
  {
    testId: 'probe-system-color-reference',
    label: 'reference: ButtonFace / ButtonText',
  },
  {
    testId: 'probe-substitution-canary',
    label: 'canary: authored rgb(1, 2, 3)',
  },
] as const;

interface Reading {
  readonly label: string;
  readonly policy: string;
  readonly color: string;
  readonly background: string;
  readonly border: string;
}

/**
 * Reads the probe out of the live CSSOM in whatever engine is showing this page.
 *
 * Nothing here asserts a palette. The table reports what *this* browser resolved,
 * which is the only honest way to talk about forced colors: the substitution is
 * the user agent's, the system colours are the platform's, and only the
 * declarations are CAP's.
 */
const useReadings = (): {
  readonly readings: readonly Reading[];
  readonly forcedColors: boolean;
  readonly substitutes: boolean | undefined;
} => {
  const { targetDocument } = useFluent_unstable();
  const [readings, setReadings] = React.useState<readonly Reading[]>([]);
  const [forcedColors, setForcedColors] = React.useState(false);
  const [substitutes, setSubstitutes] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const view = targetDocument?.defaultView;

    if (!targetDocument || !view) {
      return;
    }

    const read = () => {
      const next: Reading[] = [];
      let canaryBackground: string | undefined;

      for (const { testId, label } of surfaces) {
        const element = targetDocument.querySelector(
          `[data-testid="${testId}"]`
        );

        if (!element) {
          continue;
        }

        const style = view.getComputedStyle(element);

        if (testId === 'probe-substitution-canary') {
          canaryBackground = style.backgroundColor;
        }

        next.push({
          label,
          policy: style.forcedColorAdjust || '(unsupported)',
          color: style.color,
          background: style.backgroundColor,
          border: style.borderTopColor,
        });
      }

      setReadings(next);
      setForcedColors(view.matchMedia('(forced-colors: active)').matches);
      setSubstitutes(
        canaryBackground === undefined
          ? undefined
          : canaryBackground !== 'rgb(1, 2, 3)'
      );
    };

    read();

    const query = view.matchMedia('(forced-colors: active)');

    query.addEventListener('change', read);

    return () => query.removeEventListener('change', read);
  }, [targetDocument]);

  return { readings, forcedColors, substitutes };
};

export const AlternateAppearanceReport: React.FC = () => {
  const styles = useStyles();
  const { readings, forcedColors, substitutes } = useReadings();

  return (
    <div className={styles.root}>
      <div className={styles.fixtures}>
        <AlternateAppearanceProbe />
      </div>

      <p className={styles.note}>
        This browser {forcedColors ? 'matches' : 'does not match'}{' '}
        <code>(forced-colors: active)</code>, and{' '}
        {substitutes === undefined
          ? 'the substitution canary has not been read yet'
          : substitutes
          ? 'substitutes system colours into untreated surfaces'
          : 'leaves untreated surfaces on their authored colours'}
        . Turn on your platform&rsquo;s high contrast mode to change the first;
        the second is a property of the engine.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.cell}>surface</th>
            <th className={styles.cell}>forced-color-adjust</th>
            <th className={styles.cell}>color</th>
            <th className={styles.cell}>background</th>
            <th className={styles.cell}>border-top-color</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr key={reading.label}>
              <td className={styles.cell}>{reading.label}</td>
              <td className={styles.cell}>{reading.policy}</td>
              <td className={styles.cell}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: reading.color }}
                />
                {reading.color}
              </td>
              <td className={styles.cell}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: reading.background }}
                />
                {reading.background}
              </td>
              <td className={styles.cell}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: reading.border }}
                />
                {reading.border}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AlternateAppearanceReport.displayName = 'AlternateAppearanceReport';
