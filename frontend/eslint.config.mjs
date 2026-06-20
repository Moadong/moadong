import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import localRules from './scripts/eslint-rules/index.js';

const config = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'public/**',
      'storybook-static/**',
      'jest.config.js',
      'jest.setup.ts',
      'netlify.toml',
    ],
  },
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
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
      'react-hooks': reactHooks,
      storybook,
      local: localRules,
    },
    rules: {
      'local/no-hardcoded-event-name': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // React Compiler 도입 가드레일 (Rules of React 위반 상시 감지)
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/set-state-in-effect': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.stories.{js,ts,jsx,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  configPrettier,
];

export default config;
