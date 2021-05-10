"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasId = exports.getValidator = exports.saveValidator = void 0;
const schemaRepo = {};
function saveValidator(id, schema) {
    schemaRepo[id] = schema;
}
exports.saveValidator = saveValidator;
function getValidator(id) {
    if (!id)
        return null;
    return schemaRepo[id] || null;
}
exports.getValidator = getValidator;
function hasId(id) {
    return schemaRepo.hasOwnProperty(id);
}
exports.hasId = hasId;
