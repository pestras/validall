import { SchemaContext } from "./ctx";
import { ValidallError } from "./errors";
import { validate } from "./operations";
import { IsDate, IsString } from "./types";
import { ObjectSchema } from "./types/object-schema";

export class Schema<T extends object> {

  constructor(readonly schema: ObjectSchema<T>) { }

  validate(input: T, prefix?: string): ValidallError | undefined {

    const ctx: SchemaContext = { path: prefix ?? '', value: input };

    if (Object.prototype.toString.call(input) !== "[object Object]")
      return new ValidallError(ctx, `validation input is not an object!`);

    try {
      for (const prop in this.schema)
        validate(
          {
            path: ctx.path ? `${ctx.path}.${prop}` : prop,
            value: input[prop]
          },
          this.schema[prop]
        );
    } catch (error) {
      if (prefix)
        throw error;
      
      return error;
    }
  }
}