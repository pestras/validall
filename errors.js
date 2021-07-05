"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidallError = void 0;
/**
 * Validall error class
 */
class ValidallError extends Error {
    constructor(message, path = '') {
        super(message);
        this.name = this.constructor.name;
        this.path = path;
    }
}
exports.ValidallError = ValidallError;
//# sourceMappingURL=errors.js.map