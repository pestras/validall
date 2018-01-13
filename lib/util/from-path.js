"use strict";

/**
 * Get or set value from a path to an object property and returns the source object
 * @param {any} src The source object
 * @param {string} path the path to the property
 * @param {any} [value] the new value '_optional_'
 * @param {boolean} [inject] Add the value to the object and create the path even if it is not fully exists '_optional_'
 * @return {any}
 */
function fromPath(src, path, value, inject) {
  path = path.split('.');

  if (path.length === 1) {

    if (!value)
      src[path[0]];
    else if (inject)
      src[path[0]] = value;
    else if (src.hasOwnProperty(path[0]))
      src[path[0]] = value;

    return src;
  }

  let temp = src;

  for (let j = 0; j < path.length; j++) {

    if (temp[path[j]]) {
      temp = temp[path[j]];

      if (j === path.length - 2 && value) {
        if (inject || src.hasOwnProperty(path[j + 1]))
          temp[path[j + 1]] = value;

        return src;
      }

      if (j === path.length - 1)
        return src;

    } else if (inject) {
      temp[path[j--]] = {};
    } else {
      return src;
    }
  }

  return src;
}

module.exports = fromPath;