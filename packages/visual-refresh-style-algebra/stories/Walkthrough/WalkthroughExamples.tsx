import * as React from 'react';
import {
  FluentProvider,
  Switch,
  makeStyles,
  mergeClasses,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';
import {
  CleanRoomButton,
  compareContracts,
  createForcedColorsEmissionExperiment,
  measureForcedColorsEmission,
  normalizeForcedColorsEmission,
  resolveSyntheticForcedColorsContract as resolveForcedColorsContract,
  resolveSyntheticLayeredButtonWithHistory as resolveLayeredButtonWithHistory,
  resolveSyntheticSemanticButton as resolveSemanticButton,
  type SyntheticButtonResearchCase as ButtonCase,
  type EmittedStyleRule,
} from '../../src';
import { resolveButtonWithMutation } from '../../src/testing/mutations';

const exampleCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'focusVisible',
  colorMode: 'forcedColors',
  contentKind: 'textAndIcon',
  iconPlacement: 'before',
  anatomyPolicy: 'visualRefreshReconstructed',
  compositionContext: 'standalone',
  direction: 'ltr',
};

const useStyles = makeStyles({
  surface: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
    marginBlock: tokens.spacingVerticalL,
    paddingBlock: tokens.spacingVerticalXL,
    paddingInline: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    fontFamily: tokens.fontFamilyBase,
    '@media (max-width: 640px)': {
      paddingInline: tokens.spacingHorizontalM,
    },
  },
  eyebrow: {
    margin: 0,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  body: {
    maxWidth: '72ch',
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  chip: {
    paddingBlock: tokens.spacingVerticalXS,
    paddingInline: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
  flow: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)',
    gap: tokens.spacingHorizontalS,
    alignItems: 'stretch',
    '@media (max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
  flowNode: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  flowArrow: {
    alignSelf: 'center',
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase500,
    '@media (max-width: 720px)': {
      justifySelf: 'center',
      transform: 'rotate(90deg)',
    },
  },
  nodeLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  nodeValue: {
    margin: 0,
    overflowWrap: 'anywhere',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
  },
  split: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  lane: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    paddingBlock: tokens.spacingVerticalM,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke1}`,
  },
  laneSemantic: {
    borderTopColor: tokens.colorBrandStroke1,
  },
  laneTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  laneList: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    margin: 0,
    paddingInlineStart: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground2,
  },
  result: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    paddingBlock: tokens.spacingVerticalM,
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  status: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  pass: {
    color: tokens.colorPaletteGreenForeground1,
  },
  fail: {
    color: tokens.colorPaletteRedForeground1,
  },
  lawGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(180px, 0.7fr) minmax(0, 1.3fr)',
    gap: tokens.spacingHorizontalL,
    alignItems: 'start',
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  lawStatement: {
    margin: 0,
    paddingInlineStart: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  observation: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    paddingBlock: tokens.spacingVerticalS,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
  emissionFlow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
  count: {
    display: 'block',
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
  },
  ruleList: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  rule: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    paddingBlock: tokens.spacingVerticalXS,
    paddingInline: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke2}`,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
    overflowWrap: 'anywhere',
  },
  duplicate: {
    borderLeftColor: tokens.colorPaletteGreenBorderActive,
  },
  contextual: {
    borderLeftColor: tokens.colorPaletteMarigoldBorderActive,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
});

const caseDimensions: readonly [string, string][] = [
  ['Product', exampleCase.product],
  ['Language', exampleCase.visualLanguage],
  ['Appearance', exampleCase.appearance],
  ['State', exampleCase.interactionState],
  ['Environment', exampleCase.colorMode],
  ['Content', `${exampleCase.contentKind}/${exampleCase.iconPlacement}`],
];

const summarizeContract = (): readonly string[] => {
  const contract = resolveSemanticButton(exampleCase);
  return [
    `${contract.geometry.blockSize}px tall`,
    `${contract.appearance.foregroundRole} on ${contract.appearance.backgroundRole}`,
    `${contract.shape.radiusStartStart}px corners`,
    contract.focus.visible
      ? `visible ${contract.focus.colorRole} focus`
      : 'no focus indicator',
  ];
};

export const CaseToContractExample = () => {
  const styles = useStyles();
  const contractSummary = summarizeContract();

  return (
    <FluentProvider theme={webLightTheme} className={styles.surface}>
      <p className={styles.eyebrow}>First intuition</p>
      <h3 className={styles.heading}>
        Treat styling as a question with a structured answer
      </h3>
      <p className={styles.body}>
        A button case describes the situation. A resolver applies named policy.
        The contract records the meaning that a renderer must preserve.
      </p>
      <ul className={styles.chips} aria-label="Button case dimensions">
        {caseDimensions.map(([label, value]) => (
          <li key={label} className={styles.chip}>{`${label}: ${value}`}</li>
        ))}
      </ul>
      <div className={styles.flow}>
        <div className={styles.flowNode}>
          <span className={styles.nodeLabel}>1. Button case</span>
          <p className={styles.nodeValue}>The conditions we want to resolve</p>
        </div>
        <span className={styles.flowArrow} aria-hidden="true">{`>`}</span>
        <div className={styles.flowNode}>
          <span className={styles.nodeLabel}>2. Semantic resolver</span>
          <p className={styles.nodeValue}>Named policy, no CSS required</p>
        </div>
        <span className={styles.flowArrow} aria-hidden="true">{`>`}</span>
        <div className={styles.flowNode}>
          <span className={styles.nodeLabel}>3. Style contract</span>
          <p className={styles.nodeValue}>{contractSummary.join(' | ')}</p>
        </div>
      </div>
    </FluentProvider>
  );
};

export const ArchitectureExample = () => {
  const styles = useStyles();
  const layered = resolveLayeredButtonWithHistory(exampleCase);
  const semantic = resolveSemanticButton(exampleCase);
  const differences = compareContracts(layered.contract, semantic);

  return (
    <FluentProvider theme={webLightTheme} className={styles.surface}>
      <p className={styles.eyebrow}>Two implementations, one meaning</p>
      <div className={styles.split}>
        <section className={styles.lane}>
          <h3 className={styles.laneTitle}>Layered resolver</h3>
          <ul className={styles.laneList}>
            <li>Begin with a complete Fluent baseline</li>
            <li>Apply Visual Refresh and product overrides</li>
            <li>Apply interaction and forced-colors protection</li>
            <li>Record each field write for auditing</li>
          </ul>
          <CleanRoomButton
            architecture="layered"
            buttonCase={exampleCase}
            contract={layered.contract}
            label="Continue"
          />
          <span
            className={styles.nodeValue}
          >{`${layered.writeHistory.length} recorded field writes`}</span>
        </section>
        <section className={mergeClasses(styles.lane, styles.laneSemantic)}>
          <h3 className={styles.laneTitle}>Semantic resolver</h3>
          <ul className={styles.laneList}>
            <li>Resolve geometry independently</li>
            <li>Resolve appearance and focus independently</li>
            <li>Resolve anatomy and capabilities independently</li>
            <li>Assemble one contract at the end</li>
          </ul>
          <CleanRoomButton
            architecture="semantic"
            buttonCase={exampleCase}
            contract={semantic}
            label="Continue"
          />
          <span className={styles.nodeValue}>
            No intermediate field ownership
          </span>
        </section>
      </div>
      <div className={styles.result}>
        <span
          className={mergeClasses(
            styles.status,
            differences.length === 0 ? styles.pass : styles.fail
          )}
        >
          {differences.length === 0
            ? 'Same semantic result'
            : `${differences.length} semantic differences`}
        </span>
        <span className={styles.body}>
          The experiment compares meaning, not implementation steps.
        </span>
      </div>
    </FluentProvider>
  );
};

export const LawExample = () => {
  const styles = useStyles();
  const [faultEnabled, setFaultEnabled] = React.useState(false);
  const contract = faultEnabled
    ? resolveButtonWithMutation(exampleCase, 'leakProductColorIntoForcedColors')
    : resolveSemanticButton(exampleCase);
  const usesSystemBackground =
    contract.appearance.backgroundRole === 'ButtonFace';

  return (
    <FluentProvider theme={webLightTheme} className={styles.surface}>
      <p className={styles.eyebrow}>Executable theory</p>
      <div className={styles.lawGrid}>
        <div>
          <p className={styles.lawStatement}>
            In forced colors, ordinary product color roles must not leak into
            the result.
          </p>
        </div>
        <div>
          <Switch
            checked={faultEnabled}
            label="Introduce a product-color leak"
            onChange={(_, data) => setFaultEnabled(data.checked)}
          />
          <div className={styles.observation} aria-live="polite">
            <span>{`Resolved background: ${contract.appearance.backgroundRole}`}</span>
            <span
              className={mergeClasses(
                styles.status,
                usesSystemBackground ? styles.pass : styles.fail
              )}
            >
              {usesSystemBackground ? 'Law passes' : 'Law catches the fault'}
            </span>
          </div>
          <CleanRoomButton
            architecture="semantic"
            buttonCase={exampleCase}
            contract={contract}
            label="Continue"
          />
        </div>
      </div>
    </FluentProvider>
  );
};

const ruleLabel = (rule: EmittedStyleRule): string =>
  `${rule.selectorScope} | ${rule.semanticDecision} | ${Object.keys(
    rule.declarations
  ).join(', ')}`;

export const EmissionExample = () => {
  const styles = useStyles();
  const semantic = resolveForcedColorsContract(exampleCase);
  const original = createForcedColorsEmissionExperiment(semantic, {
    component: 'Button',
    slot: 'root',
  });
  const normalized = normalizeForcedColorsEmission(original);
  const metrics = measureForcedColorsEmission(original, normalized);

  return (
    <FluentProvider theme={webLightTheme} className={styles.surface}>
      <p className={styles.eyebrow}>Meaning first, CSS second</p>
      <h3 className={styles.heading}>
        Compression is useful only when context survives
      </h3>
      <p className={styles.body}>
        This synthetic example deliberately contains one exact duplicate and one
        lookalike with a different selector. The normalizer removes the
        duplicate and keeps the contextual rule.
      </p>
      <div className={styles.emissionFlow}>
        <section className={styles.lane}>
          <span className={styles.count}>{metrics.semanticDecisions}</span>
          <h3 className={styles.laneTitle}>Semantic decisions</h3>
          <p className={styles.body}>
            Appearance, visible boundary, and focus policy for this case.
          </p>
        </section>
        <section className={styles.lane}>
          <span className={styles.count}>{metrics.emittedRules}</span>
          <h3 className={styles.laneTitle}>Emitted rules</h3>
          <ul className={styles.ruleList}>
            {original.rules.map((rule, index) => (
              <li
                key={`${rule.selectorScope}-${rule.sourceRules.join(
                  '-'
                )}-${index}`}
                className={mergeClasses(
                  styles.rule,
                  rule.sourceRules.includes(
                    'synthetic-product-style-hook-copy'
                  ) && styles.duplicate,
                  rule.sourceRules.includes('synthetic-contextual-lookalike') &&
                    styles.contextual
                )}
              >
                {ruleLabel(rule)}
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.lane}>
          <span className={styles.count}>{normalized.rules.length}</span>
          <h3 className={styles.laneTitle}>Normalized rules</h3>
          <p
            className={styles.body}
          >{`${metrics.safelyNormalizedRules} exact duplicate removed; selector-sensitive lookalike retained.`}</p>
        </section>
      </div>
      <div className={styles.legend}>
        <span>Green edge: safe exact duplicate</span>
        <span>Gold edge: similar declaration, different selector</span>
      </div>
    </FluentProvider>
  );
};
