"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let userValidator = new index_1.Validall({
    id: 'User',
    schema: {
        $meta: { title: 'User Schema' },
        $props: {
            username: { $meta: { desc: "username is unique" } },
            contacts: {
                $props: {
                    mobile: { $meta: { desc: 'should be hidden' } }
                }
            }
        }
    }
});
console.log(userValidator.getMetaByName('desc'));
