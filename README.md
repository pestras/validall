JavaScript validator.

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

  var isValid = validall.test(user, {
    $root: { $hasKeys: ['name', 'email'] },
    name: { $is: 'string' },
    email: { $is: 'email', $message: 'Email is not valid!' },
    password: { $match: /^[a-zA-Z0-9_]{8,16}$/ },
    age: { $gte: 30 },
    roles: { $hasSome: ["admin", "author"], $hasNot: ["subscriber"] },
    gender: { $in: ["male", "female" ]},
    articles: { $each: { date: { $afterDate: '07-03-2017' } } },
    'options.notificationMode': { $in: ['high', 'low'] }
  });
  ```


### errors:

  List all the errors found in the src, in case of **test** method has returned **false**.

  ```js
  var isValid = validall.test(user, {
    $root: { $hasKeys: ['username'] },
    email: { $is: 'email', $message: "Email is not valid!" }
  }, true);

  console.log(validall.errors())

  /*
    ["'$root' must include keys: [username]", "Email is not valid!"]
  */
  ```


### reset:

  Reset all options to default.

  _note: in most cases you won't use it_.



## Operators


### $is:

  Checks the type of the value

  **Parameters:** 'String', can have one of the following values:
  
  * set
  * true
  * filled
  * number
  * string
  * boolean
  * date
  * regexp
  * array
  * object
  * email
  * url

  **set** value checks if the src value is not undefined, "" or " ".
  **true** value checks if the src value is not false, undefined, null, 0, "", " ", or NaN.
  **filled** value checks if the src value is not undefined, null, [], {}, "", " ".

### $equals:

  Checks if the src value is equal to argumant provided.

  _node: this operator does a shallow comparative process._

   _note: it also compares arrays and objects length to pass._

  **Parameters:** '*', any value to compare with.


### $identical:

  Same as '$equals' operator, but has a deep comparative process.

  _note: it also compares arrays and objects length to pass._

  **Parameters:** '*', any value to compare with.

  ```js
  var publish = validall.test(response, {
    $root: { $identical: previousResponse, $message: null }
  });
  ```


### $match:

  Test the src src value with given regex.

  **Parameters:** 'RegExp', the regular expression to test with.

  ```js
  var isValid = validall.test(user, {
    password: { $match: /^[a-zA-Z0-9_]{8,16}$/ },
  });
  ```


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

  ```js
  var isValid = validall.test(user, {
    age: { $inRange: [16, 40] },
  });
  ```


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

  ```js
  var isValid = validall.test(article, {
    publishDate: { $onDate: "02-06-2016" }
  });
  ```


### $beforeDate:

  Checks if the src data is before the giving date.

  **Parameters:** 'Date | String'


### $afterDate:

  Checks if the src data is after the giving date.

  **Parameters:** 'Date | String'


### $fn:

  In case of nothing from the previous operators fix your issue, you can provide your own function to validate the src and return a boolean.

  **Parameters:** 'function', src value is passed as the first argument.

  ```js
  var isValid = validall.test(user, {
    key: { 
      $fn: function (keyValue) {
        var state = false;
        // your code
        return state;
      },
      $message: 'your message'      // You should add your error message otherwise 'unhandled error message' will be pushed
    }
  });
  ```



### $or:

  In case you provide two operators for one key and you only need one of them to pass, then you can use '$or' operator:

  ```js
  var isValid = validall.test(user, {
    age: { $or: [{ $is: 'number' }, { $is: 'string' }] }
  });
  ```

  Also you can use it at the root, to provide more than way of validations:

  ```js
  var isValid = validall.test(user, {
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
  var isValid = validall.test(user, {
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
  var isValid = validall.test(user, {
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
  var isValid = validall.test(user, {
    $root: { $hasKeys: ['email'], $message: 'Email is required' }
  });
  ```