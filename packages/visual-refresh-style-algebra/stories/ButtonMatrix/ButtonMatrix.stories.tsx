import * as React from 'react';
import type { ButtonCase } from '../../src';
import { unsupportedTeamsTint } from '../fixtures';
import { Matrix, SplitPair, UnsupportedCase } from '../storySupport';

const cases: readonly { title: string; input: ButtonCase }[] = [
  {
    title: 'SharePoint tint, hover, icon before',
    input: {
      product: 'sharepoint',
      visualLanguage: 'visualRefresh',
      density: 'standard',
      appearance: 'tint',
      interactionState: 'hover',
      colorMode: 'dark',
      contentKind: 'textAndIcon',
      iconPlacement: 'before',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
  },
  {
    title: 'Fluent tint, pressed, icon after',
    input: {
      product: 'fluent',
      visualLanguage: 'visualRefresh',
      density: 'compact',
      appearance: 'tint',
      interactionState: 'pressed',
      colorMode: 'light',
      contentKind: 'textAndIcon',
      iconPlacement: 'after',
      anatomyPolicy: 'fluentDefault',
      compositionContext: 'standalone',
      direction: 'ltr',
    },
  },
  {
    title: 'Forced-colors focus, icon only',
    input: {
      product: 'sharepoint',
      visualLanguage: 'visualRefresh',
      density: 'standard',
      appearance: 'subtle',
      interactionState: 'focusVisible',
      colorMode: 'forcedColors',
      contentKind: 'iconOnly',
      iconPlacement: 'only',
      anatomyPolicy: 'visualRefreshReconstructed',
      compositionContext: 'toolbar',
      direction: 'ltr',
    },
  },
  {
    title: 'Teams compact disabled',
    input: {
      product: 'teams',
      visualLanguage: 'visualRefresh',
      density: 'compact',
      appearance: 'subtle',
      interactionState: 'disabled',
      colorMode: 'dark',
      contentKind: 'text',
      iconPlacement: 'none',
      anatomyPolicy: 'fluentDefault',
      compositionContext: 'toolbar',
      direction: 'ltr',
    },
  },
  {
    title: 'Fluent 2 transparent',
    input: {
      product: 'fluent',
      visualLanguage: 'fluent2',
      density: 'standard',
      appearance: 'transparent',
      interactionState: 'rest',
      colorMode: 'light',
      contentKind: 'textAndIcon',
      iconPlacement: 'before',
      anatomyPolicy: 'fluentDefault',
      compositionContext: 'standalone',
      direction: 'rtl',
    },
  },
];

export const ButtonMatrix = () => (
  <>
    <Matrix cases={cases} />
    <SplitPair direction="ltr" />
    <SplitPair direction="rtl" />
    <UnsupportedCase input={unsupportedTeamsTint} />
  </>
);
