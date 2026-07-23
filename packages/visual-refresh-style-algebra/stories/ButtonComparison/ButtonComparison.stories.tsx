import * as React from 'react';
import { Matrix } from '../storySupport';
import type { ButtonCase } from '../../src';

const cases: readonly { title: string; input: ButtonCase }[] = [
  {
    title: 'Fluent 2 baseline',
    input: {
      product: 'fluent',
      visualLanguage: 'fluent2',
      density: 'standard',
      appearance: 'primary',
      interactionState: 'rest',
      colorMode: 'light',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'fluentDefault',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
  },
  {
    title: 'Visual Refresh 36 px reference',
    input: {
      product: 'fluent',
      visualLanguage: 'visualRefresh',
      density: 'standard',
      appearance: 'primary',
      interactionState: 'rest',
      colorMode: 'light',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
  },
  {
    title: 'Teams 32 px reference',
    input: {
      product: 'teams',
      visualLanguage: 'visualRefresh',
      density: 'standard',
      appearance: 'primary',
      interactionState: 'rest',
      colorMode: 'light',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
  },
];

export const ButtonComparison = () => <Matrix cases={cases} />;
