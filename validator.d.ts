import { ISchema, ISchemaOptions, IImportOptions } from "./schema";
import { ValidallValidationError, ValidallInvalidArgsError } from "./errors";
import { IFetchOptions } from '@pestras/toolbox/fetch';
export declare class Validall {
    private _id;
    private negateMode;
    private meta;
    private _error;
    private map;
    private orgSchema;
    private _schema;
    private options;
    private isPrepared;
    defaults: {
        [key: string]: any;
    };
    nullables: string[];
    src: any;
    constructor(options: ISchemaOptions, map?: any);
    get id(): string;
    get error(): ValidallValidationError;
    get schema(): {
        $equals?: any;
        $deepEquals?: any;
        $gt?: string | number;
        $gte?: string | number;
        $lt?: string | number;
        $lte?: string | number;
        $inRange?: string | [number, number];
        $intersect?: string | any[];
        $include?: string | any[];
        $enum?: string | any[];
        $type?: "string" | "number" | "boolean" | "object" | "function" | "date" | "regexp" | "array" | "int" | "float" | "primitive";
        $ref?: string | Validall;
        $instanceof?: string | Function;
        $is?: import("./schema").isOptions;
        $regex?: string | RegExp | [string, string?];
        $on?: string | number | Date;
        $before?: string | number | Date;
        $after?: string | number | Date;
        $default?: any;
        $nullable?: string | boolean;
        $filter?: string | boolean;
        $cast?: import("./schema").castOptions;
        $to?: import("./schema").toOptions;
        $message?: string | string[];
        $meta?: any;
        $required?: string | boolean;
        $strict?: string | boolean | string[];
        $each?: ISchema;
        $props?: {
            [key: string]: ISchema;
        };
        $paths?: {
            [key: string]: ISchema;
        };
        $keys?: import("./schema").IValidatorOperators;
        $length?: import("./schema").IValidatorOperators;
        $size?: import("./schema").IValidatorOperators;
        $not?: import("./schema").INegatableOperators;
        $and?: ISchema[];
        $or?: ISchema[];
        $xor?: ISchema[];
        $nor?: ISchema[];
    };
    private saveMeta;
    private reset;
    /**
     *
     */
    private next;
    set(keyPath: string, value: any): any;
    validate(src: any, throwErr?: boolean): boolean;
    getPropMeta(prop?: string): any;
    getAllMeta(): any;
    getMetaByName(name: string): {
        [key: string]: any;
    }[];
    static ImportSchema(config: IFetchOptions, options?: IImportOptions): Promise<Validall>;
    static GetValidator(id: string): Validall;
    static ValidateSchema(options: ISchemaOptions): ValidallInvalidArgsError;
}
