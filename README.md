# Validall

Advanced javaScript schema validator written with typescript.

## Installation

```bash
npm install @pestras/validall
```

# Class Validall

To create a schema, we can instantiate **Vaildall** in two ways:

```ts
import { Validall } from "Validall";

let schema = new Validall('schemaName', {
  // schema definition
});

// or

let schema = new Validall({
  // schema defintion
});
```

Giving schema a name, gives the ablity to reference that schema in other schema for reusebility.

# Schema Definition

Schema is built up through various operators that simulates each specific case.

Operators can be categorized by their behavior or type:

## Basic Operators:

### **$required:** *boolean*

Marks the field as required.

```ts
let schema = new Validall({
  username: { $required: true },
  password: { $required: true },
});

console.log(schema.validate({})); // false
console.log(schema.error.message); // 'username' is required
```

So if the username or the password is undefined, **Validall** will return **false** value with a proper error message of failure.

### **$nullable:** *boolean*

Marks the field as nullable.

```ts
let schema = new Validall({
  birthdate: { $nullable: true },
});

let user = {}

console.log(schema.validate(user)); // true
console.log(user); // { birthdate: null }
```

When the nullable field is undefined, **Validall** will sets its value to null.

### **$default:** *any*

Sets the field with the provided value when undefined.

```ts
let schema = new Validall({
  value: { $default: '' },
});

let input = {}

console.log(schema.validate(input)); // true
console.log(input); // { value: '' }
```

**$default** operator accepts special keywords for specific values:

- 'Date.now':

  When default value set to **'Date.now'**, then assign value will be the current date instance, however it can accept modifiers to make it a **string date** or **timestamp**

  ```ts
  let schema = new Validall({
    birthdate: { $default: 'Date.now' } // new Date()
    // or
    birthdate: { $default: 'Date.now string' } // new Date().toLocalString()
    // or
    birthdate: { $default: 'Date.now number' } // new Date().getTime()
    // or
    birthdate: { $default: 'Date.now iso' } // new Date().toISOString()
  });
  ```

- '$<:path>':

  Assign the current field with the same value of the givin field path form the input object.

  ```ts
  let schema = new Validall({
    name: { $default: '$username' }
  });

  let user = { username: 'myusername' }
  schema.validate(user);

  console.log(user) // { username: 'myusername', name: 'myusername' }
  ```

**Note:** when using **$default** operator with **$type** operator, the default value must match the type given otherwise schema validation will fail on instantiation.

```ts
// the following will throw an error with a message 'invalid 'id.$default' argument type: (string: 0), expected to be of type (number)'
let schema = new Validall({
  id: { $type: 'number' $default: '0' }
});
```

This also applies when using reference path as a default value, when the reference value is undefined or of different type, however the error will be during validation process rather than instantiation time.

```ts
// the following will throw an error with a message 'invalid 'id.$default' argument type: (string: 0), expected to be of type (number)'
let schema = new Validall({
  id: { $type: 'number' $default: '$serial' }
});

console.log(schema.validate({ serial: '123' })); // false
console.log(schema.error.message) // "invalid reference type '$serial' passed to 'id'"
```

### **$message:** *string*

**Validall** accepts custom messages for each validation segment.

```ts
let schema = new Validall({
  name: { $type: 'string', $message: 'invalidName' }
});

console.log(schema.validate({ name: 123 })); // false
console.log(schema.error.message); // 'invalidName'
```

## Equality Operators:

### **$equals:** *any*

Compares the current value with one provided.

```ts
let schema = new Validall({
  age: { $equals: 25 }
});
```

### **$equalsRef:** *string*

Compares the current value with the provided referenced value.

```ts
let schema = new Validall({
  repassword: { $equalsRef: 'password' }
});

console.log(schema.validate({ password: 123, repassword: 123 })); // true
```

## Numerics Operaotrs:

### **$gt:** *number*

Checks whether current value larger than the provided one.

```ts
let schema = new Validall({
  age: { $gt: 25 }
});
```

### **$gtRef:** *string*

Checks whether current value larger than the provided reference value.

```ts
let schema = new Validall({
  value1: { $gtRef: 'value2' }
});

console.log(schema.validate({ value1: 10, value2: 5 })); // true
```

### **$gte:** *number*

Checks whether current value larger than or equals to the provided one.

```ts
let schema = new Validall({
  age: { $gte: 25 }
});
```
### **$gteRef:** *string*

Checks whether current value larger than or equals to the provided reference value.

```ts
let schema = new Validall({
  value1: { $gteRef: 'value2' }
});

console.log(schema.validate({ value1: 10, value2: 10 })); // true
```

### **$lt:** *number*

Checks whether current value less than  the provided one.

```ts
let schema = new Validall({
  age: { $lt: 25 }
});
```

### **$ltRef:** *string*

Checks whether current value less than the provided reference value.

```ts
let schema = new Validall({
  value1: { $ltRef: 'value2' }
});

console.log(schema.validate({ value1: 5, value2: 10 })); // true
```

### **$lte:** *number*

Checks whether current value less than or equals to the provided one.

```ts
let schema = new Validall({
  age: { $lte: 25 }
});
```

### **$lteRef:** *string*

Checks whether current value less than or equals to the provided reference value.

```ts
let schema = new Validall({
  value1: { $lteRef: 'value2' }
});

console.log(schema.validate({ value1: 10, value2: 10 })); // true
```

### **$inRange:** *[number, number]*

Checks whether current value in range between specific values.

```ts
let schema = new Validall({
  age: { $inRange: [12, 18] }
});
```

**Note:** 12 and 18 are considered in range as well.

## Types & Patterns Operators:

### **$type:** *typeOptions*

Checks whether the current value type matches the one provided.

```ts
let schema = new Validall({
  // Only Date instances are accepted
  createDate: { $type: 'date' }
});
```

**$type** operator currently supports the following types options:

- number
- int
- float
- string
- boolean
- primitive: combination of (*number, boolean, string*)
- date
- regexp
- function
- object
- array

For array specific types, we can combine **$type** operator with **$each** operator, more on that later.

### **$is:** *isOptions*

Checks whether the current value matched the provided option prebuilt pattern.

```ts
let schema = new Validall({
  // valid (Date, string or number) dates are accepted
  createDate: { $is: 'date' }  
});

console.log(schema.validate({ createDate: '5-8-2021' })); // true
```

**$is** operator currently supports the following options:

- name: alphabetical space seperated strings
- email: checks for valid emails
- url: checks for valid urls
- notEmpty: checks for not (empty strings, empty arrays or empty objects)
- number: any thing that can be converted to a number.
- date: Date, string date or number date

### **$regex:** *RegExp*

Test the current value with the provided Regexp.

```ts
let schema = new Validall({
  password: { $regex: /[a-zA-Z0-9\-\$@&\!]{8,}/g }  
});
```

### **$instanceof:** *Function | class*

Checks Whether the current value is instance of the provided constructor.

```ts
class Article {}

let schema = new Validall({
  article: { $instanceof: Article }  
});
```

### **$enum:** *(number | string)[]*

Make sure the current value is one or the provided list.

```ts
let schema = new Validall({
  role: { $enum: ['Admin', 'Author', 'Viewer'] }
  // or with numbers
  value: { $enum: [10, 12, 15, 18] }
});
```

## Dates Operators:

### **$on:** *Date | string | number*

Checks whether the current date is the same as the one provided.

```ts
let schema = new Validall({
  createDate: { $on: new Date(2020, 8, 5) }
  // or with string date
  createDate: { $on: '9-5-2020' }
  // or with timestamp
  createDate: { $on: 1599253200000 }
});
```

Invalid input date will throw error the time of instantiation.

### **$onRef:** *string*

Checks whether the current date is the same as the provided reference value.

```ts
let schema = new Validall({
  createDate: { $onRef: 'updateDate' }
});
```

### **$before:** *Date | string | number*

Checks whether the current date is before the one provided.

```ts
let schema = new Validall({
  createDate: { $before: new Date(2020, 8, 5) }
  // or with string date
  createDate: { $before: '9-5-2020' }
  // or with timestamp
  createDate: { $before: 1599253200000 }
});
```

Invalid input date will throw error the time of instantiation.

### **$beforeRef:** *string*

Checks whether the current date is before the provided reference value.

```ts
let schema = new Validall({
  createDate: { $beforeRef: 'updateDate' }
});
```

### **$after:** *Date | string | number*

Checks whether the current date is after the one provided.

```ts
let schema = new Validall({
  createDate: { $after: new Date(2020, 8, 5) }
  // or with string date
  createDate: { $after: '9-5-2020' }
  // or with timestamp
  createDate: { $after: 1599253200000 }
});
```

Invalid input date will throw error the time of instantiation.

### **$afterRef:** *string*

Checks whether the current date is after the provided reference value.

```ts
let schema = new Validall({
  updateDate: { $afterRef: 'createDate' }
});
```

## Objects Operaotrs:

### **$props:** *{ [key: string]: ISchema }*

Used to validate objects properties.

```ts
let schema = new Validall({
  contacts: {
    $props: {
      name: { $type: 'string' },
      mobile: { $tye: 'string', $is: 'number' },
      email: { $is: 'email' }
    }
  }
});
```

Actually the root object is nested inside **$props** operator implicitly, so the previous example can be rewritten as:

```ts
let schema = new Validall({
  // used explicitly
  $props: {
    contacts: {
      $props: {
        name: { $type: 'string' },
        mobile: { $tye: 'string', $is: 'number' },
        email: { $is: 'email' }
      }
    }
  }
});
```

We can use other operators at the root level instead of **$props**.

### **$paths:** *{ [key: string]: ISchema }*

It provides the same functionality as **props** operator, however it can jump to nested propertes directly.

```ts
let schema = new Validall({
  // used as rool operator instead of $props
  $paths: {
    'work.contacts.name': { $type: 'string' },
    'work.contacts.tel': { $type: 'string', $is: 'number' },
    'work.contacts.email': { $is: 'email' }
  }
});
```

### **$map:** *ISchema*

Used to validate map or hashMaps where keys are unknown but values should follow the schema.

```ts
let schema = new Validall({
  // used as rool operator instead of $props
  $map: {
    // each value ot the map is a document with some properties
    $props: {
      title: { $type: 'string' $required: true },
      content: { $type: 'string', $default: '' },
      createDate: { $is: 'date', $default: 'Date.now number' }
    }
  }
});
```

### **$size:** *number | INumericOperators*

Validates objects sizes.

```ts
let schema = new Validall({
  keyValueMap: {
    $map: { $type: 'string' },
    // restrict size to specific value
    $size: 10
    // or validate size
    $size: { $lt: 20 }
  }
});
```

### **$keys:** *IArrayOperators*

Validate objects keys list.

```ts
let schema = new Validall({
  // restrict contacts object keys to only the following array, can have less.
  contacts: { $keys: { $in: ['name', 'email', 'mobile', 'address'] } }
});
```

### **$strict:** *boolean*

Strict the object keys only to the keys that are defined in sibling **$props** operator, any more key will make the validation fali.

```ts
let schema = new Validall({
  $strict: true,
  $props: {
    name: { $is: 'name' },
    email: { $is: 'email' }
  }
});

schema.validate({
  name: 'John',
  email: 'john@there.com',
  // this will cause validation to fail
  mobile: '468446743'
});

console.log(schema.error.message); // "'mobile' field is not allowed"
```

**Note:** Using **$strict** with no **$props** operator, will throw an error the time of instantiation.

### **$filter:** *boolean*

filter object keys to match the keys that are defined in sibling **$props** operator.

```ts
let schema = new Validall({
  $filter: true,
  $props: {
    name: { $is: 'name' },
    email: { $is: 'email' }
  }
});

let user = {
  name: 'John',
  email: 'john@there.com',
  // this will be filtered
  mobile: '468446743'
}

schema.validate(user);

console.log(user); // { name: 'John', email 'john@there.com' }
```

**Note:** Using **$filter** with no **$props** operator, will throw an error the time of instantiation.

## Arrays Operators:

### **$each:** *ISchema*

Validate each element in the input array.

```ts
let schema = new Validall({
  // used os the root operator instead of $props
  $each: {
    $props: {
      name: { $is: 'name' },
      email: { $is: 'email' }
    }
  }
});

schema.validate([{
    name: 'John',
    email: 'john@there.com'
  }, {
    name: 'David',
    email: 'david@there.com'
  }, {
    name: 'Sam',
    email: 'sam@there.com'
}]);
```

### **$length:** *number | INumericOperators*

Validates arrays length.

```ts
let schema = new Validall({
  $each: {
    $props: {
      name: { $is: 'name' },
      email: { $is: 'email' }
    }
  },
  // restrict length to specific value
  $length: 10,
  // or validate length
  $length: { $naRange: [5, 20] }
});
```

### **$intersects:** *(string | number)[]*

Makes sure the input array share at least on value with giving list.

```ts
let schame = new Schema({
  activites: { $intersects: ['swimming', 'hiking', 'sleeping'] }
});
```
### **$in:** *(string | number)[]*

Makes sure the input array has no value out of the giving list.

```ts
let schame = new Schema({
  roles: { $intersects: ['admin', 'author', 'viewer'] }
});
```

## Logical Operators:

### **$not:**

Some operator can be inverted to match the opposite case.

```ts
let schema = new Validall({
  username: { $not: { equals: '' } },
  // do not share any value
  roles: { $not: { $intersects: ['admin', 'author'] } },
  // out of range
  age: { $not: { $inRange: [25, 32] } }
});
```

**$not** operator can only neglect the folloeing operators:

- $equals
- $equalsRef
- $inRange
- $intersects
- $on
- $onRef
- $instanceof
- $regex
- $alias

### **$and:**

The default behavior in **Validall** is the **&&** checking, however some times we need to explicitly use that to seperate messages or group validations.

```ts
let schema = new Validall({
  // if name was not a string or not even provided then the same message will be outputed
  name: { $type: 'string', $required: true, $message: 'invalid name' }
  // different message for each case
  name: { $and: [
    { $type: 'sring', $message: 'name must be string' },
    { $required: true, $message: 'name is required' }
  ]}
});
```

### **$or:**

As the name suggests, when any case passes, jumps to the next validation block.

```ts
let schema = new Validall({
  id: { $or: [{ $type: 'string' }, { $type: 'number' }] }
});
```

### **$xor:**

Allows just one case to pass but not the others

```ts
let schema = new Validall({
  roles: { $xor: [{ $in: ['admin', 'author'] }, { $in: 'subscriber', 'viewer' }] }
});
```

### **$nor:**

Returns true when one of the cases pass.

```ts
let schema = new Validall({
  roles: { $nor: [{ $intersects: ['admin', 'author'] }, { $length: { $gt: 1 } }] }
});
```

## Conditional Operators:

### **$cond:**

Sometimes we need to validate some cases depending on some other cases existance.

```ts
let schema = new Validall({
  type: { $enum: ['company', 'professional', 'student'] },
  contacts: {
    email: { $is: 'email' },
    mobile: { $type: 'string', $is: 'number' }
    // address is required only when type is 'company'
    address: {
      $type: 'string',
      $cond: [
        { $if: { $props: { type: { $equals: 'company' } } }, $then: { $required: true } },
        { $else: { $default: '' } }
      ]
    }
  }
});
```

**Note:** **$if** operator always has the root scope whereas **then** and **else** are local scoped.

We can simplify condition using **$name** and **alias** operators, more on that later on.

## Referencial Operators:

### **$ref:** *string*

Validall schemas can reference other schemas for reusability.

```ts
new Validall('Contacts', {
  email: { $type: 'string', $is: 'email' },
  mobile: { $type: 'string', $is: 'number' }
  address: { $type: 'string' }
});

let schema = new Validall({
  name: { $type: 'string', $is: 'name' },
  contacts: { $ref: 'Contacts' }
});
```

**Notes:**

- Referencing undefined schema will throw an error on instantiation level.
- Validators cannot reference each other, otherwise with throw an error on instantiation level as well. 

We can get our named validators at any time to use them indivdualy in other places as follows:

```ts
new Validall('Contacts', {
  email: { $type: 'string', $is: 'email' },
  mobile: { $type: 'string', $is: 'number' }
  address: { $type: 'string' }
});

// somewhere else
let vContacts = Validall.Get('Contacts');

vContacts.validate({
  // some input
});
```

### **$name & $alias:**

Using conditions can make schemas very complex to read and with lots of repeated validation segments.

**Validall** provides the abiity to store validation state for each block or segment, so we can reference it in condition or logical operators later.

```ts
let schema = new Validall({
  name: { $type: 'string', $is: 'name' },
  // can be done in two ways ----------------------------------------
  type: { $or: [{ $equals: 'company', $name: 'company' }, { $equals: 'individual', $name: 'individual' }],
  // or
  type: { 
    $enum: ['company', 'individual'], $name: [
      // we can assign the first elment with a string to reference the whole block, however it would be useless in this current expample
      { $equals: 'company', as: 'company' },
      { $equals: 'individual', as: 'individual' }
    ] 
  }
  // ----------------------------------------
  contacts: {
    $props: {
      email: { $is: 'email' },
      mobile: { $is: 'number' },
      address: {
        $cond: [{ $if: 'company', $then: { $required: true } }, { $else: { $default: '' } }],
      }
    }
  }
});
```

**$alias** operator reference the **$name** operator explicitly, to make it usable with other operators or validations.

So the previous condition can be written in another way:

```ts
{
  // ...
  contancts: {
    $props: {
      email: { $is: 'email' },
      mobile: { $is: 'number' },
      address: { $xor: [{ $alias: 'individual' }, { $required: true }]}
    }
  }
}
```

## Modifiers Operators:

### **$to:** toOptions[]

We can modify the input data in some ways using **$to** or **$cast** operators

```ts
{
  username: { $type: 'string', $to: ['trim', 'lowercase'] }
}
```

**to** supports the following options:

- **lowercase:** lowercase all the characters in a string.
- **uppercase:** capitalize all the characters in a string.
- **capitalizeFirst:** capitalize only the first character in a string.
- **capitalizeFirstAll:** capitalize the first character in each string separated by a space.
- **trim:** trim white space from the start and the end of a string and any repeated space in the middle.
- **path:** cleans a path from duplicated or repeated slashes also remove any end slashes and any unnecessary '../' in the middle of the path.

### **$cast:**

Changes the type of the current input.

```ts
{
  active: { $cast: 'boolean' }
}
```

**$cast** operator supports the follwing options:

- **number:** can be casted from strings and booleans.
- **string:** can be casted from numbers, booleans, dates, regexp, and functions, however objects and arrays will be converted to json string.
- **boolean:** can be casted from any value.
- **date:** can be casted from numbers and strings.
- **regexp:** can bes casted from number, strings and booleans.
- **array:** can be casted from any single value.

--------------------------------------------------------------------------------
Please if any bugs found, create an issue in [github](https://github.com/ammar6885/Validall "Validall github repo").

Thank you.