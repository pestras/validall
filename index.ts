import { ISchema, ISchemaOptions, IOptions } from './schema';
import { Validall } from './validator';

export { Validall } from './validator';

export function validate(src: any, schema: ISchema, throwMode = false): Error | never {
  let options: IOptions = {
    schema: schema,
    id: null,
    throwMode: throwMode
  };

  let validator = new Validall(options);

  return validator.validate(src) ? null : validator.error;
}