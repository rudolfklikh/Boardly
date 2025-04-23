import { ASTUtils, TSESTree } from '@typescript-eslint/utils';
import path from 'path';
import fs from 'fs';

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === 'Identifier';
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === 'Literal';
}

export function isMemberExpression(
  node: TSESTree.Node
): node is TSESTree.MemberExpression {
  return node.type === 'MemberExpression';
}

export function isProperty(node: TSESTree.Node): node is TSESTree.Property {
  return node.type === 'Property';
}

export function isPropertyDefinition(
  node: TSESTree.Node
): node is TSESTree.PropertyDefinition {
  return node.type === 'PropertyDefinition';
}

export function isObjectExpression(
  node: TSESTree.Node
): node is TSESTree.ObjectExpression {
  return node.type === 'ObjectExpression';
}

export function usedInGetter(node: TSESTree.MemberExpression): boolean {
  let current: TSESTree.Node | undefined = node.parent;
  while (current) {
    if (
      ASTUtils.isNodeOfTypeWithConditions(
        TSESTree.AST_NODE_TYPES.MethodDefinition,
        { kind: 'get' }
      )(current)
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

// TODO: evaluate if we want to add this check back and allow signals in nzComponentParams
export function usedInNzComponentParams(
  node: TSESTree.MemberExpression
): boolean {
  if (
    isProperty(node.parent) &&
    isObjectExpression(node.parent.parent) &&
    isProperty(node.parent.parent.parent)
  ) {
    const property = node.parent.parent.parent;
    if (
      isIdentifier(property.key) &&
      property.key.name === 'nzComponentParams'
    ) {
      return true;
    }
  }

  return false;
}

// eslint-disable-next-line complexity
export function getTemplate(
  node: TSESTree.CallExpression,
  componentFileName: string
): string | null {
  if (node.arguments.length !== 1 || !isObjectExpression(node.arguments[0])) {
    return null;
  }
  const arg = node.arguments[0];
  const properties = arg.properties.filter(isProperty);
  const templateProp = properties.find(
    (property) => isIdentifier(property.key) && property.key.name === 'template'
  );
  if (templateProp && isLiteral(templateProp.value)) {
    return templateProp.value.value as string;
  }
  const templateUrlProp = properties.find(
    (property) =>
      isIdentifier(property.key) && property.key.name === 'templateUrl'
  );
  if (templateUrlProp && isLiteral(templateUrlProp.value)) {
    const fileName = templateUrlProp.value.value as string;
    const filePath = path.join(path.dirname(componentFileName), fileName);

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return fileContent;
    }
  }
  return null;
}

export function getCalleeName(node: TSESTree.CallExpression): string {
  return isIdentifier(node.callee) ? node.callee.name : 'unknown node type';
}

export function getExpressionName(
  node: TSESTree.TSInstantiationExpression
): string {
  return isIdentifier(node.expression)
    ? node.expression.name
    : isMemberExpression(node.expression) &&
        isIdentifier(node.expression.object)
      ? node.expression.object.name
      : '';
}
