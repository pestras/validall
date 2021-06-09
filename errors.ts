import { compile } from '@pestras/toolbox/string/compile';

export interface IValidallError {
  path: string;
}

export class ValidallError extends Error {
  path: string;
  operator: string;
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
  opoerator: string;
  expected: string;
  got: any;
}

export class ValidallInvalidArgsError extends ValidallError {

  constructor(args: IInvalidArgs) {
    super();

    this.path = args.path;
    this.operator = args.opoerator;
    this.expected = args.expected;
    this.got = args.got;

    this.message = this.short = `invalid ${args.opoerator} method argument ${args.got}`;
    this.message += ` method: ${args.opoerator}`;
    this.message += ` expected: ${args.expected}`;
    this.message += ` got: ${args.got}`;
    this.message += ` path: ${args.path}`;
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
    this.operator = args.method;
    this.expected = args.expected;
    this.got = args.got;

    if (msg) {
      msg = Array.isArray(msg) ? msg : [msg];
      this.message = compile(msg[0], args);
      this.code = msg[1] || '0';
      this.short = this.message;
    } else {
      this.message = this.short = prefix; 
      this.message += ` method: ${args.method}.`;
      this.message += ` expected: ${args.expected}.`;
      this.message += ` got: ${args.got}.`;
      this.message += ` path: ${args.path}.`;
    }
    
  }
}