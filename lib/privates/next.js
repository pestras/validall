"use strict";

const prepare = require('./prepare');
const filter = require('../util/filter');
const Operators = require('../operators');
const ValidallError = require('../validall-error');

const escapedOperators = ['$required', '$message', '$default', '$filter'];

function next(value, options, path) {
  let { operators, fields } = prepare.call(this, options);
  let hasFields = fields && Object.keys(fields).length;

  // filtering value object;
  if (operators.$filter === true && hasFields)
    filter(value, Object.keys(fields));

  // if $default operator is used and value is undefined
  // assign the default value then exit
  if (operators.$default && value === undefined) {
    Operators.$default(this.src, operators.$default, path);
    delete operators.$default;
    return;
  }

  // if field is optional set $required operator to false
  // otherwise if validator default required is true set $required operator to true
  if (path.charAt(path.length - 1) === '?') {
    operators.$required = false;
    path.slice(0, path.length - 1);
  } else if (operators.$required === undefined) {
    operators.$required = this.config.required;
  }

  if (value === undefined) {
    if (!operators.$required)
      return;
    else
      throw new ValidallError('$required', path, `"${path}" is required`, 'undefined');
  }

  this.currentPath = path;
  let message = operators.$message;
  delete operators.$message;

  for (let operator in operators) {
    if (escapedOperators.indexOf(operator) > -1)
      continue;
      
    Operators[operator](value, operators[operator], path, message, this);
  }

  if (hasFields) {
    for (let field in fields) {
      this.currentPath = path + '.' + field;
      next.call(this, value[field], fields[field], this.currentPath);
    }
  }
}

module.exports = next;