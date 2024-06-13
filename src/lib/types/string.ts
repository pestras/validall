import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { register } from "../registry";
import { parseDate } from "../util/date/format";
import { stringTypeMethods } from "../util/string";
import { BaseOperatorOptions, OperationOptions } from "./base";

export const stringTypes = ['email', 'URL', 'date', 'number', 'boolean'] as const;
export type StringType = typeof stringTypes[number];

// IsString
// ---------------------------------------------------------------------------------
export interface IsStringOperationOptions extends BaseOperatorOptions {
  type?: StringType | null;
}

export function IsString(options?: OperationOptions): IsStringOperationOptions
export function IsString(type: StringType, options?: OperationOptions): IsStringOperationOptions
export function IsString(arg1?: StringType | OperationOptions, arg2?: OperationOptions): IsStringOperationOptions {
  return {
    name: 'isString',
    type: typeof arg1 === 'string' ? arg1 : null,
    options: typeof arg1 === 'string' ? arg2 : arg1
  };
}

register('isString', (ctx: SchemaContext, opt: IsStringOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'string')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type string`);

  if (opt.type && !stringTypeMethods[opt.type](ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be ${opt.type} string`);
});

// Regex
// ---------------------------------------------------------------------------------
export interface RegexOperationOptions extends BaseOperatorOptions {
  regex: RegExp;
}

export function Regex(regex: RegExp, options?: OperationOptions): RegexOperationOptions {
  return { name: 'regex', regex, options };
}

register('regex', (ctx: SchemaContext, opt: RegexOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'string')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type string`);

  if (!opt.regex.test(ctx.value))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must match pattern`);
});

// Length
// ---------------------------------------------------------------------------------
export interface LengthOperationOptions extends BaseOperatorOptions {
  length: number | [number?, number?];
}

export function Length(length: number | [number?, number?], options?: OperationOptions): LengthOperationOptions {
  return { name: 'length', length, options };
}

register('length', (ctx: SchemaContext, opt: LengthOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'string')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type string`);

  if (typeof opt.length === 'number' && ctx.value.length !== opt.length)
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: length must equals ${opt.length} characters`);

  if (Array.isArray(opt.length)) {
    if (typeof opt.length[0] === 'number' && ctx.value.length < opt.length[0])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: length must be at least ${opt.length[0]} characters`);

    if (typeof opt.length[1] === 'number' && ctx.value.length > opt.length[1])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: length must be at max ${opt.length[1]} characters`);
  }
});

// dateFormat
// ---------------------------------------------------------------------------------
export interface IsDateFormatOperationOptions extends BaseOperatorOptions {
  format: string;
}

export function IsDateFormat(format: string, options?: OperationOptions): IsDateFormatOperationOptions {
  return { name: 'isDateFormat', format, options };
}

register('isDateFormat', (ctx: SchemaContext, opt: IsDateFormatOperationOptions) => {
  if (ctx.value === undefined || ctx.value === null)
    return;

  if (typeof ctx.value !== 'string')
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a date string`);

  if (!parseDate(ctx.value, opt.format))
    throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: date does not match format ${opt.format}`);
});