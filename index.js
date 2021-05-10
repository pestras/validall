"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Validall = void 0;
const validator_1 = require("./validator");
var validator_2 = require("./validator");
Object.defineProperty(exports, "Validall", { enumerable: true, get: function () { return validator_2.Validall; } });
function validate(src, schema, map, throwMode = false) {
    let options = {
        schema: schema,
        id: null,
        throwMode: throwMode
    };
    let validator = new validator_1.Validall(options, map === true ? src : map || null);
    return validator.validate(src) ? null : validator.error;
}
exports.validate = validate;
