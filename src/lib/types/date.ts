import { DateUnit } from "../util/date/unit";
import { BaseOperatorOptions, OperationOptions } from "./base";

// IsDate
// ---------------------------------------------------------------------------------------
export interface IsDateOperationOptions extends BaseOperatorOptions {
  name: 'isDate';
}

export function IsDate(options?: OperationOptions): IsDateOperationOptions {
  return { name: 'isDate', options };
}

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