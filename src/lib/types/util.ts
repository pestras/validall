import { BaseOperatorOptions, OperationOptions } from "./base";


// IsRequired
// ----------------------------------------------------------------------
export interface IsRequiredOperationOptions extends BaseOperatorOptions {
  name: 'isRequired';
}

export function IsRequired(options?: OperationOptions): IsRequiredOperationOptions {
  return { name: 'isRequired', options };
}

// IsNullable
// ----------------------------------------------------------------------
export interface IsNullableOperationOptions extends BaseOperatorOptions {
  name: 'isNullable';
}

export function IsNullable(options?: OperationOptions): IsNullableOperationOptions {
  return { name: 'isNullable', options };
}

// Validate
// ----------------------------------------------------------------------
export interface ValidateOperationOptions extends BaseOperatorOptions {
  name: 'validate';
  func: (val: any, path: string) => void
}

export function Validate(func: (val: any, path: string) => void, options?: OperationOptions): ValidateOperationOptions {
  return { name: 'validate', func, options };
}