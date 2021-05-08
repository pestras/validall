import { Validall } from './validator';
export { Validall } from './validator';
export function validate(src, schema, map, throwMode = false) {
    let options = {
        schema: schema,
        id: null,
        throwMode: throwMode
    };
    let validator = new Validall(options, map === true ? src : map || null);
    return validator.validate(src) ? null : validator.error;
}
