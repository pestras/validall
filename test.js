const Validall = require('./');

let user = { name: ['123'] };
let schema = new Validall.Schema({ name: [String] });

console.log(user);
let state = schema.test(user);

console.log(state);
console.log(schema.error);
console.log(user);