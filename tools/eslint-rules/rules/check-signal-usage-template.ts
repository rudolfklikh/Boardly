import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import {
  getCalleeName,
  getTemplate,
  isIdentifier,
  isPropertyDefinition
} from './utils';

export const RULE_NAME = 'check-signal-usage-template';

const signalTypes = ['signal', 'computed', 'input'];

interface Signal {
  readonly name: string;
  readonly type: string;
  readonly node: TSESTree.Node;
}

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `check to make sure that the signal is used correctly in templates`
    },
    schema: [],
    messages: {
      signalNotInvokedTemplate: `signal '{{ signal }}' missing () in component template`
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
        signals.forEach(({ name: signal, node: signalNode }) => {
          const matches: string[] = [];

          matches.push(...extractSignalBindings(signal, template));
          matches.push(...extractSignalInterpolations(signal, template));
          matches.push(...extractControlFlowMatches(signal, template));

          if (matches.length > 0) {
            const signalRe = new RegExp(
              `(?<!\\.)${signal}(?!\\.(set|update))(?!(:|\\(.*\\)))(?=([^\\w]|$))`,
              'gm'
            );
            matches.forEach((match) => {
              if (signalRe.test(match)) {
                context.report({
                  messageId: 'signalNotInvokedTemplate',
                  data: { signal },
                  node: signalNode
                });
              }
            });
          }
        });
      }
    };
  }
});

function extractControlFlowMatches(signal: string, template: string): string[] {
  const matches: string[] = [];

  const templateControlFlowRegex = new RegExp(
    `@((else )?if|for|switch|case)\\s*\\((.*${signal}.*)\\)`,
    'gm'
  );
  const templateControlFlowMatches = template.matchAll(
    templateControlFlowRegex
  );
  for (const match of templateControlFlowMatches) {
    matches.push(match[3]);
  }

  return matches;
}

function extractSignalInterpolations(
  signal: string,
  template: string
): string[] {
  const matches: string[] = [];

  const interpolationRegex = new RegExp(`{{\\s*(.*${signal}.*)\\s*}}`, 'gm');
  const interpolationMatches = template.matchAll(interpolationRegex);
  for (const match of interpolationMatches) {
    matches.push(match[1]);
  }

  return matches;
}

function extractSignalBindings(signal: string, template: string): string[] {
  const matches: string[] = [];
  const bindingRegex = new RegExp(
    `(\\*ng\\w+|\\[\\w+\\])="(.*${signal}[^"\\\\]*(\\\\.[^"\\\\]*)*)"`,
    'gm'
  );
  const bindingMatches = template.matchAll(bindingRegex);
  for (const match of bindingMatches) {
    matches.push(match[2]);
  }
  return matches;
}
