import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [],

  addons: [
    '@storybook/addon-docs',
    '@nx/react/plugins/storybook',
    '@storybook/addon-webpack5-compiler-babel',
    '@fluentui-contrib/storybook-addon-fluent-inspector',
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
