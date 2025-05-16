import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsObject
// ----------------------------------------------------------------------------------
export interface IsObjectOptions extends OperationOptions {
  lazy?: boolean;
}
export interface IsObjectOperationOptions<T extends object = any> extends BaseOperatorOptions {
  schema?: Schema<T> | string | null;
  options?: IsObjectOptions;
}

export function IsObject<T extends object = any>(schema?: Schema<T> | string | null, options?: IsObjectOptions): IsObjectOperationOptions {
  return {
    name: 'isObject',
    schema,
    options
  };
}

register('isObject', (ctx: SchemaContext, opt: IsObjectOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  const schema = opt.schema
    ? typeof opt.schema === 'string'
      ? Schema.Get(opt.schema)
      : opt.schema
    : null;

  if (Object.prototype.toString.call(ctx.value) !== "[object Object]")
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an object`);

  if (!opt.options?.lazy && schema) {
    const keys = Object.keys(ctx.value);
    const schemaKeys = Object.keys(schema.schema);

    for (const key of keys)
      if (!schemaKeys.includes(key)) {
        const newCtx: SchemaContext = { path: ctx.path ? `${ctx.path}.${key}` : key, value: ctx.value };
        throw new ValidallError(newCtx, `${newCtx.path} key is not allowed`);
      }
  }

  if (schema)
    schema.validate(ctx.value, ctx.path);
});