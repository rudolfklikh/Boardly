import { defineConfig } from 'eslint/config';

export const nxLintBoundaries = defineConfig({
  files: ['**/*.ts', '**/*.js'],
  rules: {
    '@nx/enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
        depConstraints: [
          {
            sourceTag: '*',
            onlyDependOnLibsWithTags: ['*']
          }
        ]
      }
    ]
  }
});
