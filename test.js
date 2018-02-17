const Validall = require('./');

let user = { name: '123' };
let schema = new Validall.Schema({ name: 'string', '_id?': 'string', active: { $type: 'boolean', $default: true } });

console.log(user);
let state = schema.test(user, { name: 'string', '_id?': 'string', active: { $type: 'boolean', $default: true } });

console.log(state);
console.log(schema.error);
console.log(schema.defaults);
console.log(user);