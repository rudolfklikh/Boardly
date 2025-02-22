import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import angular from 'angular-eslint';

export const angularESLintTemplate = tseslint.config({
  files: ['**/*.html'],
  extends: [...angular.configs.templateAll],
  rules: {
    '@angular-eslint/template/i18n': 'off'
  }
});

export const angularESLint = tseslint.config({
  files: ['**/*.ts'],
  extends: [...angular.configs.tsRecommended, ...tseslint.configs.recommended],
  languageOptions: {
    parser: typescriptParser,
    globals: {
      ...globals.browser,
      ...globals.es2022
    },
    parserOptions: { project: '**/tsconfig.*?.json' }
  },
  processor: angular.processInlineTemplates,
  rules: {
    complexity: ['error', { max: 6 }],
    'functional/no-let': ['error', { allowInFunctions: true }],
    'functional/prefer-property-signatures': 'error',
    'functional/prefer-immutable-types': [
      'error',
      {
        enforcement: 'None',
        ignoreInferredTypes: true,
        parameters: {
          enforcement: 'ReadonlyDeep'
        },
        ignoreNamePattern: ['_', '#']
      }
    ],
    'functional/immutable-data': [
      'error',
      {
        ignoreAccessorPattern: ['**._*', '**.#*']
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      { accessibility: 'explicit' }
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        vars: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        ignoreClassWithStaticInitBlock: true
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['property', 'parameterProperty', 'accessor'],
        modifiers: ['private'],
        prefix: ['#'],
        format: null
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase']
      },
      {
        selector: 'typeLike',
        format: ['PascalCase']
      }
    ],
    'no-unused-private-class-members': 'error',
    'no-constant-binary-expression': 'warn',
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-empty-object-type': 'warn',
    'functional/no-mixed-types': 'error',
    'functional/no-loop-statements': 'error',
    'no-param-reassign': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    '@angular-eslint/no-lifecycle-call': 'error',
    '@angular-eslint/no-pipe-impure': 'error',
    '@angular-eslint/prefer-output-readonly': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'id-blacklist': 'off',
    'id-match': 'off',
    'no-underscore-dangle': 'off',
    'no-extra-semi': 'off',
    '@nx/workspace-no-reactive-select-signal': 'error',
    '@nx/workspace-forbid-on-destroy': 'error'
  }
});

export const declarationsESLint = tseslint.config({
  files: ['**/*.d.ts'],
  extends: [...angular.configs.tsRecommended, ...tseslint.configs.recommended],
  languageOptions: {
    parser: typescriptParser,
    globals: {
      ...globals.browser,
      ...globals.es2022
    },
    parserOptions: { project: '**/tsconfig.*?.json' }
  },
  processor: angular.processInlineTemplates,
  rules: {
    '@typescript-eslint/no-unused-vars': 'off'
  }
});
