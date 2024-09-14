import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**'],
  },
  {
    rules: {
      'no-use-before-define': 'error',
      '@typescript-eslint/no-use-before-define': ['error', { 'classes': false, 'enums': false }],
      '@typescript-eslint/no-unused-vars': ['error', { 'caughtErrors': 'none' }],
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
