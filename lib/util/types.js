"use strict";

const Types = {
  list: [
    'number', 'int', 'float', 'string', 'boolean', 'primitive', 'date', 'regexp', 'function', 'object',
    'number[]', 'int[]', 'float[]', 'string[]', 'boolean[]', 'primitive[]', 'date[]', 'regexp[]', 'function[]', 'object[]', 'array', 'any'
  ]
};

Types.isValid = type => Types.list.indexOf(type) > -1;
Types.number = (value) => typeof value === 'number';
Types.int = (value) => (Types.number(value) && ("" + value).indexOf('.') === -1);
Types.float = (value) => (Types.number(value) && ("" + value).indexOf('.') > -1);
Types.string = (value) => typeof value === 'string';
Types.html = (value) => typeof value === 'string';
Types.boolean = (value) => typeof value === 'boolean';
Types.primitive = (value) => (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');
Types.date = (value) => value instanceof Date;
Types.regexp = (value) => value instanceof RegExp;
Types.function = (value) => typeof value === 'function';
Types.object = (value) => typeof value === "object" && value.toString() === "[object Object]";
Types['number[]'] = (value) => Array.isArray(value) && value.every(item => typeof item === 'number');
Types['int[]'] = (value) => Array.isArray(value) && value.every(item => Types.int(item));
Types['float[]'] = (value) => Array.isArray(value) && value.every(item => Types.float(item));
Types['string[]'] = (value) => Array.isArray(value) && value.every(item => typeof item === 'string');
Types['boolean[]'] = (value) => Array.isArray(value) && value.every(item => typeof item === 'boolean');
Types['primitive[]'] = (value) => Array.isArray(value) && value.every(item => Types.primitive(item));
Types['date[]'] = (value) => Array.isArray(value) && value.every(item => item instanceof Date);
Types['regexp[]'] = (value) => Array.isArray(value) && value.every(item => item instanceof RegExp);
Types['function[]'] = (value) => Array.isArray(value) && value.every(item => typeof item === 'function');
Types['object[]'] = (value) => Array.isArray(value) && value.every(item => Types.object(item));
Types.array = (value) => Array.isArray(value);
Types.any = () => true;

Types.getTypeOf = value => {
  for (let i = 0; i < Types.list.length; i++)
    if (Types[Types.list[i]](value))
      return Types.list[i];

  return 'any';
};

module.exports = Types;