import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.mjs';
import { FDS_BOUNDARIES_RULES } from '../../tools/utils/fds-design-boundaries.mjs';

export default tseslint.config(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()]
    },
    rules: {
      'import-x/no-restricted-paths': [
        'error',
        {
          basePath: './src',
          zones: FDS_BOUNDARIES_RULES
        }
      ],
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
