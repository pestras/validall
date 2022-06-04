// deno-lint-ignore-file no-explicit-any
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ValidallError } from "./errors.ts";
import { IRootSchema, ISchema, Logger, ValidationContext } from "./interfaces.ts";
import { validateSchema } from "./validate-schema.ts";
import { Operators } from "./operators.ts";
import { isSchema, ValidallRepo, getValue, extend, setOwnDeepBulkProps } from "./util.ts";

export class Validall {
  private static Logger: Logger = console;
  private static LoggerDisabled = false;

  /** Unique identifier to reference the current instance in other schemas */
  private _name = '';
  private _originalSchema: ISchema;
  private _schema: ISchema | null = null;
  private _error: ValidallError | null = null;
  private _ctx = new ValidationContext({ logger: Validall.Logger, loggerDisabled: Validall.LoggerDisabled });
  // private _checksCount = 0;

  constructor(schema: IRootSchema | { [key: string]: ISchema })
  constructor(name: string, schema: IRootSchema | { [key: string]: ISchema })
  constructor(
    name: string | IRootSchema | { [key: string]: ISchema },
    schema?: IRootSchema | { [key: string]: ISchema }
  ) {
    if (name === undefined)
      throw new ValidallError(<ValidationContext>{}, 'expected a schema, got undefined');

    if (typeof name === 'string')
      this._name = name;
    else
      schema = name

    this._originalSchema = isSchema(schema)
      ? <IRootSchema>schema
      : <ISchema>{ $props: schema };

    /**
     * ensure schema is valid
     */
    validateSchema(this._originalSchema, 'Schema', this._ctx);

    /**
     * if validator has a name, then it will be saved in the store repo, for later referencing,
     * it will replace any matching previuos validator name if set to replaceSchema
     */
    if (this._name)
      ValidallRepo.set(this._name, this);
  }

  static Get(name: string): Validall {
    return ValidallRepo.get(name);
  }

  get name() { return this._name; }
  get error() { return this._error; }
  get schema(): ISchema { return extend({}, this._originalSchema); }

  private _reset() {
    this._error = null;
    this._schema = null;
    // this._checksCount = 0;

    for (const prop in this._ctx.aliasStates)
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

    ctx.message = ctx.schema?.$message || '';

    if (ctx.schema?.$log)
      Operators.$log(ctx);

    if (ctx.currentInput === undefined || ctx.currentInput === null)
      Operators.undefinedOrNullInput(ctx);

    else if (ctx.currentInput === '' && ctx.schema?.$type === 'string' && ctx.schema.$default !== undefined)
      Operators.$default(ctx);

    else {
      for (const operator in ctx.schema) {
        // skip none validators operators or already checked operaotrs
        if (Operators.isSkipping(operator))
          continue;

        if (operator === '$name' && typeof ctx.schema.$name === 'string')
          continue;

        Operators[<"$if">operator](ctx);
      }
    }

    if (ctx.schema?.$name) {
      if (typeof ctx.schema.$name === 'string')
      ctx.aliasStates[ctx.schema.$name] = true;
      else
        for (const $name of ctx.schema.$name)
          if (typeof $name === 'string')
            ctx.aliasStates[$name] = true;
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

    const ctx = this._ctx.clone({
      input,
      currentInput: input,
      parentCtx,
      next: (c: ValidationContext) => this._next(c),
      localPath: '',
      inputPath: parentCtx?.fullPath || ''
    });

    this._prepareSchema(ctx);

    ctx.schema = this._schema ?? undefined;

    try {
      this._next(ctx);

    } catch (e) {
      if (ctx.parentCtx) throw e;

      this._error = e;
      return false;
    }

    return true;
  }

  static UseLogger<T extends Logger>(logger: T, disabled = false) {
    Validall.Logger = logger || console;
    Validall.LoggerDisabled = disabled;
  }
}