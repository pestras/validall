import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { DateUnit, getDateUnit } from "../util/date/unit";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsDate
// ---------------------------------------------------------------------------------------
export interface IsDateOperationOptions extends BaseOperatorOptions {
  name: 'isDate';
}

export function IsDate(options?: OperationOptions): IsDateOperationOptions {
  return { name: 'isDate', options };
}

register('isDate', (ctx: SchemaContext, opt: IsDateOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (!(ctx.value instanceof Date))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type Date`);
});

// IsDateInRange
// ---------------------------------------------------------------------------------------
export interface IsDateInRangeOperationOptions extends BaseOperatorOptions {
  name: 'isDateInRange';
  range: [(Date | number)?, (Date | number)?];
  unit?: DateUnit | null;
}

export function IsDateInRange(range: [Date?, Date?], options?: OperationOptions): IsDateInRangeOperationOptions;
export function IsDateInRange(unit: DateUnit, range: [number?, number?], options?: OperationOptions): IsDateInRangeOperationOptions;
export function IsDateInRange(
  arg1: [Date?, Date?] | DateUnit,
  arg2?: [number?, number?] | OperationOptions,
  arg3?: OperationOptions): IsDateInRangeOperationOptions {
  return {
    name: 'isDateInRange',
    range: Array.isArray(arg2) ? arg2 : arg1 as [Date?, Date?],
    unit: typeof arg1 === 'string' ? arg1 : null,
    options: !Array.isArray(arg2) ? arg2 : arg3
  };
}

register('isDateInRange', (ctx: SchemaContext, opt: IsDateInRangeOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  const date = new Date(ctx.value);

  if (date.toString() === 'Invalid Date')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a valid Date`);

  if (opt.unit) {
    const unitValue = getDateUnit[opt.unit](date);

    if (typeof opt.range[0] === 'number' && unitValue < opt.range[0])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must be at least ${opt.range[0]}`);

    if (typeof opt.range[1] === 'number' && unitValue > opt.range[1])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must be at max ${opt.range[1]}`);

  } else {
    if (opt.range[0] instanceof Date && date.getTime() < opt.range[0].getDate())
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be at least ${opt.range[0]}`);

    if (opt.range[1] instanceof Date && date.getTime() > opt.range[1].getDate())
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be at max ${opt.range[1]}`);
  }
});

// IsDateOutRange
// ---------------------------------------------------------------------------------------
export interface IsDateOutRangeOperationOptions extends BaseOperatorOptions {
  name: 'isDateOutRange';
  range: [Date | number, Date | number];
  unit?: DateUnit | null;
}

export function IsDateOutRange(range: [Date, Date], options?: OperationOptions): IsDateOutRangeOperationOptions;
export function IsDateOutRange(unit: DateUnit, range: [number, number], options?: OperationOptions): IsDateOutRangeOperationOptions;
export function IsDateOutRange(
  arg1: [Date, Date] | DateUnit,
  arg2?: [number, number] | OperationOptions,
  arg3?: OperationOptions): IsDateOutRangeOperationOptions {
  return {
    name: 'isDateOutRange',
    range: Array.isArray(arg2) ? arg2 : arg1 as [Date, Date],
    unit: typeof arg1 === 'string' ? arg1 : null,
    options: !Array.isArray(arg2) ? arg2 : arg3
  };
}

register('isDateOutRange', (ctx: SchemaContext, opt: IsDateOutRangeOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  const date = new Date(ctx.value);

  if (date.toString() === 'Invalid Date')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a valid Date`);

  if (opt.unit) {
    const unitValue = getDateUnit[opt.unit](date);

    if (typeof opt.range[0] === 'number' && unitValue > opt.range[0] && typeof opt.range[1] === 'number' && unitValue < opt.range[1])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must be out of range [${opt.range[0]}, ${opt.range[1]}]`);

  } else {
    if (opt.range[0] instanceof Date && date.getTime() > opt.range[0].getDate() && opt.range[1] instanceof Date && date.getTime() < opt.range[1].getDate())
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be out of range [${opt.range[0]}, ${opt.range[1]}]`);
  }
});

// IsDateIn
// ---------------------------------------------------------------------------------------
export interface IsDateInOperationOptions extends BaseOperatorOptions {
  name: 'isDateIn';
  values: number[];
  unit: DateUnit;
}

export function IsDateIn(unit: DateUnit, values: number[], options?: OperationOptions): IsDateInOperationOptions {
  return { name: 'isDateIn', unit, values, options };
}

register('isDateIn', (ctx: SchemaContext, opt: IsDateInOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  const date = new Date(ctx.value);

  if (date.toString() === 'Invalid Date')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a valid Date`);

  const unitValue = getDateUnit[opt.unit](date);

  if (!opt.values.includes(unitValue))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must be in [${opt.values}]`);
});

// IsDateNotIn
// ---------------------------------------------------------------------------------------
export interface IsDateNotInOperationOptions extends BaseOperatorOptions {
  name: 'isDateNotIn';
  values: number[];
  unit: DateUnit;
}

export function IsDateNotIn(unit: DateUnit, values: number[], options?: OperationOptions): IsDateNotInOperationOptions {
  return { name: 'isDateNotIn', unit, values, options };
}

register('isDateNotIn', (ctx: SchemaContext, opt: IsDateNotInOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  const date = new Date(ctx.value);

  if (date.toString() === 'Invalid Date')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a valid Date`);;

  const unitValue = getDateUnit[opt.unit](date);

  if (opt.values.includes(unitValue))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must not be in [${opt.values}]`);
});