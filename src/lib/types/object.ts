import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsObject
// ----------------------------------------------------------------------------------
export function IsObject(options?: OperationOptions): BaseOperatorOptions {
  return { 
    name: 'isObject',
    options
  };
}

register('isObject', (ctx: SchemaContext, opt: BaseOperatorOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (Object.prototype.toString.call(ctx.value) !== "[object Object]")
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an object`);
});