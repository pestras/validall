import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register, runHandler } from "../registry";
import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";

// And
// -----------------------------------------------------------------------
export interface AndOperationOptions extends BaseOperatorOptions {
  operators: BaseOperatorOptions[];
}

export function And(operators: BaseOperatorOptions[], options?: OperationOptions): AndOperationOptions {
  return { name: 'and', operators, options };
}

register('and', (ctx: SchemaContext, opt: AndOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  for (const op of opt.operators)
    runHandler(op.name, ctx, op);
});

// Or
// -----------------------------------------------------------------------
export interface OrOperationOptions extends BaseOperatorOptions {
  operators: BaseOperatorOptions[];
}

export function Or(operators: BaseOperatorOptions[], options?: OperationOptions): OrOperationOptions {
  return { name: 'or', operators, options };
}

register('or', (ctx: SchemaContext, opt: OrOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  let error: ValidallError | null = null;

  for (const op of opt.operators) {
    try {
      runHandler(op.name, ctx, op);
      
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
  operators: BaseOperatorOptions[];
}

export function Xor(operators: BaseOperatorOptions[], options?: OperationOptions): XorOperationOptions {
  return { name: 'xor', operators, options };
}

register('xor', (ctx: SchemaContext, opt: XorOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  let passed = 0;
  let error: ValidallError | null = null;

  for (const op of opt.operators) {
    try {
      runHandler(op.name, ctx, op);
  
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
  operators: BaseOperatorOptions[];
}

export function Nor(operators: BaseOperatorOptions[], options?: OperationOptions): NorOperationOptions {
  return { name: 'nor', operators, options };
}

register('nor', (ctx: SchemaContext, opt: NorOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  let error: ValidallError | null = null;

  for (const op of opt.operators) {
    try {
      runHandler(op.name, ctx, op);

      error = new ValidallError(ctx, `${ctx.path}:: no operation shall pass`);
      break;

    } catch (e) { }

    if (error)
      throw error;
  }
});