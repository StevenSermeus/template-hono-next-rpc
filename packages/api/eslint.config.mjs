import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/volumes/',
      '**/cli/',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.config.mjs',
      '**/*.config.cjs',
      '**/*-lock.json',
      '**/*-lock.yaml',
      '**/*.lock',
      '**/.env',
      '**/.env.*',
      '**/.env-*',
      '!**/**.example',
    ],
  },
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  {
    plugins: {},

    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: true,
        },
      ],
    },
  },
];
