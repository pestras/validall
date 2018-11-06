export declare type isOptions = 'name' | 'email' | 'url' | 'value' | 'notEmpty' | 'number';
export declare type castOptions = "number" | "string" | "bolean" | "date" | "regexp" | "array";
export declare type toArgs = 'lowercase' | 'uppercase' | 'trim' | 'capitlizeFirst' | 'capitlizeFirstAll' | 'path';
export declare type toOptions = toArgs | toArgs[];
export interface IValidatorOperators {
    $equals?: any;
    $deepEquals?: any;
    $gt?: number;
    $gte?: number;
    $lt?: number;
    $lte?: number;
    $inRange?: [number, number];
    $intersect?: any[];
    $include?: any[];
    $enum?: any[];
}
export interface IContextualOperators {
    $type?: string;
    $ref?: string;
    $instanceof?: Function;
    $is?: isOptions;
    $regex?: RegExp;
    $on?: Date | string | number;
    $before?: Date | string | number;
    $after?: Date | string | number;
}
export interface IModifierOperators {
    $default?: any;
    $nullable?: boolean;
    $filter?: boolean;
    $cast?: castOptions;
    $to?: toOptions;
}
export interface INegatableOperators {
    $equals?: any;
    $deepEquals?: any;
    $inRange?: [number, number];
    $intersect?: any[];
    $include?: any[];
}
export interface IReaderOperators {
    $message?: string | string[];
    $meta?: any;
}
export interface IStructuralOperaotrs {
    $required?: boolean;
    $strict?: boolean | string[];
    $each?: ISchema;
    $props?: {
        [key: string]: ISchema;
    };
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
export interface ISchema extends IValidatorOperators, IContextualOperators, IModifierOperators, IReaderOperators, IStructuralOperaotrs, ILogicalOperators {
}
export interface ISchemaOptions {
    required?: boolean;
    filter?: boolean;
    strict?: boolean;
    nullable?: boolean;
    throwMode?: boolean;
}
export interface IOptions extends ISchemaOptions {
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
