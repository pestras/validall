import { ISchema, ISchemaOptions } from './schema';
import { Validall } from './validator';
import { ValidallValidationError } from './errors';

export { Validall } from './validator';

export function validate(src: any, schema: ISchema, map?: any, throwMode = false): ValidallValidationError | never {
  let options: ISchemaOptions = {
    schema: schema,
    id: null,
    throwMode: throwMode
  };

  let validator = new Validall(options, map === true ? src : map || null);

  return validator.validate(src) ? null : validator.error;
}