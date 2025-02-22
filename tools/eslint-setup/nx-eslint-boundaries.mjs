import tseslint from 'typescript-eslint';

export const nxLintBoundaries = tseslint.config({
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
