import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import {
  getCalleeName,
  getTemplate,
  isIdentifier,
  isPropertyDefinition
} from './utils';

export const RULE_NAME = 'no-signal-funcs-in-template';

const signalTypes = ['signal', 'computed', 'input'];

interface Signal {
  readonly name: string;
  readonly type: string;
  readonly node: TSESTree.Node;
}

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Don't use signal functions in template`
    },
    schema: [],
    messages: {
      signalFuncUsedInTemplate: `Don't use '{{ func }}' on '{{ signal }}' in template`
    }
  },
  defaultOptions: [],
  create(context) {
    const signals: Signal[] = [];
    let componentCallExpression: TSESTree.CallExpression | null = null;
    return {
      CallExpression(node) {
        if (isIdentifier(node.callee) && node.callee.name === 'Component') {
          componentCallExpression = node;
          return;
        }

        if (
          isPropertyDefinition(node.parent) &&
          isIdentifier(node.parent.key)
        ) {
          const signalType = getCalleeName(node);
          if (signalTypes.includes(signalType)) {
            signals.push({
              name: node.parent.key.name,
              type: signalType,
              node: node.parent
            });
          }
        }
      },
      'Program:exit'() {
        if (componentCallExpression === null || signals.length === 0) {
          return;
        }

        const template = getTemplate(componentCallExpression, context.filename);

        if (template === null) {
          return;
        }
        for (const { name: signal, node: signalNode } of signals) {
          const signalFuncRegex = new RegExp(
            `[^-\\.[\\w]${signal}\\.(set|update)\\([^\\)]*\\)`
          );
          const funcMatches = signalFuncRegex.exec(template);
          if (funcMatches) {
            context.report({
              messageId: 'signalFuncUsedInTemplate',
              data: { signal, func: funcMatches[1] },
              node: signalNode
            });
          }
        }
      }
    };
  }
});
