export type isOptions = 'name' | 'email' | 'url' | 'value' | 'notEmpty' | 'number';
export type castOptions = "number" | "string" | "bolean" | "date" | "regexp" | "array";
export type toArgs = 'lowercase' | 'uppercase' | 'trim' | 'capitalizeFirst' | 'capitalizeFirstAll' | 'path';
export type toOptions = toArgs | toArgs[];

export interface IValidatorOperators {
  $equals?: any;
  $deepEquals?: any;
  $gt?: number | string;
  $gte?: number | string;
  $lt?: number | string;
  $lte?: number | string;
  $inRange?: [number, number] | string;
  $intersect?: any[] | string;
  $include?: any[] | string;
  $enum?: any[] | string;
}

export interface IContextualOperators {
  $type?: 'number' | 'int' | 'float' | 'string' | 'boolean' | 'primitive' | 'date' | 'regexp' | 'function' | 'object' | 'array';
  $ref?: string;
  $instanceof?: Function | string;
  $is?: isOptions;
  $regex?: RegExp | string;
  $on?: Date | string | number;
  $before?: Date | string | number;
  $after?: Date | string | number;
}

export interface IModifierOperators {
  $default?: any;
  $nullable?: boolean | string;
  $filter?: boolean | string;
  $cast?: castOptions;
  $to?: toOptions;
}

export interface INegatableOperators {
  $equals?: any;
  $deepEquals?: any;
  $inRange?: [number, number] | string;
  $intersect?: any[] | string;
  $include?: any[] | string;
}

export interface IReaderOperators {
  $message?: string | string[];
  $meta?: any;
}

export interface IStructuralOperaotrs {
  $required?: boolean | string;
  $strict?: boolean | string | string[];
  $each?: ISchema;
  $props?: { [key: string]: ISchema }
  $keys?: IValidatorOperators;
  $length?: IValidatorOperators;
  $size?: IValidatorOperators;
}

export interface ILogicalOperators {
  $not?: INegatableOperators;
  $and?: ISchema[];
  $or?: ISchema[];
  $xor?: ISchema[];
  $nor?: ISchema[];
}

export interface ISchema
  extends
    IValidatorOperators, 
    IContextualOperators,
    IModifierOperators,
    IReaderOperators, 
    IStructuralOperaotrs, 
    ILogicalOperators {}

export interface ISchemaConfig {
  required?: boolean;
  filter?: boolean;
  strict?: boolean;
  nullable?: boolean;
  throwMode?: boolean;
}

export interface ISchemaOptions extends ISchemaConfig {
  id: string;
  replaceSchema?: boolean;
  lazy?: boolean;
  schema: ISchema;
}

export interface IValidator {
  src: any;
  negateMode: boolean;
  path(supPath: string): string;
  next(src: any, schema: ISchema, path: string): void;
}

export interface IImportOptions {
  id?: string;
  replaceSchema?: boolean;
  throwMode?: boolean;
  map?: string;
}