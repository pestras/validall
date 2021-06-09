# Validall

JavaScript validator.

## Installation

```bash
npm install Validall
```

### Class Validall: (options: IOptions): Validall

```js
import { Validall } from "Validall";

let validator = new Validall({
  id: 'User',
  schema: {
    $meta: { title: 'User Schema' },
    $strict: true,
    $props: {
      username: { $type: 'string', $to: ['trim', 'lowercase'], $required: true },
      email: { $is: 'email' },
      password: { $regex: /^[a-zA-Z0-9_]{6,}$/ },
      roles: { $enum: ['admin', 'author', 'subscriber'], $inRange: [1, 2] $message: 'unknown role!!' },
      age: { $gte: 18 },
      active: { $cast: 'boolean', $default: true }
      posts: { $length: { $lte: 20 }, $each: { $ref: 'Post' } },
      address: {
        $required: true,
        $instanceof: Address
      }
    }
  }
});

let isValid = validator.validate(user);

if (!isValid)
  console.log(validator.error);
```

### errors  _v3.*_

Validall provides two types of errors:

* ValidallInvalidArgsError.
* ValidallValidationError.

#### ValidallInvalidArgsError

InvalidArgsErrors are thrown once the validator has been instantiated and had schema arguments errors.

```js
try {
  let validator = new Validall({
    id: 'User',
    schema: {
      $props: { name: { $type: 5 } }
    }
  });
} catch (err) {
  console.log(err.message);
  // ValidallInvalidArgsError: invalid $type method argument 5
  //  method: $type
  //  expected: valid type name
  //  got: 5
  //  path: $props.name.$type
  console.log(err.short);
  // invalid $type method argument 5
}
```

Other properties can be accessed are _err.method, err.expected, err.got, err.path_.

#### ValidallValidationError

In case validation failed, we can access the error message through **validator.error**:

```js
let user = { name: 123 }
let isValid = validator.validate(user);

console.log(validator.error.message);
// ValidallValidationError: expected name of type string
//    method: $type.
//    expected: string.
//    got: 123.
//    path: name.
console.log(validator.error.short);
// expected name of type string
```

Other properties can be accessed are _err.method, err.expected, err.got, err.path_.

We can add our custom messages as we will see later.

### validate: (src: any, schema: ISchema, throwMode?: boolean): Error | never

Validall also provide a fast validate method for easy use validations **validate**.

```js
import { validate } from 'validall';

let error = validate({ name: 123 }, { $props: { name: 'string' } });
```

**validate** function may throw **ValidallInvalidArgsError** in case of invalid schema provided.

### Validall Params

#### SchemaOptions: ISchemaOptions _required_

When instantiating Validall some options needs to be provided:

* **id**: _string, required_: name of instance so it can be referenced in other schemas, can be set to null to cancel refernciation.
* **schema**: _ISchema, required_: schema object that handles the validations process.
* **required**: _boolean, optional_: sets the default behavior of each field as required, default is false.
* **nullable**: _boolean, optional_: sets the default behavior of each field as nullable, default is false.
* **filter**: _boolean, optional_: sets the default behavior of each object to filter extra fields not included in schema, default is false.
* **strict**: _boolean, optional_: sets the default behavior of each object to throw validation error for each extra field not included in schema, default is false.
* **throwMode**: _boolean, optional_: force validator instance to throw errors instead of returning boolean value, default is false.
* **replaceSchema** _boolean, optional_: forces schema replacement, default is false.
* **lazy** _boolean, optional_: make schema validation done in the first use of the validator instead of on instanciating, default is false.

#### map: any _optional_

**validall** constructor accepts a map object, which lets you change your schema dynamically in some special cases.

```js
let signupValidaltor = new Validall({
  id: 'Signup',
  schema: {
    $props: {
      email: { $type: 'string' },
      password: { $type: 'string', $regex: /^\w[\w_]{8,}$/ },
      repassword: { $equal: '$password' } // value from map
    }
  }
}, { password: '' });

// later you got signupData
// update map.password value
signupValidaltor.set('password', signupData.password);

signupValidaltor.validate(signupData);
```

## ISchema Operators

### $message: string | string[] _v1.*_

When any operator fails it throws its default message.
This option allows to add custom error messages.

```js
let error = validate(user, {
  $props: { email: { $is: 'email', $message: 'invalid user email' } }
});
```

Messages are template strings, there are some keywords that can be replaced with their actual values once the error is thrown.

```js
let error = validate(user, {
  $props: { email: { $is: 'email', $message: 'invalid user email: {{got}}' } }
});
```

Keywords are the same properties in **ValidallValidationError** _method, expected, got, path_.

Messages can be an array of two string length, first is the actual message, and the other is some custom code for any reason.

```js
let error = validate(user, {
  $props: { email: { $is: 'email', $message: ['invalid user email: {{got}}', 'E0012' ] } }
});

console.log(error.code);
// 'E0012'
```

**$message** is not affected by **negateMode**.

### $required: boolean _v1.*_

Marks the field as required.

```js
let error = validate(user, {
  $props: { username: { $required: true, $type: 'string' } }
});
```

**$required** is not affected by **negateMode**.

### $nullable: boolean _v2.7.*_

Assign a value of **null** to the current field if it was undefined.

```js
let error = validate(user, {
  $props: { lastname: { $type: 'string', $nullable: true } }
});
```

Using **$required** operator with **$nullable** is useless.
And using **$nullable** operator with **$default** is useless as well.
**$nullable** is not affected by **negateMode**.

### $default: any _v1.*_

Add a value to the current field if it was undefined.

```js
let error = validate(user, {
  $props: { role: { $default: 'subscriber' } }
});
```

You can set the field to the current date by passing ```Date.now``` or as a string 'Date.now'.

```js
let error = validate(user, {
  $props: { createdAt: { $default: 'Date.now' } }
});
```

Using **$required** operator with **$default** is useless.
And using **$nullable** operator with **$default** is useless as well.
**$default** is not affected by **negateMode**.

### $filter: boolean _v2.*_

If set to **true** it cleans the src from any extra fields not specified in the schema.

```js
let user = { name: 'john', age: 30 };

let error = validate(user, {
  $filter: true,
  $props: {
    name: 'string'
  }
});

console.log(user);
// { name: 'john' }
```

Setting **$default** inside schema overites the default behavior specified in Validall options.
Using **$strict** operator with **$filter** is useless.
**$default** is not affected by **negateMode**.

### $strict: boolean | string[]  _v2.*_

If set to **true** any extra fields that are not specified in the schema, will throw an error.

```js
let user = { name: 'john', age: 30 };

let error = validate(user, {
  $strict: true,
  $props: {
    name: 'string'
  }
}, 'user');

console.log(error.message);
// age is out of src keys: name
//    method: $strict.
//    expected: not exist.
//    got: age.
//    path: .
```

**$strict** can be set to an array of string in case some extra fields are allowed

```js
let user = { name: 'john', age: 30 };

let error = validate(user, {
  $strict: ['name', 'age'],
  $props: {
    name: 'string'
  }
}, 'user');

console.log(error);
// null
```

**$strict** is not affected by **negateMode**.
Using **$strict** operator with **$filter** is useless.

### $type: string  _v1.*_

Validates the type of the value.

```js
let error = validate(user, {
  $props: { username: { $type: 'string' } }
});
```

**Supported Types:**

* 'number'
* 'int'
* 'float'
* 'string'
* 'boolean'
* 'primitive'   _'number, string or boolean'_
* 'date'
* 'regexp'
* 'object'
* 'function'
* 'array'

**$type** is not affected by **negateMode**.

### $instanceof: function  _v3.*_

Makes sure that src is instance of some constructor.

```js
let error = validate(user, {
  $props: { contacts: { $instanceof: Contacts } }
});
```

**$instanceof** is not affected by **negateMode**.

### $ref: string | Validall  _v3.*_

**$ref** operator accepts an id or a reference of another Validall instance or imported schema.

```js
let ArticleValidator = new Validall({
  id: 'Article',
  schema: { $props: { title: { $type: 'string' } } }
});

let UserSchema = new Validall({
  schema: {
    $props: {
      name: { $type: 'string' },
      articles: { $each: { $ref: 'Article' } }
     //  articles: { $each: { $ref: ArticleValidator } }  # accepted as well
    }
  }
});
```

**$ref** is not affected by **negateMode**.

### $is: string  _v1.*_

Tests the current value with a built in pattern.

For now **$is** only supports _value | notEmpty | number | name | email | url | date_ patterns.

```js
let error = validate(user, {
  $props: {
    // name: accepts space separated alphapatical string
    name: { $type: 'string' $is: 'name' },
    // value: undefined, null, empty string, "0", 0 all return false
    gender: { $is: 'value' },
    // number: accepts number or string of digits as "33"
    age: { $is: 'number' },
    // notEmpty: accepts string, array, objects which are not empty
    roles: { $is: 'notEmpty' }
    // email: clear
    email: { $type: 'string' $is: 'email' },
    // url: also clear
    website: { $type: 'string' $is: 'url' },
    // date: accepts date instance, string date, milliseconds number
    birth: { $is: 'date' }
  }
});
```

It is a good practice to check the type first in case of _name, email, url_ for clear error messages.
**$is** is not affected by **negateMode**.

### $equals: any _v1.*_

Checks if the src value is equal to the argumant provided.

```js
let error = validate(user, {
  $props: { active: { $equals: true } }
});
```

**$equals** operator does a shallow comparative process _===_

### $deepEquals: any _v2.*_

Same as '$equals' operator, but has a deep comparative process.

```js
let error = validate({response}, {
  $props: { response: { $deepEquals: previousResponse } }
});
```

### $regex: RegExp _v2.*_

Tests the current value with a regular expression.

```js
let error = validate(user, {
  $props: { password: { $regex: /^[a-zA-Z0-9_]{8,16}$/ } }
});
```

**$regex** is not affected by **negateMode**.

### $gt: number _v1.*_

Tests if the current value number is larger than a specific number.

```js
let error = validate(user, {
  $props: { rank: { $gt: 3 } }
});
```

**$gt** is not affected by **negateMode**.

### $gte: number _v1.*_

Tests if the current value number is larger than or equals to a specific number.

```js
let error = validate(user, {
  $props: { rank: { $gte: 4 } }
});
```

**$gte** is not affected by **negateMode**.

### $lt: number _v1.*_

Tests if the current value number is less than a specific number.

```js
let error = validate(article, {
  $props: { likes: { $lt: 50 } }
});
```

**$lt** is not affected by **negateMode**.

### $lte: _v1.*_

Tests if the current value number is less than or equals to a specific number.

```js
let error = validate(article, {
  $props: { likes: { $lte: 50 } }
});
```

**$lte** is not affected by **negateMode**.

### $inRange: [number,number] _v2.*_

Tests if the current value number is between a specific range.

```js
let error = validate(article, {
  // 5 and 50 are included.
  // if [50, 5] was provided, it will be reversed automatically
  $props: { read: { $inRange: [5, 50] } }
});
```

### $length: IValidatorOperators _v2.*_

Puts the input length into the context.

```js
let error = validate(user, {
  $props: {
    articles: { $length: { $equals: 10 } }
    // or
    articles: { $length: { $not: { $equal: 10 } } }
    // or
    articles: { $length: { $gt: 10 } }
    // or
    articles: { $length: { $inRange: [10, 20] } }
    ...
  }
});
```

**$length** operator supports strings and arrays as an input.
**$length** is not affected by **negateMode**.

### $size: IValidatorOperators _v1.*_

Puts the input size into the context.

```js
let error = validate(user, {
  $props: {
    details: { $size: { $equals: 10 } }
    // or
    details: { $size: { $not: { $equal: 10 } } }
    // or
    details: { $size: { $gt: 10 } }
    // or
    details: { $size: { $range: [10, 20] } }
  }
});
```

**$size** is not affected by **negateMode**.

### $keys: IValidatorOperators _v2.*_

Puts an object keys into the context

```js
let error = validate(user, {
  $props: {
    tools: { $keys: { $in: ['design', 'style', 'validation'] } }  // whatever
    // or
    tools: { $keys: { $length: { $equal: 3 } } }
  }
});
```

**$keys** is not affected by **negateMode**.

### $intersect: any[] _v3.*_

Checks if the the current input shares any items with the giving list or a single value.

```js
let error = validate(users, {
  $props: {
    roles: { $intersect: ['admin', 'author'] }, // array with array
    order: { $intersect: [22, 34, 36] }  // single value with array
  }
});
```

### $include: any[] _v1.*_

Checks if input list items includes all items in the giving list.

```js
let error = validate(user, {
  $props: {
    roles: { $include: ['subscriber'] }
  }
});
```

### $enum: any[] _v1.*_

Checks if input list items or string are all included in the giving list.

```js
let error = validate(user, {
  $props: {
    roles: { $enum: ['admin', 'author', 'subscriber'] }
  }
});
```

### $props: {[key: string]: ISchema} _v2.*_

Puts an object keys into the context

```js
let error = validate(user, {
  $props: {
    name: { $type: 'string' },
    gender: { $type: 'string', $enum: ['male', 'female'] }
  },
  // added automatically if not added manually
  $type: 'object'
});
```

Using **$props** automatically adds **$type** operater set to **object**
**$props** is not affected by **negateMode**.

### $paths: {[key: string]: ISchema} _v2.*_

Puts an object path keys into the context

```js
let error = validate(user, {
  $paths: {
    'contacts.mobile': { $type: 'number' },
    'details.gender': { $type: 'string', $enum: ['male', 'female'] }
  },
  // added automatically if not added manually
  $type: 'object'
});
```

Using **$paths** automatically adds **$type** operater set to **object**
**$paths** is not affected by **negateMode**.

### $each: ISchema _v2.*_

Validates each item in the input array with the provided schema

```js
let error = validate(user, {
  $props: {
    articles: {
      $each: {
        $props: {
          title: { $type: 'string' },
          content: { $type: 'string' }
        },
        // added automatically if not added manually
        $type: 'array'
      }
    }
});
```

Using **$each** automatically adds **$type** operater set to **array**
**$each** is not affected by **negateMode**.

### $map: ISchema _v3_

Validates maps values, ignoring keys.  

```js
let error = validate(checklist, {
  $map: {
    $props: {
      value: { $type: 'boolean' },
      disabled: { $type: 'boolean' }
    },
    // added automatically if not added manually
    $type: 'object'
  }
});
```

Using **$map** automatically adds **$type** operater set to **object**
**$map** is not affected by **negateMode**.

### $on: number | string | Date _v1.*_

Checks if the input date points to the same giving date.

```js
let error = validate(article, {
  $props: {
    publishDate: { $on: new Date("02-06-2016") }  // Date instance
    // or
    publishDate: { $on: "02-06-2016" }  // string
    // or
    publishDate: { $on: 123657624 }  // number
  }
});
```

**$on** is not affected by **negateMode**.

### $before: number | string | Date _v1.*_

Checks if the input data is before the giving date.

```js
let error = validate(article, {
  $props: {
    publishDate: { $before: new Date("02-06-2016") }  // Date instance
    // or
    publishDate: { $before: "02-06-2016" }  // string
    // or
    publishDate: { $before: 123657624 }  // number
  }
});
```

**$before** is not affected by **negateMode**.

### $after: number | string | Date _v1.*_

Checks if the input data is after the giving date.

```js
let error = validate(article, {
  $props: {
    publishDate: { $after: new Date("02-06-2016") }  // Date instance
    // or
    publishDate: { $after: "02-06-2016" }  // string
    // or
    publishDate: { $after: 123657624 }  // number
  }
});
```

**$after** is not affected by **negateMode**.

### $cast: string _v2.2.*_

Cast input to the specified type if applicable.

```js
let error = validate(user, {
  $props: {
    age: { $cast: 'number' },         // "30" -> 30
    createdAt: { $cast: 'string' },   // date instance -> "15-12-2017"
    active: { $cast: 'boolean' },     // 1 -> true
    birthDate: { $cast: 'date' },     // "15-12-1988" -> date instance
    pattern: { $cast: 'regexp' },     // "abc" -> /abc/
    roles: { $cast: 'array' },        // "author" -> ["author"]  
  }
})
```

#### supported types

* number: can be casted from strings and booleans.
* string: can be casted from numbers, booleans, dates, regexp, and functions, however objects and arrays will be converted to json string.
* boolean: can be casted from any value.
* date: can be casted from numbers and strings.
* regexp: can bes casted from number, strings and booleans.
* array: can be casted from any single value.

**$cast** is not affected by **negateMode**.

### $to: string | string[] _v2.2*_

This operator accepts a pattern or list of patterns as an input, it applys all provided patterns to the current input

```js
let error = validate(user, {
  $props: {
    fullname: { $type: 'string', $to: ['trim', 'lowercase', 'capitalizeFirstAll' ] }
  }
})
```

#### Built in modifiers

* lowercase: lowercase all the characters in a string.
* uppercase: capitalize all the characters in a string.
* capitalizeFirst: capitalize only the first character in a string.
* capitalizeFirstAll: capitalize the first character in each string separated by a space.
* trim: trim white space from the start and the end of a string and any repeated space in the middle.
* path: cleans a path from duplicated or repeated slashes also remove any end slashes and any unnecessary '../' in the middle of the path.

**$to** is not affected by **negateMode**.

### $not: INegatableOperators _v1.*_

Negate children operators results.

```js
let error = validate(article, {
  $props: {
    categories: { $not: { $intersect: ['news', 'sport', 'movies', 'science'] } } // no way in
  }
});
```

### $and: ISchema[] _v1.*_

Returns false if at least one operator in the list failed.

```js
let error = validate(user, {
  $props: {
    role: { $and: [{ $type: 'string' }, { $enum: ['admin', 'author', 'subscriber'] }]}
    // same as
    role: { $type: 'string[]', $enum: ['admin', 'author', 'subscriber'] }
  }
});
```

Both ways are the same, however using **$and** gives the abiltity to add our custom messages for each operator we use.

```js
let error = validate(user, {
  $props: {
    role: { $and: [
      { $type: 'string', $message: 'type fail custom message' },
      { $enum: ['admin', 'author', 'subscriber'], $message: 'enum fail custom message' }
    ]}
    // or
    role: {
      $type: 'string',
      $enum: ['admin', 'author', 'subscriber'],
      $message: 'both type and enum fail message'
    }
  }
});
```

### $or: ISchema[] _v1.*_

Returns true if at least one operator of a list passed.

```js
let isValid = Validall(someValue, {
  $or: [{ $type: 'number' }, { $type: 'string' }]
});
```

### $nor: ISchema[] _v1.*_

Returns true if no operator in the list passed.

```js
let isValid = Validall(user, {
  $nor: [{ $is: 'number' }, { $length: { $gt: 15 } }]
});
```

### $xor: ISchema[] _v1.*_

Returns true if only one operator in the list passed but not the others.

```js
let isValid = Validall(roles, {
  $xor: [{ $in: 'admin' }, { $size: { $gt: 1 } }]
});
```

### $meta: object _v3.*_

Assign some custom meta data to any property in schema.

```js
let userValidator = new Validall({
  id: 'User',
  schema: {
    $meta: { title: 'User Schema' },
    $props: {
      username: { $meta: { desc: "username is unique" } },
      contacts: {
        $props: {
          mobile: { $meta: { desc: 'should be hidden' }}
        }
      }
    }
  }
});

// if no property specified, root meta will be returned
console.log(userValidator.getPropMeta());
// { title: 'User Schema' }

console.log(userSchema.getPropMeta('username'));
// { desc: "username is unique" }

console.log(userSchema.getPropMeta('contacts.mobile'));
// { desc: 'should be hidden' }
```

## Validall Instance Methods: _v2.*_

### set(keyPath: string, value: any): Error | never

**set** method gives the ability to change schema map properties, each time using set **vaildall** would validate the schema again and may return **ValidallInvalidArgsError**
in certian cases.

```js
const map = { limits: { age: [25, 35] } }
let memberValidaltor = new Validall({
  id: 'Member',
  schema: {
    $props: {
      name: { $type: 'string' },
      age: { $inRange: '$limits.age' }
    }
  }
}, map);

let member = { name: 'Joe', age: 28 };

memberValidaltor.validate(user); // true

memberValidaltor.set('limits.age', [30, 35]);

memberValidaltor.validate(user); // false
```

### getPropMeta(prop?: string)

It returns provided property meta if exists

```js
let userValidator = new Validall({
  id: 'User',
  schema: {
    $meta: { title: 'User Schema' },
    $props: {
      username: { $meta: { desc: "username is unique" } },
      contacts: {
        $props: {
          mobile: { $meta: { desc: 'should be hidden' }}
        }
      }
    }
  }
});

// if no property specified, root meta will be returned
console.log(userValidator.getPropMeta());
// { title: 'User Schema' }

console.log(userSchema.getPropMeta('username'));
// { desc: "username is unique" }

console.log(userSchema.getPropMeta('contacts.mobile'));
// { desc: 'should be hidden' }
```

### getAllMeta()

Returns all meta in the schema.

```js
console.log(userSchema.getAllMeta());
// {
//    User:  title: 'User Schema' },
//    username: { desc: "username is unique" },
//    contacts.mobile: { desc: 'should be hidden' }
// }
```

### getMetaByName(name: string): Array<{prop: string; value: any}>

Returns array of properties that include the provided meta property name;

```js
console.log(userSchema.getMetaByName('desc'));
//  [
//    { field: 'username', value: 'username is unique' },
//    { field: 'contacts.mobile', value: 'should be hidden' }
//  ]
```

## Validall Static Methods: _v3.*_

### ValidateSchema(options: IOptions): Error

Validate schema options and returns an error if found.

When instatiating Validall, this method is called implicitly.

### GetValidator(id: string): Validall

Get any predifined schema instance.

```js
let UserValidator = new Validall({ id: 'User', schema: {
  $props: { name: { $type: 'string' }}
}});

// in some other module...
let UserValidator = Validall.GetValidator('User');
```

If validator id was set to null, then it cannot be refernced or obtained.

```js
let anonymousValidator = new Validall({ id: null, schema: {
  $props: { name: { $type: 'string' }}
}});
```

If id already exists, old schema won't be overriden unless **replaceSchema** options was set to true.

```js
let UserValidator = new Validall({
  id: 'User',
  schema: {
    $props: { name: { $type: 'string' }}
  }
});

let AuthorValidator = new Validall({
  id: 'User',
  schema: {
    $props: { name: { $type: 'string' }}
  }
});

// later
Validall.GetValidator('User') // UserValidator

// unless
let AuthorValidator = new Validall({
  id: 'User',
  // replace schema explicitly
  replaceSchema: true,
  schema: {
    $props: { name: { $type: 'string' }}
  }
});

// then
Validall.getSchema('User') // AuthorValidator
```

### ImportSchema(request: string | AxiosRequestConfig, options?: IImportOptions): Promise\<Validall\>

Import schema remotely.

```js
Validall.ImportSchema("http://somehost/someshema")
  .then(validator => ...)
  .catch(err => ...)
```

Schemas imported remotely can be referenced or obtained if they have an id.

#### parameters

**request** _required_: is an axios request, it can be a string or a config object.

**options** _optional_:

* id: _string_ replace imported schema id if needed.
* replaceSchema: _boolean_ allow imported schema to replace existing schema with the same id.
* throwMode: _boolean_ override imported schema throwMode option.
* map: _string_ explained below.

Validall by default expects the schema to be in **response.data**, if this is not the case specifying the actual path is required.

```js
Validall.ImportSchema("http://somehost/someshema", { map: 'data.results[0].schema' })
  .then(validator => ...)
  .catch(err => ...)
```

## Notes

* Axios must be installed in case of **Validall.ImportSchema()** need to be used.
* It is better to import all Schemas before using them.
* In case of to many references in the project and managing instanciating order is somehow hard to control, then it is recomended to set **lazy** option to **true** for each validator.
* circular referencing is not a possible.

--------------------------------------------------------------------------------
Please if any bugs found, create an issue in [github](https://github.com/ammar6885/Validall "Validall github repo").

Thank you.