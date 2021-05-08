var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getValue } from '@pestras/toolbox/object/get-value';
import { ValidallValidationError } from "./errors";
import { Operators } from './operators';
import { saveValidator, getValidator, hasId } from './repo';
import { validateSchema } from './validate-schema';
import { injectValue } from '@pestras/toolbox/object/inject-value';
import { objFromMap } from '@pestras/toolbox/object/object-from-map';
import { setValue } from '@pestras/toolbox/object/set-value';
import { fetch } from '@pestras/toolbox/fetch';
export class Validall {
    constructor(options, map) {
        this.negateMode = false;
        this.meta = {};
        this._error = null;
        this.orgSchema = null;
        this._schema = null;
        this.options = null;
        this.isPrepared = false;
        this.defaults = {};
        this.nullables = [];
        this.src = null;
        this._id = options.id || null;
        this.orgSchema = options.schema;
        this.options = {
            strict: !!options.strict,
            filter: !!options.filter,
            required: !!options.required,
            nullable: !!options.nullable,
            throwMode: !!options.throwMode
        };
        if (map) {
            this._schema = objFromMap(map, {}, options.schema, { ignoreKeys: true });
            this.map = map;
        }
        else {
            this._schema = options.schema;
        }
        // extract meta data form schema
        this.saveMeta(this._schema);
        // before starting validate process, schema should be cleaned, pluged with default values and validated
        if (!options.lazy) {
            validateSchema(this._schema, this.options);
            this.isPrepared = true;
        }
        if (this._id && (!hasId(this._id) || options.replaceSchema))
            saveValidator(this._id, this);
    }
    get id() { return this._id; }
    get error() {
        return this._error;
    }
    get schema() { return Object.assign({}, this._schema); }
    saveMeta(schema, path = '') {
        // register meta with the current path if exist
        if (schema.hasOwnProperty('$meta'))
            this.meta[path || this._id || 'root'] = schema.$meta;
        if (schema.hasOwnProperty('$props')) {
            for (let prop in schema.$props)
                this.saveMeta(schema.$props[prop], `${path ? path + '.' : ''}${prop}`);
        }
        if (schema.hasOwnProperty('$paths')) {
            for (let prop in schema.$paths)
                this.saveMeta(schema.$paths[prop], `${path ? path + '.' : ''}${prop}`);
        }
    }
    reset() {
        this.negateMode = false;
        this._error = null;
    }
    /**
     *
     */
    next(src, schema = this._schema, path = '') {
        if (src === undefined) {
            // if src was not set && $default operator was set, use the default value
            if (schema.$default !== undefined)
                Operators.$default(this.src, schema.$default, path, this);
            // if $default was not set
            // check if $nullable operator is set to true or validator instance option nullable was set true
            // then assign null value to the src
            else if (schema.$nullable) {
                if (!path)
                    src = null;
                else
                    injectValue(this.src, path, null);
                // if field is required throw a validation error
            }
            else if (schema.$required)
                throw new ValidallValidationError({
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
        if (schema.$props) {
            if (schema.$filter)
                Operators.$filter(src, Object.keys(schema.$props));
            else if (schema.$strict)
                Operators.$strict(src, Object.keys(schema.$props), path, schema.$message);
        }
        // run the rest operaotrs
        for (let operator in schema) {
            // escape already checked operators
            if (['$required', '$message', '$default', '$strict', '$filter', '$nullable', '$meta'].indexOf(operator) > -1)
                continue;
            src = path ? getValue(this.src, path) || src : src;
            Operators[operator](src, schema[operator], path, schema.$message, this);
        }
    }
    set(keyPath, value) {
        let oldValue = getValue(this.map, keyPath);
        setValue(this.map, keyPath, value);
        try {
            let schema = objFromMap(this.map, {}, this.orgSchema, { ignoreKeys: true });
            validateSchema(schema, this.options);
            this._schema = schema;
            return null;
        }
        catch (err) {
            setValue(this.map, keyPath, oldValue);
            return err;
        }
    }
    validate(src, throwErr = false) {
        this.src = src;
        this.reset();
        if (!this.isPrepared) {
            validateSchema(this._schema, this.options);
            this.isPrepared = true;
        }
        if (src === undefined) {
            if (this._schema === undefined)
                return true;
            this._error = new ValidallValidationError({
                method: 'validate',
                expected: 'not undefined',
                got: src,
                path: '.',
            }, 'undefined src', this._schema.$message);
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
    static ImportSchema(config, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let validatorOptions;
            try {
                let res = yield fetch(config);
                if (options.map)
                    validatorOptions = getValue(res.data, options.map);
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
        return getValidator(id);
    }
    static ValidateSchema(options) {
        try {
            validateSchema(options.schema, options);
        }
        catch (err) {
            return err;
        }
        return null;
    }
}
