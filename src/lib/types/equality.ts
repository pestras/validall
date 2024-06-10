import { BaseOperatorOptions, OperationOptions } from "./base";


// Equals
// ----------------------------------------------------------------------
export interface EqualsOperationOptions<T> extends BaseOperatorOptions {
  name: 'equals';
  value: T;
}

export function Equals<T>(value: T, options?: OperationOptions): EqualsOperationOptions<T> {
  return { 
    name: 'equals',
    value,
    options
  };
}

// NotEquals
// ----------------------------------------------------------------------
export interface NotEqualsOperationOptions<T> extends BaseOperatorOptions {
  name: 'notEquals';
  value: T;
}

export function NotEquals<T>(value: T, options?: OperationOptions): NotEqualsOperationOptions<T> {
  return { 
    name: 'notEquals',
    value,
    options
  };
}

// InRange
// ----------------------------------------------------------------------
export interface InRangeOperationOptions<T> extends BaseOperatorOptions {
  name: 'inRange';
  range: [T?, T?];
}

export function InRange<T>(range: [T?, T?], options?: OperationOptions): InRangeOperationOptions<T> {
  return { 
    name: 'inRange',
    range,
    options
  };
}

// OutRange
// ----------------------------------------------------------------------
export interface OutRangeOperationOptions<T> extends BaseOperatorOptions {
  name: 'outRange';
  range: [T, T];
}

export function OutRange<T>(range: [T, T], options?: OperationOptions): OutRangeOperationOptions<T> {
  return { 
    name: 'outRange',
    range,
    options
  };
}

// IsIn
// ----------------------------------------------------------------------
export interface IsInOperationOptions<T> extends BaseOperatorOptions {
  name: 'isIn';
  values: Readonly<T[]> | T[];
}

export function IsIn<T>(values: Readonly<T[]> | T[], options?: OperationOptions): IsInOperationOptions<T> {
  return { 
    name: 'isIn',
    values,
    options
  };
}

// IsNotIn
// ----------------------------------------------------------------------
export interface IsNotInOperationOptions<T> extends BaseOperatorOptions {
  name: 'isNotIn';
  values: Readonly<T[]> | T[];
}

export function IsNotIn<T>(values: Readonly<T[]> | T[], options?: OperationOptions): IsNotInOperationOptions<T> {
  return { 
    name: 'isNotIn',
    values,
    options
  };
}

// Intersect
// ----------------------------------------------------------------------------------
export interface IntersectOperationOptions<T> extends BaseOperatorOptions {
  name: 'intersect';
  values: Readonly<T[]> | T[];
}

export function Intersect<T>(values: Readonly<T[]> | T[], options?: OperationOptions): IntersectOperationOptions<T> {
  return { name: 'intersect', values, options };
}