import baseConfig from '../../eslint.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig
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
