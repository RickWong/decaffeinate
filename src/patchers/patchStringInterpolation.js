/**
 * Replaces string interpolation with template strings.
 *
 * @example
 *
 *   "a#{b}c"  ->  `a${b}c`
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
export default function patchStringInterpolation(node, patcher) {
  if (node.type === 'ConcatOp') {
    if (node.parent.type !== 'ConcatOp') {
      patcher.replace(node.range[0], node.range[0] + 1, '`');
      patcher.replace(node.range[1] - 1, node.range[1], '`');
    }
    patchInterpolation(node.left, patcher);
    patchInterpolation(node.right, patcher);
  }
}

/**
 * Patches the interpolation surrounding a node, if it is an interpolated value.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @private
 */
function patchInterpolation(node, patcher) {
  switch (node.type) {
    case 'String':
    case 'ConcatOp':
      return;
  }

  const interpolationStart = findInterpolationStart(node, patcher.original);

  if (interpolationStart < 0) {
    throw new Error(
      'unable to find interpolation start, i.e. "#{", before ' + node.type +
      ' at line ' + node.line + ', column ' + node.column
    );
  }

  patcher.replace(interpolationStart, interpolationStart + 1, '$');
}

/**
 * Find the start of the interpolation that contains an expression.
 *
 * @param {Object} expression
 * @param {string} source
 * @returns {number}
 * @private
 */
function findInterpolationStart(expression, source) {
  var index = expression.range[0] - 2;

  while (index >= 0) {
    if (source.slice(index, index + '#{'.length) === '#{') {
      break;
    }

    index--;
  }

  return index;
}
