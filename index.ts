import { ValidallError } from "./errors";
import { IRootSchema, ISchema, ValidationContext } from "./interfaces";
import { validateSchema } from "./validate-schema";
import { extend } from '@pestras/toolbox/object/extend';
import { setOwnDeepBulkProps } from '@pestras/toolbox/object/set-own-deep-bulk-props';
import { getValue } from '@pestras/toolbox/object/get-value';
import { Operators } from "./operators";
import { isSchema, ValidallRepo } from "./util";

export class Validall {
  /** Unique identifier to reference the current instance in other schemas */
  private _name: string;
  private _originalSchema: ISchema;
  private _schema: ISchema;
  private _error: ValidallError;
  private _ctx = new ValidationContext();
  private _checksCount = 0;

  constructor(schema: IRootSchema | { [key: string]: ISchema })
  constructor(name: string, schema: IRootSchema | { [key: string]: ISchema })
  constructor(
    name: string | IRootSchema | { [key: string]: ISchema },
    schema?: IRootSchema | { [key: string]: ISchema }
  ) {

    if (name === undefined)
      throw new ValidallError('expected a schema, got undefined');

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
    this._checksCount = 0;

    for (let prop in this._ctx.aliasStates)
      this._ctx.aliasStates[prop] = false;
  }

  private _next(ctx: ValidationContext) {
    this._checksCount += 1;

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
      Operators.undefinedOrNullInput(ctx);

    else {
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

  validate(input: any, path?: string) {
    this._reset();

    if (input === undefined) {
      this._error = new ValidallError(this._schema.$message || 'undefinedValidallInput');

      return false;
    }

    let ctx = this._ctx.clone({
      input,
      currentInput: input,
      isSubSchema: !!path,
      next: (c: ValidationContext) => this._next(c),
      localPath: '',
      inputPath: path || ''
    });

    this._prepareSchema(ctx);

    ctx.schema = this._schema;

    try {
      this._next(ctx);

    } catch (e) {
      if (ctx.isSubSchema) throw e;

      this._error = e;
      return false;
    }

    return true;
  }
}