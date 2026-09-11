import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-webpack5';

const fluentInspectorPreset = fileURLToPath(
  new URL('./fluent-inspector-preset.ts', import.meta.url)
);

const config: StorybookConfig = {
  stories: [],

  addons: [
    '@storybook/addon-docs',
    '@nx/react/plugins/storybook',
    '@storybook/addon-webpack5-compiler-babel',
    fluentInspectorPreset,
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
