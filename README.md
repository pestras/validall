JavaScript validator.

## Installation

```bash
$ npm install Validall
```

## Usage

Starting from version 2.1.6 Validall added support for typescript declarations.

```ts
import * as Validall from "Validall"
```

### Validation:

**Validall()** is the main function that starts the validation process.

**Parameters**

* src: _{any}_ - the source needs to be validated.
* schema: _{any}_ options that make the validations.
* options: _{object} [optional]_ set some defaults and configurations to the current process.

```js
let Validall = require("Validall");

let isValid = Validall(user, {
  username: { $type: 'string', $to: (name) => name.toLowerCase(), $required: true },
  email: 'string',
  password: { $regex: /^[a-zA-Z0-9_]{6,}$/ },
  roles: { $all: ['admin', 'author', 'subscriber'], $message: 'unknown role!!' },
  age: { $gte: 12 },
  active { $cast: 'boolean', $default: true }
  aricles: [{
    title: { $type: 'string', $length: { $lte: 50 } },
    date: { $before: '01/01/2018' }
  }]
});
```


### message:

In case **Validall()** returned a false value we can access the error message through:

* Validall.error

```js
let user = { username: 1223 }
let isValid = Validall(user, {
  username: 'string'
}, { root: 'user' });

console.log(Validall.error);

  // Validall Error:-
  //   operator: '$type'
  //   path: 'user.name'
  //   message: '"user.name" must be of type "string"'
  //   got: 'number: 123'
```

We can add our custom messages as we will see later. 



## Operators

## $type:

Checks the type of the value.
```js
let isValid = Validall(user, {
  name: 'string',
  // or
  name: { $type: 'string' }
});
```

The second way allows you to add more options when needed.
```js
let isValid = Validall(user, {
  roles: { $type: { $in: ['string', 'string[]'] }
});
```

**Possible options:**

* any
* number
* int
* float
* string
* boolean
* primitive   _'number, string or boolean'_
* date
* regexp
* object
* function
* array
* number[]
* int[]
* float[]
* string[]
* boolean[]
* primitive[]
* date[]
* regexp[]
* object[]
* function[]


### $strict:

If set to **true** any extra fields that are not specified in the schema, will throw an error.

```js
let user = { name: 'john', age: 30 };

let isValid = Validall(user, {
  $strict: true,
  name: 'string'
}, 'user');

// Validall Error:-
//  operator: '$strict'
//  path: 'user'
//  message: '"user" should not have property: "age"'
//  got: {
//   "name": 123,
//   "age": true
//  }
```

### $filter:

If set to **true** it cleans the src from any extra fields.

```js
let user = { name: 'john', age: 30 };

let isValid = Validall(user, {
  $filter: true,
  name: 'string'
}, 'user');

console.log(user);
// { name: 'john' }
```

Using **$strict** besides **$filter** is useless.


### $required:

Marks the field as required.

```js
let isValid = Validall(user, {
  username: { $required: true, $type: 'string' }
});
```


### $default

Add a value to the current field if it was undefined.

```js
let isValid = Validall(user, {
  role: { $default: 'subscriber' }
});
```

You can set the field to the current date by passing ```Date.now``` or as a string 'Date.now'.

```js
let isValid = Validall(user, {
  createdAt: { $default: 'Date.now' }
});
```

Using **$required** operator with **$default** is useless.


### $equals:

Checks if the src value is equal to the argumant provided.

```js
let isValid = Validall(user, {
  active: true
  // or
  active: { $equals: true }
});
```

The first way is only used with primitive types.
When passing a string value, if the value matches a valid type name **Validall** will check the type instead of the equality, type has more priority over equality.

```js
let isValid = Validall(user, {
  username: 'string'  // checks type
  role: 'admin'       // checks equality
});
```

_note: **$equals** operator does a shallow comparative process, it also compares arrays and objects size to pass._


### $deepEquals:

Same as '$equals' operator, but has a deep comparative process.

```js
let unPublish = Validall(response, {
  $deepEquals: previousResponse
});
```

_note: it also compares arrays and objects size to pass._


### $regex:

Tests the current value with a regular expression.

```js
let isValid = Validall(user, {
  password: { $regex: /^[a-zA-Z0-9_]{8,16}$/ }
});
```


### $gt:

Tests if the current value number is larger than a specific number.

```js
let isValid = Validall(user, {
  rank: { $gt: 3 }
});
```


### $gte:

Tests if the current value number is larger than or equals to a specific number.

```js
let isValid = Validall(user, {
  rank: { $gte: 4 }
});
```


### $lt:

Tests if the current value number is less than a specific number.

```js
let isValid = Validall(article, {
  likes: { $lt: 50 }
});
```


### $lte:

Tests if the current value number is less than or equals to a specific number.

```js
let isValid = Validall(article, {
  likes: { $lte: 50 }
});
```


### $inRange:

Tests if the current value number is between a specific range.

```js
let isValid = Validall(article, {
  read: { $range: [5, 50] }
});
```

_note: 5 and 50 are included._


### $length:

Puts the length of an array or a string into the context.

```js
let isValid = Validall(user, {
  articles: { $length: 10 }
  // or
  articles: { $length: { $gt: 10 } }
  // or
  articles: { $length: { $inRange: [10, 20] } }
  // or
  articles: { $length: { $in: [10, 15] } }
});
```


### $size:

Puts the size of an object into the context.

```js
let isValid = Validall(user, {
  details: { $size: 10 }
  // or
  details: { $size: { $gt: 10 } }
  // or
  details: { $size: { $range: [10, 20] } }
  // or
  details: { $size: { $in: [10, 15] } }
});
```


### $in:

Checks if the the current value shares any items with the giving list or a single value.

```js
let isValid = Validall(users, [{
  _id: { $in: '5486456cadf84fa' }  // array with string
  username: { $in: ['pancake', 'cheesecake'] }  // string with array
  roles: { $in: ['admin', 'author'] } // array with array
}]);
```

It is not only about strings, you can use what ever type, but the equality test is shallow.


### $all:

Checks if the the current value is all in the giving list.

```js
let isValid = Validall(articles, [{
  categories: { $all: ['news', 'sport', 'movies', 'science'] }  // no way out
}]);
```


### $keys:

Puts an object keys into the context

```js
let isValid = Validall(user, [{
  tools: { $keys: { $in: ['design', 'style', 'validation'] } }  // whatever
  // or
  tools: { $keys: { $length: 3 } }
}]);
```


### $on:

Checks if the value date points to the same giving date.

```js
let isValid = Validall(article, {
  publishDate: { $on: new Date("02-06-2016") }  // Date instance
  // or
  publishDate: { $on: "02-06-2016" }  // string
  // or
  publishDate: { $on: 123657624 }  // number
});
```


### $before:

Checks if the value data is before the giving date.

```js
let isValid = Validall(publishDate, {
  publishDate: { $before: new Date("02-06-2016") }  // Date instance
  // or
  publishDate: { $before: "02-06-2016" }  // string
  // or
  publishDate: { $before: 123657624 }  // number
});
```


### $after:

Checks if the value data is after the giving date.

```js
let isValid = Validall(publishDate, {
  publishDate: { $after: new Date("02-06-2016") }  // Date instance
  // or
  publishDate: { $after: "02-06-2016" }  // string
  // or
  publishDate: { $after: 123657624 }  // number
});
```



### $cast:

Forces casting types;

```js
let isValid = Validall(user, {
  age: { $cast: 'number' },         // "30" > 30
  createdAt: { $cast: 'string' },   // date instance > "15-12-2017" 
  active: { $cast: 'boolean' },     // 1 > true
  birthDate: { $cast: 'date' },     // "15-12-1988" > date instance
  pattern: { $cast: 'regexp' },     // "/abc/" > /abc/
  roles: { $cast: 'array' },        // "author" > ["author"]  
})
```

#### supported types:

* number: can be casted from strings and booleans.
* string: can be casted from numbers, booleans, dates, regexp, and functions, however objects and arrays converted to json string.
* boolean: can be casted from any value.
* date: can be casted from numbers and strings.
* regexp: can bes casted from number, strings and booleans.
* array: can be casted from any single value.



### $to

This operator takes only function or list of functions, it call the function with current value passed and assign the return value to the current value. (* _* )

An example:

```js
let isValid = Validall(user, {
  role: { $type: 'string', $to: role => role.toLowerCase() }
})
```

clear...



### $not:

Negate children operators results.

```js
let isValid = Validall(article, {
  categories: { $not: { $in: ['news', 'sport', 'movies', 'science'] } } // no way in
});
```



### $and: 

Returns false when at least one operator in the list is failed.

```js
let state = Validall(article, {
  roles: { $and: [{ $type: 'string[]' }, { $all: ['admin', 'author', 'subscriber'] }]}
  // same as
  roles: { $type: 'string[]', $all: ['admin', 'author', 'subscriber']}
});
```

Both ways are the same, however using **$and** gives the abiltity to add our custom messages for each operator we use.

```js
let state = Validall(article, {
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
let isValid = Validall(exam, {
  result: { $or: [{ $type: 'number' }, { $type: 'string' }] }
});
```



### $nor:

Returns true when no operator in the list is passed.

```js
let isValid = Validall(user, {
  name: { $nor: [{ $is: 'number' }, { $size: { $gt: 15 } }] }
});
```



### $xor:

Returns true when only one operator in the list is passed but not the others.

```js
let isValid = Validall(user, {
  // when user has admin role, he has no need for any other role.
  roles: { $xor: [{ $in: 'admin' }, { $size: { $gt: 1 } }] }
});
```



### $message:

When any operator fails it throws its default message.
This option allows us to add our custom error messages.

```js
let isValid = Validall(user, {
  email: { $type: 'string', $message: 'invalid user email' }
});
```


### $each:

Validating objects is straightforward, however with arrays we are only validating what the array should includes, but not the array itself as in the examples below:

```js
let isValid = Validall(user, {
  articles: [{
    name: 'string', // validating articles[$].name
    publishDate: { $after: '07-08-2017' } // validating articles[$].publishDate
    ...
  }]
});
```

Using **$each** operator lets us separate the array and its contents validations.

```js
let isValid = Validall(user, {
  articles: {
    $required: true,
    $size: { $lt: 50 }
    $each: {
      name: 'string', // validating articles[$].name
      publishDate: { $after: '07-08-2017' } // validating articles[$].publishDate
      ...
    }
  }
});
```


## Validall Options:

The third parameter in Validall function is an object including some defaults and configuration.

### root: _string_

As default **Validall** names the source passed to it as 'root' that can be seen in error messages.
**root** options let you change the name to what ever you need.

### required: _boolean_

Change the default behavior of **Validall** and marks all fields as required unless you invert it in the field options.

```js
let isValid = Validall(user, {
  name: 'string',
  age: { $type: 'number', required: false }
  // or
  'age?': 'number'
}, {
  required: true
})
```

### strict: _boolean_

Change the default behavior of **Validall** and apply the **$strict** option to all objects including root unless you invert it in the field options.

### filter

Change the default behavior of **Validall** and apply the **$filter** option to all objects including root unless you invert it in the field options.

### throwMode: _boolean_

Lets **Validall** to throw errors instead of returning true or false values.

### traceError: _boolean_

This option is related with the **throwMode** option, it provides tracing for thrown errors.



## Schema:

We can instantiate Validall to create schemas.


```js
let Schema = new Validall.Schema({
  username: 'string',
  password: { $regex: /^[a-zA-Z0-9_]{8,}$/ }
}, {
  $root: 'user'
  $required: true,
  $filter: true
});

Schema.test(someUser);
```




--------------------------------------------------------------------------------
Please if any bugs found, create an issue in [github](https://github.com/ammar6885/Validall "Validall github repo").

Thank you.