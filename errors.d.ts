import { ValidationContext } from "./interfaces";
/**
 * Validall error class
 */
export declare class ValidallError extends Error {
    path: string;
    constructor(ctx: ValidationContext, message: string, path?: string);
}
