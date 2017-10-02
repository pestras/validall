type typeOptions = "undefined" | "any" | "number" | "string" | "boolean" | "primitive" | "date" | "regexp" | "object" | "function" | "any[]" | "number[]" | "string[]" | "boolean[]" | "primitive[]" | "date[]" | "regexp[]" | "object[]";
type isOptions = "null" | "number" | "date" | "set" | "true" | "filled" | "email" | "url";

interface IOperators {
  $message?: string;
  $type?: typeOptions;
  $is?: isOptions;
  $extendable?: boolean | "filter";
  $required?: boolean;
  $default?: any;
  $equals?: any;
  $identical?: any;
  $regex?: RegExp;
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $range?: [number, number];
  $size?: number | IOperators;
  $keys?: IOperators;
  $in?: any[];
  $all?: any[];
  $on?: Date | string;
  $before?: Date | string;
  $after?: Date | string;
  $fn?: (value: any, fieldPath: string) => boolean;
  $each?: [ISchema];
  $not?: IOperators;
  $and?: IOperators[];
  $or?: IOperators[];
  $nor?: IOperators[];
  $xor?: IOperators[];
}

interface ISchema extends IOperators {
  [key: string]: any;
}

interface IMessageData {
  fieldPath?: string;
  operator?: string;
  expected?: any;
  received?: any;
  not?: "not" | ""
}

interface ITypeUtil {
  undefined: (value: any) => boolean;
  number: (value: any) => boolean;
  string: (value: any) => boolean;
  html: (value: any) => boolean;
  boolean: (value: any) => boolean;
  primitive: (value: any) => boolean;
  date: (value: any) => boolean;
  regexp: (value: any) => boolean;
  object: (value: any) => boolean;
  function: (value: any) => boolean;
  'number[]': (value: any) => boolean;
  'string[]': (value: any) => boolean;
  'boolean[]': (value: any) => boolean;
  'primitive[]': (value: any) => boolean;
  'date[]': (value: any) => boolean;
  'regexp[]': (value: any) => boolean;
  'object[]': (value: any) => boolean;
  'any[]': (value: any) => boolean;
  any: (value?: any) => boolean;
}

interface IIsUtil {
  null: (value: any) => boolean;
  number: (value: any) => boolean;
  set: (value: any) => boolean;
  'true': (value: any) => boolean;
  filled: (value: any) => boolean;
  date: (value: any) => boolean;
  email: (value: any) => boolean;
  url: (value: any) => boolean;
}

interface IUtils {
  compile: (template: string, data: any) => string;
  fromPath: (src: object, path: string, value?: any, inject?: boolean) => any;
  equals: (src: any, target: any, deep?: boolean) => boolean;
  isSet: (value: any) => boolean;
  isTrue: (value: any) => boolean;
  isFilled: (value: any) => boolean;
  getType: (value: any) => string;
  type: ITypeUtil;
  is: IIsUtil;
}

declare namespace error {
  class ValidallError {
    constructor(messages: string | { message: string; data?: IMessageData }[]);
  }
}

export = validall;
declare function validall(src: any, schema: ISchema, rootName?: string): boolean;
declare namespace validall {
  export const message: string;
  export const errMap: string;
  export const Error: error.ValidallError;
  export function expect(value: any, type: string): void | never;
  export const util: IUtils;  
}