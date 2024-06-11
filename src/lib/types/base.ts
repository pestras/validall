import { SchemaContext } from "../ctx";

export interface OperationOptions {
  message?: string | ((ctx: SchemaContext) => string);
}

export interface BaseOperatorOptions {
  name: string;
  options?: OperationOptions | null;
}