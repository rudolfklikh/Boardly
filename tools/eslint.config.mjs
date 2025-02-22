import baseConfig from '../eslint.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(...baseConfig, {
  files: ['**/*.ts'],
  rules: {
    'functional/immutable-data': ['off'],
    'functional/no-loop-statements': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-extra-boolean-cast': ['off'],
    'functional/prefer-immutable-types': 'off'
  }
});
