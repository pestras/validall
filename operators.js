"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operators = void 0;
const types_1 = require("@pestras/toolbox/types");
const is_1 = require("@pestras/toolbox/is");
const equals_1 = require("@pestras/toolbox/object/equals");
const inject_value_1 = require("@pestras/toolbox/object/inject-value");
const cast_1 = require("@pestras/toolbox/cast");
const omit_1 = require("@pestras/toolbox/object/omit");
const errors_1 = require("./errors");
const to_1 = require("./to");
const get_value_1 = require("@pestras/toolbox/object/get-value");
exports.Operators = {
    // list of schema available operators
    list: [
        '$message', '$required', '$nullable', '$default', '$filter', '$strict', '$type', '$instanceof', '$ref', '$is', '$equals', '$map',
        '$deepEquals', '$regex', '$gt', '$gte', '$lt', '$lte', '$inRange', '$length', '$size', '$intersect', '$include', '$enum',
        '$cast', '$to', '$props', '$paths', '$keys', '$on', '$before', '$after', '$not', '$and', '$or', '$nor', '$xor', '$each', '$meta'
    ],
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * check if key is an operator
     */
    isOperator(key) {
        return this.list.indexOf(key) > -1;
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Default operator
     */
    $default(src, defaultValue, path, validator) {
        // if default value equals to Date.now ref or 'Date.now' string, then set it to Date.now()
        if (defaultValue === Date.now || defaultValue === 'Date.now')
            defaultValue = Date.now();
        // inject the default value into the src
        inject_value_1.injectValue(src, path, defaultValue);
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Filter operator
     */
    $filter(src, keepList) {
        let srcKeys = Object.keys(src);
        let omitList = [];
        for (let i = 0; i < srcKeys.length; i++)
            if (keepList.indexOf(srcKeys[i]) === -1)
                omitList.push(srcKeys[i]);
        if (omitList.length)
            omit_1.omit(src, omitList);
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Strict operator
     */
    $strict(src, keys, path, msg) {
        // if no keys then strict mode is off
        if (!keys || keys.length === 0)
            return;
        // loop through src keys and find invalid keys
        for (let prop in src) {
            if (keys.indexOf(prop) === -1)
                throw new errors_1.ValidallValidationError({
                    method: '$strict',
                    path: path ? path + '.' + prop : prop,
                    expected: 'not exist',
                    got: prop
                }, `${path ? path + '.' + prop : prop} is not allowed.`, msg);
        }
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Type operator
     */
    $type(src, type, path, msg, validator) {
        if (types_1.Types.getTypesOf(src).indexOf(type) === -1)
            throw new errors_1.ValidallValidationError({
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
    $ref(src, vali, path, msg, validator) {
        try {
            vali.validate(src, true);
        }
        catch (err) {
            throw new errors_1.ValidallValidationError({
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
    $instanceof(src, constructor, path, msg, validator) {
        if (!(src instanceof constructor))
            throw new errors_1.ValidallValidationError({
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
    $is(src, patternName, path, msg, validator) {
        if (!is_1.Is[patternName](src))
            throw new errors_1.ValidallValidationError({
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
    $cast(src, type, path, msg, validator) {
        try {
            // try to cast src
            inject_value_1.injectValue(validator.src, path, cast_1.cast(src, type));
        }
        catch (err) {
            throw new errors_1.ValidallValidationError({
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
    $to(src, methods, path, msg, validator) {
        for (let i = 0; i < methods.length; i++) {
            try {
                // try to update src
                inject_value_1.injectValue(validator.src, path, to_1.To[methods[i]]);
            }
            catch (err) {
                throw new errors_1.ValidallValidationError({
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
    $equals(src, target, path, msg, validator) {
        // save equality result
        let areEqual = src === target;
        // if src and target are equal and negate mode is on throw validation error
        if (areEqual && validator.negateMode)
            throw new errors_1.ValidallValidationError({
                method: '$equals',
                expected: 'src and target are not equal',
                got: src,
                path: path
            }, `expected ${path} not equal to ${target}`, msg);
        // if src and target are not equal and negate mode is off throw validation error
        if (!areEqual && !validator.negateMode)
            throw new errors_1.ValidallValidationError({
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
    $deepEquals(src, target, path, msg, validator) {
        // save equality result
        let areEqual = equals_1.equals(src, target, true);
        // if src and target are equal and negate mode is on throw validation error
        if (areEqual && validator.negateMode)
            throw new errors_1.ValidallValidationError({
                method: '$equals',
                expected: 'src and target are not deeply equal',
                got: src,
                path: path
            }, `expected ${path} not deeply equal to ${target}`, msg);
        // if src and target are not equal and negate mode is off throw validation error
        if (!areEqual && !validator.negateMode)
            throw new errors_1.ValidallValidationError({
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
    $gt(src, limit, path, msg, validator) {
        if (typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'number',
                got: typeof src + ': ' + src,
                method: '$gt',
                path: path
            }, `${src} is not a number`, msg);
        if (src <= limit)
            throw new errors_1.ValidallValidationError({
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
    $gte(src, limit, path, msg, validator) {
        if (typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'number',
                got: typeof src + ': ' + src,
                method: '$gte',
                path: path
            }, `${src} is not a number`, msg);
        if (src < limit)
            throw new errors_1.ValidallValidationError({
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
    $lt(src, limit, path, msg, validator) {
        if (typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'number',
                got: typeof src + ': ' + src,
                method: '$lt',
                path: path
            }, `${src} is not a number`, msg);
        if (src >= limit)
            throw new errors_1.ValidallValidationError({
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
    $lte(src, limit, path, msg, validator) {
        if (typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'number',
                got: typeof src + ': ' + src,
                method: '$lte',
                path: path
            }, `${src} is not a number`, msg);
        if (src > limit)
            throw new errors_1.ValidallValidationError({
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
    $inRange(src, range, path, msg, validator) {
        if (typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'number',
                got: typeof src + ': ' + src,
                method: '$inRange',
                path: path
            }, `${path} must be a number!`, msg);
        if (src >= range[0] && src <= range[1] && validator.negateMode)
            throw new errors_1.ValidallValidationError({
                method: '$inRange',
                expected: 'src must not be in range',
                got: src,
                path: path
            }, `${path} must not be in range between ${range}`, msg);
        if ((src < range[0] || src > range[1]) && !validator.negateMode)
            throw new errors_1.ValidallValidationError({
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
    $regex(src, pattern, path, msg, validator) {
        if (!pattern.test(src))
            throw new errors_1.ValidallValidationError({
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
    $length(src, options, path, msg, validator) {
        if (typeof src !== 'string' && !Array.isArray(src))
            throw new errors_1.ValidallValidationError({
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
    $size(src, options, path, msg, validator) {
        if (!types_1.Types.object(src))
            throw new errors_1.ValidallValidationError({
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
    $keys(src, options, path, msg, validator) {
        if (!types_1.Types.object(src))
            throw new errors_1.ValidallValidationError({
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
    $intersect(src, list, path, msg, validator) {
        src = Array.isArray(src) ? src : [src];
        list = Array.isArray(list) ? list : [list];
        let looper = src.length < list.length ? src : list;
        let checker = looper === src ? list : src;
        for (let i = 0; i < looper.length; i++)
            if (checker.indexOf(looper[i]) > -1)
                if (validator.negateMode)
                    throw new errors_1.ValidallValidationError({
                        method: '$intersect',
                        expected: 'no shared values',
                        got: src,
                        path: path
                    }, `${path} must not share any value with ${list}`, msg);
                else
                    return;
        if (!validator.negateMode)
            throw new errors_1.ValidallValidationError({
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
    $enum(src, list, path, msg, validator) {
        src = Array.isArray(src) ? src : [src];
        list = Array.isArray(list) ? list : [list];
        let allIncluded = true;
        for (let i = 0; i < src.length; i++)
            if (list.indexOf(src[i]) === -1) {
                if (!validator.negateMode)
                    throw new errors_1.ValidallValidationError({
                        method: '$enum',
                        expected: 'included value',
                        got: src,
                        path: path
                    }, `${path} value must not be out of ${list}`, msg);
                allIncluded = false;
            }
        if (validator.negateMode && allIncluded)
            throw new errors_1.ValidallValidationError({
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
    $include(src, list, path, msg, validator) {
        src = Array.isArray(src) ? src : [src];
        list = Array.isArray(list) ? list : [list];
        let allIncluded = true;
        for (let i = 0; i < list.length; i++)
            if (src.indexOf(list[i]) === -1) {
                if (!validator.negateMode)
                    throw new errors_1.ValidallValidationError({
                        method: '$include',
                        expected: 'include all values',
                        got: src,
                        path: path
                    }, `${path} value must include ${list[i]}`, msg);
                allIncluded = false;
            }
        if (validator.negateMode && allIncluded)
            throw new errors_1.ValidallValidationError({
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
    $on(src, date, path, msg, validator) {
        if (!types_1.Types.date(src) && typeof src !== 'string' && typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'date instance, string or number',
                got: typeof src + ': ' + src,
                method: '$on',
                path: path
            }, `${path} must be date instance, string or number`, msg);
        if (typeof src === 'string') {
            let d = new Date(src);
            if (d.toString() === "Invalid Date")
                throw new errors_1.ValidallValidationError({
                    method: '$on',
                    expected: 'a valid date',
                    got: src,
                    path: path
                }, `${path} must be a valid date`, msg);
        }
        if (typeof src === 'number')
            src = new Date(src);
        if (Date.parse(src) !== Date.parse(date))
            throw new errors_1.ValidallValidationError({
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
    $before(src, date, path, msg, validator) {
        if (!types_1.Types.date(src) && typeof src !== 'string' && typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'date instance, string or number',
                got: typeof src + ': ' + src,
                method: '$before',
                path: path
            }, `${path} must be date instance, string or number`, msg);
        if (typeof src === 'string') {
            let d = new Date(src);
            if (d.toString() === "Invalid Date")
                throw new errors_1.ValidallValidationError({
                    method: '$before',
                    expected: 'a valid date',
                    got: src,
                    path: path
                }, `${path} must be a valid date`, msg);
        }
        if (typeof src === 'number')
            src = new Date(src);
        if (Date.parse(src) >= Date.parse(date))
            throw new errors_1.ValidallValidationError({
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
    $after(src, date, path, msg, validator) {
        if (!types_1.Types.date(src) && typeof src !== 'string' && typeof src !== 'number')
            throw new errors_1.ValidallValidationError({
                expected: 'date instance, string or number',
                got: typeof src + ': ' + src,
                method: '$after',
                path: path
            }, `${path} must be date instance, string or number`, msg);
        if (typeof src === 'string') {
            let d = new Date(src);
            if (d.toString() === "Invalid Date")
                throw new errors_1.ValidallValidationError({
                    method: '$after',
                    expected: 'a valid date',
                    got: src,
                    path: path
                }, `${path} must be a valid date`, msg);
        }
        if (typeof src === 'number')
            src = new Date(src);
        if (Date.parse(src) <= Date.parse(date))
            throw new errors_1.ValidallValidationError({
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
    $not(src, options, path, msg, validator) {
        validator.negateMode = !validator.negateMode;
        validator.next(src, options, path);
        validator.negateMode = !validator.negateMode;
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * And Operator
     */
    $and(src, options, path, msg, validator) {
        for (let i = 0; i < options.length; i++)
            validator.next(src, options[i], path);
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Or Operator
     */
    $or(src, options, path, msg, validator) {
        let errors = [];
        for (let i = 0; i < options.length; i++) {
            try {
                validator.next(src, options[i], path);
                return;
            }
            catch (err) {
                errors.push(err.short);
            }
        }
        throw new errors_1.ValidallValidationError({
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
    $xor(src, options, path, msg, validator) {
        let passed = [];
        let errors = [];
        for (let i = 0; i < options.length; i++) {
            try {
                validator.next(src, options[i], path);
                passed.push(options[i]);
                if (passed.length > 1)
                    break;
            }
            catch (err) {
                errors.push(err.short);
            }
        }
        if (passed.length === 1)
            return;
        if (passed.length === 0) {
            throw new errors_1.ValidallValidationError({
                method: '$xor',
                expected: 'only one validation passes',
                got: 'all validations failed',
                path: path
            }, errors.join(' or '), msg);
        }
        else {
            let errorMsg = '';
            for (let i = 0; i < passed.length; i++)
                errorMsg += 'passed: ' + JSON.stringify(passed[i]) + '\n';
            throw new errors_1.ValidallValidationError({
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
    $nor(src, options, path, msg, validator) {
        let error;
        validator.negateMode = true;
        for (let i = 0; i < options.length; i++) {
            try {
                validator.next(src, options[i], path);
            }
            catch (err) {
                error = err.short;
                break;
            }
        }
        validator.negateMode = false;
        if (error) {
            throw new errors_1.ValidallValidationError({
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
    $map(src, schema, path, msg, validator) {
        for (let prop in src) {
            validator.next(src[prop], schema, `${path}.${prop}`);
        }
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Each Operator
     */
    $each(src, schema, path, msg, validator) {
        for (let i = 0; i < src.length; i++) {
            validator.next(src[i], schema, `${path}[${i}]`);
        }
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Properties Operator
     */
    $props(src, schema, path, msg, validator) {
        for (let prop in schema)
            if (schema.hasOwnProperty(prop))
                validator.next(src[prop], schema[prop], `${path}${path ? '.' : ''}${prop}`);
    },
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Paths Operator
     */
    $paths(src, schema, path, msg, validator) {
        for (let prop in schema)
            if (schema.hasOwnProperty(prop))
                validator.next(get_value_1.getValue(src, prop), schema[prop], `${path}${path ? '.' : ''}${prop}`);
    }
};
