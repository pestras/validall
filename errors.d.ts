/**
 * Validall error class
 */
export declare class ValidallError extends Error {
    path: string;
    constructor(message: string, path?: string);
}
