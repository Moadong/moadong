import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';

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
    },
    rules: {
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
      // set-state-in-effect: 정당한 효과(로딩/구독/OAuth 콜백)와 어드민 폼
      // 시드 케이스가 섞여 있어 일괄 error 승격은 하지 않고 warn 가드레일로 유지.
      'react-hooks/set-state-in-effect': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Storybook 스토리의 render 함수 안 훅 호출은 의도된 패턴이므로 해제
    files: ['**/*.stories.{js,ts,jsx,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  configPrettier,
];

export default config;