import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import functional from 'eslint-plugin-functional';

export const plugins = tseslint.config({
  plugins: {
    prettier,
    functional
  }
});
