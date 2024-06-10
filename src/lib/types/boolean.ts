import { BaseOperatorOptions, OperationOptions } from "./base";

// IsBoolean
// -----------------------------------------------------------------------
export interface IsBooleanOperationOptions extends BaseOperatorOptions {
  name: 'isBoolean';
}

export function IsBoolean(options?: OperationOptions): IsBooleanOperationOptions {
  return { name: 'isBoolean', options };
}