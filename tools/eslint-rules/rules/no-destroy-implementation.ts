import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'forbid-on-destroy';

export const rule = ESLintUtils.RuleCreator((name) => `${name}`)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: ''
    },
    schema: [],
    messages: {
      onDestroy: 'OnDestroy lifecycle hook is not allowed',
      ngOnDestroy: 'Not allowed to implement ngOnDestroy'
    }
  },
  defaultOptions: [],
  create: (context) => ({
    ClassDeclaration: (node: TSESTree.ClassDeclaration) => {
      const onDestroyInterface = node.implements.find(
        (i) => (i.expression as TSESTree.Identifier).name === 'OnDestroy'
      );
      if (onDestroyInterface) {
        context.report({
          node: onDestroyInterface.parent,
          messageId: 'onDestroy',
          loc: onDestroyInterface.loc
        });

        const ngOnDestroy = node.body.body.find((i) => {
          return (
            i.type === 'MethodDefinition' &&
            (i.key as TSESTree.Identifier).name === 'ngOnDestroy'
          );
        });
        if (ngOnDestroy) {
          context.report({
            node: ngOnDestroy,
            messageId: 'ngOnDestroy',
            loc: ngOnDestroy.loc
          });
        }
      }
    }
  })
});
