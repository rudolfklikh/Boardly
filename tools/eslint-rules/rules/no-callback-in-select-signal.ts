/**
 * Having a callback in a this.store.selectSignal expression is not allowed. Instead, a memoized selector should be passed.
 *
 * Correct Example:
 *   this.store.selectSignal(isFeatureToggleEnabled(MY_FEATURE_TOGGLE))
 *   this.store.selectSignal(isTheOrderSold)
 *
 * Wrong Example:
 *   this.store.selectSignal(() => isFeatureToggleEnabled(MY_FEATURE_TOGGLE))
 */

import { ESLintUtils } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-callback-in-store-select-signal';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `no callback in store.selectSignal`
    },
    schema: [],
    messages: {
      noCallbackInStoreSelectSignal: `no callback in store.selectSignal (go to custom workspace rule for explanation)`
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const isSelectSignal =
          (node.callee as any).property?.name === 'selectSignal' &&
          (node.callee as any).object?.property?.name === 'store';

        if (!isSelectSignal) return;

        node.arguments.forEach((arg) => {
          if (
            arg.type === 'ArrowFunctionExpression' ||
            arg.type === 'FunctionExpression'
          ) {
            context.report({
              node: arg,
              messageId: 'noCallbackInStoreSelectSignal'
            });
          }
        });
      }
    };
  }
});
