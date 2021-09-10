// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { compile } from '@pestras/toolbox/string/compile';
import { ValidationContext } from "./interfaces";

/**
 * Validall error class
 */
export class ValidallError extends Error {
  public path: string;

  constructor(ctx: ValidationContext, message: string, path = '') {
    super(compile(message, { path: ctx.fullPath, input: ctx.currentInput, inputType: typeof ctx.input } ));
    
    this.name = this.constructor.name;
    this.path = path;
  }
}