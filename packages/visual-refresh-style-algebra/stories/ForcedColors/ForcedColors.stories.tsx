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
  createForcedColorsEmissionExperiment,
  measureForcedColorsEmission,
  normalizeForcedColorsEmission,
  resolveSyntheticForcedColorsContract as resolveForcedColorsContract,
  resolveSyntheticLayeredButtonWithHistory as resolveLayeredButtonWithHistory,
  resolveSyntheticSemanticButton as resolveSemanticButton,
  type SyntheticButtonResearchCase as ButtonCase,
  type ForcedColorsEmissionTarget,
} from '../../src';

interface ForcedColorsStoryCase {
  title: string;
  input: ButtonCase;
  target: ForcedColorsEmissionTarget;
}

const useStyles = makeStyles({
  matrix: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  case: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  metadata: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    overflowWrap: 'anywhere',
  },
  renderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  rendered: {
    display: 'grid',
    justifyItems: 'start',
    gap: tokens.spacingVerticalXS,
  },
  label: {
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
  },
  details: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
  },
  output: {
    maxBlockSize: '280px',
    margin: `${tokens.spacingVerticalS} 0 0`,
    padding: tokens.spacingHorizontalM,
    overflow: 'auto',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    whiteSpace: 'pre-wrap',
  },
  blocked: {
    margin: 0,
    color: tokens.colorPaletteRedForeground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
});

const cases: readonly ForcedColorsStoryCase[] = [
  {
    title: 'Fluent 2 baseline, primary focus',
    input: {
      product: 'fluent',
      visualLanguage: 'fluent2',
      density: 'standard',
      appearance: 'primary',
      interactionState: 'focusVisible',
      colorMode: 'forcedColors',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'fluentDefault',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
    target: { component: 'Button', slot: 'root' },
  },
  {
    title: 'Fluent Visual Refresh, compact subtle ToggleButton',
    input: {
      product: 'fluent',
      visualLanguage: 'visualRefresh',
      density: 'compact',
      appearance: 'subtle',
      interactionState: 'focusVisible',
      colorMode: 'forcedColors',
      contentKind: 'textAndIcon',
      iconPlacement: 'before',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'toolbar',
      direction: 'ltr',
    },
    target: { component: 'ToggleButton', slot: 'root' },
  },
  {
    title: 'SharePoint tint, disabled',
    input: {
      product: 'sharepoint',
      visualLanguage: 'visualRefresh',
      density: 'standard',
      appearance: 'tint',
      interactionState: 'disabled',
      colorMode: 'forcedColors',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'fluentDefault',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
    target: { component: 'Button', slot: 'root' },
  },
  {
    title: 'Teams transparent split primary, LTR',
    input: {
      product: 'teams',
      visualLanguage: 'visualRefresh',
      density: 'standard',
      appearance: 'transparent',
      interactionState: 'focusVisible',
      colorMode: 'forcedColors',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'splitButtonStart',
      direction: 'ltr',
    },
    target: { component: 'SplitButton', slot: 'primaryAction' },
  },
  {
    title: 'Teams primary split menu, compact RTL',
    input: {
      product: 'teams',
      visualLanguage: 'visualRefresh',
      density: 'compact',
      appearance: 'primary',
      interactionState: 'focusVisible',
      colorMode: 'forcedColors',
      contentKind: 'iconOnly',
      iconPlacement: 'only',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'splitButtonEnd',
      direction: 'rtl',
    },
    target: { component: 'SplitButton', slot: 'menuAction' },
  },
];

const ForcedColorsCase = ({ title, input, target }: ForcedColorsStoryCase) => {
  const styles = useStyles();
  const layered = resolveLayeredButtonWithHistory(input);
  const semanticButton = resolveSemanticButton(input);
  const semanticForcedColors = resolveForcedColorsContract(input);
  const unnormalized = createForcedColorsEmissionExperiment(
    semanticForcedColors,
    target
  );
  const normalized = normalizeForcedColorsEmission(unnormalized);
  const metrics = measureForcedColorsEmission(unnormalized, normalized);
  const unsafeDiagnostics = normalized.diagnostics.filter(
    (diagnostic) => diagnostic.kind === 'unsafeToMerge'
  );
  const labelProps =
    input.contentKind === 'iconOnly'
      ? { label: '', ariaLabel: 'More options' }
      : { label: 'Continue' };

  return (
    <FluentProvider
      theme={input.product === 'teams' ? webDarkTheme : webLightTheme}
      className={styles.case}
      data-story-case={title}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.metadata}>
        {`${input.product} | ${input.visualLanguage} | ${input.density} | ${input.appearance} | ${input.interactionState} | ${input.compositionContext} | ${input.direction} | ${target.component}/${target.slot}`}
      </p>
      <div className={styles.renderGrid}>
        <div className={styles.rendered}>
          <span className={styles.label}>Layered output</span>
          <CleanRoomButton
            architecture="layered"
            buttonCase={input}
            contract={layered.contract}
            {...labelProps}
          />
        </div>
        <div className={styles.rendered}>
          <span className={styles.label}>Semantic output</span>
          <CleanRoomButton
            architecture="semantic"
            buttonCase={input}
            contract={semanticButton}
            {...labelProps}
          />
        </div>
      </div>
      <p className={styles.metadata}>{JSON.stringify(metrics)}</p>
      {unsafeDiagnostics.map((diagnostic, index) => (
        <p
          key={`${diagnostic.ruleIndexes.join('-')}-${index}`}
          className={styles.blocked}
        >
          {diagnostic.explanation}
        </p>
      ))}
      <details className={styles.details}>
        <summary>Semantic forced-colors contract</summary>
        <pre className={styles.output}>
          {JSON.stringify(semanticForcedColors, undefined, 2)}
        </pre>
      </details>
      <details className={styles.details}>
        <summary>Unnormalized emission</summary>
        <pre className={styles.output}>
          {JSON.stringify(unnormalized.rules, undefined, 2)}
        </pre>
      </details>
      <details className={styles.details}>
        <summary>Normalized emission and diagnostics</summary>
        <pre className={styles.output}>
          {JSON.stringify(normalized, undefined, 2)}
        </pre>
      </details>
      <details className={styles.details}>
        <summary>Layered provenance and write history</summary>
        <pre className={styles.output}>
          {JSON.stringify(
            {
              provenance: layered.contract.provenance,
              writeHistory: layered.writeHistory,
            },
            undefined,
            2
          )}
        </pre>
      </details>
    </FluentProvider>
  );
};

export const ForcedColorsEmission = () => {
  const styles = useStyles();
  return (
    <div className={styles.matrix}>
      {cases.map((storyCase) => (
        <ForcedColorsCase key={storyCase.title} {...storyCase} />
      ))}
    </div>
  );
};
