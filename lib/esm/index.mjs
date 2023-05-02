// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { ValidallError } from "./errors";
import { ValidationContext } from "./interfaces";
import { validateSchema } from "./validate-schema";
import { getValue, extend, setOwnDeepBulkProps, plant$propsOperator } from './util';
import { Operators } from "./operators";
import { ValidallRepo } from "./util";
export class Validall {
    /** Unique identifier to reference the current instance in other schemas */
    _name;
    _originalSchema;
    _schema;
    _error;
    _ctx = new ValidationContext({ logger: Validall.Logger, loggerDisabled: Validall.LoggerDisabled });
    constructor(name, schema) {
        if (name === undefined)
            throw new ValidallError({}, 'expected a schema, got undefined');
        if (typeof name === 'string')
            this._name = name;
        else
            schema = name;
        this._originalSchema = plant$propsOperator(schema);
        /**
         * if validator has a name, then it will be saved in the store repo, for later referencing,
         * it will replace any matching previuos validator name if set to replaceSchema
         */
        if (this._name)
            ValidallRepo.set(this._name, this);
        /** ensure schema is valid */
        try {
            validateSchema(this._originalSchema, 'Schema', this._ctx, this._name);
        }
        catch (error) {
            if (this._name)
                ValidallRepo.delete(this._name);
            throw error;
        }
    }
    static Get(name) {
        return ValidallRepo.get(name);
    }
    get name() { return this._name; }
    get error() { return this._error; }
    get schema() { return extend({}, this._originalSchema); }
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
        if (!!ctx.schema.$log)
            Operators.$log(ctx);
        if (ctx.currentInput === undefined || ctx.currentInput === null)
            Operators.undefinedOrNullInput(ctx);
        else if (ctx.currentInput === '' && ctx.schema.$type === 'string' && ctx.schema.$default !== undefined)
            Operators.$default(ctx);
        else {
            for (let operator in ctx.schema) {
                // skip none validators operators or already checked operaotrs
                if (Operators.isSkipping(operator))
                    continue;
                if (operator === '$name' && typeof ctx.schema.$name === 'string')
                    continue;
                Operators[operator](ctx);
            }
        }
        if (ctx.schema.$name) {
            if (typeof ctx.schema.$name === 'string')
                ctx.aliasStates[ctx.schema.$name] = true;
            else
                for (let $name of ctx.schema.$name)
                    if (typeof $name === 'string')
                        ctx.aliasStates[$name] = true;
                    else
                        ctx.next(ctx.clone({ schema: $name }));
        }
        else if (ctx.schema.$as) {
            ctx.aliasStates[ctx.schema.$as] = true;
        }
    }
    _prepareSchema(ctx) {
        this._schema = extend({}, this._originalSchema);
        setOwnDeepBulkProps(this._schema, [
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
                ? new Date(getValue(ctx.input, val))
                : getValue(ctx.input, val);
        });
    }
    validate(input, parentCtx) {
        this._reset();
        if (input === undefined) {
            this._error = new ValidallError({}, this._schema?.$message || 'undefinedValidallInput');
            return false;
        }
        let ctx = this._ctx.clone({
            input,
            currentInput: input,
            parentCtx,
            next: (c) => this._next(c),
            localPath: '',
            inputPath: parentCtx?.fullPath || ''
        });
        this._prepareSchema(ctx);
        ctx.schema = this._schema;
        try {
            this._next(ctx);
        }
        catch (e) {
            if (ctx.parentCtx)
                throw e;
            this._error = e;
            return false;
        }
        return true;
    }
    static Logger = console;
    static LoggerDisabled = false;
    static UseLogger(logger, disabled = false) {
        this.Logger = logger || console;
        this.LoggerDisabled = disabled;
    }
}
