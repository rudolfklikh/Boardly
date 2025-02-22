/**
 * creating new signals inside of a reactive context (i.e. computed(), effect(), etc.) causes
 * those signals to be scoped to that context, and since that context is reactive it the signals
 * created in that context will destroy themselves after the run and will not be reactive to
 * changes in the signal's source.
 *
 * When using store.selectSignal() scoped to the context of computed() or effect(), the code will
 * run once, but then the signal will destroy itself.  This signal being destroyed will no longer
 * react to changes as expected resulting in unexpected behavior that is hard to debug.
 *
 * to fix this, declare the signal outside of that context.
 *
 * example:
 * // this works correctly and will continue to be reactive if getNotesCount is updated later
 * // since the scope of the signal is outside of the reactive computed context
 * private readonly notesCount = this.store.selectSignal(getNotesCount);
 *
 * public readonly hasNotes = computed(() => !!this.notesCount());
 *
 * // this will not work correctly since the scope of the signal is inside of the reactive
 * // computed context
 * public readonly hasNotes = computed(() => !!this.store.selectSignal(getNotesCount)());
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-reactive-select-signal';

export const rule = ESLintUtils.RuleCreator((name) => `${name}`)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `no selectSignal in a reactive context`
    },
    schema: [],
    messages: {
      noReactiveSelectSignal:
        'no selectSignal in a reactive context (go to custom workspace rule for explanation)'
    }
  },
  defaultOptions: [],
  create: (context) => ({
    CallExpression: (node) => {
      const isSelectSignal =
        (node.callee as TSESTree.MetaProperty).property?.name ===
        'selectSignal';

      if (!isSelectSignal) return;

      const reactiveContextNames = ['computed', 'effect'];
      let parent: any = node.parent;
      while (!!parent) {
        if (reactiveContextNames.includes(parent.callee?.name)) {
          context.report({ node, messageId: 'noReactiveSelectSignal' });
          break;
        }
        parent = parent.parent;
      }
    }
  })
});
