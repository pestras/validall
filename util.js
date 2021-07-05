"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceState = exports.isSchema = exports.ValidallRepo = exports.To = void 0;
const url_1 = require("@pestras/toolbox/url");
exports.To = {
    lowercase: (value) => value.toLowerCase(),
    uppercase: (value) => value.toUpperCase(),
    capitalizeFirst: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    capitalizeFirstAll: (value) => value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    trim: (value) => value.trim().replace(/\s{2,}/g, ' '),
    path: (value) => url_1.URL.Clean(value)
};
exports.ValidallRepo = new Map();
function isSchema(input) {
    return Object.keys(input).every(key => key.charAt(0) === '$');
}
exports.isSchema = isSchema;
class ReferenceState {
    static HasReference(vName, reference) {
        return ReferenceState.state[vName] && ReferenceState.state[vName].has(reference);
    }
    static SetReference(vName, reference) {
        if (ReferenceState.state[vName])
            ReferenceState.state[vName].add(reference);
    }
}
exports.ReferenceState = ReferenceState;
ReferenceState.state = {};
;
//# sourceMappingURL=util.js.map