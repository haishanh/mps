'use strict';

/*
 * based on
 * https://github.com/Tencent/westore/blob/master/packages/westore/utils/diff.js
 * MIT License
 *
 */

const ARRAYTYPE = 'array';
const OBJECTTYPE = 'object';
const FUNCTIONTYPE = 'function';

module.exports = function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, '', result);
  return result;
};

function syncKeys(current, pre) {
  if (current === pre) return;
  const rootCurrentType = type(current);
  const rootPreType = type(pre);
  if (rootCurrentType === OBJECTTYPE && rootPreType === OBJECTTYPE) {
    if (Object.keys(current).length >= Object.keys(pre).length) {
      for (let key in pre) {
        const currentValue = current[key];
        if (currentValue === undefined) {
          current[key] = null;
        } else {
          syncKeys(currentValue, pre[key]);
        }
      }
    }
  } else if (rootCurrentType === ARRAYTYPE && rootPreType === ARRAYTYPE) {
    if (current.length >= pre.length) {
      for (let i = 0; i < pre.length; i++) {
        syncKeys(current[i], pre[i]);
      }
    }
  }
}

function _diff(current, pre, path, result) {
  if (current === pre) return;
  const rootCurrentType = type(current);
  const rootPreType = type(pre);
  if (rootCurrentType === OBJECTTYPE) {
    if (
      rootPreType !== OBJECTTYPE ||
      Object.keys(current).length < Object.keys(pre).length
    ) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = current[key];
        const preValue = pre[key];
        const currentType = type(currentValue);
        const preType = type(preValue);
        if (currentType !== ARRAYTYPE && currentType !== OBJECTTYPE) {
          if (currentValue !== pre[key]) {
            setResult(
              result,
              (path == '' ? '' : path + '.') + key,
              currentValue
            );
          }
        } else if (currentType === ARRAYTYPE) {
          if (preType !== ARRAYTYPE) {
            setResult(
              result,
              (path == '' ? '' : path + '.') + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == '' ? '' : path + '.') + key,
                currentValue
              );
            } else {
              for (let i = 0; i < currentValue.length; i++) {
                _diff(
                  currentValue[i],
                  preValue[i],
                  (path == '' ? '' : path + '.') + key + '[' + i + ']',
                  result
                );
              }
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (
            preType != OBJECTTYPE ||
            Object.keys(currentValue).length < Object.keys(preValue).length
          ) {
            setResult(
              result,
              (path == '' ? '' : path + '.') + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == '' ? '' : path + '.') + key + '.' + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        for (let i = 0; i < current.length; i++) {
          _diff(current[i], pre[i], path + '[' + i + ']', result);
        }
      }
    }
  } else {
    setResult(result, path, current);
  }
}

function setResult(result, k, v) {
  if (type(v) != FUNCTIONTYPE) {
    result[k] = v;
  }
}

function type(x) {
  if (x === null) {
    return 'null';
  } else if (Array.isArray(x)) {
    return 'array';
  }
  return typeof x;
}
