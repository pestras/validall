type isOptions = 'name' | 'email' | 'url';
type toArgs = 'lowercase' | 'uppercase' | 'trim' | 'capitlizeFirst' | 'capitlizeFirstAll' | 'path' | ((value: any) => any);
type toOptions = toArgs | toArgs[];
type castOptions = "number" | "string" | "bolean" | "date" | "regexp" | "array";

interface IOperators {
  $message?: string;
  $default?: any;
  $nullable?: boolean;
  $required?: boolean; 
  $strict?: boolean;
  $filter?: boolean;
  $props?: any;
  $type?: any;
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
  getTypesOf: (value: any) => any[];
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
    name?: string;
    root?: string;
    required?: boolean;
    filter?: boolean;
    strict?: boolean;
    nullable?: boolean;
    throwMode?: boolean;
    traceError?: boolean;
  }
  
  export interface ISchema extends IOperators {}

  export class Schema {
    error: IValidallError;
    defaults: { [key: string]: any };
    nullables: { [key: string]: boolean };
    constructor(schema: ISchema, options?: ISchemaOptions)
    test(src: any): boolean | never;
    getProps(field?: string): any;
    getPropsByName(name: string): any[];
  }
}