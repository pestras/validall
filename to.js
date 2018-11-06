"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("tools-box/url");
exports.To = {
    lowercase(value) { return value.toLowerCase(); },
    uppercase(value) { return value.toUpperCase(); },
    capitlizeFirst(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
    capitlizeFirstAll(value) { return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); },
    trim(value) { return value.trim().replace(/\s{2,}/g, ' '); },
    path(value) { return url_1.URL.Clean(value); }
};
