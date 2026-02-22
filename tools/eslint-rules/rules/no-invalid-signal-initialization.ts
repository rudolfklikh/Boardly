import { ESLintUtils } from '@typescript-eslint/utils';
import { getExpressionName } from './utils';

export const RULE_NAME = 'no-invalid-signal-initialization';

const signalTypes = ['signal', 'computed', 'input'];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `check to make sure that signals are initialized properly`
    },
    schema: [],
    messages: {
      signalNotInitializedProperly: `{{ prop }} is not properly initalized - {{ func }} should be invoked`
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      TSInstantiationExpression(node) {
        const signalType = getExpressionName(node);
        if (
          signalTypes.includes(signalType) &&
          node.parent.type !== 'CallExpression'
        ) {
          context.report({
            messageId: 'signalNotInitializedProperly',
            data: {
              prop: (<any>node.parent).key.name,
              func: signalType
            },
            node: node
          });
        }
      }
    };
  }
});
