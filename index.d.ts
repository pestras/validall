import { ValidallError } from "./errors";
import { IRootSchema, ISchema } from "./interfaces";
export declare class Validall {
    /** Unique identifier to reference the current instance in other schemas */
    private _name;
    private _originalSchema;
    private _schema;
    private _error;
    private _ctx;
    constructor(schema: IRootSchema | {
        [key: string]: ISchema;
    });
    constructor(name: string, schema: IRootSchema | {
        [key: string]: ISchema;
    });
    static Get(name: string): Validall;
    get name(): string;
    get error(): ValidallError;
    get schema(): ISchema;
    private _reset;
    private _next;
    private _prepareSchema;
    validate(input: any, path?: string): boolean;
}
