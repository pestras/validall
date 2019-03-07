import { Validall } from './validator';
import { Types } from 'tools-box/types';
import { Is } from 'tools-box/is';
import { equals } from 'tools-box/object/equals';
import { ISchema, IValidator, isOptions, toArgs, IValidatorOperators, INegatableOperators } from "./schema";
import { injectValue } from 'tools-box/object/inject-value';
import { cast } from 'tools-box/cast';
import { omit } from 'tools-box/object/omit';
import { ValidallValidationError } from "./errors";
import { To } from './to';
import { getValue } from 'tools-box/object/get-value';

export const Operators = {
  // list of schema available operators
  list: [
    '$message', '$required', '$nullable', '$default', '$filter', '$strict', '$type', '$instanceof', '$ref', '$is', '$equals',
    '$deepEquals', '$regex', '$gt', '$gte', '$lt', '$lte', '$inRange', '$length', '$size', '$intersect', '$include', '$enum',
    '$cast', '$to', '$props', '$paths', '$keys', '$on', '$before', '$after', '$not', '$and', '$or', '$nor', '$xor', '$each', '$meta'
  ],

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * check if key is an operator
   */
  isOperator(key: string) {
    return this.list.indexOf(key) > -1;
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Default operator
   */
  $default(src: any, defaultValue: any, path: any, validator?: any) {
    // if default value equals to Date.now ref or 'Date.now' string, then set it to Date.now()
    if (defaultValue === Date.now || defaultValue === 'Date.now')
      defaultValue = Date.now();
    // inject the default value into the src
    injectValue(src, path, defaultValue);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Filter operator
   */
  $filter(src: any, keepList: string[]) {
    let srcKeys = Object.keys(src);
    let omitList: string[] = [];

    for (let i = 0; i < srcKeys.length; i++)
      if (keepList.indexOf(srcKeys[i]) === -1)
        omitList.push(srcKeys[i]);

    if (omitList.length)
      omit(src, omitList);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Strict operator
   */
  $strict(src: any, keys: any, path: string, msg: string | string[], validator: any) {
    // if no keys then strict mode is off
    if (!keys || keys.length === 0)
      return;

    // loop through src keys and find invalid keys
    for (let prop in src) {
      if (keys.indexOf(prop) === -1)
        throw new ValidallValidationError({
          method: '$strict',
          path: path,
          expected: 'not exist',
          got: prop
        }, `${path ? path + '.' + prop : prop} is not allowed.`, msg);
    }
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Type operator
   */
  $type(src: any, type: string, path: string, msg: string | string[], validator: IValidator) {
    if (Types.getTypesOf(src).indexOf(type) === -1)
      throw new ValidallValidationError({
        method: '$type',
        expected: type,
        got: src,
        path: path
      }, `expected ${path} of type ${type}${Array.isArray(type) ? '[]' : ''}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Ref operator
   */
  $ref(src: any, vali: Validall, path: string, msg: string | string[], validator: IValidator) {
    try {
      vali.validate(src, true);
    } catch (err) {
      throw new ValidallValidationError({
        expected: err.expected,
        got: err.got,
        method: err.method,
        path: path + '.' + err.path
      }, err.short, msg);
    }
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Instance od operator
   */
  $instanceof(src: any, constructor: any, path: string, msg: string | string[], validator: IValidator) {
    if (!(src instanceof constructor))
      throw new ValidallValidationError({
        expected: 'instance of ' + constructor.name,
        got: src,
        method: '$instanceOf',
        path: path
      }, `expected ${path} instance of ${constructor.name}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Is operator
   */
  $is(src: any, patternName: isOptions, path: string, msg: string | string[], validator: IValidator) {
    if (!(<any>Is)[patternName](src))
      throw new ValidallValidationError({
        method: '$is',
        expected: patternName,
        got: src,
        path: path,
      }, `expected ${path} a valid ${patternName}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Cast operator
   */
  $cast(src: any, type: 'boolean' | 'string' | 'number' | 'date' | 'regexp' | 'array', path: string, msg: string | string[], validator: IValidator) {
    try {
      // try to cast src
      injectValue(validator.src, path, cast(src, type));
    } catch (err) {
      throw new ValidallValidationError({
        method: '$cast',
        expected: 'castable type to ' + type,
        got: src,
        path: path,
      }, err);
    }
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * To Operator
   */
  $to(src: any, methods: toArgs[], path: string, msg: string | string[], validator: IValidator) {
    for (let i = 0; i < methods.length; i++) {
      try {
        // try to update src
        injectValue(validator.src, path, To[methods[i]]);
      } catch (err) {
        throw new ValidallValidationError({
          method: '$to',
          expected: methods[i],
          got: src,
          path: path
        }, err.message);
      }
    }
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Equals Operator
   */
  $equals(src: any, target: any, path: string, msg: string | string[], validator: IValidator) {
    // save equality result
    let areEqual = src === target;

    // if src and target are equal and negate mode is on throw validation error
    if (areEqual && validator.negateMode)
      throw new ValidallValidationError({
        method: '$equals',
        expected: 'src and target are not equal',
        got: src,
        path: path
      }, `expected ${path} not equal to ${target}`, msg);

    // if src and target are not equal and negate mode is off throw validation error
    if (!areEqual && !validator.negateMode)
      throw new ValidallValidationError({
        method: '$equals',
        expected: 'src and target are equal',
        got: src,
        path: path
      }, `expected ${path} equals to ${target}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Deep Equals Operator
   */
  $deepEquals(src: any, target: any, path: string, msg: string | string[], validator: IValidator) {
    // save equality result
    let areEqual = equals(src, target, true);

    // if src and target are equal and negate mode is on throw validation error
    if (areEqual && validator.negateMode)
      throw new ValidallValidationError({
        method: '$equals',
        expected: 'src and target are not deeply equal',
        got: src,
        path: path
      }, `expected ${path} not deeply equal to ${target}`, msg);

    // if src and target are not equal and negate mode is off throw validation error
    if (!areEqual && !validator.negateMode)
      throw new ValidallValidationError({
        method: '$equals',
        expected: 'src and target are deeply equal',
        got: src,
        path: path
      }, `expected ${path} deeply equals to ${target}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Greate Than Operator
   */
  $gt(src: any, limit: number, path: string, msg: string | string[], validator: IValidator) {
    if (typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'number',
        got: typeof src + ': ' + src,
        method: '$gt',
        path: path
      }, `${src} is not a number`, msg);

    if (src <= limit)
      throw new ValidallValidationError({
        method: '$gt',
        expected: 'src is greate than limit',
        got: src,
        path: path
      }, `${path} must be greater than ${limit}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Greate Than or Equal Operator
   */
  $gte(src: any, limit: number, path: string, msg: string | string[], validator: IValidator) {
    if (typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'number',
        got: typeof src + ': ' + src,
        method: '$gte',
        path: path
      }, `${src} is not a number`, msg);

    if (src < limit)
      throw new ValidallValidationError({
        method: '$gte',
        expected: 'src is greate than or equal limit',
        got: src,
        path: path
      }, `${path} must be greater than or equal ${limit}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Less Than Operator
   */
  $lt(src: any, limit: number, path: string, msg: string | string[], validator: IValidator) {
    if (typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'number',
        got: typeof src + ': ' + src,
        method: '$lt',
        path: path
      }, `${src} is not a number`, msg);

    if (src >= limit)
      throw new ValidallValidationError({
        method: '$lt',
        expected: 'src is less than limit',
        got: src,
        path: path
      }, `${path} must be less than ${limit}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Less Than or Equal Operator
   */
  $lte(src: any, limit: number, path: string, msg: string | string[], validator: IValidator) {
    if (typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'number',
        got: typeof src + ': ' + src,
        method: '$lte',
        path: path
      }, `${src} is not a number`, msg);

    if (src > limit)
      throw new ValidallValidationError({
        method: '$lte',
        expected: 'src is less than or equal limit',
        got: src,
        path: path
      }, `${path} must be less than or equal ${limit}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * In Range Operator
   */
  $inRange(src: any, range: [number, number], path: string, msg: string | string[], validator: IValidator) {
    if (typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'number',
        got: typeof src + ': ' + src,
        method: '$inRange',
        path: path
      }, `${path} must be a number!`, msg);

    if (src >= range[0] && src <= range[1] && validator.negateMode)
      throw new ValidallValidationError({
        method: '$inRange',
        expected: 'src must not be in range',
        got: src,
        path: path
      }, `${path} must not be in range between ${range}`, msg);

    if ((src < range[0] || src > range[1]) && !validator.negateMode)
      throw new ValidallValidationError({
        method: '$inRange',
        expected: 'src must be in range',
        got: src,
        path: path
      }, `${path} must be in range between ${range}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * RegExp Operator
   */
  $regex(src: any, pattern: RegExp, path: string, msg: string | string[], validator: IValidator) {
    if (!pattern.test(src))
      throw new ValidallValidationError({
        method: '$regex',
        expected: `match pattern ${pattern}`,
        got: src,
        path: path
      }, `expected ${path} matches ${pattern}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Length Operator
   */
  $length(src: any, options: IValidatorOperators, path: string, msg: string | string[], validator: IValidator) {
    if (typeof src !== 'string' && !Array.isArray(src))
      throw new ValidallValidationError({
        expected: 'string or array',
        got: typeof src + ': ' + src,
        method: '$length',
        path: path
      }, `${path} must be of type string or array`, msg);
      
    validator.next(src.length, options, `${path}.$length`);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Size Operator
   */
  $size(src: any, options: IValidatorOperators, path: string, msg: string | string[], validator: IValidator) {
    if (!Types.object(src))
      throw new ValidallValidationError({
        expected: 'object',
        got: typeof src + ': ' + src,
        method: '$size',
        path: path
      }, `${path} must be an object`, msg);

    validator.next(Object.keys(src).length, options, `${path}.$size`);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Keys Operator
   */
  $keys(src: any, options: IValidatorOperators, path: string, msg: string | string[], validator: IValidator) {
    if (!Types.object(src))
      throw new ValidallValidationError({
        expected: 'object',
        got: typeof src + ': ' + src,
        method: '$keys',
        path: path
      }, `${path} must be an object`, msg);

    validator.next(Object.keys(src), options, `${path}.$keys`);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * intersect Operator
   */
  $intersect(src: any, list: string | string[], path: string, msg: string | string[], validator: IValidator) {
    src = Array.isArray(src) ? src : [src];
    list = Array.isArray(list) ? list : [list];

    let looper = src.length < list.length ? src : list;
    let checker = looper === src ? list : src;

    for (let i = 0; i < looper.length; i++)
      if (checker.indexOf(looper[i]) > -1)
        if (validator.negateMode)
          throw new ValidallValidationError({
            method: '$intersect',
            expected: 'no shared values',
            got: src,
            path: path
          }, `${path} must not share any value with ${list}`, msg);
        else
          return

    if (!validator.negateMode)
      throw new ValidallValidationError({
        method: '$intersect',
        expected: 'intersect some values',
        got: src,
        path: path
      }, `${path} must share any value with ${list}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Enum Operator
   */
  $enum(src: any, list: string | string[], path: string, msg: string | string[], validator: IValidator) {
    src = Array.isArray(src) ? src : [src];
    list = Array.isArray(list) ? list : [list];

    let allIncluded = true;

    for (let i = 0; i < src.length; i++)
      if (list.indexOf(src[i]) === -1) {
        if (!validator.negateMode)
          throw new ValidallValidationError({
            method: '$enum',
            expected: 'included value',
            got: src,
            path: path
          }, `${path} value must not be out of ${list}`, msg);

        allIncluded = false;
      }

    if (validator.negateMode && allIncluded)
      throw new ValidallValidationError({
        method: '$enum',
        expected: 'not all values included',
        got: src,
        path: path
      }, `${path} must not be all included in ${list}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Include Operator
   */
  $include(src: any, list: string | string[], path: string, msg: string | string[], validator: IValidator) {
    src = Array.isArray(src) ? src : [src];
    list = Array.isArray(list) ? list : [list];

    let allIncluded = true;

    for (let i = 0; i < list.length; i++)
      if (src.indexOf(list[i]) === -1) {
        if (!validator.negateMode)
          throw new ValidallValidationError({
            method: '$include',
            expected: 'include all values',
            got: src,
            path: path
          }, `${path} value must include ${list[i]}`, msg);

        allIncluded = false;
      }

    if (validator.negateMode && allIncluded)
      throw new ValidallValidationError({
        method: '$include',
        expected: 'not included any value',
        got: src,
        path: path
      }, `${path} value must not include all ${list}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * On Operator
   */
  $on(src: any, date: string, path: string, msg: string | string[], validator: IValidator) {
    if (!Types.date(src) && typeof src !== 'string' && typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'date instance, string or number',
        got: typeof src + ': ' + src,
        method: '$on',
        path: path
      }, `${path} must be date instance, string or number`, msg);

    if (typeof src === 'string') {
      let d = new Date(src);
      if (d.toString() === "Invalid Date")
        throw new ValidallValidationError({
          method: '$on',
          expected: 'a valid date',
          got: src,
          path: path
        }, `${path} must be a valid date`, msg);
    }

    if (typeof src === 'number')
      src = new Date(src);

    if (Date.parse(src) !== Date.parse(date))
      throw new ValidallValidationError({
        method: '$on',
        expected: 'on time date',
        got: src,
        path: path
      }, `${path} must be on date ${date}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Before Operator
   */
  $before(src: any, date: string, path: string, msg: string | string[], validator: IValidator) {
    if (!Types.date(src) && typeof src !== 'string' && typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'date instance, string or number',
        got: typeof src + ': ' + src,
        method: '$before',
        path: path
      }, `${path} must be date instance, string or number`, msg);

    if (typeof src === 'string') {
      let d = new Date(src);
      if (d.toString() === "Invalid Date")
        throw new ValidallValidationError({
          method: '$before',
          expected: 'a valid date',
          got: src,
          path: path
        }, `${path} must be a valid date`, msg);
    }

    if (typeof src === 'number')
      src = new Date(src);

    if (Date.parse(src) >= Date.parse(date))
      throw new ValidallValidationError({
        method: '$before',
        expected: 'before ' + date,
        got: src,
        path: path
      }, `${path} must be before date ${date}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * After Operator
   */
  $after(src: any, date: string, path: string, msg: string | string[], validator: IValidator) {
    if (!Types.date(src) && typeof src !== 'string' && typeof src !== 'number')
      throw new ValidallValidationError({
        expected: 'date instance, string or number',
        got: typeof src + ': ' + src,
        method: '$after',
        path: path
      }, `${path} must be date instance, string or number`, msg);

    if (typeof src === 'string') {
      let d = new Date(src);
      if (d.toString() === "Invalid Date")
        throw new ValidallValidationError({
          method: '$after',
          expected: 'a valid date',
          got: src,
          path: path
        }, `${path} must be a valid date`, msg);
    }

    if (typeof src === 'number')
      src = new Date(src);

    if (Date.parse(src) <= Date.parse(date))
      throw new ValidallValidationError({
        method: '$after',
        expected: 'after ' + date,
        got: src,
        path: path
      }, `${path} must be after date ${date}`, msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Not Operator
   */
  $not(src: any, options: INegatableOperators, path: string, msg: string | string[], validator: IValidator) {
    validator.negateMode = !validator.negateMode;
    validator.next(src, options, path)
    validator.negateMode = !validator.negateMode;
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * And Operator
   */
  $and(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator) {
    for (let i = 0; i < options.length; i++)
      validator.next(src, options[i], path);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Or Operator
   */
  $or(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator) {
    let errors = [];

    for (let i = 0; i < options.length; i++) {
      try {
        validator.next(src, options[i], path);
        return;
      } catch (err) {
        errors.push(err.short);
      }
    }

    throw new ValidallValidationError({
      method: '$or',
      expected: 'at least one validation passes',
      got: 'all validations failed',
      path: path
    }, errors.join(' or '), msg);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Xor Operator
   */
  $xor(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator) {
    let passed = [];
    let errors = [];

    for (let i = 0; i < options.length; i++) {
      try {
        validator.next(src, options[i], path);
        passed.push(options[i]);

        if (passed.length > 1)
          break;
      } catch (err) {
        errors.push(err.short);
      }
    }

    if (passed.length === 1)
      return;

    if (passed.length === 0) {

      throw new ValidallValidationError({
        method: '$xor',
        expected: 'only one validation passes',
        got: 'all validations failed',
        path: path
      }, errors.join(' or '), msg);

    } else {
      let errorMsg = '';

      for (let i = 0; i < passed.length; i++)
        errorMsg += 'passed: ' + JSON.stringify(passed[i]) + '\n';

      throw new ValidallValidationError({
        method: '$xor',
        expected: 'only one validation passes',
        got: 'multible validations passed',
        path: path
      }, errorMsg, msg);
    }
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Nor Operator
   */
  $nor(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator) {
    let error: string;

    validator.negateMode = true;
    for (let i = 0; i < options.length; i++) {
      try {
        validator.next(src, options[i], path);
      } catch (err) {
        error = err.short;
        break;
      }
    }

    validator.negateMode = false;

    if (error) {

      throw new ValidallValidationError({
        method: '$nor',
        expected: 'none of validations passes',
        got: 'some validations passed',
        path: path
      }, error, msg);
    }
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Each Operator
   */
  $each(src: any, schema: ISchema, path: string, msg: string | string[], validator: IValidator) {
    for (let i = 0; i < src.length; i++)
      validator.next(src[i], schema, `${path}[${i}]`);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Properties Operator
   */
  $props(src: any, schema: { [key: string]: ISchema }, path: string, msg: string | string[], validator: IValidator) {
    for (let prop in schema)
      if (schema.hasOwnProperty(prop))
        validator.next(src[prop], schema[prop], `${path}${path ? '.' : ''}${prop}`);
  },

  /**
   * ------------------------------------------------------------------------------------------------------------------------
   * Paths Operator
   */
  $paths(src: any, schema: { [key: string]: ISchema }, path: string, msg: string | string[], validator: IValidator) {
    for (let prop in schema)
      if (schema.hasOwnProperty(prop))
        validator.next(getValue(src, prop), schema[prop], `${path}${path ? '.' : ''}${prop}`);
  }
}