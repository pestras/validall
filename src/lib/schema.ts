import { SchemaContext } from "./ctx";
import { ValidallError } from "./errors";
import { register, runHandler } from "./registry";
import { BaseOperatorOptions } from "./types/base";
import { ObjectSchema } from "./types/object-schema";

export interface SchemaOptions {
  name?: string;
  strict?: boolean;
  nullable?: boolean;
}

export class Schema<T extends object> {
  private static repo = new Map<string, Schema<any>>;

  constructor(private schema: ObjectSchema<T>, private options: SchemaOptions = {}) {

    if (!this.schema)
      throw "validation schema is required";

    if (options.name) {
      if (Schema.repo.has(options.name))
        throw `validation schema name '${options.name}' already exists`;

      Schema.repo.set(options.name, this);
    }
  }

  static Get<T extends object>(name: string): Schema<T> | null {
    return Schema.repo.get(name) ?? null;
  }

  static Register<OPTIONS extends BaseOperatorOptions>(
    name: string,
    handler: (ctx: SchemaContext, opt: OPTIONS) => void
  ) {
    register(name, handler);
  }

  validate(input: T, prefix?: string): ValidallError | undefined {

    const ctx: SchemaContext = { path: prefix ?? '', value: input };

    if (!prefix && !this.options.nullable && !input)
      return new ValidallError(ctx, `validation input is required`);

    if (input) {
      if (Object.prototype.toString.call(input) !== "[object Object]")
        return new ValidallError(ctx, `validation input is not an object!`);

      if (this.options.strict) {
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

          for (const op of this.schema[prop]) {
            op instanceof Schema
              ? op.validate(localCtx.value, localCtx.path)
              : runHandler(op.name, localCtx, op);
          }
        }
      } catch (error) {
        if (prefix)
          throw error;

        return error;
      }
    }

  }
}