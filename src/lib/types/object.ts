import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsObject
// ----------------------------------------------------------------------------------
export interface IsObjectOptions extends OperationOptions {
  strict?: boolean;
}
export interface IsObjectOperationOptions<T extends object = any> extends BaseOperatorOptions {
  schema?: Schema<T> | null;
  options?: IsObjectOptions;
}

export function IsObject<T extends object = any>(schema?: Schema<T> | null, options?: IsObjectOptions): IsObjectOperationOptions {
  return { 
    name: 'isObject',
    schema,
    options
  };
}

register('isObject', (ctx: SchemaContext, opt: IsObjectOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (Object.prototype.toString.call(ctx.value) !== "[object Object]")
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an object`);

  if (opt.options?.strict && opt.schema) {
    const keys = Object.keys(ctx.value);
    const schemaKeys = Object.keys(opt.schema.schema);

    for (const key of keys)
      if (!schemaKeys.includes(key)) {
        const newCtx: SchemaContext = { path: ctx.path ? `${ctx.path}.${key}` : key, value: ctx.value };
        throw new ValidallError(newCtx, `${newCtx.path} key is not allowed`);
      }
  }

  if (opt.schema)
    opt.schema.validate(ctx.value, ctx.path);
});