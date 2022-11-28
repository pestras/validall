// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { compile } from './util';
import { ValidationContext } from "./interfaces";

/**
 * Validall error class
 */
export class ValidallError extends Error {
  public path: string;
  public input: any;
  public inputType: string;
  public prop: string;

  constructor(ctx: ValidationContext, message: string) {
    super(compile(message, { path: ctx.fullPath, input: ctx.currentInput, inputType: typeof ctx.currentInput, prop: ctx.prop }));

    this.name = this.constructor.name;
    this.path = ctx.fullPath;
    this.input = ctx.currentInput;
    this.inputType = typeof ctx.input
    this.prop = ctx.prop;
  }
}