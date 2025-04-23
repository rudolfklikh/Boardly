import { ESLintUtils } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-nz-component-params';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `Prevents usage of nzComponentParams`
    },
    schema: [],
    messages: {
      doNotUse: `nzComponentParams is deprecated and should not be used. Use nzData instead.`
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      'Property[key.name=/^nzComponentParams$/]'(node) {
        context.report({
          node,
          messageId: 'doNotUse'
        });
      }
    };
  }
});
