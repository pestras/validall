import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register, runHandler } from "../registry";
import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";

// And
// -----------------------------------------------------------------------
export interface AndOperationOptions extends BaseOperatorOptions {
  name: 'and';
  operators: (BaseOperatorOptions | Schema<any>)[];
}

export function And(operators: (BaseOperatorOptions | Schema<any>)[], options?: OperationOptions): AndOperationOptions {
  return { name: 'and', operators, options };
}

register('and', (ctx: SchemaContext, opt: AndOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  for (const op of opt.operators)
    op instanceof Schema
      ? op.validate(ctx.value, ctx.path)
      : runHandler(op.name, ctx, op);
});

// Or
// -----------------------------------------------------------------------
export interface OrOperationOptions extends BaseOperatorOptions {
  name: 'or';
  operators: (BaseOperatorOptions | Schema<any>)[];
}

export function Or(operators: (BaseOperatorOptions | Schema<any>)[], options?: OperationOptions): OrOperationOptions {
  return { name: 'or', operators, options };
}

register('or', (ctx: SchemaContext, opt: OrOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  let error: ValidallError | null = null;

  for (const op of opt.operators) {
    try {
      op instanceof Schema
        ? op.validate(ctx.value, ctx.path)
        : runHandler(op.name, ctx, op);

      return;

    } catch (e) {
      error = error ?? e
    }
  }

  if (error)
    throw error;
});

// Xor
// -----------------------------------------------------------------------
export interface XorOperationOptions extends BaseOperatorOptions {
  name: 'xor';
  operators: (BaseOperatorOptions | Schema<any>)[];
}

export function Xor(operators: (BaseOperatorOptions | Schema<any>)[], options?: OperationOptions): XorOperationOptions {
  return { name: 'xor', operators, options };
}

register('xor', (ctx: SchemaContext, opt: XorOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  let passed = 0;
  let error: ValidallError | null = null;

  for (const op of opt.operators) {
    try {
      op instanceof Schema
        ? op.validate(ctx.value, ctx.path)
        : runHandler(op.name, ctx, op);

      passed++;

      if (passed > 1) {
        error = new ValidallError(ctx, `${ctx.path}:: only a single operation may pass`);
        break;
      }

    } catch (e) { }

    if (error)
      throw error;
  }
});

// Nor
// -----------------------------------------------------------------------
export interface NorOperationOptions extends BaseOperatorOptions {
  name: 'nor';
  operators: (BaseOperatorOptions | Schema<any>)[];
}

export function Nor(operators: (BaseOperatorOptions | Schema<any>)[], options?: OperationOptions): NorOperationOptions {
  return { name: 'nor', operators, options };
}

register('nor', (ctx: SchemaContext, opt: NorOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  let error: ValidallError | null = null;

  for (const op of opt.operators) {
    try {
      op instanceof Schema
        ? op.validate(ctx.value, ctx.path)
        : runHandler(op.name, ctx, op);

      error = new ValidallError(ctx, `${ctx.path}:: no operation shall pass`);
      break;

    } catch (e) { }

    if (error)
      throw error;
  }
});