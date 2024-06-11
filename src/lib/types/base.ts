import { SchemaContext } from "../ctx";
import { ValidallError } from "../errors";
import { Schema } from "../schema";

export const operators = [
  // util
  "validate",
  "isRequired",
  "isNullable",
  // boolean
  "isBoolean",
  // number
  "isNumber",
  "isInt",
  "isFloat",
  // string
  "isString",
  "regex",
  "length",
  // date
  "isDate",
  "isDateInRange",
  "isDateOutRange",
  "isDateIn",
  "isDateNotIn",
  // equality
  "equals",
  "notEquals",
  "inRange",
  "outRange",
  "isIn",
  "isNotIn",
  "intersect",
  // array
  "isArray",
  "arrayLength",
  // logic
  "and",
  "or",
  "xor",
  "nor"
] as const;

export type Operator = typeof operators[number];

export interface OperationOptions {
  message?: string | ((ctx: SchemaContext) => string);
}

export interface BaseOperatorOptions {
  name: Operator;
  options?: OperationOptions | null;
}