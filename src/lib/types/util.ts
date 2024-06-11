import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsRequired
// ----------------------------------------------------------------------
export interface IsRequiredOperationOptions extends BaseOperatorOptions {
  name: 'isRequired';
}

export function IsRequired(options?: OperationOptions): IsRequiredOperationOptions {
  return { name: 'isRequired', options };
}

register('isRequired', (ctx: SchemaContext, opt: IsRequiredOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: is required`);
});

// IsNullable
// ----------------------------------------------------------------------
export interface IsNullableOperationOptions extends BaseOperatorOptions {
  name: 'isNullable';
}

export function IsNullable(options?: OperationOptions): IsNullableOperationOptions {
  return { name: 'isNullable', options };
}

register('isNullable', (ctx: SchemaContext, opt: IsNullableOperationOptions) => {
  if (!ctx.value && ctx.value !== null)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be null`);
});

// Validate
// ----------------------------------------------------------------------
export interface ValidateOperationOptions extends BaseOperatorOptions {
  name: 'validate';
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