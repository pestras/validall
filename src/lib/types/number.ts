import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsNumber
// ----------------------------------------------------------------------------------
export function IsNumebr(options?: OperationOptions): BaseOperatorOptions {
  return { name: 'isNumber', options };
}

register('isNumber', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'number')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type number`);
});

// IsInt
// ----------------------------------------------------------------------------------
export function IsInt(options?: OperationOptions): BaseOperatorOptions {
  return { name: "isInt", options };
}

register('isInt', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'number')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type number`);

  if (ctx.value % 1 !== 0)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be integer`);
});

// IsFloat
// ----------------------------------------------------------------------------------
export function IsFloat(options?: OperationOptions): BaseOperatorOptions {
  return { name: "isFloat", options };
}

register('isFloat', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'number')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type number`);

  if (ctx.value % 1 === 0)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be float`);
});

// InRange
// ----------------------------------------------------------------------
export interface InRangeOperationOptions extends BaseOperatorOptions {
  range: [number?, number?];
}

export function InRange(range: [number?, number?], options?: OperationOptions): InRangeOperationOptions {
  return { 
    name: 'inRange',
    range,
    options
  };
}

register('inRange', (ctx: SchemaContext, opt: InRangeOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (opt.range[0] !== null && opt.range[0] !== undefined && opt.range[0] > ctx.value)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be at least ${opt.range[0]}`);

  if (opt.range[1] !== null && opt.range[1] !== undefined && opt.range[1] < ctx.value)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be at max ${opt.range[1]}`);
});

// OutRange
// ----------------------------------------------------------------------
export interface OutRangeOperationOptions extends BaseOperatorOptions {
  range: [number, number];
}

export function OutRange(range: [number, number], options?: OperationOptions): OutRangeOperationOptions {
  return { 
    name: 'outRange',
    range,
    options
  };
}

register('outRange', (ctx: SchemaContext, opt: OutRangeOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (opt.range[0] < ctx.value && opt.range[1] > ctx.value)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be out of range [${opt.range[0]},${opt.range[1]}]`);
});