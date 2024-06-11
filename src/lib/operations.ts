import { BaseOperatorOptions, OperationOptions, Operator } from "./types/base";
import { ArrayLengthOperationOptions, IsArrayOperationOptions } from './types/array';
import { IsBooleanOperationOptions } from './types/boolean';
import { IsDateInOperationOptions, IsDateInRangeOperationOptions, IsDateNotInOperationOptions, IsDateOperationOptions, IsDateOutRangeOperationOptions } from './types/date';
import { EqualsOperationOptions, InRangeOperationOptions, IsInOperationOptions, IsNotInOperationOptions, NotEqualsOperationOptions, OutRangeOperationOptions, IntersectOperationOptions } from './types/equality';
import { AndOperationOptions, NorOperationOptions, OrOperationOptions, XorOperationOptions } from './types/logic';
import { IsFloatOperationOptions, IsIntOperationOptions, IsNumberOperationOptions } from './types/number';
import { IsStringOperationOptions, LengthOperationOptions, RegexOperationOptions } from './types/string';
import { ValidateOperationOptions, IsNullableOperationOptions, IsRequiredOperationOptions } from './types/util';
import { SchemaContext } from "./ctx";
import { ValidallError } from "./errors";
import { stringTypeMethods } from "./util/string";
import { getDateUnit } from "./util/date/unit";
import { Schema } from "./schema";
import { SchemaOperation } from "./types/object-schema";

interface OperationsMap {
  // util
  isRequired: IsRequiredOperationOptions;
  isNullable: IsNullableOperationOptions;
  validate: ValidateOperationOptions;
  // boolean
  isBoolean: IsBooleanOperationOptions;
  // number
  isNumber: IsNumberOperationOptions;
  isInt: IsIntOperationOptions;
  isFloat: IsFloatOperationOptions;
  // string
  isString: IsStringOperationOptions;
  regex: RegexOperationOptions;
  length: LengthOperationOptions;
  // date
  isDate: IsDateOperationOptions;
  isDateInRange: IsDateInRangeOperationOptions;
  isDateOutRange: IsDateOutRangeOperationOptions;
  isDateIn: IsDateInOperationOptions;
  isDateNotIn: IsDateNotInOperationOptions;
  // array
  isArray: IsArrayOperationOptions;
  arrayLength: ArrayLengthOperationOptions;
  intersect: IntersectOperationOptions<any>;
  // equality
  equals: EqualsOperationOptions<any>;
  notEquals: NotEqualsOperationOptions<any>;
  inRange: InRangeOperationOptions<any>;
  outRange: OutRangeOperationOptions<any>;
  isIn: IsInOperationOptions<any>;
  isNotIn: IsNotInOperationOptions<any>;
  // logic
  and: AndOperationOptions;
  or: OrOperationOptions;
  xor: XorOperationOptions;
  nor: NorOperationOptions;
}

export const operations: Record<
  Operator,
  (ctx: SchemaContext, opt: OperationsMap[Operator]) => void
> = {
  // util
  // ===================================================================================
  isRequired(ctx: SchemaContext, opt: IsRequiredOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: is required`);
  },
  isNullable(ctx: SchemaContext, opt: IsNullableOperationOptions) {
    if (!ctx.value && ctx.value !== null)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be null`);
  },
  validate(ctx: SchemaContext, opt: ValidateOperationOptions) {
    try {
      opt.func(ctx.value, ctx.path);
    } catch (error) {
      throw new ValidallError(ctx, error.message);
    }
  },
  // boolean
  // ===================================================================================
  isBoolean(ctx: SchemaContext, opt: IsBooleanOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (typeof ctx.value !== 'boolean')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type boolean`);
  },
  // number
  // ===================================================================================
  isNumber(ctx: SchemaContext, opt: IsNumberOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (typeof ctx.value !== 'number')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type number`);
  },
  isInt(ctx: SchemaContext, opt: IsNumberOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (typeof ctx.value !== 'number')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type number`);

    if (ctx.value % 1 !== 0)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be integer`);
  },
  isFloat(ctx: SchemaContext, opt: IsNumberOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (typeof ctx.value !== 'number')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type number`);

    if (ctx.value % 1 === 0)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be float`);
  },
  // string
  // ===================================================================================
  isString(ctx: SchemaContext, opt: IsStringOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (typeof ctx.value !== 'string')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type string`);

    if (opt.type && !stringTypeMethods[opt.type](ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be ${opt.type} string`);
  },
  regex(ctx: SchemaContext, opt: RegexOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (typeof ctx.value !== 'string')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type string`);

    if (!opt.regex.test(ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must match pattern`);
  },
  length(ctx: SchemaContext, opt: LengthOperationOptions) {
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
  },
  // date
  // ===================================================================================
  isDate(ctx: SchemaContext, opt: IsDateOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (!(ctx.value instanceof Date))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be of type Date`);
  },
  isDateInRange(ctx: SchemaContext, opt: IsDateInRangeOperationOptions) {
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
  },
  isDateOutRange(ctx: SchemaContext, opt: IsDateOutRangeOperationOptions) {
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
  },
  isDateIn(ctx: SchemaContext, opt: IsDateInOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    const date = new Date(ctx.value);

    if (date.toString() === 'Invalid Date')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a valid Date`);

    const unitValue = getDateUnit[opt.unit](date);

    if (!opt.values.includes(unitValue))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must be in [${opt.values}]`);
  },
  isDateNotIn(ctx: SchemaContext, opt: IsDateNotInOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    const date = new Date(ctx.value);

    if (date.toString() === 'Invalid Date')
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be a valid Date`);;

    const unitValue = getDateUnit[opt.unit](date);

    if (opt.values.includes(unitValue))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: ${opt.unit} must not be in [${opt.values}]`);
  },
  // equality
  // ===================================================================================
  equals<T>(ctx: SchemaContext, opt: EqualsOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (opt.value !== ctx.value)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be equals to ${opt.value}`);
  },
  notEquals<T>(ctx: SchemaContext, opt: NotEqualsOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (opt.value === ctx.value)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must not be equals to ${opt.value}`);
  },
  inRange<T>(ctx: SchemaContext, opt: InRangeOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (opt.range[0] !== null && opt.range[0] !== undefined && opt.range[0] > ctx.value)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be at least ${opt.range[0]}`);

    if (opt.range[1] !== null && opt.range[1] !== undefined && opt.range[1] < ctx.value)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be at max ${opt.range[1]}`);
  },
  outRange<T>(ctx: SchemaContext, opt: OutRangeOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (opt.range[0] < ctx.value && opt.range[1] > ctx.value)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be out of range [${opt.range[0]},${opt.range[1]}]`);
  },
  isIn<T>(ctx: SchemaContext, opt: IsInOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (Array.isArray(ctx.value)) {
      if (ctx.value.some(v => !opt.values.includes(v)))
        throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: all values must be in [${opt.values}]`);

    } else if (!opt.values.includes(ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be in [${opt.values}]`);
  },
  isNotIn<T>(ctx: SchemaContext, opt: IsNotInOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (Array.isArray(ctx.value)) {
      if (ctx.value.some(v => opt.values.includes(v)))
        throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: all values must not be in [${opt.values}]`);

    } else if (opt.values.includes(ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must not be in [${opt.values}]`);
  },
  intersect<T>(ctx: SchemaContext, opt: IntersectOperationOptions<T>) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (!Array.isArray(ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an array`);

    if (ctx.value.every(v => !opt.values.includes(v)))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must include any of [${opt.values}]`);
  },
  // array
  // ===================================================================================
  isArray(ctx: SchemaContext, opt: IsArrayOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (!Array.isArray(ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an array`);

    if (opt.operations) {
      for (let i = 0; i < ctx.value.length; i++) {
        for (const op of opt.operations)
          op instanceof Schema
            ? op.validate(ctx.value[i], `${ctx.path}.${i}`)
            : operations[op.name]({ value: ctx.value[i], path: `${ctx.path}.${i}` }, op);
      }
    }
  },
  arrayLength(ctx: SchemaContext, opt: ArrayLengthOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    if (!Array.isArray(ctx.value))
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: must be an array`);

    if (typeof opt.length === "number" && ctx.value.length !== opt.length)
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: array length must be ${opt.length}`);

    if (Array.isArray(opt.length) && typeof opt.length[0] === 'number' && ctx.value.length < opt.length[0])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: array length must be at least ${opt.length[0]}`);

    if (Array.isArray(opt.length) && typeof opt.length[1] === 'number' && ctx.value.length > opt.length[1])
      throw new ValidallError(ctx, opt.options?.message ?? `${ctx.path}: array length must be at max ${opt.length[1]}`);
  },
  // logic
  // ===================================================================================
  and(ctx: SchemaContext, opt: AndOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    validate(ctx, opt.operators);
  },
  or(ctx: SchemaContext, opt: OrOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    let error: ValidallError | null = null;

    for (const op of opt.operators) {
      try {
        op instanceof Schema
          ? op.validate(ctx.value, ctx.path)
          : operations[op.name](ctx, op);

        return;

      } catch (e) {
        error = error ?? e
      }
    }

    if (error)
      throw error;
  },
  xor(ctx: SchemaContext, opt: XorOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    let passed = 0;
    let error: ValidallError | null = null;

    for (const op of opt.operators) {
      try {
        op instanceof Schema
          ? op.validate(ctx.value, ctx.path)
          : operations[op.name](ctx, op);

        passed++;

        if (passed > 1) {
          error = new ValidallError(ctx, `${ctx.path}:: only a single operation may pass`);
          break;
        }

      } catch (e) { }

      if (error)
        throw error;
    }
  },
  nor(ctx: SchemaContext, opt: NorOperationOptions) {
    if (ctx.value === undefined || ctx.value === null)
      return;

    let error: ValidallError | null = null;

    for (const op of opt.operators) {
      try {
        op instanceof Schema
          ? op.validate(ctx.value, ctx.path)
          : operations[op.name](ctx, op);

        error = new ValidallError(ctx, `${ctx.path}:: no operation shall pass`);
        break;

      } catch (e) { }

      if (error)
        throw error;
    }
  },
}

export function validate<T>(
  ctx: SchemaContext,
  ops: (SchemaOperation<T> | Schema<any>)[]
) {
  for (const op of ops)
    op instanceof Schema
      ? op.validate(ctx.value, ctx.path)
      : operations[op.name](ctx, op);
}