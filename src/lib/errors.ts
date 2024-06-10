// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { SchemaContext } from "./ctx";

/**
 * Validall error class
 */
export class ValidallError extends Error {
  public path: string;
  public value: any;

  constructor(ctx: SchemaContext, message: string | ((ctx: SchemaContext) => string)) {
    super(typeof message === "string" ? message : message(ctx));

    this.name = this.constructor.name;
    this.path = ctx.path;
    this.value = ctx.value;
  }
}