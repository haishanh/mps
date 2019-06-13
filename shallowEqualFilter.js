const hasOwn = Object.prototype.hasOwnProperty;

const is = (x, y) => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  }
  // eslint-disable-next-line no-self-compare
  return x !== x && y !== y;
};

/**
 * filter out props which are not changed
 */
export default function filter(next, prev) {
  const collect = {};
  if (is(next, prev)) return collect;

  if (typeof next !== 'object') {
    return collect;
  } else if (typeof prev !== 'object') {
    return next;
  }

  const keys = Object.keys(next);

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (
      // `next` has this key but `prev` does not
      !hasOwn.call(prev, k) ||
      // value or referential difference
      !is(next[k], prev[k])
    ) {
      // console.log('prop %s changed from %s to %s', k, prev[k], next[k]);
      collect[k] = next[k];
    }
  }
  return collect;
}
