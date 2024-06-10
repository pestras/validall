import { BaseOperatorOptions, OperationOptions } from "./base";

// IsNumber
// ----------------------------------------------------------------------------------
export interface IsNumberOperationOptions extends BaseOperatorOptions {
  name: 'isNumber';
}

export function IsNumebr(options?: OperationOptions): IsNumberOperationOptions {
  return { name: 'isNumber', options };
}

// IsInt
// ----------------------------------------------------------------------------------
export interface IsIntOperationOptions extends BaseOperatorOptions {
  name: 'isInt';
}

export function IsInt(options?: OperationOptions): IsIntOperationOptions {
  return { name: "isInt", options };
}

// IsFloat
// ----------------------------------------------------------------------------------
export interface IsFloatOperationOptions extends BaseOperatorOptions {
  name: 'isFloat';
}

export function IsFloat(options?: OperationOptions): IsFloatOperationOptions {
  return { name: "isFloat", options };
}