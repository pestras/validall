import { compile } from '@pestras/toolbox/string/compile';
export class ValidallError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
export class ValidallInvalidArgsError extends ValidallError {
    constructor(args) {
        super();
        this.path = args.path;
        this.method = args.method;
        this.expected = args.expected;
        this.got = args.got;
        this.message = this.short = `invalid ${args.method} method argument ${args.got}`;
        this.message += ` method: ${args.method}`;
        this.message += ` expected: ${args.expected}`;
        this.message += ` got: ${args.got}`;
        this.message += ` path: ${args.path}`;
    }
}
export class ValidallValidationError extends ValidallError {
    constructor(args, prefix, msg) {
        super();
        this.code = '0';
        this.path = args.path;
        this.method = args.method;
        this.expected = args.expected;
        this.got = args.got;
        if (msg) {
            msg = Array.isArray(msg) ? msg : [msg];
            this.message = compile(msg[0], args);
            this.code = msg[1] || '0';
            this.short = this.message;
        }
        else {
            this.message = this.short = prefix;
            this.message += ` method: ${args.method}.`;
            this.message += ` expected: ${args.expected}.`;
            this.message += ` got: ${args.got}.`;
            this.message += ` path: ${args.path}.`;
        }
    }
}
