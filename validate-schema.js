"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("./operators");
const types_1 = require("tools-box/types");
const set_value_1 = require("tools-box/object/set-value");
const errors_1 = require("./errors");
const is_1 = require("tools-box/is");
const to_1 = require("./to");
const repo_1 = require("./repo");
function validateSchema(schema, options, path = "") {
    schema.$required = schema.$required === false ? false : schema.$required || options.required;
    schema.$nullable = schema.$nullable === false ? false : schema.$nullable || options.nullable;
    for (let operator in schema) {
        let currentPath = path ? `${path}.${operator}` : operator;
        if (operators_1.Operators.isOperator(operator)) {
            operatorsValidator[operator](schema[operator], schema, currentPath, options);
            if (operator === '$props')
                for (let prop in schema[operator])
                    validateSchema(schema.$props[prop], options, `${currentPath}.${prop}`);
        }
        else {
            throw new errors_1.ValidallInvalidArgsError({
                method: 'validateSchema',
                expected: 'valid operator',
                got: operator,
                path: path
            });
        }
    }
}
exports.validateSchema = validateSchema;
function validateOperator(operator, value) {
}
const operatorsValidator = {
    $message(value, schema, path) {
        if (value && typeof value !== 'string' || types_1.Types.function(value))
            throw new errors_1.ValidallInvalidArgsError({
                method: '$message',
                expected: 'string or function',
                got: `${typeof value}: ${value}`,
                path: path
            });
    },
    $required(value, schema, path) {
        if (value && typeof value !== 'boolean')
            throw new errors_1.ValidallInvalidArgsError({
                method: '$required',
                expected: 'boolean',
                got: `${typeof value}: ${value}`,
                path: path
            });
    },
    $nullable(value, schema, path) {
        if (value && typeof value !== 'boolean')
            throw new errors_1.ValidallInvalidArgsError({
                method: '$nullable',
                expected: 'boolean',
                got: `${typeof value}: ${value}`,
                path: path
            });
    },
    $default(value, schema, path) {
        if (!value || !schema.$type)
            return;
        let type = schema.$type;
        let match = false;
        if (Array.isArray(type)) {
            if (type.length === 1)
                match = types_1.Types.arrayOf(type[0], value);
            else {
                if (!Array.isArray(value) || value.length !== type.length)
                    throw new errors_1.ValidallInvalidArgsError({
                        method: '$default',
                        expected: `${type}`,
                        got: value,
                        path: path
                    });
                for (let i = 0; i < type.length; i++)
                    if (Array.isArray(type[i])) {
                        if (!types_1.Types.arrayOf(type[i][0], value[i])) {
                            throw new errors_1.ValidallInvalidArgsError({
                                method: '$default',
                                got: `${typeof value[i]}: ${value[i]}`,
                                expected: `${type}`,
                                path: path
                            });
                        }
                    }
                    else if (types_1.Types.getTypesOf(value[i]).indexOf(type[i]) === -1) {
                        throw new errors_1.ValidallInvalidArgsError({
                            method: '$default',
                            got: `${typeof value[i]}: ${value[i]}`,
                            expected: `${type}`,
                            path: path
                        });
                    }
            }
        }
        else {
            // save type match
            match = types_1.Types.getTypesOf(value).indexOf(type) > -1;
        }
        // if not type match and negate mode is off also throw validation error
        if (!match)
            throw new errors_1.ValidallInvalidArgsError({
                method: '$default',
                expected: `${type}`,
                got: `${typeof value}: ${value}`,
                path: path
            });
    },
    $filter(value, schema, path, options) {
        if (value && typeof value !== 'boolean')
            throw new errors_1.ValidallInvalidArgsError({
                method: '$filter',
                expected: 'boolean',
                got: `${typeof value}: ${value}`,
                path: path
            });
        if (!schema.$props)
            throw new errors_1.ValidallInvalidArgsError({
                method: '$filter',
                expected: 'has $props operator',
                got: null,
                path: path
            });
    },
    $strict(value, schema, path) {
        if (value && typeof value !== 'boolean' && !Array.isArray(value))
            throw new errors_1.ValidallInvalidArgsError({
                method: '$strict',
                expected: 'boolean',
                got: `${typeof value}: ${value}`,
                path: path
            });
    },
    $meta() { return true; },
    $type(value, schema, path) {
        if (!types_1.Types.isValidType(value))
            throw new errors_1.ValidallInvalidArgsError({
                method: '$type',
                expected: 'valid type name',
                got: value,
                path: path
            });
    },
    $ref(value, schema, path) {
        if (typeof value !== 'string')
            throw new errors_1.ValidallInvalidArgsError({
                method: '$ref',
                expected: 'string',
                got: `${typeof value}: ${value}`,
                path: path
            });
        let validator = repo_1.getValidator(value);
        if (!validator)
            throw new errors_1.ValidallInvalidArgsError({
                method: '$ref',
                expected: 'valid id or alias',
                got: value,
                path: path
            });
        set_value_1.setValue(schema, '$ref', Array.isArray(value) ? [validator] : validator);
    },
    $instanceof(value, schema, path) {
        if (typeof value !== 'function')
            throw new errors_1.ValidallInvalidArgsError({
                method: '$instanceof',
                expected: 'constructor function',
                got: value,
                path: path
            });
    },
    $is(value, schema, path) {
        if (Object.keys(is_1.Is).indexOf(value) === -1)
            throw new errors_1.ValidallInvalidArgsError({
                method: '$Is',
                expected: 'valid pattern name',
                got: value,
                path: path
            });
    },
    $cast(value, schema, path) {
        if (['boolean', 'string', 'number', 'date', 'regexp', 'array'].indexOf(value) === -1)
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'supported type name',
                got: value,
                method: '$cast',
                path: path
            });
    },
    $to(value, schema, path) {
        let methods = Array.isArray(value) ? value : [value];
        // loop through methods and check if each is valid
        for (let i = 0; i < methods.length; i++)
            if (Object.keys(to_1.To).indexOf(methods[i]) === -1)
                throw new errors_1.ValidallInvalidArgsError({
                    expected: 'valid method name',
                    got: methods[i],
                    method: '$to',
                    path: path
                });
        set_value_1.setValue(schema, '$to', methods);
    },
    $equals() { return true; },
    $deepEquals() { return true; },
    $gt(value, schema, path, operator = '$gt') {
        if (typeof value !== 'number')
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'number',
                got: typeof value + ': ' + value,
                method: operator,
                path: path
            });
    },
    $gte(value, schema, path) {
        this.$gt(value, schema, path, '$gte');
    },
    $lt(value, schema, path) {
        this.$gt(value, schema, path, '$lt');
    },
    $lte(value, schema, path) {
        this.$gt(value, schema, path, '$lte');
    },
    $inRange(value, schema, path) {
        if (typeof value[0] !== 'number' && typeof value[1] !== 'number' && value.length !== 2)
            throw new errors_1.ValidallInvalidArgsError({
                expected: '[number, number]',
                got: typeof value + ': ' + value,
                method: '$inRange',
                path: path
            });
        if (value[0] === value[1])
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'range[0] < range[1]',
                got: value,
                method: '$inRange',
                path: path
            });
        if (value[0] > value[1]) {
            value = [value[1], value[0]];
            set_value_1.setValue(schema, '$inRange', value);
        }
    },
    $regex(value, schema, path) {
        if (!types_1.Types.regexp(value))
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'RegExp',
                got: typeof value + ': ' + value,
                method: '$regex',
                path: path
            });
    },
    $length(value, schema, path) {
        if (typeof value !== 'number' && !types_1.Types.object(value))
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'number or operators object',
                got: typeof value + ': ' + value,
                method: '$length',
                path: path
            });
    },
    $size(value, schema, path) {
        if (typeof value !== 'number' && !types_1.Types.object(value))
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'number or operators object',
                got: typeof value + ': ' + value,
                method: '$size',
                path: path
            });
    },
    $keys(value, schema, path) {
        if (!types_1.Types.object(value))
            throw new errors_1.ValidallInvalidArgsError({
                expected: ' operators object',
                got: typeof value + ': ' + value,
                method: '$keys',
                path: path
            });
    },
    $intersect() { return true; },
    $include() { return true; },
    $enum() { return true; },
    $on(value, schema, path, operator = '$on') {
        if (!types_1.Types.date(value) && typeof value !== 'string' && typeof value !== 'number') {
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'date instance, string or number',
                got: typeof value + ': ' + value,
                method: operator,
                path: path
            });
        }
        if (typeof value === 'string') {
            let d = new Date(value);
            if (d.toString() === "Invalid Date")
                throw new errors_1.ValidallInvalidArgsError({
                    method: operator,
                    expected: 'a valid date',
                    got: value,
                    path: path
                });
        }
        if (typeof value === 'number') {
            value = new Date(value);
            set_value_1.setValue(schema, operator, value);
        }
    },
    $before(value, schema, path) {
        this.$on(value, schema, path, '$before');
    },
    $after(value, schema, path) {
        this.$on(value, schema, path, '$after');
    },
    $not() { return true; },
    $and(value, schema, path, operator = '$and') {
        if (!Array.isArray(value))
            throw new errors_1.ValidallInvalidArgsError({
                expected: 'array of schemas',
                got: typeof value + ': ' + value,
                method: operator,
                path: path
            });
    },
    $or(value, schema, path) {
        this.$and(value, schema, path, '$or');
    },
    $nor(value, schema, path) {
        this.$and(value, schema, path, '$nor');
    },
    $xor(value, schema, path) {
        this.$and(value, schema, path, '$xor');
    },
    $each(value, schema, path, options) {
        schema.$type = 'array';
    },
    $props(value, schema, path, options) {
        if (!types_1.Types.object(value))
            throw new errors_1.ValidallInvalidArgsError({
                method: '$props',
                expected: 'object',
                got: `${typeof value}: value`,
                path: path
            });
        schema.$type = schema.$type || 'object';
        if (schema.$filter === undefined)
            schema.$filter = options.filter;
        if (schema.$strict === undefined)
            schema.$strict = options.strict === false ? false : Object.keys(schema.$props);
        else
            schema.$strict = schema.$strict === true ? Object.keys(schema.$props) : schema.$strict;
    },
    $paths(value, schema, path, options) {
        if (!types_1.Types.object(value))
            throw new errors_1.ValidallInvalidArgsError({
                method: '$props',
                expected: 'object',
                got: `${typeof value}: value`,
                path: path
            });
        schema.$type = schema.$type || 'object';
    }
};
