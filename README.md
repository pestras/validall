JavaScript objects validator.

## Installation

```bash
$ npm install validall
```

## Usage


## Methods:


### test:

  It is the main function the let start the validation process.

  **Parameters**

  * src: _{any}_ - the source need to be validated.
  * options: _{Object}_ list of options and operators to make the validations.
  * forceAll: _{Boolean}_ if set to **true** forces the validator to continue processing the operations until it gathers all the errors found in the source object, default is false.

  ```js
  var validall = require("validall");

  validall.test(user, {
    $root: { $hasKeys: ['name', 'email'] },
    name: { $is: 'string' },
    email: { $is: 'email', $message: 'Email is not valid!' },
    password: { $match: /^[a-zA-Z0-9_]{8,16}$/ },
    age: { $gte: 30 },
    roles: { $hasSome: ["admin", "author"], $hasNot: ["subscriber"] },
    gender: { $in: ["male", "female" ]},
    articles: { $each: { date: { $afterDate: '07-03-2017' } } },
    'options.notificationMode': { $in: ['high', 'low'] }
  }, true);
  ```


### errors:

  List all the errors found in case of **test** method has returned **false**.


### reset:

  Reset all options to default.

  _note: in most cases you won't use it_.



## Operators


### $is:

  Checks the type of the value

  **Parameters:** 'String', can have one of the following values:

  * number
  * string
  * boolean
  * date
  * regexp
  * array
  * object
  * email
  * url


### $equals:

  Checks if the src value is equal to argumant provided.

  _node: this operator does a shallow comparative process._

   _note: it also compares arrays and objects length to pass._

  **Parameters:** '*', any value to compare with.


### $identical:

  Same as '$equals' operator, but has a deep comparative process.

  _note: it also compares arrays and objects length to pass._

  **Parameters:** '*', any value to compare with.


### $match:

  Test the src src value with given regex.

  **Parameters:** 'RegExp', the regular expression to test with.


### $gt:

  Checks if the src value is greater than the given number.

  **Parameters:** 'Number', the number to compare with.


### $gte:

  Checks if the src value is greater than or equals the given number.

  **Parameters:** 'Number', the number to compare with.


### $lt:

  Checks if the src value is less than the given number.

  **Parameters:** 'Number', the number to compare with.


### $lte:

  Checks if the src value is less than or equals the given number.

  **Parameters:** 'Number', the number to compare with.


### $inRange:

  Checks if the src value number is in the range specified in the given range.

  **Parameters:** 'Array', array with to numbers specifing the start and the end of the range.


### $outOfRange:

  Checks if the src value number is out of the range specified in the given range.

  **Parameters:** 'Array', array with to numbers specifing the start and the end of the range.


### $len:

  Checks if the src value string or array length is equals to the given number.

  **Parameters:** 'Number', the number to compare with.


### $gtLen:

  Checks if the src value length is greater than the given number.

  **Parameters:** 'Number', the number to compare with.


### $gteLen:

  Checks if the src value length is greater than or equals the given number.

  **Parameters:** 'Number', the number to compare with.


### $ltLen:

  Checks if the src value length is less than the given number.

  **Parameters:** 'Number', the number to compare with.


### $lteLen:

  Checks if the src value length is less than or equals the given number.

  **Parameters:** 'Number', the number to compare with.


### $innRangeLen:

  Checks if the src value string or array length is in the range specified in the given range.

  **Parameters:** 'Array', array with to numbers specifing the start and the end of the range.


### $outOfRangeLen:

  Checks if the src value string or array length is out of the range specified in the given range.

  **Parameters:** 'Array', array with to numbers specifing the start and the end of the range.


### $size:

  Checks if the src value object keys length is equals to the given number.

  **Parameters:** 'Number', the number to compare with.


### $gtSize:

  Checks if the src value keys length is greater than the given number.

  **Parameters:** 'Number', the number to compare with.


### $gteSize:

  Checks if the src value keys length is greater than or equals the given number.

  **Parameters:** 'Number', the number to compare with.


### $ltSize:

  Checks if the src value keys length is less than the given number.

  **Parameters:** 'Number', the number to compare with.


### $lteSize:

  Checks if the src value keys length is less than or equals the given number.

  **Parameters:** 'Number', the number to compare with.


### $inRangeSize:

  Checks if the src value object keys length is in the range specified in the given range.

  **Parameters:** 'Array', array with to numbers specifing the start and the end of the range.


### $outOfRangeSize:

  Checks if the src value object keys length is out of the range specified in the given range.

  **Parameters:** 'Array', array with to numbers specifing the start and the end of the range.


### $has:

  Checks if the src value array includes all the items in the giving list.

  **Parameters:** 'Array<Number | String>'

### $hasSome:

  Checks if the src value array includes at least one of the items in the giving list.

  **Parameters:** 'Array<Number | String>'


### $hasNot:

  Checks if the src value array does not include all the items in the giving list.

  **Parameters:** 'Array<Number | String>'


### $hasNotSome:

  Checks if the src value array does not include at least one of the items in the giving list.

  **Parameters:** 'Array<Number | String>'


### $hasKeys:

  Checks if the src value object includes all the keys in the giving list.

  _note: nested keys are supported._

  **Parameters:** 'Array<String>'


### $hasSomeKeys:

  Checks if the src value object includes at least one of the keys in the giving list.

  _note: nested keys are supported._

  **Parameters:** 'Array<String>'


### $hasNotKeys:

  Checks if the src value object does not include all the keys in the giving list.

  _note: nested keys are supported._

  **Parameters:** 'Array<String>'


### $hasNotSomeKeys:

  Checks if the src value object does not include at least one of the keys in the giving list.

  _note: nested keys are supported._

  **Parameters:** 'Array<String>'


### $in:

  Checks if the src value string or array items is all included in the giving list.

  **Parameters:** 'Array<Number | String>'


### $someIn:

  Checks if there is at least one item in the src array included in the giving list.

  **Parameters:** 'Array<Number | String>'


### $notIn:

  Checks if the src value string or array items is not included in the giving list.

  **Parameters:** 'Array<Number | String>'


### $someNotIn:

  Checks if at least one of the items in the src array is not included in the giving list.

  **Parameters:** 'Array<Number | String>'


### $onDate:

  Checks if the src data is on the same giving date.

  **Parameters:** 'Date | String'


### $beforeDate:

  Checks if the src data is before the giving date.

  **Parameters:** 'Date | String'


### $afterDate:

  Checks if the src data is after the giving date.

  **Parameters:** 'Date | String'


### $fn:

  In case of nothing from the previous operators fix your issue, you can provide your own function to validate the src and return a boolean.

  **Parameters:** 'function', src value is passed as the first argument.


### $or:

  In case you provide to operators for one key and you only need one of them to pass, then you can use '$or' operator:

  ```js
  validall.test(obj, {
    age: { $or: [{ $is: 'number' }, { $is: 'string' }] }
  });
  ```

  Also you can use it at the root, to provide more than way of validations:

  ```js
  validall.test(obj, {
    $or: [
      {
        gender: { $match: 'male' },
        age: { $inRange: [28, 33] }
      },
      {
        gender: { $match: 'female' },
        age: { $inRange: [25, 30] }
      }
    ]
  })
  ```


### $each:

  Loop through an array and perform validall operations on each item

  ```js
  validall.test(obj, {
    'family.children': { 
      $each: {
        { $root: { $is: 'object', hasKeys: ['name', 'age'] } }
        { $age: { $lte: 5 } }
      } 
    }
  });
  ```


### $message:

  For each false state triggered, validall push an error string to the returned errors array.

  In case you need to add a custom error message, this option is for you.

  ```js
  validall.test(obj, {
    married: { $equals: false, $message: 'You should get married' }
  });
  ```

  or in case you need to ignore the error message

  ```js
  var publish = validall.test(response, {
    $root: { $identical: previousResponse, $message: null }
  });
  ```


### $root:

  $root operator let you validate the root object

  ```js
  validall.test(obj, {
    $root: { $hasKeys: ['email'], $message: 'Email is required' }
  });
  ```