import { ESLintUtils } from '@typescript-eslint/utils';
import {
  isIdentifier,
  isPropertyDefinition,
  usedInGetter,
  usedInNzComponentParams
} from './utils';

export const RULE_NAME = 'check-signal-usage';

const signalTypes = ['signal', 'computed', 'input'];
const signalMethods = ['set', 'update'];
const defaultOptions = {
  ignoreNzComponentParams: false
};

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `check to make sure that the signal is used correctly`
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreNzComponentParams: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      signalNotInvoked: `signal '{{ signal }}' missing ()`
    }
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const signals: string[] = [];
    const ignoreNzComponentParams = (context.options[0] || defaultOptions)
      .ignoreNzComponentParams;
    return {
      CallExpression(node) {
        if (
          isPropertyDefinition(node.parent) &&
          isIdentifier(node.parent.key)
        ) {
          const signalType = isIdentifier(node.callee)
            ? node.callee.name
            : 'unknown node type';
          if (signalTypes.includes(signalType)) {
            signals.push(node.parent.key.name);
          }
        }
      },
      // eslint-disable-next-line complexity
      MemberExpression(node) {
        if (
          node.object.type === 'ThisExpression' &&
          node.property.type === 'Identifier'
        ) {
          const signalName = node.property.name;
          if (
            signals.includes(signalName) &&
            node.parent.type !== 'CallExpression' &&
            !(
              node.parent.type == 'MemberExpression' &&
              signalMethods.includes((<any>node.parent.property).name)
            )
          ) {
            if (usedInGetter(node)) {
              // If the signal is used in a getter, we don't want to report it
              // Separate rule for this
              return;
            }
            if (ignoreNzComponentParams && usedInNzComponentParams(node)) {
              // If the signal is used in nzComponentParams, we don't want to report it
              return;
            }
            context.report({
              messageId: 'signalNotInvoked',
              data: { signal: signalName },
              node: node
            });
          }
        }
      }
    };
  }
});
