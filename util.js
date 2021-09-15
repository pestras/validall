"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.cast = exports.ReferenceState = exports.isSchema = exports.ValidallRepo = exports.To = void 0;
const types_1 = require("@pestras/toolbox/types");
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
function cast(to, value, expected) {
    if (to === 'boolean')
        return !!value;
    if (to === 'number') {
        if (expected === 'date')
            return new Date(value).getTime();
        if (types_1.Types.primitive(value)) {
            let casted = +value;
            if (isNaN(casted))
                throw `casting value: ${value} produces NaN!`;
            return casted;
        }
        throw `can't cast non primitive value to number!`;
    }
    if (to === 'string') {
        if (expected === 'date')
            return new Date(value).toLocaleDateString();
        if (types_1.Types.object(value) || Array.isArray(value))
            return JSON.stringify(value);
        return "" + value;
    }
    if (to === 'date') {
        if (types_1.Types.number(value) || types_1.Types.string(value)) {
            let d = new Date(value);
            if (d.toString() === "Invalid Date")
                throw `can't cast value: ${value} to a date`;
            return d;
        }
        if (types_1.Types.date(value))
            return value;
        throw `"can't cast ${typeof value} type value to a Date!"`;
    }
    if (to === 'regexp') {
        if (types_1.Types.primitive(value))
            return new RegExp(value);
        if (types_1.Types.regexp(value))
            return value;
        throw `"can't cast ${typeof value} type value to a Regexp!"`;
    }
    if (to === 'array')
        return Array.isArray(value) ? value : [value];
    throw `unsupported cast type ${to}`;
}
exports.cast = cast;
//# sourceMappingURL=util.js.map