import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-viewport',
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@': path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          '../src',
        ),
      };
    }
    return config;
  },
};

export default config;
