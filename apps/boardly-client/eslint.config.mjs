import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.mjs';

export default tseslint.config(
  ...baseConfig,

  {
    files: ['**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'off',
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
  }
  // TODO decide which rules use
  // {
  // files: ['**/*.ts'],
  // rules: {

  //   '@angular-eslint/directive-selector': [
  //     'error',
  //     {
  //       type: 'attribute',
  //       prefix: 'sell',
  //       style: 'camelCase'
  //     }
  //   ],
  //   '@angular-eslint/component-selector': [
  //     'error',
  //     {
  //       type: 'element',
  //       prefix: 'app',
  //       style: 'kebab-case'
  //     }
  //   ]
  // }
  // }
);
