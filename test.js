const Validall = require('./');

let user = { name: '123' };

console.log(user);
let state = Validall(user, { name: 'string', isActive: { $type: 'boolean', $default: false } });
let state2 = Validall(user, {});

console.log(state);
console.log(Validall.error);
console.log(user);