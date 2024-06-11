
import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register, runHandler } from "../registry";
import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsArray
// ----------------------------------------------------------------------------------
export interface IsArrayOperationOptions extends BaseOperatorOptions {
  operations?: (BaseOperatorOptions | Schema<any>)[] | null;
}

export function IsArray(operations?: (BaseOperatorOptions | Schema<any>)[] | null, options?: OperationOptions): IsArrayOperationOptions {
  return { 
    name: 'isArray',
    operations,
    options
  };
}

register('isArray', (ctx: SchemaContext, opt: IsArrayOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (!Array.isArray(ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an array`);

  if (opt.operations) {
    for (let i = 0; i < ctx.value.length; i++) {
      for (const op of opt.operations)
        op instanceof Schema
          ? op.validate(ctx.value[i], `${ctx.path}.${i}`)
          : runHandler(op.name, { value: ctx.value[i], path: `${ctx.path}.${i}` }, op);
    }
  }
});

// ArrayLength
// ---------------------------------------------------------------------------------
export interface ArrayLengthOperationOptions extends BaseOperatorOptions {
  length: number | [number?, number?];
}

export function ArrayLength(length: number | [number?, number?], options?: OperationOptions): ArrayLengthOperationOptions {
  return { name: 'arrayLength', length, options };
}

register('arrayLength', (ctx: SchemaContext, opt: ArrayLengthOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (!Array.isArray(ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an array`);

  if (typeof opt.length === "number" && ctx.value.length !== opt.length)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: array length must be ${opt.length}`);

  if (Array.isArray(opt.length) && typeof opt.length[0] === 'number' && ctx.value.length < opt.length[0])
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: array length must be at least ${opt.length[0]}`);

  if (Array.isArray(opt.length) && typeof opt.length[1] === 'number' && ctx.value.length > opt.length[1])
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: array length must be at max ${opt.length[1]}`);
});