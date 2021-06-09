import { Operators } from './operators';
import { ISchema, ISchemaConfig } from './schema';
import { Types } from '@pestras/toolbox/types';
import { setValue } from '@pestras/toolbox/object/set-value';
import { ValidallInvalidArgsError } from './errors';
import { Is } from '@pestras/toolbox/is';
import { To } from './to';
import { getValidator } from './repo';
import { Validall } from './validator';

export function validateSchema(schema: ISchema, options: ISchemaConfig, path = "") {
  schema.$required = schema.$required === false ? false : schema.$required || options.required;
  schema.$nullable = schema.$nullable === false ? false : schema.$nullable || options.nullable;

  for (let operator in schema) {
    let currentPath = path ? `${path}.${operator}` : operator;
    if (Operators.isOperator(operator)) {
      operatorsValidator[operator](schema[<keyof ISchema>operator], schema, currentPath, options);

      if (operator === '$props')
        for (let prop in schema[operator])
          validateSchema(schema.$props[prop], options, `${currentPath}.${prop}`);

      if (operator === "$each")
        validateSchema(schema.$each, options, `${currentPath}`);

    } else {
      throw new ValidallInvalidArgsError({
        method: 'validateSchema',
        expected: 'valid operator',
        got: operator,
        path: path
      });
    }
  }
}

const operatorsValidator: any = {
  $message(value: any, schema: any, path: string) {
    if (value && typeof value !== 'string' || Types.function(value))
      throw new ValidallInvalidArgsError({
        method: '$message',
        expected: 'string or function',
        got: `${typeof value}: ${value}`,
        path: path
      });
  },

  $required(value: any, schema: any, path: string) {
    if (value && typeof value !== 'boolean')
      throw new ValidallInvalidArgsError({
        method: '$required',
        expected: 'boolean',
        got: `${typeof value}: ${value}`,
        path: path
      });
  },

  $nullable(value: any, schema: any, path: string) {
    if (value && typeof value !== 'boolean')
      throw new ValidallInvalidArgsError({
        method: '$nullable',
        expected: 'boolean',
        got: `${typeof value}: ${value}`,
        path: path
      });
  },

  $default(value: any, schema: any, path: string) {
    if (!value || !schema.$type)
      return;

    let type = schema.$type;

    let match: boolean = false;
    if (Array.isArray(type)) {
      if (type.length === 1)
        match = Types.arrayOf(type[0], value);
      else {
        if (!Array.isArray(value) || value.length !== type.length)
          throw new ValidallInvalidArgsError({
            method: '$default',
            expected: `${type}`,
            got: value,
            path: path
          });

        for (let i = 0; i < type.length; i++)
          if (Array.isArray(type[i])) {
            if (!Types.arrayOf(type[i][0], value[i])) {
              throw new ValidallInvalidArgsError({
                method: '$default',
                got: `${typeof value[i]}: ${value[i]}`,
                expected: `${type}`,
                path: path
              });
            }
          } else if (Types.getTypesOf(value[i]).indexOf(type[i]) === -1) {
            throw new ValidallInvalidArgsError({
              method: '$default',
              got: `${typeof value[i]}: ${value[i]}`,
              expected: `${type}`,
              path: path
            });
          }
      }

    } else {
      // save type match
      match = Types.getTypesOf(value).indexOf(type) > -1;
    }

    // if not type match and negate mode is off also throw validation error
    if (!match)
      throw new ValidallInvalidArgsError({
        method: '$default',
        expected: `${type}`,
        got: `${typeof value}: ${value}`,
        path: path
      });
  },

  $filter(value: any, schema: any, path: string, options: ISchemaConfig) {
    if (value && typeof value !== 'boolean')
      throw new ValidallInvalidArgsError({
        method: '$filter',
        expected: 'boolean',
        got: `${typeof value}: ${value}`,
        path: path
      });

    if (!schema.$props)
      throw new ValidallInvalidArgsError({
        method: '$filter',
        expected: 'has $props operator',
        got: null,
        path: path
      });
  },

  $strict(value: any, schema: any, path: string) {
    if (value && typeof value !== 'boolean' && !Array.isArray(value))
      throw new ValidallInvalidArgsError({
        method: '$strict',
        expected: 'boolean',
        got: `${typeof value}: ${value}`,
        path: path
      });
  },

  $meta() { return true; },

  $type(value: any, schema: any, path: string) {
    if (!Types.isValidType(value))
      throw new ValidallInvalidArgsError({
        method: '$type',
        expected: 'valid type name',
        got: value,
        path: path
      });
  },

  $ref(value: any, schema: any, path: string) {
    if (typeof value !== 'string' && value?.constructor !== Validall)
      throw new ValidallInvalidArgsError({
        method: '$ref',
        expected: 'string or Validall instance',
        got: `${typeof value}: ${value}`,
        path: path
      });
      
    let validator = typeof value === 'string' ? getValidator(value) : value;

    if (!validator)
      throw new ValidallInvalidArgsError({
        method: '$ref',
        expected: 'valid id or alias',
        got: value,
        path: path
      });

    setValue(schema, '$ref', Array.isArray(value) ? [validator] : validator);
  },

  $instanceof(value: any, schema: any, path: string) {
    if (typeof value !== 'function')
      throw new ValidallInvalidArgsError({
        method: '$instanceof',
        expected: 'constructor function',
        got: value,
        path: path
      });
  },

  $is(value: any, schema: any, path: string) {
    if (Object.keys(Is).indexOf(value) === -1)
      throw new ValidallInvalidArgsError({
        method: '$Is',
        expected: 'valid pattern name',
        got: value,
        path: path
      });
  },

  $cast(value: any, schema: any, path: string) {
    if (['boolean', 'string', 'number', 'date', 'regexp', 'array'].indexOf(value) === -1)
      throw new ValidallInvalidArgsError({
        expected: 'supported type name',
        got: value,
        method: '$cast',
        path: path
      });
  },

  $to(value: any, schema: any, path: string) {
    let methods = Array.isArray(value) ? value : [value];

    // loop through methods and check if each is valid
    for (let i = 0; i < methods.length; i++)
      if (Object.keys(To).indexOf(methods[i]) === -1)
        throw new ValidallInvalidArgsError({
          expected: 'valid method name',
          got: methods[i],
          method: '$to',
          path: path
        });

    setValue(schema, '$to', methods);
  },

  $equals() { return true },
  $deepEquals() { return true },

  $gt(value: any, schema: any, path: string, operator = '$gt') {
    if (typeof value !== 'number')
      throw new ValidallInvalidArgsError({
        expected: 'number',
        got: typeof value + ': ' + value,
        method: operator,
        path: path
      });
  },

  $gte(value: any, schema: any, path: string) {
    this.$gt(value, schema, path, '$gte');
  },

  $lt(value: any, schema: any, path: string) {
    this.$gt(value, schema, path, '$lt');
  },

  $lte(value: any, schema: any, path: string) {
    this.$gt(value, schema, path, '$lte');
  },

  $inRange(value: any, schema: any, path: string) {
    if (typeof value[0] !== 'number' && typeof value[1] !== 'number' && value.length !== 2)
      throw new ValidallInvalidArgsError({
        expected: '[number, number]',
        got: typeof value + ': ' + value,
        method: '$inRange',
        path: path
      });

    if (value[0] === value[1])
      throw new ValidallInvalidArgsError({
        expected: 'range[0] < range[1]',
        got: value,
        method: '$inRange',
        path: path
      });

    if (value[0] > value[1]) {
      value = [value[1], value[0]];
      setValue(schema, '$inRange', value);
    }
  },

  $regex(value: any, schema: any, path: string) {
    if (Array.isArray(value)) {
      setValue(schema, '$regex', new RegExp(value[0], value[1]));
    } else if (!Types.regexp(value))
      throw new ValidallInvalidArgsError({
        expected: 'RegExp',
        got: typeof value + ': ' + value,
        method: '$regex',
        path: path
      });
  },

  $length(value: any, schema: any, path: string) {
    if (typeof value !== 'number' && !Types.object(value))
      throw new ValidallInvalidArgsError({
        expected: 'number or operators object',
        got: typeof value + ': ' + value,
        method: '$length',
        path: path
      });
  },

  $size(value: any, schema: any, path: string) {
    if (typeof value !== 'number' && !Types.object(value))
      throw new ValidallInvalidArgsError({
        expected: 'number or operators object',
        got: typeof value + ': ' + value,
        method: '$size',
        path: path
      });
  },

  $keys(value: any, schema: any, path: string) {
    if (!Types.object(value))
      throw new ValidallInvalidArgsError({
        expected: ' operators object',
        got: typeof value + ': ' + value,
        method: '$keys',
        path: path
      });
  },

  $intersect() { return true },
  $include() { return true },
  $enum() { return true },

  $on(value: any, schema: any, path: string, operator = '$on') {
    if (!Types.date(value) && typeof value !== 'string' && typeof value !== 'number') {
      throw new ValidallInvalidArgsError({
        expected: 'date instance, string or number',
        got: typeof value + ': ' + value,
        method: operator,
        path: path
      });
    }

    if (typeof value === 'string') {
      let d = new Date(value);
      if (d.toString() === "Invalid Date")
        throw new ValidallInvalidArgsError({
          method: operator,
          expected: 'a valid date',
          got: value,
          path: path
        });
    }

    if (typeof value === 'number') {
      value = new Date(value);
      setValue(schema, operator, value);
    }
  },

  $before(value: any, schema: any, path: string) {
    this.$on(value, schema, path, '$before');
  },

  $after(value: any, schema: any, path: string) {
    this.$on(value, schema, path, '$after');
  },

  $not() { return true },

  $and(value: any, schema: any, path: string, operator = '$and') {
    if (!Array.isArray(value))
      throw new ValidallInvalidArgsError({
        expected: 'array of schemas',
        got: typeof value + ': ' + value,
        method: operator,
        path: path
      });
  },

  $or(value: any, schema: any, path: string) {
    this.$and(value, schema, path, '$or');
  },

  $nor(value: any, schema: any, path: string) {
    this.$and(value, schema, path, '$nor');
  },

  $xor(value: any, schema: any, path: string) {
    this.$and(value, schema, path, '$xor');
  },

  $map(value: any, schema: any, path: string, options: ISchemaConfig) {
    schema.$type = 'object';
  },

  $each(value: any, schema: any, path: string, options: ISchemaConfig) {
    schema.$type = 'array';
  },

  $props(value: any, schema: any, path: string, options: ISchemaConfig) {
    if (!Types.object(value))
      throw new ValidallInvalidArgsError({
        method: '$props',
        expected: 'object',
        got: `${typeof value}: value`,
        path: path
      });

    schema.$type = schema.$type || 'object';

    if (schema.$filter === undefined)
      schema.$filter = options.filter;

    // if (schema.$strict === undefined)
    //   schema.$strict = options.strict === false ? false : Object.keys(schema.$props);
    // else
    //   schema.$strict = schema.$strict === true ? Object.keys(schema.$props) : schema.$strict;
    if (schema.$strict === undefined)
      schema.$strict = !!options.strict;
  },

  $paths(value: any, schema: any, path: string, options: ISchemaConfig) {
    if (!Types.object(value))
      throw new ValidallInvalidArgsError({
        method: '$props',
        expected: 'object',
        got: `${typeof value}: value`,
        path: path
      });

    schema.$type = schema.$type || 'object';
  }
}