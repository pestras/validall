"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validall = void 0;
const errors_1 = require("./errors");
const interfaces_1 = require("./interfaces");
const validate_schema_1 = require("./validate-schema");
const extend_1 = require("@pestras/toolbox/object/extend");
const set_own_deep_bulk_props_1 = require("@pestras/toolbox/object/set-own-deep-bulk-props");
const get_value_1 = require("@pestras/toolbox/object/get-value");
const operators_1 = require("./operators");
const util_1 = require("./util");
class Validall {
    constructor(name, schema) {
        this._ctx = new interfaces_1.ValidationContext();
        if (name === undefined)
            throw new errors_1.ValidallError({}, 'expected a schema, got undefined');
        if (typeof name === 'string')
            this._name = name;
        else
            schema = name;
        this._originalSchema = util_1.isSchema(schema)
            ? schema
            : { $props: schema };
        /**
         * ensure schema is valid
         */
        validate_schema_1.validateSchema(this._originalSchema, 'Schema', this._ctx);
        /**
         * if validator has a name, then it will be saved in the store repo, for later referencing,
         * it will replace any matching previuos validator name if set to replaceSchema
         */
        if (this._name)
            util_1.ValidallRepo.set(this._name, this);
    }
    static Get(name) {
        return util_1.ValidallRepo.get(name);
    }
    get name() { return this._name; }
    get error() { return this._error; }
    get schema() { return extend_1.extend({}, this._originalSchema); }
    _reset() {
        this._error = null;
        this._schema = null;
        // this._checksCount = 0;
        for (let prop in this._ctx.aliasStates)
            this._ctx.aliasStates[prop] = false;
    }
    _next(ctx) {
        // this._checksCount += 1;
        // console.log('');
        // console.log('next - checksCount:', this._checksCount);
        // console.log('next - aliasStated:', ctx.aliasStates);
        // console.log('next - localPath:', `'${ctx.localPath}'`);
        // console.log('next - fullPath:', `'${ctx.fullPath}'`);
        // console.log('next - schemaKeys:', Object.keys(ctx.schema));
        // console.log('-----------------------------------------------------------------------------------------');
        // console.log('');
        ctx.message = ctx.schema.$message || '';
        if (ctx.currentInput === undefined || ctx.currentInput === null)
            operators_1.Operators.undefinedOrNullInput(ctx);
        else {
            for (let operator in ctx.schema) {
                // skip none validators operators or already checked operaotrs
                if (operators_1.Operators.isSkipping(operator))
                    continue;
                if (operator === '$name' && typeof ctx.schema.$name === 'string')
                    continue;
                operators_1.Operators[operator](ctx);
            }
        }
        if (ctx.schema.$name) {
            if (typeof ctx.schema.$name === 'string')
                ctx.aliasStates[ctx.schema.$name] = true;
            else
                for (let $name of ctx.schema.$name)
                    if (typeof $name === 'string')
                        ctx.aliasStates[$name] = true;
        }
    }
    _prepareSchema(ctx) {
        this._schema = extend_1.extend({}, this._originalSchema);
        set_own_deep_bulk_props_1.setOwnDeepBulkProps(this._schema, [
            '$equalsRef',
            '$deepEqualsRef',
            '$gtRef',
            '$gteRef',
            '$gteRef',
            '$ltRef',
            '$lteRef',
            '$onRef',
            '$beforeRef',
            '$afterRef'
        ], (val, operator) => {
            return ['$onRef', '$beforeRef', '$afterRef'].includes(operator)
                ? new Date(get_value_1.getValue(ctx.input, val))
                : get_value_1.getValue(ctx.input, val);
        });
    }
    validate(input, path) {
        this._reset();
        if (input === undefined) {
            this._error = new errors_1.ValidallError({}, this._schema.$message || 'undefinedValidallInput');
            return false;
        }
        let ctx = this._ctx.clone({
            input,
            currentInput: input,
            isSubSchema: !!path,
            next: (c) => this._next(c),
            localPath: '',
            inputPath: path || ''
        });
        this._prepareSchema(ctx);
        ctx.schema = this._schema;
        try {
            this._next(ctx);
        }
        catch (e) {
            if (ctx.isSubSchema)
                throw e;
            this._error = e;
            return false;
        }
        return true;
    }
}
exports.Validall = Validall;
//# sourceMappingURL=index.js.map