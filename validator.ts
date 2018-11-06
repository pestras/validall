import { getValue } from 'tools-box/object/get-value';
import { ISchema, ISchemaOptions, IOptions, IImportOptions } from "./schema";
import { ValidallValidationError, ValidallInvalidArgsError } from "./errors";
import { Operators } from './operators';
import axios, { AxiosRequestConfig } from 'axios';
import { saveValidator, getValidator, hasId } from './repo';
import { validateSchema } from './validate-schema';
import { injectValue } from 'tools-box/object/inject-value';

export class Validall {
  private _id: string;
  private negateMode = false;
  private meta: any = {};
  private _error: any = null;
  private schema: ISchema = null;
  private options: ISchemaOptions = null;
  private isPrepared = false;

  defaults: { [key: string]: any } = {};
  nullables: string[] = [];
  src: any = null;

  constructor(options: IOptions) {
    this.schema = options.schema || null;
    this._id = options.id || null;

    this.options = {
      strict: !!options.strict,
      filter: !!options.filter,
      required: !!options.required,
      nullable: !!options.nullable,
      throwMode: !!options.throwMode
    }

    // extract meta data form schema
    this.saveMeta(this.schema);

    // before starting validate process, schema should be cleaned, pluged with default values and validated
    if (!options.lazy) {
      validateSchema(this.schema, this.options);
      this.isPrepared = true;
    }

    if (this._id && (!hasId(this._id) || options.replaceSchema))
      saveValidator(this._id, this);
  }

  get id(): string { return this._id; }
  get error(): Error {
    return this._error;
  }

  private saveMeta(schema: ISchema, path: string = '') {
    // register meta with the current path if exist
    if (schema.hasOwnProperty('$meta'))
      this.meta[path || this._id || 'root'] = schema.$meta;

    if (schema.hasOwnProperty('$props')) {
      for (let prop in schema.$props)
        this.saveMeta(schema.$props[prop], `${path ? path + '.' : ''}${prop}`);
    }
  }

  private reset() {
    this.negateMode = false;
    this._error = null;
  }

  /**
   *  
   */
  private next(src: any, schema: ISchema = this.schema, path: string = '') {
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
      } else if (schema.$required)
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
    if (schema.$props && schema.$filter)
      Operators.$filter(src, Object.keys(schema.$props));

    // run the rest operaotrs
    for (let operator in schema) {
      // escape already checked operators
      if (['$required', '$message', '$default', '$filter', '$nullable', '$meta'].indexOf(operator) > -1)
        continue;

      (<any>Operators)[operator](src, schema[<keyof ISchema>operator], path, schema.$message, this);
    }
  }

  validate(src: any, throwErr = false, negateMode = false) {
    this.src = src;
    this.reset();

    if (!this.isPrepared) {
      validateSchema(this.schema, this.options)
      this.isPrepared = true;
    }

    if (src === undefined) {
      if (this.schema === undefined)
        return true;

      this._error = new ValidallValidationError({
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
    } catch (err) {
      this._error = err;
      if (this.options.throwMode || throwErr)
        throw this._error;

      return false;
    }

    return true;
  }

  getPropMeta(prop?: string): any {
    if (prop)
      return this.meta[prop];
    else
      return this.meta[this._id || 'root'];
  }

  getAllMeta(): any {
    return this.meta;
  }

  getMetaByName(name: string) {
    let results: { [key: string]: any }[] = [];

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

  static async ImportSchema(request: string | AxiosRequestConfig, options: IImportOptions = {}): Promise<Validall> {
    if (!axios)
      throw "[validall error]: axios is required for 'ImportSchema' method to work properly";

    let validatorOptions: IOptions;

    try {
      let res = await axios(<any>request);

      if (options.map)
        validatorOptions = getValue(res.data, options.map);
      else
        validatorOptions = res.data;

    } catch (err) {
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
  }

  static GetValidator(id: string): Validall {
    return getValidator(id);
  }

  static ValidateSchema(options: IOptions): ValidallInvalidArgsError {

    try {
      validateSchema(options.schema, options);
    } catch (err) {
      return err;
    }

    return null;
  }
}