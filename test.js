const Validall = require('./');

let user = { name: [1] };
let schema = new Validall.Schema({ name: { $is: "notEmpty" } });

// console.log(user);
let state = schema.test(user);

console.log(state);
console.log(schema.error);
// console.log(user);
