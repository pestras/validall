"use strict";

/**
 * Compares two objects field by field
 * @param {any} src The source object.
 * @param {any} target The object to compare with.
 * @param {Boolean} [deep] Make a deep comparision '_optional_'.
 * @return {Boolean}
 */
function equals(src, target, deep) {
  if (src instanceof Array && target instanceof Array) {
    if (src.length !== target.length)
      return false;

    for (let i = 0; i < src.length; i++) {
      let pass = false;

      for (let j = 0; j < target.length; j++) {

        if ((deep && equals(src[i], target[j])) || (!deep && src[i] === target[j])) {

          if (equals(src[i], target[j])) {
            pass = true;
            break;
          }
        }
      }

      if (!pass)
        return false;
    }

    return true;

  } else if (src instanceof Date && target instanceof Date) {
    return src.toDateString() === target.toDateString();
  } else if (src instanceof RegExp && target instanceof RegExp) {
    return src.toString() === target.toString();
  } else if (src instanceof Object && target instanceof Object) {

    if (Object.keys(src).length !== Object.keys(target).length)
      return false;

    for (let prop1 in src) {

      if (src.hasOwnProperty(prop1)) {
        let pass = false;

        for (let prop2 in target) {

          if (target.hasOwnProperty(prop1)) {

            if ((deep && equals(src[prop1], target[prop2])) || (!deep && src[prop1] === target[prop2])) {
              pass = true;
              break;
            }
          }
        }

        if (!pass)
          return false;
      }
    }

    return true;

  } else {
    return src === target;
  }
}

module.exports = equals;