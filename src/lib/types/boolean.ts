import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsBoolean
// -----------------------------------------------------------------------
export function IsBoolean(options?: OperationOptions): BaseOperatorOptions {
  return { name: 'isBoolean', options };
}

register('isBoolean', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'boolean')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type boolean`);
});