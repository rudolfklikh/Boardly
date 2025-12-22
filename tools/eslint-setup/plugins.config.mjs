import functional from 'eslint-plugin-functional';
import importXPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export const plugins = defineConfig({
  plugins: {
    prettier,
    functional,
    'import-x': importXPlugin
  }
});
