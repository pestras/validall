JavaScript validator.

## Installation

```bash
$ npm install validall
```

## Usage

Starting from version 2.1.6 validall added support for typescript declarations.

```ts
import * as validall from "validall"
```

### Validation:

**validall()** is the main function that starts the validation process.

**Parameters**

* src: _{any}_ - the source needs to be validated.
* schema: _{any}_ options that make the validations.
* rootName: _{string} [optional]_ set the root object name for clear field path, default is 'root'.

```js
var validall = require("validall");

var isValid = validall(user, {
  username: { $type: 'string', $required: true },
  email: { $is: 'email' },
  img: 'string',
  password: { $regex: /^[a-zA-Z0-9_]{6,}$/ },
  roles: { $all: ['admin', 'author', 'subscriber'], $message: 'unknown role!!' },
  age: { $gte: 12 },
  aricles: [{
    title: 'string',
    date: { $before: '01/01/2018' }
  }]
});
```


### message:

In case **validall()** returned a false value we can access the error message through:

* validall.message: returns the matched error message.
* validall.errMap: return more details about the error.

```js
var isValid = validall(user, {
  email: { $is: 'email'}
}, 'user');

console.log(validall.message);
// user.email must be a valid 'email'

console.log(validall.errMap);
// { fieldPath: "user.email", operator: "$is", expected: 'mail', received: "example@mailcom" }
```

We can add our custom messages as we will see later. 



## Operators

## $type:

Checks the type of the value.
```js
var isValid = validall(user, {
  name: 'string',
  // or
  name: { $type: 'string' }
});
```

The second way allows you to add more options when needed.
```js
var isValid = validall(user, {
  roles: { $type: { $in: ['string', 'string[]'] }
});
```

**Possible options:**

* undefined
* any
* number
* string
* boolean
* primitive   _'number, string or boolean'_
* date
* regexp
* object
* any[]
* number[]
* string[]
* boolean[]
* primitive[]
* date[]
* regexp[]
* object[]


### $is:

Checks the value with ready made patterns.

```js
var isValid = validall(user, {
  email: { $is: 'email' }
});
```

**Possible options:** 'String', can have one of the following values:

* null
* set _'not undefined, null or empty string'_
* true _'any true value'_
* filled _'not undefined, null, empty string, empty array or empty object'_
* number _'a number type or a valid number string'_
* date _'a Date instance or a valid date string'_
* email
* url

**date** option is not reliable when used with 'date string'.



### $extendable:

When validating objects, any extra fields that are not specified in the schema, will throw an error.
**validall** expects objects to be not extendable.

```js
let user = { name: 'john', age: 30 };

var isValid = validall(user, {
  name: 'string'
}, 'user');

// errMap: { fieldPath: 'user', operator: '$extendable', expected: ['name'], received: ['name', 'age'] }
```

To reverse it just set **$extendable** operator to true;

```js
let user = { name: 'john', age: 30 };

var isValid = validall(user, {
  $extendable: true,
  name: 'string'
}, 'user');

// pass
```

Also **$extendable** operator can have a third value rather than true or false, which is 'filter'.
What 'filter' option does is cleaning the src from any extra fields.

```js
let user = { name: 'john', age: 30 };

var isValid = validall(user, {
  $extendable: 'filter',
  name: 'string'
}, 'user');

console.log(user);
// { name: 'john' }
```

### $required:

By default each field in the schema is considered as required.
To make a field not required just set the **$required** operator to false or add a question mark at the end of the fieldname.

```js
var isValid = validall(user, {
  username: { $required: false, $type: 'string' }
  // or
  'username?': 'string'
});
```


### $default

Add a value to the current field if it was not set.

```js
var isValid = validall(user, {
  role: { $default: 'subscriber' }
});
```

You can set the field to the current date by passing ```Date.now``` or as a string 'Date.now'.

```js
var isValid = validall(user, {
  createdAt: { $default: 'Date.now' }
});
```

Using **$required** operator with **$default** is useless.


### $equals:

Checks if the src value is equal to the argumant provided.

```js
var isValid = validall(user, {
  active: true
  // or
  active: { $equals: true }
});
```

The first way is only used with primitive types.
When passing a string value, if the value matches a valid type name **validall** will check the type instead of the equality, type has more priority over equality.

```js
var isValid = validall(user, {
  username: 'string'  // checks type
  role: 'admin'       // checks equality
});
```

_note: **$equals** operator does a shallow comparative process, it also compares arrays and objects size to pass._


### $identical:

Same as '$equals' operator, but has a deep comparative process.

```js
var cancelPublish = validall(response, {
  $identical: previousResponse
});
```

_note: it also compares arrays and objects size to pass._


### $regex:

Tests the current value with a regular expression.

```js
var isValid = validall(user, {
  password: { $regex: /^[a-zA-Z0-9_]{8,16}$/ }
});
```


### $gt:

Tests if the current value number is larger than a specific number.

```js
var isValid = validall(user, {
  rank: { $gt: 3 }
});
```


### $gte:

Tests if the current value number is larger than or equals to a specific number.

```js
var isValid = validall(user, {
  rank: { $gte: 4 }
});
```


### $lt:

Tests if the current value number is less than a specific number.

```js
var isValid = validall(article, {
  likes: { $lt: 50 }
});
```


### $lte:

Tests if the current value number is less than or equals to a specific number.

```js
var isValid = validall(article, {
  likes: { $lte: 50 }
});
```


### $range:

Tests if the current value number is between a specific range.

```js
var isValid = validall(article, {
  read: { $range: [5, 50] }
});
```

_note: 5 and 50 are included._


### $size:

Puts the size of an array, an object or a string into the context.

```js
var isValid = validall(user, {
  aricles: { $size: 10 }
  // or
  articles: { $size: { $gt: 10 } }
  // or
  articles: { $size: { $range: [10, 20] } }
  // or
  articles: { $size: { $in: [10, 15] } }
});
```


### $in:

Checks if the the current value shares any items with the giving list or a single value.

```js
var isValid = validall(users, [{
  _id: { $in: '5486456cadf84fa' }  // array with string
  username: { $in: ['pancake', 'cheesecake'] }  // string with array
  roles: { $in: ['admin', 'author'] } // array with array
}]);
```

It is not only about strings, you can use what ever type, but the equality test is shallow.


### $all:

Checks if the the current value is all in the giving list.

```js
var isValid = validall(articles, [{
  categories: { $all: ['news', 'sport', 'movies', 'science'] }  // no way out
}]);
```


### $keys:

Puts an object keys into the context

```js
var isValid = validall(user, [{
  tools: { $keys: { $in: ['design', 'style', 'validation'] } }  // whatever
  // or
  tools: { $keys: { $size: 3 } }
}]);
```


### $on:

Checks if the value date points to the same giving date.

```js
var isValid = validall(article, {
  publishDate: { $on: "02-06-2016" }
});
```


### $before:

Checks if the value data is before the giving date.

```js
var isValid = validall(publishDate, { $before: "02-06-2016" });
```


### $after:

Checks if the value data is after the giving date.

```js
var isValid = validall(publishDate, { $after: "02-06-2016" });
```


### $fn:

We can provide Our own functions to validate the current value.

```js
var isValid = validall(user, {
someField: { $fn: function (fieldValue, fieldPath) {
      var state = false;
      // your test goes here
      return state;
    },
    $message: 'your message'      // $message operator should be provided otherwise 'unhandled error message' will be returned
  }
});
```

* First Argument is the current field value.
* Second Argument is the current field Path.

_**$message** operator should be provided otherwise 'unhandled error message' will be returned_



### $not:

Negate children operators results.

```js
var isValid = validall(article, {
  categories: { $not: { $in: ['news', 'sport', 'movies', 'science'] } } // no way in
});
```



### $and: 

Returns false when at least one operator in the list is failed.

```js
var state = validall(article, {
  roles: { $and: [{ $type: 'string[]' }, { $all: ['admin', 'author', 'subscriber'] }]}
  // same as
  roles: { $type: 'string[]', $all: ['admin', 'author', 'subscriber']}
});
```

Both ways are the same, however using **$and** gives us the abiltity to add our custom messages for each operator we use.

```js
var state = validall(article, {
  roles: { $and: [
    { $type: 'string[]', $message: 'type test fail custom message' }, 
    { $all: ['admin', 'author', 'subscriber'], $message: 'enum test fail custom message' }
  ]}
  // or 
  roles: {
    $type: 'string[]', 
    $all: ['admin', 'author', 'subscriber'],
    $message: 'both type and enum tests message'
  }
});
```


### $or:

Returns true when at least one operator of a list is passed.

```js
var isValid = validall(exam, {
  result: { $or: [{ $type: 'number' }, { $type: 'string' }] }
});
```



### $nor:

Returns true when no operator in the list is passed.

```js
var isValid = validall(user, {
  name: { $nor: [{ $is: 'number' }, { $size: { $gt: 15 } }] }
});
```



### $xor:

Returns true when only one operator in the list is passed but not the others.

```js
var isValid = validall(user, {
  // when user has admin role, he has no need for any other role.
  roles: { $xor: [{ $in: 'admin' }, { $size: { $gt: 1 } }] }
});
```



### $message:

When any operator fails it throws its default message.
This option allows us to add our custom error messages.

```js
var isValid = validall(user, {
  email: { $is: 'email', $message: 'invalid user email' }
});
```

**validall** considers meseages as templates, it can pass some special keywords if we asked for them.

```js
var user = { email: 'email@there' };

var isValid = validall(user, {
  email: { $is: 'email', $message: 'invalid user email: {{received}}' }
}, 'user');

// message output: invalid user email: email@there
```

**Keywords List:**

* fieldPath: current field path: _'user.email'_
* operator: the operator that threw the error: _'$is'_
* expected: the current option passed to the operator: _'email'_
* received: the value that failed the validation: _'email@there'_



### $each:

Validating objects is straightforward, however with arrays we are only validating what the array should includes, but not the array itself as in the examples below:

```js
var isValid = validall(user, {
  articles: [{
    name: 'string', // validating articles[$].name
    publishDate: { $after: '07-08-2017' } // validating articles[$].publishDate
    ...
  }]
});
```

Using **$each** operator lets us separate the array and its contents validations.

```js
var isValid = validall(user, {
  articles: {
    $required: false,
    $size: { $lt: 50 }
    $each: {
      name: 'string', // validating articles[$].name
      publishDate: { $after: '07-08-2017' } // validating articles[$].publishDate
      ...
    }
  }
});
```


## Extending validall:

We can extend validall with our own messages or operators to use whenever we needed them.

```js
  validall.extend(
    '$even',
    "{{fieldPath}} should be an even number!",
    value => value % 2 === 0
  );
```

### arguments:

* name: {string} the name of the new operator, **validall** will prefix the name with '$' if it wasn't found. _required_
* message: the operator error message. _required_
* operator: {function} the function that do the validation. _optional_

**operator arguments:**

* value: current value.
* options: options passed to the operator when used
* fieldPath: current field path.
* data: current data object to inject messages with.

The operator must returns a boolean value.



## Error Handling:

When extending **validall** or using the **$fn** operator, we add our own functions to validate the current value.
There are some conditions we need to be aware of:

### $not context:

When our operator is used as a child of the **$not** operator, it should do the opposite validation!!.
But there is a better solution.
we can Keep our function as it is, however in our error message we can just add the {{not}} keyword in the appropriate place.

```js
  validall.extend(
    '$even',
    "{{fieldPath}} should {{not}} be an even number!",
    (value) => value % 2 === 0);

  let state1 = validall.test(23, { $even: true }, 'number'); // number should be an even number!.
  let state1 = validall.test(22, { $not { $even: true } }, 'number'); // number should not be an even number!.
```

### $or, $nor, $xor:

When any of the above operators is used, any of the children operators that returns _false_ will be ignored until all operators in the list are tested in some cases.
For example the **$or** operator will keep ignoring false returning operators until it finds the true returned one.
In some cases we do not want this type of behavior for a specific errors, we need validall to terminate the process directly, like when our operator gets the wrong options.

**validall** gives us the option to make that kind of action using **expect** or **throw** helpers.

#### expect:

**expect** is used only when checking types:

```js
validall.extend(
  'hasRole',
  "{{fieldPath}} should {{not}} include {{expected}}",
  (value, role) => {

  // we are expecting that the 'role' argument is string
  validall.expect(role, 'string');

  // or maybe both string or 'string[]'
  validall.expect(role, ['string', 'string[]']);
  ...
})
```

when **expect** fails, it will terminate the validation process and throws an error accessed using **validall.message** and **validall.errMap**.


#### throw:

Throw is more general, we can throw a string message or we can throw new **validall.Error** message:

```js
validall.extend('hasRole', "{{fieldPath}} should {{not}} include {{expected}}", (value, role) => {

  // throwing a string
  if (!validall.util.type.string(role))
    throw "invalid option: " + role;

  // or throwing a valdiall.Error
  if (!validall.util.type.string(role))
    throw new validall.Error('$type_error', { expected: 'string', received: typeof role });

});
```


## Util:

**validall** shares its utilities if any needed them:


### compile:

Compile a string template with the passed data.

```js
validall.util.compile("user name: {{name}}, and email: {{cred.email}}", { name: 'john', cred: { email: 'a@b.com' } });
// "user name: john, and email: a@b.com"
```


### fromPath:

Gets or sets value from an object using paths.

**Arguments:**

* src {object}
* path {string} path to follow.
* value {any} value to replace with. _optional_
* inject {boolean} add the value even if the path does not exists. _optional_

```js
let user = { name: 'john', cred: { email: 'a@b.com' } };

// getting value
console.log(validall.util.fromPath(user, 'cred.email')); 
// "a@b.com"

// setting value
console.log(validall.util.fromPath(user, 'cred.email', 'a@b.org'));
// { name: 'john', cred: { email: 'a@b.org' }

// injecting value
console.log(validall.util.fromPath(user, 'cred.username', 'j123', true));
// { name: 'john', cred: { email: 'a@b.org', username: 'j123' }
```


### equals:

Compares two values equality.

**Arguments:**

* src {any}
* target {any} path to follow.
* deep {boolean} make a deep comparision. _optional_

```js
validall.util.equals({ name: 'john' }, { name: 'john' }) // true.

validall.util.equals({ name: 'john', cred: { email: 'a@b.com' } }, { name: 'john', cred: { email: 'a@b.com' } }) // false.

validall.util.equals({ name: 'john', cred: { email: 'a@b.com' } }, { name: 'john', cred: { email: 'a@b.com' } }, true) // true.
```


### isSet, isTrue, isFilled:

Same as **$is: 'set'**, **$is: 'true'** and **$is: 'filled'**.


### type:

Same as **$type: _'option'_**.


### getType:

Return the type of th e first arguments.

```js
validall.util.getType('john') // string
validall.util.getType(['john', 'david']) // string[]
validall.util.getType([{name: 'john'}, {name: 'david'}]) // object[]
// ...etc
```


### is:

Same as **$is: _'option'_**.



--------------------------------------------------------------------------------
Please if any bugs found, create an issue in [github](https://github.com/ammar6885/validall "validall github repo").

Thank you.