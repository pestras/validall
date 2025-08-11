import { SchemaContext } from "./ctx";
import { ValidallError } from "./errors";
import { register, runHandler } from "./registry";
import { BaseOperatorOptions } from "./types/base";
import { ObjectSchema } from "./types/object-schema";

export interface ValidallSchema {
  validate: (input: any, prefix?: string) => ValidallError | undefined;
}

export class ValidallRepo {
  private static map = new Map<string, ValidallSchema>();

  static Add(name: string, schema: ValidallSchema) {
    this.map.set(name, schema);
  }

  static HasSchema(name: string) {
    return !!this.GetSchema(name);
  }

  static HasGroup(name: string) {
    return !!this.GetSchemaGroup(name);
  }

  static GetSchema<U extends object = any>(name: string) {
    const schema = this.map.get(name);

    if (!schema || !(schema instanceof Schema))
      return null;

    return schema as Schema<U>;
  }

  static GetSchemaGroup(name: string) {
    const schema = this.map.get(name);

    if (!schema || !(schema instanceof SchemaGroup))
      return null;

    return schema as SchemaGroup;
  }
}

type Diff<T extends object, U extends T> = Omit<U, keyof T>;

export interface SchemaOptions {
  /** when true: ignores any additional fields not defined in schema */
  lazy?: boolean;
  nullable?: boolean;
}

export class Schema<T extends object> implements ValidallSchema {
  readonly name!: string | null;
  readonly schema!: ObjectSchema<T>;
  options: SchemaOptions = {};

  constructor(
    schema: ObjectSchema<T>,
    options?: SchemaOptions
  )
  constructor(
    name: string,
    schema: ObjectSchema<T>,
    options?: SchemaOptions
  )
  constructor(
    name: string | ObjectSchema<T>,
    schema: ObjectSchema<T> | SchemaOptions,
    options: SchemaOptions = {}
  ) {
    if (typeof name === 'string') {
      if (!schema)
        throw "validation schema is required";

      if (ValidallRepo.HasSchema(name))
        throw `validation schema name '${name}' already exists`;

      this.name = name;
      this.schema = schema as ObjectSchema<T>;
      this.options = options;

      ValidallRepo.Add(this.name, this);
    } else {
      if (!name)
        throw "validation schema is required";

      this.schema = name;
      this.options = schema;
    }
  }

  static Alias(name: string, to: string) {
    const src = ValidallRepo.GetSchema(to);

    if (!src)
      throw `cannot alias undefined schema: ${to}`;

    ValidallRepo.Add(name, src);
  }

  static Register<OPTIONS extends BaseOperatorOptions>(
    name: string,
    handler: (ctx: SchemaContext, opt: OPTIONS) => void
  ) {
    register(name, handler);
  }

  static Extend<T extends object, U extends T>(srcSchemaName: string, name: string, schema: ObjectSchema<Diff<T, U>>, options?: SchemaOptions) {
    const src = ValidallRepo.GetSchema(srcSchemaName);

    if (!src)
      throw `schema '${srcSchemaName}' was not found`;

    return new Schema<U>(name, Object.assign({}, src.schema, schema) as ObjectSchema<U>, options ?? src.options);
  }

  extend<U extends T>(name: string, schema: ObjectSchema<Diff<T, U>>, options?: SchemaOptions) {
    const extendedSchema = Object.assign({}, this.schema, schema);

    return new Schema<U>(name, extendedSchema as ObjectSchema<U>, options ?? this.options);
  }

  validate(input: T, prefix?: string): ValidallError | undefined {

    const ctx: SchemaContext = { path: prefix ?? '', value: input };

    if (!input) {
      if (!this.options.nullable)
        return new ValidallError(ctx, `validation input is required`);
      else
        return;
    }

    if (input) {
      if (Object.prototype.toString.call(input) !== "[object Object]")
        return new ValidallError(ctx, `validation input is not an object!`);

      if (!prefix && !this.options.lazy) {
        const allowedProps = Object.keys(this.schema);
        const inputProps = Object.keys(input);

        for (const prop of inputProps)
          if (!allowedProps.includes(prop))
            return new ValidallError(ctx, `prop "${prop}" is not allowed!`);
      }

      try {
        for (const prop in this.schema) {
          const localCtx: SchemaContext = {
            path: ctx.path ? `${ctx.path}.${prop}` : prop,
            value: input[prop]
          };

          for (const op of this.schema[prop])
            runHandler(op.name, localCtx, op);
        }
      } catch (error) {
        if (prefix)
          throw error;

        return error;
      }
    }
  }
}

export type SchemaGroupMode = 'any' | 'all' | 'single';

export class SchemaGroup implements ValidallSchema {

  constructor(readonly name: string, readonly mode: SchemaGroupMode, readonly schemasList: Schema<any>[]) {
    if (schemasList.length === 0)
      throw 'empty schema group is not allowed';

    if (ValidallRepo.HasSchema(this.name))
      throw `validation schema name '${this.name}' already exists`;

    ValidallRepo.Add(this.name, this);
  }

  static Any(name: string, schemasList: Schema<any>[]) {
    return new SchemaGroup(name, 'any', schemasList);
  }

  static All(name: string, schemasList: Schema<any>[]) {
    return new SchemaGroup(name, 'all', schemasList);
  }

  static Single(name: string, schemasList: Schema<any>[]) {
    return new SchemaGroup(name, 'single', schemasList);
  }

  validate(input: any, prefix?: string) {
    return this[this.mode](input, prefix);
  }

  private any(input: any, prefix?: string) {
    let error: ValidallError | undefined;

    for (const schema of this.schemasList) {
      error = schema.validate(input, prefix);

      if (error)
        return;
    }

    return error;
  }

  private all(input: any, prefix?: string) {
    for (const schema of this.schemasList) {
      const error = schema.validate(input, prefix);

      if (error)
        return error;
    }
  }

  private single(input: any, prefix?: string) {
    const errors: (ValidallError | undefined)[] = [];

    for (const schema of this.schemasList) {
      errors.push(schema.validate(input, prefix));

      if (errors.length === 2)
        return errors[0];
    }
  }
}