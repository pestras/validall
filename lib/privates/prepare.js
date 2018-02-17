"use strict";

let Types = require('../util/types');
let Operators = require('../operators');

function prepare(schema) {
  if (schema === undefined)
    throw `
      Validall Error:-
        message: undefined schema for path: '${this.context.path}'
    `;

  if (Types.string(schema)) {
    if (Types.isValid(schema))
      return { operators: { $type: schema } };
    else
      return { operators: { $equals: schema } };

  } else if (Types.primitive(schema) || schema === null) {
    return { operators: { $equals: schema } };

  } else if (Types.date(schema)) {
    return { operators: { $on: schema } };

  } else if (Types.regexp(schema)) {
    return { operators: { $regex: schema } };

  } else if (Array.isArray(schema)) {
    return { operators: { $type: 'any[]', $each: schema } };
  }

  let { operators, fields } = Operators.separateOperators(schema);

  if (fields && Object.keys(fields).length) {
    for (let field in fields) {
      if (field.charAt(field.length - 1) === '?') {
        let newField = field.slice(0, field.length - 1);

        if (Types.primitive(fields[field])) {
          if (Types.string(fields[field]) && Types.isValid(fields[field]))
            fields[newField] = { $type: fields[field], $required: false }
          else
            fields[newField] = { $equals: fields[field], $required: false }
        } else if (Types.array(fields[field])) {
          fields[newField] = { $each: fields[field], $required: false }
        } else {
          fields[newField] = fields[field];
          fields[newField].required = false;
        }

        delete fields[field];
      }
    }

    operators.$type = operators.$type || 'object';

    if (operators.$filter === undefined)
      operators.$filter = this.config.filter;

    if (operators.$strict === undefined)
      operators.$strict = this.config.strict === false ? false : fields;
    else
      operators.$strict = operators.$strict === false ? false : fields;
  }

  return { operators, fields };
}

module.exports = prepare;