module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  overrides: [],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json', 'webpack.config.js'],
  },
  ignorePatterns: ['webpack.config.js', 'craco.config.js'],

  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'import'],
  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'styled-components',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-router-dom',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'routes/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'components/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'new/**',
            group: 'external',
            position: 'after',
          },

          {
            pattern: '@store/**',
            group: 'external',
            position: 'after',
          },

          {
            pattern: 'hooks/**',
            group: 'external',
            position: 'after',
          },

          {
            pattern: 'shared/**',
            group: 'external',
            position: 'after',
          },

          {
            pattern: 'constants/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'utils/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    indent: 'off',
    // 'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {avoidEscape: true}],
    semi: ['error', 'always'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  settings: {
    'import/parsers': {'@typescript-eslint/parser': ['.ts', '.tsx']},
    react: {
      version: 'detect',
    },
  },
};
