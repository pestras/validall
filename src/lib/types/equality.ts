import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { BaseOperatorOptions, OperationOptions } from "./base";


// Equals
// ----------------------------------------------------------------------
export interface EqualsOperationOptions extends BaseOperatorOptions {
  name: 'equals';
  value: any;
}

export function Equals(value: any, options?: OperationOptions): EqualsOperationOptions {
  return { 
    name: 'equals',
    value,
    options
  };
}

register('equals', (ctx: SchemaContext, opt: EqualsOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (opt.value !== ctx.value)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be equals to ${opt.value}`);
});

// NotEquals
// ----------------------------------------------------------------------
export interface NotEqualsOperationOptions extends BaseOperatorOptions {
  name: 'notEquals';
  value: any;
}

export function NotEquals(value: any, options?: OperationOptions): NotEqualsOperationOptions {
  return { 
    name: 'notEquals',
    value,
    options
  };
}

register('notEquals', (ctx: SchemaContext, opt: NotEqualsOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (opt.value === ctx.value)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must not be equals to ${opt.value}`);
});

// IsIn
// ----------------------------------------------------------------------
export interface IsInOperationOptions extends BaseOperatorOptions {
  name: 'isIn';
  values: Readonly<any[]> | any[];
}

export function IsIn(values: Readonly<any[]> | any[], options?: OperationOptions): IsInOperationOptions {
  return { 
    name: 'isIn',
    values,
    options
  };
}

register('isIn', (ctx: SchemaContext, opt: IsInOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (Array.isArray(ctx.value)) {
    if (ctx.value.some(v => !opt.values.includes(v)))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: all values must be in [${opt.values}]`);

  } else if (!opt.values.includes(ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be in [${opt.values}]`);
});

// IsNotIn
// ----------------------------------------------------------------------
export interface IsNotInOperationOptions extends BaseOperatorOptions {
  name: 'isNotIn';
  values: Readonly<any[]> | any[];
}

export function IsNotIn(values: Readonly<any[]> | any[], options?: OperationOptions): IsNotInOperationOptions {
  return { 
    name: 'isNotIn',
    values,
    options
  };
}

register('isNotIn', (ctx: SchemaContext, opt: IsNotInOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (Array.isArray(ctx.value)) {
    if (ctx.value.some(v => opt.values.includes(v)))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: all values must not be in [${opt.values}]`);

  } else if (opt.values.includes(ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must not be in [${opt.values}]`);
});

// Intersect
// ----------------------------------------------------------------------------------
export interface IntersectOperationOptions extends BaseOperatorOptions {
  name: 'intersect';
  values: Readonly<any[]> | any[];
}

export function Intersect(values: Readonly<any[]> | any[], options?: OperationOptions): IntersectOperationOptions {
  return { name: 'intersect', values, options };
}

register('intersect', (ctx: SchemaContext, opt: IntersectOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (!Array.isArray(ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an array`);

  if (ctx.value.every(v => !opt.values.includes(v)))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must include any of [${opt.values}]`);
});