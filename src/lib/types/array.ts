
import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";
import { SchemaOperation } from "./object-schema";

// IsArray
// ----------------------------------------------------------------------------------
export interface IsArrayOperationOptions extends BaseOperatorOptions {
  name: 'isArray';
  operations?: (SchemaOperation<any> | Schema<any>)[] | null;
}

export function IsArray(operations?: (SchemaOperation<any> | Schema<any>)[] | null, options?: OperationOptions): IsArrayOperationOptions {
  return { 
    name: 'isArray',
    operations,
    options
  };
}

// ArrayLength
// ---------------------------------------------------------------------------------
export interface ArrayLengthOperationOptions extends BaseOperatorOptions {
  name: 'arrayLength';
  length: number | [number?, number?];
}

export function ArrayLength(length: number | [number?, number?], options?: OperationOptions): ArrayLengthOperationOptions {
  return { name: 'arrayLength', length, options };
}