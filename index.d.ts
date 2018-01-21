type typesOptions = "any" | "number" | "int" | "float" | "string" | "boolean" | "primitive" | "date" | "regexp" | "object" | "function" | "array" | "number[]" | "int[]" | "float[]" | "string[]" | "boolean[]" | "primitive[]" | "date[]" | "regexp[]" | "object[]" | "function[]";

interface IOperators {
  $message?: string;
  $default?: any;
  $required?: boolean; 
  $strict?: boolean;
  $filter?: boolean;
  $type?: typesOptions;
  $cast?: "number" | "string" | "bolean" | "date" | "regexp" | "array";
  $to?: (value: any) => any | ((value: any) => any)[];
  $equals?: any;
  $deepEquals?: any;
  $regex?: RegExp;
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $inRange?: [number, number];
  $length?: number | IOperators;
  $size?: number | IOperators;
  $in?: any;
  $all?: any;
  $keys?: IOperators;
  $on?: Date | string | number;
  $before?: Date | string | number;
  $after?: Date | string | number;
  $not?: IOperators;
  $and?: IOperators[];
  $or?: IOperators[];
  $xor?: IOperators[];
  $nor?: IOperators[];
  $each?: Validall.ISchema;
}

interface ITypesUtil {
  isValidType: (type: string) => boolean;
  int: (value: any) => boolean;
  float: (value: any) => boolean;
  number: (value: any) => boolean;
  string: (value: any) => boolean;
  boolean: (value: any) => boolean;
  primitive: (value: any) => boolean;
  date: (value: any) => boolean;
  regexp: (value: any) => boolean;
  object: (value: any) => boolean;
  function: (value: any) => boolean;
  'number[]': (value: any) => boolean;
  'int[]': (value: any) => boolean;
  'float[]': (value: any) => boolean;
  'string[]': (value: any) => boolean;
  'boolean[]': (value: any) => boolean;
  'primitive[]': (value: any) => boolean;
  'date[]': (value: any) => boolean;
  'regexp[]': (value: any) => boolean;
  'object[]': (value: any) => boolean;
  'function[]': (value: any) => boolean;
  'array': (value: any) => boolean;
  any: (value?: any) => boolean;
  getTypeOf: (value: any) => typesOptions;
}

interface IValidallError {
  operator: string;
  path: string;
  message: string;
  got: string;
  toString: () => string;
}

export = Validall;

declare function Validall(src: any, schema: Validall.ISchema, options?: Validall.ISchemaOptions): boolean;
declare namespace Validall {  
  export const Types: ITypesUtil;
  export const error: IValidallError;
  export interface ISchemaOptions {
    root?: string;
    required?: boolean;
    filter?: boolean;
    strict?: boolean;
    throwMode?: boolean;
    traceError?: boolean;
  }
  export interface ISchema extends IOperators {
    [key: string]: ISchema | any;
  }
  export class Schema {
    error: IValidallError;
    constructor(schema: ISchema, options?: ISchemaOptions)
    test(src: any): boolean | never;
  }
}