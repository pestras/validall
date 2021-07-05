import { compile } from "@pestras/toolbox/string/compile";

/**
 * Validall error class
 */
export class ValidallError extends Error {
  public path: string;

  constructor(message: string, path = '') {
    super(message);
    
    this.name = this.constructor.name;
    this.path = path;
  }
}