"use strict";

let fromPath = require('./util/from-path');
const Types = require('./util/types');
const cast = require('./util/cast');
const equals = require('./util/equals');
const ValidallError = require('./validall-error');

const Operators = {
  list: [
    '$message',
    '$required',
    '$default',
    '$strict',
    '$type',
    '$cast',
    '$to',
    //  '$is',
    '$filter',
    '$equals',
    '$deepEquals',
    '$regex',
    '$gt',
    '$gte',
    '$lt',
    '$lte',
    '$inRange',
    '$length',
    '$size',
    '$in',
    '$all',
    '$keys',
    '$on',
    '$before',
    '$after',
    '$not',
    '$and',
    '$or',
    '$nor',
    '$xor',
    '$each'
  ],

  /**
   * Add a value to the current field if it was not set
   * @param {*} schema 
   * @return {{operators: any, fields: any}} defaultValue
   */
  separateOperators(schema) {
    let result = { operators: {}, fields: {} };

    for (let prop in schema) {
      if (this.list.indexOf(prop) > -1)
        result.operators[prop] = schema[prop];
      else
        result.fields[prop] = schema[prop];
    }

    return result;
  }
};

/**
 * Add a value to the current field if it was not set
 * @param {*} value 
 * @param {*} defaultValue
 */
function $default(src, defaultValue, path) {
  if (defaultValue === Date.now || defaultValue === 'Date.now')
    defaultValue = Date.now();

  path = path.split('.').slice(1).join('.');
  fromPath(src, path, defaultValue, true);
}

Operators.$default = $default;

/**
 * Compares an object fields with a given list of fields
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $strict(value, fields, path, message, V) {
  if (!fields)
    return;

  for (let prop in value) {
    if (Object.keys(fields).indexOf(prop) === -1)
      throw new ValidallError('$strict', path, message || `"${path}" should not have property: "${prop}"`, value);
  }
}

Operators.$strict = $strict;

/**
 * Checks the type of a value
 * @param {any} value 
 * @param {any} type
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $type(value, type, path, message, V) {
  if (!Types.object(type)) {
    if (!Types.isValid(type))
      throw new ValidallError('$type', path, message || `"${type}" is not a valid type`, type);

    if (V.negateMode && (Types.getTypeOf(value) === type))
      throw new ValidallError('$type', path, message || `"${path}" must not be of type "${type}"`, value);
    else if (!V.negateMode && (Types.getTypeOf(value) !== type))
      throw new ValidallError('$type', path, message || `"${path}" must be of type "${type}"`, `${Types.getTypeOf(value)}: ${value}`);

  } else {
    next.call(V, Types.getTypeOf(value), type, path + '.' + '$type');
  }
}

Operators.$type = $type;

/**
 * modify value with custom function
 * @param {any} value 
 * @param {string} type
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $cast(value, type, path, message, V) {
  if (!Types.isValid(type))
    throw new ValidallError('$cast', path, `invalid type "${type}"`, type);

  try {
    fromPath(V.src, path.split('.').slice(1).join('.'), cast(value, type), true);
  } catch (e) {
    throw new ValidallError('$cast', path, message || e, value);
  }
}

Operators.$cast = $cast;

/**
 * modify value with custom function
 * @param {any} value 
 * @param {Function[]} methods
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $to(value, methods, path, message, V) {
  methods = Array.isArray(methods) ? methods : [methods];

  for (let i = 0; i < methods.length; i++) {
    if (!Types.function(methods[i]))
      throw new ValidallError('$to', path, '$to operator accepts only functions', methods[i]);

    try {
      fromPath(V.src, path.split('.').slice(1).join('.'), methods[i](value), true);
    } catch (e) {
      throw new ValidallError('$to', path, e, value);
    }
  }
}

Operators.$to = $to;

/**
 * Checks if two values are shallow equals
 * @param {any} value 
 * @param {string | any} target
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $equals(value, target, path, message, V) {
  if (V.negateMode && equals(value, target))
    throw new ValidallError('$equals', path, message || `"${path}" must not equal "${target}"`, value);
  else if (!V.negateMode && !equals(value, target))
    throw new ValidallError('$equals', path, message || `"${path}" must equal "${target}"`, value);
}

Operators.$equals = $equals;

/**
 * Checks if two values are deeply equals
 * @param {any} value 
 * @param {string | any} target
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $deepEquals(value, target, path, message, V) {

  if (V.negateMode && equals(value, target, true))
    throw new ValidallError('$deepEquals', path, message || `"${path}" must not deeply equal "${target}"`, value);
  else if (!V.negateMode && !equals(value, target, true))
    throw new ValidallError('$deepEquals', path, message || `"${path}" must deeply equal "${target}"`, value);
}

Operators.$deepEquals = $deepEquals;

/**
 * Checks if value is greater than a givin limit
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $gt(value, limit, path, message, V) {
  if (!Types.number(value))
    throw new ValidallError('$gt', path, `"${path}" should be a number`, value);

  if (!Types.number(limit))
    throw new ValidallError('$gt', path, `limit should be a number`, limit);

  if (V.negateMode && value > limit)
    throw new ValidallError('$gt', path, `"${path}" must not be greater than "${limit}"`, value);
  else if (!V.negateMode && value <= limit)
    throw new ValidallError('$gt', path, `"${path}" must be greater than "${limit}"`, value);
}

Operators.$gt = $gt;

/**
 * Checks if value is greater than or equals a givin limit
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $gte(value, limit, path, message, V) {
  if (!Types.number(value))
    throw new ValidallError('$gte', path, `"${path}" should be a number`, value);

  if (!Types.number(limit))
    throw new ValidallError('$gte', path, `limit should be a number`, limit);

  if (V.negateMode && value >= limit)
    throw new ValidallError('$gte', path, `"${path}" must not be greater than or equals to "${limit}"`, value);
  else if (!V.negateMode && value < limit)
    throw new ValidallError('$gte', path, `"${path}" must be greater than or equals to "${limit}"`, value);
}

Operators.$gte = $gte;

/**
 * Checks if value is less than a givin limit
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $lt(value, limit, path, message, V) {
  if (!Types.number(value))
    throw new ValidallError('$lt', path, `"${path}" should be a number`, value);

  if (!Types.number(limit))
    throw new ValidallError('$lt', path, `limit should be a number`, limit);

  if (V.negateMode && value < limit)
    throw new ValidallError('$lt', path, `"${path}" must not be less than "${limit}"`, value);
  else if (!V.negateMode && value >= limit)
    throw new ValidallError('$lt', path, `"${path}" must be less than "${limit}"`, value);
}

Operators.$lt = $lt;

/**
 * Checks if value is less than or equals a givin limit
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $lte(value, limit, path, message, V) {
  if (!Types.number(value))
    throw new ValidallError('$lte', path, `"${path}" should be a number`, value);

  if (!Types.number(limit))
    throw new ValidallError('$lte', path, `limit should be a number`, limit);

  if (V.negateMode && value <= limit)
    throw new ValidallError('$lte', path, `"${path}" must not be less than or equals to "${limit}"`, value);
  else if (!V.negateMode && value > limit)
    throw new ValidallError('$lte', path, `"${path}" must be less than or equals to "${limit}"`, value);
}

Operators.$lte = $lte;

/**
 * Checks if value is beatween a givin range
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $inRange(value, range, path, message, V) {
  if (!Types.number(value))
    throw new ValidallError('$inRange', path, `"${path}" should be a number`, value);

  if (!Types['number[]'](range))
    throw new ValidallError('$inRange', path, `range should be an array of two numbers`, range);

  if (range.length !== 2)
    throw new ValidallError('$inRange', path, `range should an array of two numbers`, range);

  if (range[0] > range[1])
    range.reverse();

  if (V.negateMode && (value >= range[0] && value <= range[1]))
    throw new ValidallError('$inRange', path, `"${path}" must not be in range between [${range}]`, value);
  else if (!V.negateMode && (value < range[0] || value > range[1]))
    throw new ValidallError('$inRange', path, `"${path}" must be in range between [${range}]`, value);
}

Operators.$inRange = $inRange;

/**
 * Checks if value is beatween a givin range
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $regex(value, pattern, path, message, V) {
  if (!Types.regexp(pattern))
    throw new ValidallError('$regex', path, `pattern should be instance of Regexp class`, pattern);

  if (this.negateMode && pattern.test(value))
    throw new ValidallError('$regex', path, `"${path}" must not match "'${pattern}'" pattern`, value);
  else if (!this.negateMode && !pattern.test(value))
    throw new ValidallError('$regex', path, `"${path}" must match "'${pattern}'" pattern`, value);
}

Operators.$regex = $regex;

/**
 * Checks length of string or an array
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $length(value, options, path, message, V) {
  if (!Types.string(value) && !Types.array(value))
    throw new ValidallError('$length', path, `"${path}" should be of type string or array`, value);

  require('./privates/next')
    .call(V, value.length, options, `${path}.$length`);
}

Operators.$length = $length;

/**
 * Checks size of object
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $size(value, options, path, message, V) {
  if (!Types.object(value))
    throw new ValidallError('$length', path, `"${path}" should be of type object`, value);

  require('./privates/next')
    .call(V, Object.keys(value).length, options, `${path}.$size`);
}

Operators.$size = $size;

/**
 * Checks if value shares any its items with a givin list
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $in(value, list, path, message, V) {
  value = Array.isArray(value) ? value : [value];
  list = Array.isArray(list) ? list : [list];

  let looper = value.length < list.length ? value : list;
  let checker = value.length < list.length ? list : value;

  for (let i = 0; i < looper.length; i++)
    if (checker.indexOf(looper[i]) > -1)
      return;

  throw new ValidallError('$in', path, `"${path}" must share any value with [${list}]`, value);
}

Operators.$in = $in;

/**
 * Checks if value shares all its items with a givin list
 * @param {any} value 
 * @param {any} list
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $all(value, list, path, message, V) {

  value = Array.isArray(value) ? value : [value];
  list = Array.isArray(list) ? list : [list];

  for (let i = 0; i < value.length; i++)
    if (list.indexOf(value[i]) === -1)
      throw new ValidallError('$all', path, `"${path}" must be all included in [${list}]`, value);
}

Operators.$all = $all;

/**
 * Checks if value shares all its items with a givin list
 * @param {any} value 
 * @param {any} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $keys(value, options, path, message, V) {
  if (!Types.object(value))
    throw new ValidallError('$keys', path, `"${path}" must be an object`, value);

  let keys = Object.keys(value);
  require('./privates/next')
    .call(V, keys, options, `${path}.$keys`);
}

Operators.$keys = $keys;

/**
 * Matches an equal date
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $on(value, date, path, message, V) {
  if (!Types.date(date) && !Types.string(date) && !Types.number(date))
    throw new ValidallError('$on', path, '$on operator takes a milliseconds number, string date, or a date instance', date);

  if (!Types.date(value) && !Types.string(value) && !Types.number(value))
    throw new ValidallError('$on', path, `"${path}" must be a milliseconds number, string date, or a date instance`, value);

  if (Types.string(date) || Types.number(date)) {
    let d = new Date(date);
    if (d.toString() === "Invalid Date")
      throw new ValidallError('$on', path, `$on date options is an invalid Date`, date);
  }

  if (Types.string(value) || Types.number(value)) {
    let d = new Date(value);
    if (d.toString() === "Invalid Date")
      throw new ValidallError('$on', path, `${path} is an invalid Date`, value);
  }

  if (Date.parse(value) !== Date.parse(date))
    throw new ValidallError('$on', path, `"${path}" should be on date: "${date}"`, value);
}

Operators.$on = $on;

/**
 * Matches before date
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $before(value, date, path, message, V) {
  if (!Types.date(date) && !Types.string(date) && !Types.number(date))
    throw new ValidallError('$before', path, '$before operator takes a milliseconds number, string date, or a date instance', date);

  if (!Types.date(value) && !Types.string(value) && !Types.number(value))
    throw new ValidallError('$before', path, `"${path}" must be a milliseconds number, string date, or a date instance`, value);

  if (Types.string(date) || Types.number(date)) {
    let d = new Date(date);
    if (d.toString() === "Invalid Date")
      throw new ValidallError('$before', path, `$before date options is an invalid Date`, date);
  }

  if (Types.string(value) || Types.number(value)) {
    let d = new Date(value);
    if (d.toString() === "Invalid Date")
      throw new ValidallError('$before', path, `${path} is an invalid Date`, value);
  }

  if (Date.parse(value) >= Date.parse(date))
    throw new ValidallError('$before', path, `"${path}" should be before date: "${date}"`, value);
}

Operators.$before = $before;

/**
 * Matches after date
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $after(value, date, path, message, V) {
  if (!Types.date(date) && !Types.string(date) && !Types.number(date))
    throw new ValidallError('$after', path, '$after operator takes a milliseconds number, string date, or a date instance', date);

  if (!Types.date(value) && !Types.string(value) && !Types.number(value))
    throw new ValidallError('$after', path, `"${path}" must be a milliseconds number, string date, or a date instance`, value);

  if (Types.string(date) || Types.number(date)) {
    let d = new Date(date);
    if (d.toString() === "Invalid Date")
      throw new ValidallError('$after', path, `$after date options is an invalid Date`, date);
  }

  if (Types.string(value) || Types.number(value)) {
    let d = new Date(value);
    if (d.toString() === "Invalid Date")
      throw new ValidallError('$after', path, `${path} is an invalid Date`, value);
  }

  if (Date.parse(value) <= Date.parse(date))
    throw new ValidallError('$after', path, `"${path}" should be after date: "${date}"`, value);
}

Operators.$after = $after;

/**
 * negates Validator logic 
 * @param {any} value 
 * @param {string | *} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $not(value, options, path, message, V) {
  if (Types.array(options))
    throw new ValidallError('$not', path, '$not operator cannot have an array value', options);

  if (Types.object(options)) {
    options = Operators.separateOperators(options).operators;
    if (options && !Object.keys(options).length)
      return;
  }

  V.negateMode = !V.negateMode;
  require('./privates/next')
    .call(V, value, options, path);
  V.negateMode = !V.negateMode;
}

Operators.$not = $not;

/**
 * checks if all options in the array passes 
 * @param {any} value 
 * @param {array} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $and(value, options, path, message, V) {
  if (!Types.array(options))
    throw new ValidallError('$and', path, `$and operator takes only an array of options`, options);

  const next = require('./privates/next');

  for (let i = 0; i < options.length; i++)
    next.call(V, value, options[i], path);
}

Operators.$and = $and;

/**
 * checks if any option in the array passes 
 * @param {any} value 
 * @param {array} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $or(value, options, path, message, V) {
  if (!Types.array(options))
    throw new ValidallError('$or', path, '$or operator takes only an array of options', options);

  let errors = [];
  const next = require('./privates/next');

  for (let i = 0; i < options.length; i++) {
    try {
      next.call(V, value, options[i], path);
      return;
    } catch (e) {
      errors.push(e);
      continue;
    }
  }

  if (!message) {
    message = `At least one of the following conditions should pass..`;

    for (let i = 0; i < errors.length; i++) {
      message += `
          ${errors[i].message}${i === errors.length - 1 ? '' : ','}`
    }
  }

  console.log(message);

  throw new ValidallError('$or', path, message, value);
}

Operators.$or = $or;

/**
 * checks if Only one option in the array passes but not the others
 * @param {any} value 
 * @param {array} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $xor(value, options, path, message, V) {
  if (!Types.array(options))
    throw new Error('$xor', path, '$xor operator takes only an array of options', options);

  let passed = [];
  let notPassed = [];

  const next = require('./privates/next');

  for (let i = 0; i < options.length; i++) {
    try {
      next.call(V, value, options[i], path);
      passed.push(options[i]);
    } catch (e) {
      notPassed.push(options[i]);

      continue;
    }
  }

  if (passed.length !== 1) {
    if (!message) {
      message = `Only one of the following options should pass and not the others..`;

      message += `

                  passed options:`;
      for (let i = 0; i < passed.length; i++) {
        let item = Types.object(passed[i]) ? JSON.stringify(passed[i]) : passed[i];
        message += `
                    ${item}`;
      }

      message += `

                  failed options:`;
      for (let i = 0; i < notPassed.length; i++) {
        let item = Types.object(notPassed[i]) ? JSON.stringify(notPassed[i]) : notPassed[i];
        message += `
                    ${item}`;
      }
    }

    throw new ValidallError('$xor', path, message, value);
  }
}

Operators.$xor = $xor;

/**
 * checks if none option in the array passes
 * @param {any} value 
 * @param {array} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $nor(value, options, path, message, V) {
  if (!Types.array(options))
    throw `
      Validall Error:-
        path: ${path},
        message: $nor operator takes only an array of options,
        got: ${options}
    `;

  let passed = [];
  let notPassed = [];

  const next = require('./privates/next');

  for (let i = 0; i < options.length; i++) {
    try {
      next.call(V, value, options[i], path);
      passed.push(options[i]);
    } catch (e) {
      notPassed.push(options[i]);

      continue;
    }
  }

  if (passed.length) {
    if (!message) {
      message = `None of the following options shall pass..`;

      message += `

                  passed options:`;
      for (let i = 0; i < passed.length; i++) {
        let item = Types.object(passed[i]) ? JSON.stringify(passed[i]) : passed[i];
        message += `
                    ${item}`;
      }

      message += `

                  failed options:`;
      for (let i = 0; i < notPassed.length; i++) {
        let item = Types.object(notPassed[i]) ? JSON.stringify(notPassed[i]) : notPassed[i];
        message += `
                    ${item}`;
      }
    }

    throw new ValidallError('$nor', path, message, value);
  }
}

Operators.$nor = $nor;

/**
 * Loops an array of values and make the same validation
 * @param {any} value 
 * @param {array} options
 * @param {string} path
 * @param {string} message
 * @param {Validator} V
 */
function $each(values, options, path, message, V) {
  values = Array.isArray(values) ? values : [values];

  if (!Types.object(options))
    throw new ValidallError('$and', path, `$each operator takes only an options object`, options);

  const next = require('./privates/next');

  for (let i = 0; i < values.length; i++)
    next.call(V, values[i], options, `${path}.${i}`);
}

Operators.$each = $each;


module.exports = Operators;