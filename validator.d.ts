import { ISchemaOptions, IImportOptions } from "./schema";
import { ValidallInvalidArgsError } from "./errors";
import { IFetchOptions } from 'tools-box/fetch';
export declare class Validall {
    private _id;
    private negateMode;
    private meta;
    private _error;
    private map;
    private orgSchema;
    private schema;
    private options;
    private isPrepared;
    defaults: {
        [key: string]: any;
    };
    nullables: string[];
    src: any;
    constructor(options: ISchemaOptions, map?: any);
    readonly id: string;
    readonly error: Error;
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
