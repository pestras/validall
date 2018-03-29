type typesOptions = "any" | "number" | "int" | "float" | "string" | "boolean" | "primitive" | "date" | "regexp" | "object" | "function" | "array" | "number[]" | "int[]" | "float[]" | "string[]" | "boolean[]" | "primitive[]" | "date[]" | "regexp[]" | "object[]" | "function[]" | Function | Function[];
type isOptions = 'name' | 'email' | 'url';
type toArgs = 'lowercase' | 'uppercase' | 'trim' | 'capitlizeFirst' | 'capitlizeFirstAll' | 'path' | ((value: any) => any);
type toOptions = toArgs | toArgs[];
type castOptions = "number" | "string" | "bolean" | "date" | "regexp" | "array";

interface IOperators {
  $message?: string;
  $default?: any;
  $required?: boolean; 
  $strict?: boolean;
  $filter?: boolean;
  $props?: any;
  $type?: typesOptions;
  $is?: isOptions;
  $cast?: castOptions;
  $to?: toOptions;
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
  $allIn?: any;
  $keys?: IOperators;
  $on?: Date | string | number;
  $before?: Date | string | number;
  $after?: Date | string | number;
  $not?: IOperators;
  $and?: IOperators[];
  $or?: IOperators[];
  $xor?: IOperators[];
  $nor?: IOperators[];
  $each?: IOperators;
  [key: string]: any;
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

interface IIsUtil {
  value: (value: any) => boolean;
  notEmpty: (value: any) => boolean;
  number: (value: any) => boolean;
  name: (value: string) => boolean;
  email: (value: string) => boolean;
  url: (value: string) => boolean;
  date: (value: string) => boolean;
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
  export const Is: IIsUtil;
  export const error: IValidallError;
  export interface ISchemaOptions {
    root?: string;
    required?: boolean;
    filter?: boolean;
    strict?: boolean;
    throwMode?: boolean;
    traceError?: boolean;
  }
  
  export interface ISchema extends IOperators {}

  export class Schema {
    error: IValidallError;
    defaults: { [key: string]: any };
    constructor(schema: ISchema, options?: ISchemaOptions)
    test(src: any): boolean | never;
    getProps(field?: string): any;
    getPropsByName(name: string): any[];
  }
}