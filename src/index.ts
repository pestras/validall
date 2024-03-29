// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ValidallError } from "./errors";
import { IOperators, ISchema, Logger, ValidallOptions, ValidationContext } from "./interfaces";
import { validateSchema } from "./validate-schema";
import { getValue, extend, setOwnDeepBulkProps, plant$propsOperator, globalOptions } from './util';
import { Operators } from "./operators";
import { ValidallRepo } from "./util";

export class Validall {
  /** Unique identifier to reference the current instance in other schemas */
  private _name: string;
  private _originalSchema: IOperators;
  private _schema: IOperators;
  private _error: ValidallError;
  private _ctx = new ValidationContext({ logger: Validall.Logger, loggerDisabled: Validall.LoggerDisabled });

  constructor(schema: ISchema | IOperators)
  constructor(name: string, schema: ISchema | IOperators)
  constructor(
    name: string | ISchema | IOperators,
    schema?: ISchema | IOperators
  ) {
    if (name === undefined)
      throw new ValidallError(<ValidationContext>{}, 'expected a schema, got undefined');

    if (typeof name === 'string') {
      this._name = name;
      this._originalSchema = plant$propsOperator(schema);
    } else {
      this._originalSchema = plant$propsOperator(name);
    }

    /**
     * if validator has a name, then it will be saved in the store repo, for later referencing,
     * it will replace any matching previuos validator name if set to replaceSchema
     */
    if (this._name)
      ValidallRepo.set(this._name, this);

    /** ensure schema is valid */
    try {
      validateSchema(this._originalSchema, 'Schema', this._ctx, this._name);
    } catch (error) {
      if (this._name)
        ValidallRepo.delete(this._name);

      throw error;
    }
  }

  static Get(name: string): Validall {
    return ValidallRepo.get(name);
  }

  static Defaults(options: ValidallOptions) {
    globalOptions.required = !!options.required;
    globalOptions.strict = !!options.strict;
    globalOptions.filter = !!options.filter;
  }

  get name() { return this._name; }
  get error() { return this._error; }
  get schema(): IOperators { return extend({}, this._originalSchema); }

  private _reset() {
    this._error = null;
    this._schema = null;
    // this._checksCount = 0;

    for (let prop in this._ctx.aliasStates)
      this._ctx.aliasStates[prop] = false;
  }

  private _next(ctx: ValidationContext) {
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

    else if (ctx.currentInput === '' && ctx.schema.$type === 'string') {
      if (ctx.schema.$required)
        throw new ValidallError(ctx, ctx.message || `'${ctx.fullPath}' field is required`);

      if (ctx.schema.$default !== undefined)
        Operators.$default(ctx);

    } else {
      for (let operator in ctx.schema) {
        // skip none validators operators or already checked operaotrs
        if (Operators.isSkipping(operator))
          continue;

        if (operator === '$name' && typeof ctx.schema.$name === 'string')
          continue;

        Operators[<"$if">operator](ctx);
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

    } else if ((ctx.schema as any).$as) {
      ctx.aliasStates[(ctx.schema as any).$as] = true;
    }
  }

  private _prepareSchema(ctx: ValidationContext) {
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
    ], (val: string, operator: string) => {
      return ['$onRef', '$beforeRef', '$afterRef'].includes(operator)
        ? new Date(getValue(ctx.input, val))
        : getValue(ctx.input, val)
    });
  }

  public validate(input: any, parentCtx?: ValidationContext) {
    this._reset();

    if (input === undefined) {
      this._error = new ValidallError(<ValidationContext>{}, this._schema?.$message || 'undefinedValidallInput');

      return false;
    }

    let ctx = this._ctx.clone({
      input,
      currentInput: input,
      parentCtx,
      next: (c: ValidationContext) => this._next(c),
      localPath: '',
      inputPath: parentCtx?.fullPath || ''
    });

    this._prepareSchema(ctx);

    ctx.schema = this._schema;

    try {
      this._next(ctx);

    } catch (e: any) {
      if (ctx.parentCtx) throw e;

      this._error = e;
      return false;
    }

    return true;
  }

  private static Logger: Logger = console;
  private static LoggerDisabled = false;

  static UseLogger<T extends Logger>(logger: T, disabled = false) {
    this.Logger = logger || console;
    this.LoggerDisabled = disabled;
  }
}