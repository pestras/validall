"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateMessage(args, msg) {
    if (!msg)
        return null;
    if (typeof msg === 'string')
        return msg;
    return msg(args);
}
exports.generateMessage = generateMessage;
