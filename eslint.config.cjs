const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const tsRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended.js');
const prettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: ['build/**', 'node_modules/**', '_redirects'],
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...tsRecommended.rules,
      ...prettier.rules,
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'prettier/prettier': ['error'],
    },
  },
];
