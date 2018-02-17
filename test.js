const Validall = require('./');

let user = { name: '123', 'id': '1321654' };

console.log(user);
let state = Validall(user, { name: 'string', '_id?': 'string' }, { strict: true });

console.log(state);
console.log(Validall.error);
console.log(user);