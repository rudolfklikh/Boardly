import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';
import {
  plugins,
  angularESLintTemplate,
  angularESLint,
  vitestESLint,
  storyBookESLint,
  nxLintBoundaries,
  declarationsESLint
} from './tools/eslint-setup/index.mjs';

export default tseslint.config(
  nx.configs['flat/base'],
  nx.configs['flat/typescript'],
  nx.configs['flat/javascript'],
  nx.configs['flat/angular'],
  plugins,
  angularESLint,
  angularESLintTemplate,
  declarationsESLint,
  vitestESLint,
  storyBookESLint,
  nxLintBoundaries,
  {
    ignores: ['**/dist', 'node_modules/', '**/.nx', '**/.angular']
  }
);
