import { ISchema, ISchemaOptions } from './schema';
/**
 *
 * @param schema (Schema)
 * @param options (SchemaOptions) default options
 * @param msg (string?) default options
 * @param inOperator (boolean?) operator schema or field schema
 */
export declare function prepare(schema: ISchema, options: ISchemaOptions, inOperator?: boolean): ISchema;
