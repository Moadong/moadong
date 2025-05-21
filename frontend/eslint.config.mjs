import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import storybook from 'eslint-plugin-storybook';
import configPrettier from 'eslint-config-prettier';

const config = [
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'public/**',
      'jest.config.js',
      'jest.setup.ts',
      'netlify.toml',
    ],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      storybook,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  configPrettier,
];

export default config;
