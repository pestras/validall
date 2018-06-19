"use strict";

const schemas = require('../schemas');

const Primitives = [Boolean, Number, String, Date, RegExp, Function, Object, Array];
const NonPrimitives = [Date, RegExp, Function, Object, Array];

const Map = {
  list: [Number, Boolean, String, Date, RegExp, Object, Array, Function],
  values: ['number', 'boolean', 'string', 'date', 'regexp', 'object', 'array', 'function']
};

const Types = {
  list: [
    'number', 'int', 'float', 'string', 'boolean', 'primitive', 'date', 'regexp', 'function', 'object',
    'number[]', 'int[]', 'float[]', 'string[]', 'boolean[]', 'primitive[]', 'date[]', 'regexp[]', 'function[]', 'object[]', 'array', 'any'
  ]
};

Types.isValid = type => {

  let match = Types.list.indexOf(type) > -1;

  if (!match) {
    let arrayType = type.indexOf('[]') > -1;
    type = arrayType ? type.slice(0, type.length - 2) : type;
    if (schemas.hasOwnProperty(type.toLowerCase()))
      return true;
  }

  return match;
}

Types.number = (value) => typeof value === 'number';
Types.int = (value) => (Types.number(value) && ("" + value).indexOf('.') === -1);
Types.float = (value) => (Types.number(value) && ("" + value).indexOf('.') > -1);
Types.string = (value) => typeof value === 'string';
Types.boolean = (value) => typeof value === 'boolean';
Types.primitive = (value) => (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');
Types.date = (value) => value instanceof Date;
Types.regexp = (value) => value instanceof RegExp;
Types.function = (value) => typeof value === 'function';
Types.object = (value) => value && typeof value === "object" && value.toString() === "[object Object]";
Types.array = (value) => Array.isArray(value);
Types['number[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => typeof item === 'number'));
Types['int[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => Types.int(item)));
Types['float[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => Types.float(item)));
Types['string[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => typeof item === 'string'));
Types['boolean[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => typeof item === 'boolean'));
Types['primitive[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => Types.primitive(item)));
Types['date[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => item instanceof Date));
Types['regexp[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => item instanceof RegExp));
Types['function[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => typeof item === 'function'));
Types['object[]'] = (value) => Array.isArray(value) && (value.length === 0 || value.every(item => Types.object(item)));
Types.any = (value) => true;

Types.instanceof = (value, Constructor) => {
  if (!value || !Constructor)
    return false;

  if (NonPrimitives.indexOf(Constructor) > - 1) {
    let name = Constructor.name;
    let valType = Types.getTypeOf(value);
    if (!name)
      return false;

    name = name.toLowerCase();

    if (valType.indexOf('[]') > -1 && name === 'array')
      return true;

    return valType === name;
  }

  return value.constructor === Constructor;
}

Types.getTypeOf = value => {
  for (let i = 0; i < Types.list.length; i++)
    if (Types[Types.list[i]](value))
      return Types.list[i];

  return 'any';
};

Types.getTypesOf = value => {
  let types = [];
  for (let i = 0; i < Types.list.length; i++)
    if (Types[Types.list[i]](value))
      types.push(Types.list[i]);

  types.push(...Types.searchReverseMap(types));

  if (types.indexOf("object") > -1) {
    types.push(value.constructor);
    types.push(value.constructor.name);
  }

  if (Array.isArray(value) && Types.object(value[0]))
    types.push(value[0].constructor.name + '[]');


  return types;
}

Types.searchMap = value => {
  if (typeof value === "function") {
    let index = Map.list.indexOf(value);

    if (index > -1)
      return Map.values[index];
  } else if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'function') {
    let index = Map.list.indexOf(value[0]);

    if (index > -1)
      return Map.values[index] + '[]';
  }

  return null;
}

Types.searchReverseMap = values => {
  let result = [];
  for (let value of values) {
    let index = Map.values.indexOf(value);
    if (index > -1)
      result.push(Map.list[index]);
  }

  return result;
}

module.exports = Types;