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
            name: {
                $type: 'string',
                $to: 'lowercase',
                $regex: /^[a-z]+$/g
            }
        }
    }
});
let user = {
    name: 'Ammar',
    age: 33,
    family: {
        wife: { name: 'hafsa' },
        children: [
            { name: 'amena', age: 4 }
        ]
    }
};
console.log(validator.validate(user));
console.log(user.name);
console.log(validator.error);
