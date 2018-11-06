"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
var validator_2 = require("./validator");
exports.Validall = validator_2.Validall;
function validate(src, schema, throwMode = false) {
    let options = {
        schema: schema,
        id: null,
        throwMode: throwMode
    };
    let validator = new validator_1.Validall(options);
    return validator.validate(src) ? null : validator.error;
}
exports.validate = validate;
