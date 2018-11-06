import { IOptions, IImportOptions } from "./schema";
import { ValidallInvalidArgsError } from "./errors";
import { AxiosRequestConfig } from 'axios';
export declare class Validall {
    private _id;
    private negateMode;
    private meta;
    private _error;
    private schema;
    private options;
    private isPrepared;
    defaults: {
        [key: string]: any;
    };
    nullables: string[];
    src: any;
    constructor(options: IOptions);
    readonly id: string;
    readonly error: Error;
    private saveMeta;
    private reset;
    /**
     *
     */
    private next;
    validate(src: any, throwErr?: boolean, negateMode?: boolean): boolean;
    getPropMeta(prop?: string): any;
    getAllMeta(): any;
    getMetaByName(name: string): {
        [key: string]: any;
    }[];
    static ImportSchema(request: string | AxiosRequestConfig, options?: IImportOptions): Promise<Validall>;
    static GetValidator(id: string): Validall;
    static ValidateSchema(options: IOptions): ValidallInvalidArgsError;
}
