import sourceBetween from './sourceBetween';

/**
 * Replace part of the text between the given nodes with a new string.
 *
 * @param {MagicString} patcher
 * @param {Object} left
 * @param {Object} right
 * @param {string} search
 * @param {string} replacement
 */
export default function replaceBetween(patcher, left, right, search, replacement) {
  const between = sourceBetween(patcher.original, left, right);
  const offset = between.indexOf(search);

  if (offset < 0) {
    return;
  }

  patcher.replace(left.range[1] + offset, left.range[1] + offset + search.length, replacement);
}