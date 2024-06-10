import { Schema } from "../schema";
import { BaseOperatorOptions, OperationOptions } from "./base";
import { SchemaOperation } from "./object-schema";

// And
// -----------------------------------------------------------------------
export interface AndOperationOptions extends BaseOperatorOptions {
  name: 'and';
  operators: (SchemaOperation<any> | Schema<any>)[];
}

export function And(operators: (SchemaOperation<any> | Schema<any>)[], options?: OperationOptions): AndOperationOptions {
  return { name: 'and', operators, options };
}

// Or
// -----------------------------------------------------------------------
export interface OrOperationOptions extends BaseOperatorOptions {
  name: 'or';
  operators: (SchemaOperation<any> | Schema<any>)[];
}

export function Or(operators: (SchemaOperation<any> | Schema<any>)[], options?: OperationOptions): OrOperationOptions {
  return { name: 'or', operators, options };
}

// Xor
// -----------------------------------------------------------------------
export interface XorOperationOptions extends BaseOperatorOptions {
  name: 'xor';
  operators: (SchemaOperation<any> | Schema<any>)[];
}

export function Xor(operators: (SchemaOperation<any> | Schema<any>)[], options?: OperationOptions): XorOperationOptions {
  return { name: 'xor', operators, options };
}

// Nor
// -----------------------------------------------------------------------
export interface NorOperationOptions extends BaseOperatorOptions {
  name: 'nor';
  operators: (SchemaOperation<any> | Schema<any>)[];
}

export function Nor(operators: (SchemaOperation<any> | Schema<any>)[], options?: OperationOptions): NorOperationOptions {
  return { name: 'nor', operators, options };
}