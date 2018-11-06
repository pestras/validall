import { generateMessage } from "./util";
import { compile } from 'tools-box/string/compile';

export interface IValidallError {
  path: string;
}

export class ValidallError extends Error {
  path: string;
  method: string;
  expected: string;
  got: any;
  short: string;

  constructor() {
    super();

    this.name = this.constructor.name;
  }
}

/**
 * ------------------------------------------------------------------------------------------------------------------------
 * Validall Invalid Args Error
 */
export interface IInvalidArgs extends IValidallError {
  method: string;
  expected: string;
  got: any;
}

export class ValidallInvalidArgsError extends ValidallError {

  constructor(args: IInvalidArgs) {
    super();

    this.path = args.path;
    this.method = args.method;
    this.expected = args.expected;
    this.got = args.got;

    this.message = this.short = `invalid ${args.method} method argument ${args.got}\n`;
    this.message += `   method: ${args.method}\n`;
    this.message += `   expected: ${args.expected}\n`;
    this.message += `   got: ${args.got}\n`;
    this.message += `   path: ${args.path}`;
  }
}

/**
 * ------------------------------------------------------------------------------------------------------------------------
 * Validall Validation Error
 */
export interface IValidationError extends IValidallError {
  method: string;
  expected: any;
  got: any;
}

export class ValidallValidationError extends ValidallError {
  code = '0';
  short: string;

  constructor(args: IValidationError, prefix: string, msg?: string | string[]) {
    super();

    this.path = args.path;
    this.method = args.method;
    this.expected = args.expected;
    this.got = args.got;

    if (msg) {
      msg = Array.isArray(msg) ? msg : [msg];
      this.message = compile(msg[0], args);
      this.code = msg[1] || '0';
      this.short = this.message;
    } else {
      this.message = this.short = prefix + '\n'; 
      this.message += `   method: ${args.method}.\n`;
      this.message += `   expected: ${args.expected}.\n`;
      this.message += `   got: ${args.got}.\n`;
      this.message += `   path: ${args.path}.\n`;
    }
    
  }
}