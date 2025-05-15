import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import storybook from 'eslint-plugin-storybook';
import pluginPrettier from 'eslint-plugin-prettier';

const config = {
  ignores: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'build/**',
    'public/**',
    '.eslintrc.js',
    'jest.config.js',
    'jest.setup.ts',
    'netlify.toml',
    'tsconfig.json',
  ],
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      React: 'writable',
    },
  },
  plugins: {
    '@typescript-eslint': typescript,
    react,
    storybook,
    prettier: pluginPrettier,
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-console': 'warn',

    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',

    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

export default config;
