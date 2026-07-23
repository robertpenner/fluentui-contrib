import * as React from 'react';
import {
  Button,
  FluentProvider,
  SplitButton,
  ToggleButton,
  makeStyles,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import {
  CAP_STYLE_HOOKS,
  CAP_THEME_TOKENS,
} from '@fluentui-contrib/react-cap-theme';
import { adaptGriffelForcedColorsCapture } from '../../src/emission/adaptGriffelForcedColorsCapture';
import {
  captureGriffelForcedColorsFixture,
  captureGriffelForcedColorsRules,
} from '../../src/emission/captureGriffelForcedColorsRules';
import {
  diffGriffelForcedColorsCaptures,
  type GriffelForcedColorsCapture,
  type GriffelForcedColorsCaptureDifference,
} from '../../src/emission/diffGriffelForcedColorsCaptures';
import type {
  EmissionResult,
  ForcedColorsEmissionTarget,
} from '../../src/emission/ForcedColorsEmission';
import {
  measureForcedColorsEmission,
  normalizeForcedColorsEmission,
} from '../../src/emission/normalizeForcedColorsEmission';

interface CapturedTarget {
  title: string;
  target: ForcedColorsEmissionTarget;
  original: EmissionResult;
  normalized: EmissionResult;
}

interface DifferentialCapture {
  title: string;
  baselineLabel: string;
  candidateLabel: string;
  baseline: GriffelForcedColorsCapture;
  candidate: GriffelForcedColorsCapture;
  difference: GriffelForcedColorsCaptureDifference;
}

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
  results: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  result: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
    padding: tokens.spacingHorizontalL,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  metadata: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    overflowWrap: 'anywhere',
  },
  details: {
    fontSize: tokens.fontSizeBase300,
  },
  output: {
    maxBlockSize: '320px',
    margin: `${tokens.spacingVerticalS} 0 0`,
    padding: tokens.spacingHorizontalM,
    overflow: 'auto',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    whiteSpace: 'pre-wrap',
  },
});

const capTheme = { ...webLightTheme, ...CAP_THEME_TOKENS };

const CaptureFixtures = () => {
  const styles = useStyles();
  const { targetDocument } = useFluent_unstable();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const disabledButtonRef = React.useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = React.useRef<HTMLButtonElement>(null);
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);
  const selectedToggleButtonRef = React.useRef<HTMLButtonElement>(null);
  const splitButtonRef = React.useRef<HTMLDivElement>(null);
  const [captures, setCaptures] = React.useState<CapturedTarget[]>([]);
  const [differences, setDifferences] = React.useState<DifferentialCapture[]>(
    []
  );

  React.useEffect(() => {
    if (!targetDocument) {
      return;
    }

    const targets: Array<{
      title: string;
      element: Element | null;
      target: ForcedColorsEmissionTarget;
    }> = [
      {
        title: 'CAP Button root',
        element: buttonRef.current,
        target: { component: 'Button', slot: 'root' },
      },
      {
        title: 'CAP ToggleButton root',
        element: toggleButtonRef.current,
        target: { component: 'ToggleButton', slot: 'root' },
      },
      {
        title: 'CAP SplitButton primary action',
        element: splitButtonRef.current?.querySelector(
          '.fui-SplitButton__primaryActionButton'
        ),
        target: { component: 'SplitButton', slot: 'primaryAction' },
      },
      {
        title: 'CAP SplitButton menu action',
        element: splitButtonRef.current?.querySelector(
          '.fui-SplitButton__menuButton'
        ),
        target: { component: 'SplitButton', slot: 'menuAction' },
      },
    ];

    const nextCaptures = targets.flatMap(({ title, element, target }) => {
      if (!element) {
        return [];
      }
      const capturedRules = captureGriffelForcedColorsRules(
        targetDocument.styleSheets,
        [...element.classList]
      );
      const original = adaptGriffelForcedColorsCapture(capturedRules, target);
      return [
        {
          title,
          target,
          original,
          normalized: normalizeForcedColorsEmission(original),
        },
      ];
    });

    const differentialTargets: Array<{
      title: string;
      baselineLabel: string;
      baselineElement: Element | null;
      candidateLabel: string;
      candidateElement: Element | null;
    }> = [
      {
        title: 'Disabled state',
        baselineLabel: 'Primary Button, enabled',
        baselineElement: buttonRef.current,
        candidateLabel: 'Primary Button, disabled',
        candidateElement: disabledButtonRef.current,
      },
      {
        title: 'Selected state',
        baselineLabel: 'Primary ToggleButton, unselected',
        baselineElement: toggleButtonRef.current,
        candidateLabel: 'Primary ToggleButton, selected',
        candidateElement: selectedToggleButtonRef.current,
      },
      {
        title: 'Alternate appearance',
        baselineLabel: 'Primary Button',
        baselineElement: buttonRef.current,
        candidateLabel: 'Secondary Button',
        candidateElement: secondaryButtonRef.current,
      },
    ];

    const nextDifferences = differentialTargets.flatMap(
      ({
        title,
        baselineLabel,
        baselineElement,
        candidateLabel,
        candidateElement,
      }) => {
        if (!baselineElement || !candidateElement) {
          return [];
        }
        const baseline = captureGriffelForcedColorsFixture(
          targetDocument.styleSheets,
          baselineElement
        );
        const candidate = captureGriffelForcedColorsFixture(
          targetDocument.styleSheets,
          candidateElement
        );
        return [
          {
            title,
            baselineLabel,
            candidateLabel,
            baseline,
            candidate,
            difference: diffGriffelForcedColorsCaptures(baseline, candidate),
          },
        ];
      }
    );

    React.startTransition(() => {
      setCaptures(nextCaptures);
      setDifferences(nextDifferences);
    });
  }, [targetDocument]);

  return (
    <div className={styles.root}>
      <div className={styles.fixtures}>
        <Button
          ref={buttonRef}
          appearance="primary"
          data-testid="enabled-primary-button"
        >
          Continue
        </Button>
        <Button
          ref={disabledButtonRef}
          appearance="primary"
          disabled
          data-testid="disabled-primary-button"
        >
          Continue disabled
        </Button>
        <Button
          ref={secondaryButtonRef}
          appearance="secondary"
          data-testid="secondary-button"
        >
          Continue secondary
        </Button>
        <ToggleButton
          ref={toggleButtonRef}
          appearance="primary"
          data-testid="unselected-toggle-button"
        >
          Pin
        </ToggleButton>
        <ToggleButton
          ref={selectedToggleButtonRef}
          appearance="primary"
          checked
          data-testid="selected-toggle-button"
        >
          Pin selected
        </ToggleButton>
        <SplitButton
          ref={splitButtonRef}
          appearance="primary"
          menuButton={{ 'aria-label': 'More actions' }}
        >
          Save
        </SplitButton>
      </div>
      <output data-testid="griffel-capture-data" hidden>
        {JSON.stringify(captures)}
      </output>
      <output data-testid="griffel-differential-data" hidden>
        {JSON.stringify(differences)}
      </output>
      <div className={styles.results}>
        {captures.map(({ title, target, original, normalized }) => (
          <section
            key={`${target.component}-${target.slot}`}
            className={styles.result}
          >
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.metadata}>
              {JSON.stringify(
                measureForcedColorsEmission(original, normalized)
              )}
            </p>
            <details className={styles.details}>
              <summary>Captured Griffel rules</summary>
              <pre className={styles.output}>
                {JSON.stringify(original.rules, undefined, 2)}
              </pre>
            </details>
            <details className={styles.details}>
              <summary>Normalized rules and diagnostics</summary>
              <pre className={styles.output}>
                {JSON.stringify(normalized, undefined, 2)}
              </pre>
            </details>
          </section>
        ))}
      </div>
      <h2 className={styles.sectionTitle}>Differential captures</h2>
      <div className={styles.results}>
        {differences.map(
          ({
            title,
            baselineLabel,
            candidateLabel,
            baseline,
            candidate,
            difference,
          }) => (
            <section key={title} className={styles.result}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.metadata}>
                {baselineLabel} → {candidateLabel}
              </p>
              <p className={styles.metadata}>
                {JSON.stringify({
                  baselineClasses: baseline.classNames.length,
                  candidateClasses: candidate.classNames.length,
                  addedClasses: difference.addedClassNames.length,
                  removedClasses: difference.removedClassNames.length,
                  addedRules: difference.addedRules.length,
                  removedRules: difference.removedRules.length,
                  activatedRules: difference.activatedRules.length,
                  deactivatedRules: difference.deactivatedRules.length,
                })}
              </p>
              <details className={styles.details}>
                <summary>Class and rule differences</summary>
                <pre className={styles.output}>
                  {JSON.stringify(difference, undefined, 2)}
                </pre>
              </details>
            </section>
          )
        )}
      </div>
    </div>
  );
};

export const RealGriffelCapture = () => (
  <FluentProvider theme={capTheme} customStyleHooks_unstable={CAP_STYLE_HOOKS}>
    <CaptureFixtures />
  </FluentProvider>
);
