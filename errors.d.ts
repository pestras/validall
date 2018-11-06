export interface IValidallError {
    path: string;
}
export declare class ValidallError extends Error {
    path: string;
    method: string;
    expected: string;
    got: any;
    short: string;
    constructor();
}
/**
 * ------------------------------------------------------------------------------------------------------------------------
 * Validall Invalid Args Error
 */
export interface IInvalidArgs extends IValidallError {
    method: string;
    expected: string;
    got: any;
}
export declare class ValidallInvalidArgsError extends ValidallError {
    constructor(args: IInvalidArgs);
}
/**
 * ------------------------------------------------------------------------------------------------------------------------
 * Validall Validation Error
 */
export interface IValidationError extends IValidallError {
    method: string;
    expected: any;
    got: any;
}
export declare class ValidallValidationError extends ValidallError {
    code: string;
    short: string;
    constructor(args: IValidationError, prefix: string, msg?: string | string[]);
}
