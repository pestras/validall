"use strict";

const Types = require('./types');

/**
 * Cast a value to a specific type
 * @param {any} value 
 * @param {string} type 
 */
function cast(value, type) {
  let valueType = Types.getTypeOf(value);

  if (type === 'boolean')
    return !!value;

  if (type === 'number') {
    if (Types.primitive(value)) {
      let value = +value;
      if (value === NaN)
        throw `can't cast "NaN" value to "number"`;

      return value;
    } else {
      throw `can't cast "${valueType}: ${value}" value to "number"`;
    }
  }

  if (type === 'string') {
    if (Types.primitive(value) || Types.date(value) || Types.regexp(value) || Types.function(value))
      return "" + value;
    else if (Types.object(value) || Types.array(value))
      return JSON.stringify(value);
  }

  if (type === 'date') {
    if (Types.number(value) || Types.string(value)) {
      let date = new Date(value);
      if (date.toString() === "Invalid Date")
        throw "Invalid Date";
      
      return date;
    }

    throw `can't cast "${valueType}: ${value}" value to "date"`
  }

  if (type === 'regexp') {
    if (Types.primitive(value))
      return new RegExp(value);

    throw `can't cast "${valueType}: ${value}" value to "regexp"`
  }

  if (type === 'array')
    return Array.isArray(value) ? value : [value];

  throw `unsupported type ${type}`;
}

module.exports = cast;