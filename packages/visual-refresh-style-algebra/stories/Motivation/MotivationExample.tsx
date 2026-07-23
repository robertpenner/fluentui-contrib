import * as React from 'react';
import {
  FluentProvider,
  makeStyles,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

const layers = [
  {
    name: 'Fluent defaults',
    question:
      'Which behavior, accessibility handling, and browser fixes are we inheriting?',
  },
  {
    name: 'Visual Refresh',
    question:
      'Which dimensions, shapes, colors, slots, and states need to change?',
  },
  {
    name: 'Derived component',
    question: 'Which Button rules flow into ToggleButton or another extension?',
  },
  {
    name: 'Product requirement',
    question:
      'Does Teams, SharePoint, or another product need a different constraint?',
  },
  {
    name: 'Interaction states',
    question:
      'Do rest, hover, pressed, selected, focus, and disabled remain coherent?',
  },
  {
    name: 'Accessibility mode',
    question:
      'Do focus and visible boundaries survive an OS high-contrast theme in forced-colors mode?',
  },
  {
    name: 'Composite context',
    question:
      'What changes when the component appears in a toolbar, drawer, dialog, or split control?',
  },
] as const;

const useStyles = makeStyles({
  surface: {
    display: 'grid',
    gap: tokens.spacingVerticalXL,
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
  request: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    paddingInlineStart: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  eyebrow: {
    margin: 0,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
  },
  requestText: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  lead: {
    maxWidth: '72ch',
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
  },
  layerList: {
    display: 'grid',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  layer: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(160px, 0.65fr) minmax(0, 1.35fr)',
    gap: tokens.spacingHorizontalM,
    alignItems: 'start',
    paddingBlock: tokens.spacingVerticalM,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'auto minmax(0, 1fr)',
    },
  },
  index: {
    color: tokens.colorBrandForeground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  layerName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  question: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
    '@media (max-width: 640px)': {
      gridColumnStart: 2,
    },
  },
  result: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    paddingBlock: tokens.spacingVerticalM,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteMarigoldBorderActive}`,
  },
  resultTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
});

export const MotivationMap = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme} className={styles.surface}>
      <div className={styles.request}>
        <p className={styles.eyebrow}>The visible request</p>
        <p className={styles.requestText}>
          Refresh the button height, shape, and spacing.
        </p>
      </div>
      <p className={styles.lead}>
        The request is small on screen. In a shared component system, answering
        it can cross every layer below.
      </p>
      <ol className={styles.layerList}>
        {layers.map((layer, index) => (
          <li key={layer.name} className={styles.layer}>
            <span className={styles.index}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={styles.layerName}>{layer.name}</span>
            <p className={styles.question}>{layer.question}</p>
          </li>
        ))}
      </ol>
      <div className={styles.result}>
        <p className={styles.resultTitle}>
          One visible button, many decision owners
        </p>
        <p className={styles.lead}>
          When those decisions are implicit in layered CSS, an intentional
          product difference and an accidental regression can look remarkably
          similar.
        </p>
      </div>
    </FluentProvider>
  );
};
