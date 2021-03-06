/**
 * Traverses an AST node, calling a callback for each node in the hierarchy in
 * source order.
 *
 * @param {Object} node
 * @param {function(Object, function(Object), boolean): ?boolean} callback
 */
export default function traverse(node, callback) {
  var descended = false;

  function descend(node) {
    descended = true;

    childPropertyNames(node).forEach(property => {
      const value = node[property];
      if (Array.isArray(value)) {
        value.forEach(child => {
          child.parent = node;
          traverse(child, callback);
        });
      } else if (value) {
        value.parent = node;
        traverse(value, callback);
      }
    });
  }

  const shouldDescend = callback(
    node,
    descend,
    childPropertyNames(node).length === 0
  );

  if (!descended && shouldDescend !== false) {
    descend(node);
  }
}

/**
 * Traverses an AST node, calling a callback for each node in the hierarchy
 * depth-first in source order.
 *
 * @param {Object} node
 * @param {function(Object, boolean): ?boolean} callback
 */
export function depthFirstTraverse(node, callback) {
  traverse(node, (node, descend, isLeaf) => {
    if (isLeaf) {
      return callback(node, isLeaf);
    } else {
      descend(node);
      return callback(node, isLeaf);
    }
  });
}

/**
 * @param {Object} node
 * @returns {string[]}
 */
function childPropertyNames(node) {
  const names = ORDER[node.type];

  if (!names) {
    throw new Error('cannot traverse unknown node type: ' + node.type);
  }

  return names;
}

const ORDER = {
  Program: ['body'],
  ArrayInitialiser: ['members'],
  AssignOp: ['assignee', 'expression'],
  Block: ['statements'],
  Bool: [],
  BoundFunction: ['parameters', 'body'],
  ConcatOp: ['left', 'right'],
  Conditional: ['condition', 'consequent', 'alternate'],
  DynamicMemberAccessOp: ['expression', 'indexingExpr'],
  ForIn: ['keyAssignee', 'valAssignee', 'target', 'step', 'filter', 'body'],
  ForOf: ['keyAssignee', 'valAssignee', 'target', 'filter', 'body'],
  Function: ['parameters', 'body'],
  FunctionApplication: ['function', 'arguments'],
  Identifier: [],
  Int: [],
  LogicalAndOp: ['left', 'right'],
  LogicalNotOp: ['expression'],
  LogicalOrOp: ['left', 'right'],
  MemberAccessOp: ['expression'],
  NewOp: ['ctor', 'arguments'],
  ObjectInitialiser: ['members'],
  ObjectInitialiserMember: ['key', 'expression'],
  PlusOp: ['left', 'right'],
  ProtoMemberAccessOp: ['expression'],
  Return: ['expression'],
  SeqOp: ['left', 'right'],
  String: [],
  SubtractOp: ['left', 'right'],
  This: [],
  While: ['condition', 'body']
};
