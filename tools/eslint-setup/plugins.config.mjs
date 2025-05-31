import functional from 'eslint-plugin-functional';
import importXPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export const plugins = tseslint.config({
  plugins: {
    prettier,
    functional,
    'import-x': importXPlugin
  }
});
