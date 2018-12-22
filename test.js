"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let map = {
    ageRange: [30, 36]
};
let validator = new index_1.Validall({
    id: null,
    schema: {
        $props: {
            name: { $equals: 'ammar' },
            age: { $inRange: '$ageRange' }
        }
    }
}, map);
let user = {
    name: 'ammar',
    age: 33
};
console.log(validator.validate(user));
let err = validator.set('ageRange', 5);
console.log(err);
console.log(validator.validate(user));
