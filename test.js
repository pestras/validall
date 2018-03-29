const Validall = require('./');

let user = { name: [1] };
let schema = new Validall.Schema({
  name: String,
  users: 'string[]',
  permissions: [{ model: String, services: 'string[]' }]
});

// console.log(user);
let state = schema.test(user);

console.log(state);
console.log(schema.error);
// console.log(user);
