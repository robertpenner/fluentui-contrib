import * as React from 'react';
import {
  Button,
  SplitButton,
  ToggleButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import {
  asButtonAppearance,
  capButtonAppearances,
  captureElementGriffelRules,
  CapFixtureProvider,
  type CapturedGriffelRule,
  declarationsForProperty,
  unsupportedShorthandProperties,
} from '../../src';

const FOCUS_SELECTOR_MARKER = 'data-fui-focus-visible';
const BOUNDARY_PROPERTY = 'border-top-color';

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
  verdict: {
    margin: 0,
    fontWeight: tokens.fontWeightSemibold,
  },
  emitted: {
    color: tokens.colorPaletteGreenForeground1,
  },
  dropped: {
    color: tokens.colorPaletteRedForeground1,
  },
  metadata: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    overflowWrap: 'anywhere',
  },
  output: {
    maxBlockSize: '240px',
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

interface SlotReport {
  readonly title: string;
  readonly focusBoundaryRules: readonly CapturedGriffelRule[];
  readonly forcedColorsFocusBoundaryRules: readonly CapturedGriffelRule[];
  readonly totalRules: number;
}

const focusBoundaryRules = (
  rules: readonly CapturedGriffelRule[]
): readonly CapturedGriffelRule[] =>
  declarationsForProperty(rules, BOUNDARY_PROPERTY).filter(({ selector }) =>
    selector.includes(FOCUS_SELECTOR_MARKER)
  );

const DiagnosticFixtures: React.FC = () => {
  const styles = useStyles();
  const { targetDocument } = useFluent_unstable();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const splitRef = React.useRef<HTMLDivElement>(null);
  const [reports, setReports] = React.useState<readonly SlotReport[]>([]);

  React.useEffect(() => {
    if (!targetDocument) {
      return;
    }

    const slots: ReadonlyArray<{ title: string; element: Element | null }> = [
      { title: 'CAP Button root', element: buttonRef.current },
      { title: 'CAP ToggleButton root', element: toggleRef.current },
      {
        title: 'CAP SplitButton primary action',
        element:
          splitRef.current?.querySelector(
            '.fui-SplitButton__primaryActionButton'
          ) ?? null,
      },
      {
        title: 'CAP SplitButton menu action',
        element:
          splitRef.current?.querySelector('.fui-SplitButton__menuButton') ??
          null,
      },
    ];

    const nextReports = slots.flatMap(({ title, element }) => {
      if (!element) {
        return [];
      }
      const rules = captureElementGriffelRules(
        targetDocument.styleSheets,
        element
      );
      const focusRules = focusBoundaryRules(rules);
      return [
        {
          title,
          focusBoundaryRules: focusRules.filter(({ media }) => media === ''),
          forcedColorsFocusBoundaryRules: focusRules.filter(
            ({ media }) => media !== ''
          ),
          totalRules: rules.length,
        },
      ];
    });

    React.startTransition(() => {
      setReports(nextReports);
    });
  }, [targetDocument]);

  return (
    <div className={styles.root}>
      <p className={styles.metadata}>
        Griffel refuses to expand {unsupportedShorthandProperties.join(', ')}.
        When a style hook uses one, Griffel logs an error and drops the
        declaration, so the browser never receives it. This page shows the
        opposite condition: the boundary colours a dropped declaration was meant
        to provide, read back from the live CSSOM.
      </p>
      <div className={styles.fixtures}>
        <Button
          ref={buttonRef}
          appearance="primary"
          data-testid="diagnostics-button"
        >
          Continue
        </Button>
        <ToggleButton
          ref={toggleRef}
          appearance="primary"
          checked
          data-testid="diagnostics-toggle-button"
        >
          Pin
        </ToggleButton>
        <SplitButton
          ref={splitRef}
          appearance="primary"
          menuButton={{ 'aria-label': 'More actions' }}
          data-testid="diagnostics-split-button"
        >
          Save
        </SplitButton>
        {capButtonAppearances.map((appearance) => (
          <Button
            key={appearance}
            appearance={asButtonAppearance(appearance)}
            data-testid={`diagnostics-button-${appearance}`}
          >
            {appearance}
          </Button>
        ))}
      </div>
      <output data-testid="griffel-diagnostics-data" hidden>
        {JSON.stringify(reports)}
      </output>
      <div className={styles.results}>
        {reports.map(
          ({
            title,
            focusBoundaryRules: ordinary,
            forcedColorsFocusBoundaryRules: forcedColors,
            totalRules,
          }) => {
            const emitted = ordinary.length > 0;
            return (
              <section key={title} className={styles.result}>
                <h3 className={styles.title}>{title}</h3>
                <p
                  className={`${styles.verdict} ${
                    emitted ? styles.emitted : styles.dropped
                  }`}
                >
                  {emitted
                    ? 'Focus boundary colour emitted'
                    : 'No focus boundary colour reached the stylesheet'}
                </p>
                <p className={styles.metadata}>
                  {JSON.stringify({
                    totalRules,
                    focusBoundaryRules: ordinary.length,
                    forcedColorsFocusBoundaryRules: forcedColors.length,
                  })}
                </p>
                <details>
                  <summary>Focus boundary rules</summary>
                  <pre className={styles.output}>
                    {[...ordinary, ...forcedColors]
                      .map(({ media, cssText }) =>
                        media ? `@media ${media} { ${cssText} }` : cssText
                      )
                      .join('\n\n') || '(none)'}
                  </pre>
                </details>
              </section>
            );
          }
        )}
      </div>
    </div>
  );
};

export const GriffelShorthandDiagnostics = () => (
  <CapFixtureProvider>
    <DiagnosticFixtures />
  </CapFixtureProvider>
);
