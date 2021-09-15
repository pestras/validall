"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const errors_1 = require("./errors");
const is_1 = require("@pestras/toolbox/is");
const types_1 = require("@pestras/toolbox/types");
const operators_1 = require("./operators");
const util_1 = require("./util");
function validateSchema(schema, path, ctx, vName) {
    for (let operator in schema) {
        let currPath = `${path}.${operator}`;
        let value = schema[operator];
        // console.log('');
        // console.log(currPath);
        // console.log(schema);
        // console.log('-----------------------------------');
        // console.log('');
        if (operator === '$name')
            if (typeof schema.$name === 'string')
                ctx.aliasStates[schema.$name] = false;
            else
                for (let $name of schema.$name)
                    if (typeof $name === 'string')
                        ctx.aliasStates[$name] = false;
                    else
                        ctx.aliasStates[$name.$as] = false;
        // check date
        else if (['$on', '$before', '$after'].indexOf(operator) > -1) {
            if (!is_1.Is.date(value))
                throw new errors_1.ValidallError(ctx, `invalid '${currPath}' date argument: (${typeof value}: ${value})`, currPath);
            schema[operator] = new Date(schema[operator]);
            schema.$is = 'date';
        }
        else if (operator === '$ref') {
            if (vName && util_1.ReferenceState.HasReference(value, vName))
                throw new errors_1.ValidallError(ctx, `cycle referencing between ${value} and ${vName} validators`);
            if (!util_1.ValidallRepo.has(value))
                throw new errors_1.ValidallError(ctx, `'${currPath}' reference not found: (${value})`, currPath);
            util_1.ReferenceState.SetReference(value, vName);
        }
        else if (operator === '$default' && schema.$type) {
            if (typeof value === 'string' && value.charAt(0) === '$')
                return;
            if (!types_1.Types[schema.$type](value))
                throw new errors_1.ValidallError(ctx, `invalid '${currPath}' argument type: (${typeof value}: ${value}), expected to be of type (${schema.$type})`, currPath);
        }
        else if ((operator === '$filter' || operator === '$strict') && !schema.$props)
            throw new errors_1.ValidallError(ctx, `'${currPath}' requires a sibling '$props' operator`, currPath);
        else if (operators_1.Operators.isNumberOperator(operator)) {
            schema.$type = "number";
        }
        else if (operators_1.Operators.isParentingObject(operator)) {
            schema.$type = "object";
            for (let prop in schema[operator])
                validateSchema(schema[operator][prop], `${currPath}.${prop}`, ctx);
        }
        else if (operators_1.Operators.isParenting(operator)) {
            if (operator === '$each' || operator === '$length')
                schema.$type = "array";
            else if (operator === '$map' || operator === '$keys' || operator === '$size')
                schema.$type = 'object';
            validateSchema(schema[operator], `${currPath}`, ctx);
        }
        else if (operators_1.Operators.isParentingArray(operator)) {
            for (let [index, segment] of schema[operator].entries())
                validateSchema(segment, `${currPath}.[${index}]`, ctx);
        }
    }
}
exports.validateSchema = validateSchema;
//# sourceMappingURL=validate-schema.js.map