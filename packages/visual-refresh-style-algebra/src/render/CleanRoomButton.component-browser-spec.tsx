import * as React from 'react';
import { expect, test } from '@playwright/experimental-ct-react';
import type { ButtonCase } from '../domain/ButtonCase';
import { ResearchButton } from './ResearchButton.test-story';

const baseCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'visualRefresh',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'rest',
  colorMode: 'light',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
};

test.describe('clean-room visual relationships', () => {
  test('renders the 36 px shared and 32 px Teams reference policies distinctly', async ({ mount }) => {
    const component = await mount(
      <div>
        <ResearchButton input={baseCase} />
        <ResearchButton input={{ ...baseCase, product: 'teams' }} />
      </div>,
    );
    const buttons = component.getByRole('button');

    await expect(buttons.nth(0)).toHaveCSS('height', '36px');
    await expect(buttons.nth(1)).toHaveCSS('height', '32px');
  });

  test('keeps compact controls no taller than standard controls', async ({ mount }) => {
    const component = await mount(
      <div>
        <ResearchButton input={baseCase} />
        <ResearchButton input={{ ...baseCase, density: 'compact' }} />
      </div>,
    );
    const standardHeight = await component.getByRole('button').nth(0).evaluate(element => element.getBoundingClientRect().height);
    const compactHeight = await component.getByRole('button').nth(1).evaluate(element => element.getBoundingClientRect().height);

    expect(compactHeight).toBeLessThanOrEqual(standardHeight);
  });

  test('exposes forced-colors focus and reconstructed accessible naming', async ({ mount }) => {
    const input: ButtonCase = {
      ...baseCase,
      interactionState: 'focusVisible',
      colorMode: 'forcedColors',
      contentKind: 'iconOnly',
      iconPlacement: 'only',
      anatomyPolicy: 'visualRefreshReconstructed',
    };
    const component = await mount(<ResearchButton input={input} />);
    const button = component.getByRole('button', { name: 'Add item' });

    await expect(button).toHaveCSS('outline-style', 'solid');
    await expect(button).toHaveCSS('outline-width', '2px');
    await expect(button).toHaveAttribute('data-color-mode', 'forcedColors');
    await expect(button).toHaveAttribute('data-anatomy', 'visualRefreshReconstructed');
  });

  test('mirrors logical asymmetric padding and avoids text overflow', async ({ mount }) => {
    const textAndIcon: ButtonCase = {
      ...baseCase,
      contentKind: 'textAndIcon',
      iconPlacement: 'before',
    };
    const component = await mount(
      <div>
        <ResearchButton input={{ ...textAndIcon, direction: 'ltr' }} label="A supported long label" />
        <ResearchButton input={{ ...textAndIcon, direction: 'rtl' }} label="A supported long label" />
      </div>,
    );
    const ltr = component.getByRole('button').nth(0);
    const rtl = component.getByRole('button').nth(1);

    await expect(ltr).toHaveCSS('padding-inline-start', '10px');
    await expect(ltr).toHaveCSS('padding-inline-end', '12px');
    await expect(rtl).toHaveCSS('padding-inline-start', '12px');
    await expect(rtl).toHaveCSS('padding-inline-end', '10px');
    expect(await ltr.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await rtl.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  });

  test('keeps outer corners and removes joined corners in RTL split composition', async ({ mount }) => {
    const start: ButtonCase = {
      ...baseCase,
      product: 'teams',
      direction: 'rtl',
      compositionContext: 'splitButtonStart',
    };
    const end: ButtonCase = { ...start, compositionContext: 'splitButtonEnd' };
    const component = await mount(
      <div dir="rtl" style={{ display: 'inline-flex' }}>
        <ResearchButton input={start} label="Save" />
        <ResearchButton input={end} label="More" />
      </div>,
    );
    const buttons = component.getByRole('button');

    await expect(buttons.nth(0)).toHaveCSS('border-start-start-radius', '0px');
    await expect(buttons.nth(0)).toHaveCSS('border-start-end-radius', '8px');
    await expect(buttons.nth(1)).toHaveCSS('border-start-start-radius', '8px');
    await expect(buttons.nth(1)).toHaveCSS('border-start-end-radius', '0px');
  });
});
