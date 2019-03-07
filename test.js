"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const object_from_map_1 = require("tools-box/object/object-from-map");
let schema = {
    $filter: true,
    $props: {
        emailTemplate: { $type: 'string', $required: true },
        to: { $each: { $type: 'string', $is: 'email' }, $required: true, $length: { $gte: 1 } },
        subject: { $type: 'string', $required: true },
        data: { $type: 'object' }
    }
};
let data = {
    "emailTemplate": "activation_email",
    "to": ["amrmrd111spcl@hotmail.com"],
    "subject": "Activation Email From Pestras",
    "data": {
        "user": { "email": "amrmrd111spcl@hotmail.com" }
    }
};
let err = index_1.validate(data, object_from_map_1.objFromMap(data, {}, schema, true));
console.log(err);
