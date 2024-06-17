import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsRequired
// ----------------------------------------------------------------------
export function Log(message?: string): BaseOperatorOptions {
  return { name: 'log', options: { message } };
}

register('log', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  console.log('path:', ctx.path);
  console.log('value:', ctx.value);

  if (opt.options?.message)
    console.log(opt.options.message);
});

// IsRequired
// ----------------------------------------------------------------------
export function IsRequired(options?: OperationOptions): BaseOperatorOptions {
  return { name: 'isRequired', options };
}

register('isRequired', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (
    ctx.value === undefined ||
    ctx.value === null ||
    (typeof ctx.value === 'number' && isNaN(ctx.value)) ||
    (typeof ctx.value === 'string' && !ctx.value.trim())
  )
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: is required`);
});

// IsNullable
// ----------------------------------------------------------------------
export function IsNullable(options?: OperationOptions): BaseOperatorOptions {
  return { name: 'isNullable', options };
}

register('isNullable', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (
    ctx.value === undefined ||
    (typeof ctx.value === 'number' && isNaN(ctx.value)) ||
    (typeof ctx.value === 'string' && !ctx.value.trim())
  )
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be null`);
});

// Validate
// ----------------------------------------------------------------------
export interface ValidateOperationOptions extends BaseOperatorOptions {
  func: (val: any, path: string) => void
}

export function Validate(func: (val: any, path: string) => void, options?: OperationOptions): ValidateOperationOptions {
  return { name: 'validate', func, options };
}

register('validate', (ctx: SchemaContext, opt: ValidateOperationOptions) => {
  try {
    opt.func(ctx.value, ctx.path);
  } catch (error) {
    throw new ValidallError(ctx, error.message);
  }
});