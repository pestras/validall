"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("tools-box/string/compile");
class ValidallError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
exports.ValidallError = ValidallError;
class ValidallInvalidArgsError extends ValidallError {
    constructor(args) {
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
exports.ValidallInvalidArgsError = ValidallInvalidArgsError;
class ValidallValidationError extends ValidallError {
    constructor(args, prefix, msg) {
        super();
        this.code = '0';
        this.path = args.path;
        this.method = args.method;
        this.expected = args.expected;
        this.got = args.got;
        if (msg) {
            msg = Array.isArray(msg) ? msg : [msg];
            this.message = compile_1.compile(msg[0], args);
            this.code = msg[1] || '0';
            this.short = this.message;
        }
        else {
            this.message = this.short = prefix + '\n';
            this.message += `   method: ${args.method}.\n`;
            this.message += `   expected: ${args.expected}.\n`;
            this.message += `   got: ${args.got}.\n`;
            this.message += `   path: ${args.path}.\n`;
        }
    }
}
exports.ValidallValidationError = ValidallValidationError;
