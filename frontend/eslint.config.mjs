import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
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
      'react-hooks': reactHooks,
      local: localRules,
    },
    rules: {
      'local/no-hardcoded-event-name': 'error',
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // React Compiler 도입 가드레일 (Rules of React 위반 상시 감지)
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/set-state-in-effect': 'warn',
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
