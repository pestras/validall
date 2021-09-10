"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidallError = void 0;
const compile_1 = require("@pestras/toolbox/string/compile");
/**
 * Validall error class
 */
class ValidallError extends Error {
    constructor(ctx, message, path = '') {
        super(compile_1.compile(message, { path: ctx.fullPath, input: ctx.currentInput, inputType: typeof ctx.input }));
        this.name = this.constructor.name;
        this.path = path;
    }
}
exports.ValidallError = ValidallError;
//# sourceMappingURL=errors.js.map