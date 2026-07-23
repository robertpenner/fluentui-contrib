import * as React from 'react';
import {
  FluentProvider,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {
  CleanRoomButton,
  compareContracts,
  invalidButtonCaseReasons,
  resolveLayeredButtonWithHistory,
  resolveSemanticButton,
  type ButtonCase,
} from '../src';

const useStyles = makeStyles({
  matrix: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  sample: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    paddingBlock: tokens.spacingVerticalM,
    paddingInline: tokens.spacingHorizontalM,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  dimensions: {
    margin: 0,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    overflowWrap: 'anywhere',
  },
  architectureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  architecture: {
    display: 'grid',
    justifyItems: 'start',
    gap: tokens.spacingVerticalXS,
  },
  architectureLabel: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  split: {
    display: 'inline-flex',
  },
  output: {
    margin: 0,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    overflow: 'auto',
    maxBlockSize: '320px',
    whiteSpace: 'pre-wrap',
  },
  inspectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  rejected: {
    color: tokens.colorPaletteRedForeground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
});

const dimensions = (input: ButtonCase): string =>
  [
    input.product,
    input.visualLanguage,
    input.density,
    input.appearance,
    input.interactionState,
    input.colorMode,
    `${input.contentKind}/${input.iconPlacement}`,
    input.anatomyPolicy,
    input.compositionContext,
    input.direction,
  ].join(' | ');

const buttonLabel = (
  input: ButtonCase
): { label: string; ariaLabel?: string } =>
  input.contentKind === 'iconOnly'
    ? { label: '', ariaLabel: 'Add item' }
    : { label: 'Continue' };

export const CasePair = ({
  input,
  title,
}: {
  input: ButtonCase;
  title: string;
}) => {
  const styles = useStyles();
  const layered = resolveLayeredButtonWithHistory(input).contract;
  const semantic = resolveSemanticButton(input);
  const labelProps = buttonLabel(input);
  const theme = input.colorMode === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider
      theme={theme}
      className={styles.sample}
      data-story-case={title}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.dimensions}>{dimensions(input)}</p>
      <div className={styles.architectureGrid}>
        <div className={styles.architecture}>
          <span className={styles.architectureLabel}>Layered</span>
          <CleanRoomButton
            architecture="layered"
            buttonCase={input}
            contract={layered}
            {...labelProps}
          />
        </div>
        <div className={styles.architecture}>
          <span className={styles.architectureLabel}>Semantic</span>
          <CleanRoomButton
            architecture="semantic"
            buttonCase={input}
            contract={semantic}
            {...labelProps}
          />
        </div>
      </div>
    </FluentProvider>
  );
};

export const Matrix = ({
  cases,
}: {
  cases: readonly { title: string; input: ButtonCase }[];
}) => {
  const styles = useStyles();
  return (
    <div className={styles.matrix}>
      {cases.map(({ input, title }) => (
        <CasePair key={title} input={input} title={title} />
      ))}
    </div>
  );
};

export const SplitPair = ({
  direction,
}: {
  direction: ButtonCase['direction'];
}) => {
  const styles = useStyles();
  const base: ButtonCase = {
    product: 'teams',
    visualLanguage: 'visualRefresh',
    density: 'standard',
    appearance: 'primary',
    interactionState: 'focusVisible',
    colorMode: 'forcedColors',
    contentKind: 'text',
    iconPlacement: 'none',
    anatomyPolicy: 'visualRefreshReconstructed',
    compositionContext: 'splitButtonStart',
    direction,
  };
  const start = { ...base, compositionContext: 'splitButtonStart' } as const;
  const end = { ...base, compositionContext: 'splitButtonEnd' } as const;

  return (
    <div className={styles.sample}>
      <h3 className={styles.title}>Split button, {direction.toUpperCase()}</h3>
      <div className={styles.architectureGrid}>
        {(['layered', 'semantic'] as const).map((architecture) => {
          const resolver =
            architecture === 'layered'
              ? resolveLayeredButtonWithHistory
              : undefined;
          const startContract = resolver
            ? resolver(start).contract
            : resolveSemanticButton(start);
          const endContract = resolver
            ? resolver(end).contract
            : resolveSemanticButton(end);
          return (
            <div key={architecture} className={styles.architecture}>
              <span className={styles.architectureLabel}>{architecture}</span>
              <div className={styles.split} dir={direction}>
                <CleanRoomButton
                  architecture={architecture}
                  buttonCase={start}
                  contract={startContract}
                  label="Save"
                />
                <CleanRoomButton
                  architecture={architecture}
                  buttonCase={end}
                  contract={endContract}
                  label="More"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const UnsupportedCase = ({ input }: { input: ButtonCase }) => {
  const styles = useStyles();
  const reasons = invalidButtonCaseReasons(input);
  return (
    <div className={styles.sample} data-story-case="unsupported-appearance">
      <h3 className={styles.title}>Explicitly rejected appearance</h3>
      <p className={styles.dimensions}>{dimensions(input)}</p>
      <div className={styles.rejected}>{reasons.join(', ')}</div>
    </div>
  );
};

export const CounterexampleInspector = ({ input }: { input: ButtonCase }) => {
  const styles = useStyles();
  const layered = resolveLayeredButtonWithHistory(input);
  const semantic = resolveSemanticButton(input);
  const differences = compareContracts(layered.contract, semantic);

  return (
    <div className={styles.sample}>
      <CasePair input={input} title="Serialized regression fixture" />
      <div className={styles.inspectionGrid}>
        <pre className={styles.output}>
          {JSON.stringify({ input, differences }, undefined, 2)}
        </pre>
        <pre className={styles.output}>
          {JSON.stringify(layered.contract, undefined, 2)}
        </pre>
        <pre className={styles.output}>
          {JSON.stringify(semantic, undefined, 2)}
        </pre>
        <pre className={styles.output}>
          {JSON.stringify(layered.writeHistory, undefined, 2)}
        </pre>
      </div>
    </div>
  );
};
