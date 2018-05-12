const Validall = require('./');

let user = { name: 'ammar', age: 33 };
let schema = new Validall.Schema({
  name: String
}, {
  filter: true,
  strict: false
});

console.log(user);
let state = schema.test(user);

console.log(state);
console.log(schema.error);
console.log(user);
