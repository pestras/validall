"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_value_1 = require("tools-box/object/get-value");
const errors_1 = require("./errors");
const operators_1 = require("./operators");
const axios_1 = require("axios");
const repo_1 = require("./repo");
const validate_schema_1 = require("./validate-schema");
const inject_value_1 = require("tools-box/object/inject-value");
class Validall {
    constructor(options) {
        this.negateMode = false;
        this.meta = {};
        this._error = null;
        this.schema = null;
        this.options = null;
        this.isPrepared = false;
        this.defaults = {};
        this.nullables = [];
        this.src = null;
        this.schema = options.schema || null;
        this._id = options.id || null;
        this.options = {
            strict: !!options.strict,
            filter: !!options.filter,
            required: !!options.required,
            nullable: !!options.nullable,
            throwMode: !!options.throwMode
        };
        // extract meta data form schema
        this.saveMeta(this.schema);
        // before starting validate process, schema should be cleaned, pluged with default values and validated
        if (!options.lazy) {
            validate_schema_1.validateSchema(this.schema, this.options);
            this.isPrepared = true;
        }
        if (this._id && (!repo_1.hasId(this._id) || options.replaceSchema))
            repo_1.saveValidator(this._id, this);
    }
    get id() { return this._id; }
    get error() {
        return this._error;
    }
    saveMeta(schema, path = '') {
        // register meta with the current path if exist
        if (schema.hasOwnProperty('$meta'))
            this.meta[path || this._id || 'root'] = schema.$meta;
        if (schema.hasOwnProperty('$props')) {
            for (let prop in schema.$props)
                this.saveMeta(schema.$props[prop], `${path ? path + '.' : ''}${prop}`);
        }
    }
    reset() {
        this.negateMode = false;
        this._error = null;
    }
    /**
     *
     */
    next(src, schema = this.schema, path = '') {
        if (src === undefined) {
            // if src was not set && $default operator was set, use the default value
            if (schema.$default !== undefined)
                operators_1.Operators.$default(this.src, schema.$default, path, this);
            // if $default was not set
            // check if $nullable operator is set to true or validator instance option nullable was set true
            // then assign null value to the src
            else if (schema.$nullable) {
                if (!path)
                    src = null;
                else
                    inject_value_1.injectValue(this.src, path, null);
                // if field is required throw a validation error
            }
            else if (schema.$required)
                throw new errors_1.ValidallValidationError({
                    method: '$required',
                    expected: 'value',
                    got: src,
                    path: path
                }, `${path} is required`, schema.$message);
            return;
        }
        // if src is null and $nullable is enabled
        // register field to validator nullables then exit
        if (src === null && schema.$nullable)
            return;
        // if $filter was set to true
        // remove all unnecessary custom values
        if (schema.$props && schema.$filter)
            operators_1.Operators.$filter(src, Object.keys(schema.$props));
        // run the rest operaotrs
        for (let operator in schema) {
            // escape already checked operators
            if (['$required', '$message', '$default', '$filter', '$nullable', '$meta'].indexOf(operator) > -1)
                continue;
            operators_1.Operators[operator](src, schema[operator], path, schema.$message, this);
        }
    }
    validate(src, throwErr = false, negateMode = false) {
        this.src = src;
        this.reset();
        if (!this.isPrepared) {
            validate_schema_1.validateSchema(this.schema, this.options);
            this.isPrepared = true;
        }
        if (src === undefined) {
            if (this.schema === undefined)
                return true;
            this._error = new errors_1.ValidallValidationError({
                method: 'validate',
                expected: 'not undefined',
                got: src,
                path: '.',
            }, 'undefined src', this.schema.$message);
            if (this.options.throwMode || throwErr)
                throw this._error;
            return false;
        }
        try {
            this.next(src);
        }
        catch (err) {
            this._error = err;
            if (this.options.throwMode || throwErr)
                throw this._error;
            return false;
        }
        return true;
    }
    getPropMeta(prop) {
        if (prop)
            return this.meta[prop];
        else
            return this.meta[this._id || 'root'];
    }
    getAllMeta() {
        return this.meta;
    }
    getMetaByName(name) {
        let results = [];
        if (!name)
            return results;
        for (let prop in this.meta)
            if (this.meta[prop][name] !== undefined)
                results.push({
                    field: prop,
                    value: this.meta[prop][name]
                });
        return results;
    }
    static ImportSchema(request, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!axios_1.default)
                throw "[validall error]: axios is required for 'ImportSchema' method to work properly";
            let validatorOptions;
            try {
                let res = yield axios_1.default(request);
                if (options.map)
                    validatorOptions = get_value_1.getValue(res.data, options.map);
                else
                    validatorOptions = res.data;
            }
            catch (err) {
                console.warn(`[validall warning]: could not fetch schema!`);
                console.error(err);
            }
            if (!validatorOptions)
                throw '[validall error]: invalid validator options - ' + validatorOptions;
            if (options.id)
                validatorOptions.id = options.id;
            validatorOptions.replaceSchema = !!options.replaceSchema;
            if (options.throwMode)
                validatorOptions.throwMode = options.throwMode;
            return new Validall(validatorOptions);
        });
    }
    static GetValidator(id) {
        return repo_1.getValidator(id);
    }
    static ValidateSchema(options) {
        try {
            validate_schema_1.validateSchema(options.schema, options);
        }
        catch (err) {
            return err;
        }
        return null;
    }
}
exports.Validall = Validall;
