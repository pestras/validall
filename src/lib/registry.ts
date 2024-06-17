import { SchemaContext } from "./ctx";
import { BaseOperatorOptions } from "./types/base";

const regeistry = new Map<string, (ctx: SchemaContext, opt: any) => void>();

export function register<OPTIONS extends BaseOperatorOptions>(
  name: string,
  handler: (ctx: SchemaContext, opt: OPTIONS) => void
) {
  if (regeistry.has(name))
    throw `${name} validation operator name already exists`;

  regeistry.set(name, handler);
}

export function runHandler(name: string, ctx: SchemaContext, opt: any) {
  const handler = regeistry.get(name) ?? null;

  if (handler)
    return handler(ctx, opt);

  throw `invalidOperator: ${name}`;
}