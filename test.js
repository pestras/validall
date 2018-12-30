"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let map = {
    ageRange: [30, 36]
};
let validator = new index_1.Validall({
    id: null,
    schema: {
        $paths: {
            'family.wife.name': { $equals: 'hafsa' },
            'family.children[1].age': { $gt: 3, $required: true }
        }
    }
});
let user = {
    name: 'ammar',
    age: 33,
    family: {
        wife: { name: 'hafsa' },
        children: [
            { name: 'amena', age: 4 }
        ]
    }
};
console.log(validator.validate(user));
console.log(validator.error);
