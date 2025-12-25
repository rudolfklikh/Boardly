import { defineConfig } from 'eslint/config';
import baseConfig from '../eslint.base.config.mjs';

export default defineConfig(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      'functional/immutable-data': ['off'],
      'functional/no-loop-statements': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'no-extra-boolean-cast': ['off'],
      'functional/prefer-immutable-types': 'off'
    }
  },
  {
    files: ['./eslint-rules/**/*.ts'],
    rules: {
      'vitest/require-hook': ['off']
    }
  }
);
