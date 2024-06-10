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

// required
// ----------------------------------------------------------------------
export interface IsAnyOperationOptions extends BaseOperatorOptions {
  name: 'isAny';
}

export function IsAny(options?: OperationOptions): IsAnyOperationOptions {
  return { name: 'isAny', options };
}