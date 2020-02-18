import { ISchema } from './schema';
import { ValidallValidationError } from './errors';
export { Validall } from './validator';
export declare function validate(src: any, schema: ISchema, map?: any, throwMode?: boolean): ValidallValidationError | never;
