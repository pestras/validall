import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsBoolean
// -----------------------------------------------------------------------
export interface IsBooleanOperationOptions extends BaseOperatorOptions {
  name: 'isBoolean';
}

export function IsBoolean(options?: OperationOptions): IsBooleanOperationOptions {
  return { name: 'isBoolean', options };
}

register('isBoolean', (ctx: SchemaContext, opt: IsBooleanOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'boolean')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type boolean`);
});