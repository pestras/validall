import { DateFormat } from "../util/date/format";
import { BaseOperatorOptions, OperationOptions } from "./base";

export const stringTypes = ['email', 'URL', 'date', 'number', 'boolean'] as const;
export type StringType = typeof stringTypes[number];

// IsString
// ---------------------------------------------------------------------------------
export interface IsStringOperationOptions extends BaseOperatorOptions {
  name: 'isString';
  type?: StringType | null;
}

export function IsString(type?: StringType | null, options?: OperationOptions): IsStringOperationOptions {
  return { name: 'isString', type, options };
}

// Regex
// ---------------------------------------------------------------------------------
export interface RegexOperationOptions extends BaseOperatorOptions {
  name: 'regex';
  regex: RegExp;
}

export function Regex(regex: RegExp, options?: OperationOptions): RegexOperationOptions {
  return { name: 'regex', regex, options };
}

// Length
// ---------------------------------------------------------------------------------
export interface LengthOperationOptions extends BaseOperatorOptions {
  name: 'length';
  length: number | [number?, number?];
}

export function Length(length: number | [number?, number?], options?: OperationOptions): LengthOperationOptions {
  return { name: 'length', length, options };
}