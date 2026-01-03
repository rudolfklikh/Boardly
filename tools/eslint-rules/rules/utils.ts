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

function readTemplateFile(
  fileName: string,
  componentFileName: string
): string | null {
  const filePath = path.join(path.dirname(componentFileName), fileName);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
}

function findPropertyValue(
  properties: TSESTree.Property[],
  name: string
): TSESTree.Literal | null {
  const prop = properties.find(
    (p) => isIdentifier(p.key) && p.key.name === name
  );
  return prop && isLiteral(prop.value) ? prop.value : null;
}

export function getTemplate(
  node: TSESTree.CallExpression,
  componentFileName: string
): string | null {
  const [firstArg] = node.arguments;
  if (!firstArg || !isObjectExpression(firstArg)) {
    return null;
  }
  const properties = firstArg.properties.filter(isProperty);

  const templateLiteral = findPropertyValue(properties, 'template');
  if (templateLiteral) {
    return templateLiteral.value as string;
  }

  const templateUrlLiteral = findPropertyValue(properties, 'templateUrl');
  if (templateUrlLiteral) {
    return readTemplateFile(
      templateUrlLiteral.value as string,
      componentFileName
    );
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
