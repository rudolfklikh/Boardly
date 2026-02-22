import { ESLintUtils } from '@typescript-eslint/utils';
import {
  getCalleeName,
  isIdentifier,
  isPropertyDefinition,
  usedInGetter
} from './utils';

export const RULE_NAME = 'no-signals-in-getters';

const signalTypes = ['signal', 'computed', 'input'];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Signals should not be used in getters - directly use signal or use computed`
    },
    schema: [],
    messages: {
      signalUsedInGetter: `Don't use '{{ signal }}' in getter - directly use signal or use computed`
    }
  },
  defaultOptions: [],
  create(context) {
    const signals: string[] = [];
    return {
      CallExpression(node) {
        if (
          isPropertyDefinition(node.parent) &&
          isIdentifier(node.parent.key)
        ) {
          const signalType = getCalleeName(node);
          if (signalTypes.includes(signalType)) {
            signals.push(node.parent.key.name);
          }
        }
      },
      MemberExpression(node) {
        if (
          node.object.type === 'ThisExpression' &&
          node.property.type === 'Identifier'
        ) {
          const signalName = node.property.name;
          if (signals.includes(signalName)) {
            if (usedInGetter(node)) {
              context.report({
                messageId: 'signalUsedInGetter',
                data: { signal: signalName },
                node: node
              });
              return;
            }
          }
        }
      }
    };
  }
});
