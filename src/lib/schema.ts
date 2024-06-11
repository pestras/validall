import { SchemaContext } from "./ctx";
import { ValidallError } from "./errors";
import { register, runHandler } from "./registry";
import { BaseOperatorOptions } from "./types/base";
import { ObjectSchema } from "./types/object-schema";

export class Schema<T extends object> {
  private static repo = new Map<string, Schema<any>>;

  readonly name!: string;
  readonly schema!: ObjectSchema<T>;

  constructor(schema: ObjectSchema<T>)
  constructor(name: string, schema: ObjectSchema<T>)
  constructor(arg1: string | ObjectSchema<T>, arg2?: ObjectSchema<T>) {
    if (typeof arg1 === 'string') {
      this.name = arg1;
      if (arg2)
        this.schema = arg2;
    } else {
      this.name = '';
      this.schema = arg1
    }

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

  static Register<OPTIONS extends BaseOperatorOptions>(
    name: string,
    handler: (ctx: SchemaContext, opt: OPTIONS) => void
  ) {
    register(name, handler);
  }

  validate(input: T, prefix?: string): ValidallError | undefined {

    const ctx: SchemaContext = { path: prefix ?? '', value: input };

    if (Object.prototype.toString.call(input) !== "[object Object]")
      return new ValidallError(ctx, `validation input is not an object!`);

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