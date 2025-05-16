import { SchemaContext } from "./ctx";
import { ValidallError } from "./errors";
import { register, runHandler } from "./registry";
import { BaseOperatorOptions } from "./types/base";
import { ObjectSchema } from "./types/object-schema";

type Diff<T extends object, U extends T> = Omit<U, keyof T>;

export interface SchemaOptions {
  /** when true: ignores any additional fields not defined in schema */
  lazy?: boolean;
  nullable?: boolean;
}

export class Schema<T extends object> {
  private static repo = new Map<string, Schema<any>>;

  constructor(
    readonly name: string,
    readonly schema: ObjectSchema<T>,
    readonly options: SchemaOptions = {}
  ) {

    if (!this.schema)
      throw "validation schema is required";

    if (this.name) {
      if (Schema.repo.has(this.name))
        throw `validation schema name '${this.name}' already exists`;

      Schema.repo.set(this.name, this);
    }
  }

  static Get<T extends object>(name: string): Schema<T> | null {
    return Schema.repo.get(name) ?? null;
  }

  static Alias(name: string, to: string) {
    const src = Schema.repo.get(to);

    if (!src)
      throw `cannot alias undefined schema: ${to}`;

    this.repo.set(name, src);
  }

  static Register<OPTIONS extends BaseOperatorOptions>(
    name: string,
    handler: (ctx: SchemaContext, opt: OPTIONS) => void
  ) {
    register(name, handler);
  }

  static Extend<T extends object, U extends T>(srcSchemaName: string, name: string, schema: ObjectSchema<Diff<T, U>>, options?: SchemaOptions) {
    const src = Schema.Get(srcSchemaName);

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