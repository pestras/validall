const Validall = require('./');

let postSchema = new Validall.Schema({
  title: 'string',
  content: 'string'
}, {
  name: 'Post',
  required: true
});

let user = { name: 'ammar', posts: {
  title: 'Some Title',
  content: 'some content'
} };

let schema = new Validall.Schema({
  name: 'string',
  posts: 'Post'
}, {
  filter: false,
  strict: true
});

let state = schema.test(user);

console.log(state);
console.log(schema.error);
