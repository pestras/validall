"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessage = void 0;
function generateMessage(args, msg) {
    if (!msg)
        return null;
    if (typeof msg === 'string')
        return msg;
    return msg(args);
}
exports.generateMessage = generateMessage;
