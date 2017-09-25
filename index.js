(function (global, factory) {
  if (typeof define === 'function' && define.amd) { // AMD
    define([], function () { return factory(); });
  } else if (typeof module !== 'undefined' && typeof exports === 'object') { // Node.js
    module.exports = factory();
  } else if (global !== undefined) { // Global variable
    global.validall = factory();
  }
})(this || window, function () {

  /** Current Source to validate */
  let currentSrc = null;

  /** List of all actions done by operators */
  let logs = [];

  let oppositeState = false;

  /** validation state can be 'pending' or 'opposite' or nor */
  let pendingLevel = 0;
  let pendingOperator = "";
  let pendingIterator = [];

  /** Current custom error message */
  let currentMessage = "";
  let currentData = { fieldPath: "", operator: "", expected: "", received: "", not: "" };
  let errMap = [];


  /** Validall Error class */
  class ValidallError {
    /**
     * ValidallError Constructor
     * @param {String | {message: String, data: any}[]} options Template message or list of messages.
     * @param {any} [data] Data to fill the template
     * @param {String} [connector]
     */
    constructor(options, data, connector) {
      this.message = "";
      this.map = [];

      if (typeof options === 'string')
        options = [{ message: options, data: data }];

      this._generate(options);
    }

    _generate(options) {
      for (let i = 0; i < options.length; i++) {
        let message = operators[options[i].message] ? (messages[options[i].message] || "") : options[i].message;

        if (message) {
          this.message += util.compile((message), Object.assign({}, currentData, options[i].data || {}));
        } else {
          this.message += util.compile("unknown error message: (" + options[i].message + ")", Object.assign({}, currentData, options[i].data || {}));
        }

        this.map.push(Object.assign({}, currentData, options[i].data || {}));

        if (i < options.length - 1)
          this.message += pendingOperator ? (" " + pendingOperator + " ") : "";
      }

      if (this.map.length === 1)
        this.map = this.map[0];
    }
  };

  /** utilities for validall */
  let util = {

    /**
     * Compile string template with data provided
     * @param {String} template 
     * @param {any} data 
     * @return {String}
     */
    compile(template, data) {
      let reg = /\{\{([\w\.]+)\}\}/g;

      let result = template.replace(reg, (match, $1) => {
        let parts = $1.split("."), temp;

        if (parts.length == 1)
          return data[parts[0]] || "";

        temp = data[parts[0]];

        for (let i = 1; i < parts.length; i++)
          temp = temp[parts[i]];

        return temp || "";
      });

      return result.replace(/  /g, " ");
    },

    /**
     * Get or set value from a path to an object property and returns the source object
     * @param {any} src The source object
     * @param {string} path the path to the property
     * @param {any} value the new valur '_optional_'
     * @param {boolean} inject Add the value to the object and create the path even if it is not fully exists '_optional_'
     * @return {any}
     */
    fromPath(src, path, value, inject) {
      path = path.split('.');

      if (path.length === 1) {

        if (!value)
          src[path[0]];
        else if (inject)
          src[path[0]] = value;
        else if (src.hasOwnProperty(path[0]))
          src[path[0]] = value;

        return src;
      }

      let temp = src;

      for (let j = 0; j < path.length; j++) {

        if (temp[path[j]]) {
          temp = temp[path[j]];

          if (j === path.length - 2 && value) {
            if (inject || src.hasOwnProperty(path[j + 1]))
              temp[path[j + 1]] = value;

            return obj;
          }

          if (j === path.length - 1)
            return obj;

        } else if (inject) {
          temp[path[j--]] = {};
        } else {
          return obj;
        }
      }

      return obj;
    },

    /**
     * Compares two objects field by field
     * @param {any} src The source object.
     * @param {any} target The object to compare with.
     * @param {Boolean} deep Make a deep comparision '_optional_'.
     * @return {Boolean}
     */
    equals(src, target, deep) {
      if (src instanceof Array && target instanceof Array) {
        if (src.length !== target.length)
          return false;

        for (let i = 0; i < src.length; i++) {
          let pass = false;

          for (let j = 0; j < target.length; j++) {

            if ((deep && equals(src[i], target[j])) || (!deep && src[i] === target[j])) {

              if (equals(src[i], target[j])) {
                pass = true;
                break;
              }
            }
          }

          if (!pass)
            return false;
        }

        return true;

      } else if (src instanceof Date && target instanceof Date) {
        return src.toDateString() === target.toDateString();
      } else if (src instanceof RegExp && target instanceof RegExp) {
        return src.toString() === target.toString();
      } else if (src instanceof Object && target instanceof Object) {

        if (Object.keys(src).length !== Object.keys(target).length)
          return false;

        for (let prop1 in src) {

          if (src.hasOwnProperty(prop1)) {
            let pass = false;

            for (let prop2 in target) {

              if (target.hasOwnProperty(prop1)) {

                if ((deep && equals(src[prop1], target[prop2])) || (!deep && src[prop1] === target[prop2])) {
                  pass = true;
                  break;
                }
              }
            }

            if (!pass)
              return false;
          }
        }

        return true;

      } else {
        return src === target;
      }
    },

    /**
     * Checkss if value is not undefined.
     * @param {any} value 
     * @return {Boolean}
     */
    isSet(value) {
      return value !== undefined || value !== null || value != "";
    },

    /**
     * Checks if value is a true value.
     * @param {any} value
     * @return {Boolean}
     */
    isTrue(value) {
      if (typeof value === 'string')
        value = value.replace(/\s/g, "");

      return !!value;
    },

    /**
     * Checks if value is set and not empty string, array or object.
     * _accepts falsy values_
     * @param {any} value
     * @return {Boolean}
     */
    isFilled(value) {
      if (!isSet(value))
        return false;

      if (typeof value === 'string' && !value.trim().length)
        return false;

      if (Array.isArray(value) && !value.length)
        return false;

      if (typeof value === 'object' && !Object.keys(value).length)
        return false;

      return true;
    },

    getType(value) {
      for (let prop in this.type) {
        if (this.type[prop](value))
          return prop;
      }

      return 'any';
    },

    type: {
      undefined: (value) => value === undefined,
      number: (value) => typeof value === 'number',
      string: (value) => typeof value === 'string',
      html: (value) => typeof value === 'string',
      boolean: (value) => typeof value === 'boolean',
      primitive: (value) => (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean'),
      date: (value) => value instanceof Date,
      regexp: (value) => value instanceof RegExp,
      object: (value) => typeof value === "object" && value.toString() === "[object Object]",
      function: (value) => typeof value === 'function',
      'number[]': (value) => Array.isArray(value) && value.every(item => typeof item === 'number'),
      'string[]': (value) => Array.isArray(value) && value.every(item => typeof item === 'string'),
      'boolean[]': (value) => Array.isArray(value) && value.every(item => typeof item === 'boolean'),
      'primitive[]': (value) => Array.isArray(value) && value.every(item => (typeof item === 'number' || typeof item === 'string' || typeof item === 'boolean')),
      'date[]': (value) => Array.isArray(value) && value.every(item => item instanceof Date),
      'regexp[]': (value) => Array.isArray(value) && value.every(item => item instanceof RegExp),
      'object[]': (value) => Array.isArray(value) && value.every(item => typeof item === "object" && item.toString() === "[object Object]"),
      'any[]': (value) => Array.isArray(value),
      any: () => true
    },

    is: {
      null: (value) => value === null,
      number: (value) => typeof value === 'number' || Number(value),
      set: (value) => value !== undefined,
      'true': (value) => util.isTrue(value),
      filled: (value) => util.isFilled(value),
      date: (Value) => value instanceof Date || Date.parse(value),
      email: (value) => /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value),
      url: (value) => /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm.test(value),
    }
  };

  /**
   * Throws error for invalid types.
   * @param {*} value 
   * @param {string} type 
   */
  function expect(value, types) {
    types = Array.isArray(types) ? types : [types]

    for (let i = 0; i < types.length; i++) {
      if (!util.type[types[i]])
        throw new ValidallError("invalid type check, type: " + typs[i] + 'is unknown');
      else if (util.type[types[i]](value))
        return
    }

    let first = types.shift();
    let expectedTypes = types.length ? types.reduce((prev, curr) => prev + " or " + curr, first) : first;

    throw new ValidallError('invalid_option', { expected: expectedTypes, received: typeof value });
  }

  /**
   * Seperate schema keys to fields and operators.
   * @param {any} schema
   * @return {{operators: any, fields: any}}
   */
  function separateSchema(schema) {
    let result = { _operators: {}, fields: {} };


    for (let prop in schema) {
      if (operators[prop] || prop === "$message") {
        result._operators[prop] = schema[prop];
      } else {
        result.fields[prop] = schema[prop];
      }
    }

    return result;
  }

  /**
   * Pushs new error to the errors array.
   * @param {boolean} passed
   * @param {string} template
   */
  function pushLog(passed, message) {
    // checking template name.
    if (message && typeof message === 'string') {
      // checking if state is pass  
      if (passed) {
        // checking if oppositeState
        if (oppositeState) {
          currentData.not = 'not';

          // checking pendingLevel
          if (pendingLevel) {
            logs[pendingIterator[pendingLevel]] = { message, data: Object.assign({}, currentData) };
          } else {
            throw new ValidallError(message);
          }
        } else {
          currentData.not = '';
        }
        // checking if state is an error
      } else {
        // checking if not oppositeState
        if (!oppositeState) {
          // checking pendingLevel
          if (pendingLevel) {
            logs[pendingIterator[pendingLevel]] = { message, data: Object.assign({}, currentData) };
          } else {
            throw new ValidallError(message);
          }
        }
      }
      // template name is not valid
    } else {
      throw new ValidallError('invalid_message', { message });
    }
  }

  /** Error messages templates. */
  const messages = {
    invalid_message: "message is not valid: {{message}}!",
    unknown_message: "message template name: {{templateName}}, is not found!",
    invalid_option: "invalid option type: '{{received}}' - expecting: '{{expected}}'",
    unmeasurable: "Unmeasurable value: {{value}}",
    $type: "{{fieldPath}} must {{not}} be of type '{{expected}}'",
    $is: "{{fieldPath}} must {{not}} be a valid '{{expected}}'",
    $required: "'{{fieldPath}} is {{not}} required'",
    $equals: "'{{fieldPath}}' must {{not}} equals '{{expected}}'",
    $identical: "'{{fieldPath}}' must {{not}} deeply equals '{{expected}}'",
    $gt: "'{{fieldPath}}' must {{not}} be greater than {{expected}}",
    $gte: "'{{fieldPath}}' must {{not}} be greater than or equals to {{expected}}",
    $lt: "'{{fieldPath}}' must {{not}} be less than {{expected}}",
    $lte: "'{{fieldPath}}' must {{not}} be less than or equals to {{expected}}",
    $range: "'{{fieldPath}}' must {{not}} be between '{{expected.0}}' and '{{expected.1}}'",
    $size: "'{{fieldPath}}' size must {{not}} be {{comparative}} {{expected}}",
    $regex: "'{{fieldPath}}' must {{not}} match pattern: {{expected}}",
    $in: "'{{fieldPath}}' must {{not}} include any of the following values: [{{expected}}]",
    $all: "'{{fieldPath}}' must {{not}} include all of the following values: [{{expected}}]",
    $on: "'{{fieldPath}}' must {{not}} be on date: {{expected}}",
    $before: "'{{fieldPath}}' must {{not}} be before date: {{expected}}",
    $after: "'{{fieldPath}}' must {{not}} be after date: {{expected}}",
    none: "unhandled error for operator: '{{operator}}'!"
  };

  /** Collection of function used to validate values */
  const operators = {

    /**
     * Checks the type of the source
     * @param {any} value 
     * @param {string | *} options 
     * @param {String} key Current key being validated 
     * @return {Boolean};
     */
    $type(value, options, key) {
      expect(options, ['string', 'object']);

      if (typeof options === 'string')
        if (util.type[options])
          return util.type[options](value);
        else
          throw new ValidallError('invalid option type', { expected: 'type', received: options });

      return pretest(util.getType(value), options, key + '.$type');
    },

    /**
     * Checks if value match the specified option
     * @param {any} value 
     * @param {String} type 
     * @param {String} key Current key being validated 
     * @return {Boolean}
     */
    $is(value, type, key) {
      expect(type, 'string');

      type = type.toLowerCase();

      if (util.is[type])
        return util.is[type](value);

      throw new ValidallError('invalid_option', { expected: '$is option', received: type });
    },

    /**
     * Checks if value is not undefined.
     * @param {any} value 
     * @param {Boolean} required 
     * @param {String} key Current key being validated
     * @return {Boolean}
     */
    $required(value, required, key) {
      return !required || (value && required !== undefined);
    },

    /**
     * Add a value to the current field if it was not set
     * @param {*} value 
     * @param {*} defaultValue 
     * @param {string} keyPath 
     * @return {boolean}
     */
    $default(value, defaultValue, keyPath) {
      if (!util.isSet(value)) {
        let path = keyPath.split('.').slice(1).join('.');
        util.fromPath(currentSrc, path, defaultValue, true);
      }

      return true;
    },

    /**
     * Compares two value if equals
     * @param {*} value 
     * @param {*} comparative 
     * @param {string} key 
     * @return {boolean}
     */
    $equals(value, comparative, key) {
      return util.equals(value, comparative);
    },

    /**
     * Compares two value if equals deeply
     * @param {*} value 
     * @param {*} comparative 
     * @param {string} key 
     * @return {boolean}
     */
    $identical(value, comparative, key) {
      return util.equals(value, comparative, true);
    },

    /**
     * Test value with a regular expression.
     * @param {*} value 
     * @param {RegExp | string} pattern 
     * @param {string} key
     * @return {boolean} 
     */
    $regex(value, pattern, key) {
      expect(pattern, 'regexp');

      currentData.expected = pattern.toString();
      return pattern.test(value);
    },

    /**
     * Tests if value number larger than a specific number
     * @param {*} value 
     * @param {number} number 
     * @param {String} key
     * @return {Boolean} 
     */
    $gt(value, number, key) {
      expect(number, 'number');

      return value > number;
    },

    /**
     * Tests if value number larger than or equals to a specific number
     * @param {*} value 
     * @param {number} number 
     * @param {String} key
     * @return {Boolean} 
     */
    $gte(value, number, key) {
      expect(number, 'number');

      return value >= number;
    },

    /**
     * Tests if value number less than a specific number
     * @param {*} value 
     * @param {number} number 
     * @param {String} key
     * @return {Boolean} 
     */
    $lt(value, number, key) {
      expect(number, 'number');

      return value < number;
    },

    /**
     * Tests if value number less than or equals to a specific number
     * @param {*} value 
     * @param {number} number 
     * @param {String} key
     * @return {Boolean} 
     */
    $lte(value, number, key) {
      expect(number, 'number');

      return value <= number;
    },

    /**
     * Tests if the current value number between a specific range.
     * @param {*} value 
     * @param {number[]} range 
     * @param {string} key
     * @return {Boolean}
     */
    $range(value, range, key) {
      expect(range, 'number[]');

      return (value >= range[0] && value <= range[1]);
    },

    /**
     * Checks the size of an array or object.
     * @param {*} value 
     * @param {number | *} size 
     * @param {string} key
     * @return {boolean} 
     */
    $size(value, options, key) {
      expect(options, ['number', 'object']);


      let elmSize;

      if (typeof value === 'string' || Array.isArray(value))
        elmSize = value.length;
      else if (typeof value === 'object')
        return Object.keys(value).length;
      else
        throw new ValidallError('unmeasurable');

      if (typeof options === 'number')
        return elmSize === options;
      else
        return test(elmSize, options, key + '.$size');
    },

    /**
     * Checks if the the current value shares any items with the giving list or single value.
     * @param {*} values 
     * @param {any[]} list 
     * @param {string} key 
     * @return {boolean}
     */
    $in(values, list, key) {
      expect(list, ['primitive', 'any[]']);

      values = Array.isArray(values) ? values : [values];
      list = Array.isArray(list) ? list : [list];

      for (let i = 0; i < values.length; i++)
        if (list.indexOf(values[i]) > -1)
          return true;

      return false;
    },

    /**
     * Checks if the the current value is all in the giving list.
     * @param {*} values 
     * @param {any[]} list 
     * @param {string} key
     * @return {boolean} 
     */
    $all(values, list, key) {
      expect(list, 'any[]');

      values = Array.isArray(values) ? values : [values];
      list = Array.isArray(list) ? list : [list];

      for (let i = 0; i < values.length; i++)
        if (list.indexOf(values[i]) === -1)
          return false;

      return true;
    },

    /**
     * Puts an object keys into the context
     * @param {*} value 
     * @param {number | *} size 
     * @param {string} key
     * @return {boolean}
     */
    $keys(value, options, key) {
      expect(value, 'object');
      expect(options, 'object');

      return test(Object.keys(value), options, key + ".$keys");
    },

    /**
     * Matches an equal date
     * @param {Date | string} value 
     * @param {Date | string} data
     */
    $on(value, data) {
      expect(value, 'date');
      expect(data, 'date');

      return Date.parse(value) === Date.parse(date);
    },

    /**
     * Matches an equal date;
     * @param {Date | string} value 
     * @param {Date | string} data
     */
    $before: function (value, date) {
      expect(value, 'date');
      expect(data, 'date');

      return Date.parse(value) < Date.parse(date);
    },

    /**
     * Matches an equal date;
     * @param {Date | string} value 
     * @param {Date | string} data
     */
    $after: function (value, date) {
      expect(value, 'date');
      expect(data, 'date');

      return Date.parse(value) > Date.parse(date);
    },

    /**
     * Execute a custom operator defined by the end user.
     * @param {any} value 
     * @param {Function} fn fn(value: any, key: String, pushLog: Function): Boolean
     * @param {String} key
     * @return {String} 
     */
    $fn(value, fn, key) {
      expect(fn, 'function');

      return fn(value, key);
    },

    /**
     * Loops through a list of items and test each one of them.
     * @param {*} value 
     * @param {*} options 
     * @param {string} key 
     * @return {boolean}
     */
    $each(value, options, key) {
      for (let i = 0; i < value.length; i++)
        pretest(value[i], options[0], key + '[' + i + ']');
    },

    /**
     * Negate child operators results.
     * @param {*} value 
     * @param {*} options 
     * @param {string} key 
     * @return {Boolean}
     */
    $not(value, options, key) {
      oppositeState = !oppositeState;
      let state = pretest(value, options, key);
      oppositeState = !oppositeState;
      return !state;
    },

    /**
     * Returns false when only one operator of a list is failed
     * @param {*} value 
     * @param {any[]} options 
     * @param {string} key
     * @return {boolean} 
     */
    $and(value, options, key) {
      expect(options, 'any[]');

      for (let i = 0; i < options.length; i++)
        pretest(value, options[i], key);

      return true;
    },

    /**
     * Returns true when only one operator of a list is passed
     * @param {*} value 
     * @param {any[]} options 
     * @param {string} key
     * @return {boolean} 
     */
    $or(value, options, key) {
      expect(options, 'any[]');

      let temp = pendingOperator;

      pendingOperator = "or";
      pendingLevel++;

      for (pendingIterator[pendingLevel] = 0; pendingIterator[pendingLevel] < options.length; pendingIterator[pendingLevel]++) {
        if (pretest(value, options[pendingIterator[pendingLevel]], key)) {
          pendingIterator.splice(pendingLevel--, 1);
          pendingOperator = temp;
          return true;
        }
      }

      pendingIterator.splice(pendingLevel--, 1);
      throw new ValidallError(logs);
      pendingOperator = temp;
      return false;
    },

    /**
     * Returns false when only one operator of a list is failed
     * @param {*} value 
     * @param {any[]} options 
     * @param {string} key
     * @return {boolean} 
     */
    $nor(value, options, key) {
      expect(options, 'any[]');

      let temp = pendingOperator;

      pendingOperator = "nor";
      pendingLevel++;

      for (pendingOperator[pendingLevel] = 0; pendingOperator[pendingLevel] < options.length; i++) {
        if (pretest(value, options[pendingOperator[pendingLevel]], key)) {

          pendingIterator.splice(pendingLevel--, 1);
          currentData.not = "not";
          throw new ValidallError(logs);
          pendingOperator = temp;
          return false;
        }
      }

      pendingIterator.splice(pendingLevel--, 1);
      pendingOperator = temp;
      return true;
    },

    $xor(value, options, key) {
      expect(options, 'any[]');

      let temp = pendingOperator;

      pendingOperator = "or";
      pendingLevel++;
      state = -1;

      for (pendingOperator[pendingLevel] = 0; pendingOperator[pendingLevel] < options.length; i++) {
        let currState = pretest(value, options[pendingOperator[pendingLevel]], key) ? 1 : 0;

        if (currState === 1) {
          if (state === 1) {
            pendingIterator.splice(pendingLevel--, 1);
            throw new ValidallError(logs);
            pendingOperator = temp;
            return false;
          } else {
            state = 1;
          }
        }
      }

      pendingIterator.splice(pendingLevel--, 1);
      pendingOperator = temp;
      return true;
    }
  };

  /**
   * Test src
   * @param {*} value 
   * @param {*} _operators
   * @param {string} [fieldPath]
   * @param {String} [message]
   * @return {boolean}
   */
  function test(value, _operators, fieldPath) {
    let message = _operators.$message || "";

    if (_operators.$default) {
      operators.$default(value, _operators.$default, fieldPath);
      delete _operators.$default;
    }

    if (value === undefined && !_operators.$required)
      return true;

    delete _operators.$message;

    currentData.fieldPath = fieldPath;
    currentData.received = value;

    for (let oprt in _operators) {
      currentData.operator = oprt;
      currentData.expected = _operators[oprt];

      if (message) {
        if (typeof message === 'string')
          currentMessage = message;
        else if (typeof message === 'object')
          currentMessage = message[oprt] || "";
      }


      let state = operators[oprt](value, _operators[oprt], fieldPath, currentData);

      if (currentMessage)
        currentMessage = util.compile(currentMessage, currentData);

      pushLog(state, currentMessage || oprt);

      currentMessage = pendingLevel ? currentMessage : "";

      if (!state)
        return false;
    }

    return true;
  }

  /**
   * preparations to test
   * @param {*} src 
   * @param {*} schema
   * @param {string} [fieldPath=src]
   * @return {boolean}
   */
  function pretest(src, schema, fieldPath) {
    // no schema provided
    if (schema === undefined) {
      validall.message = "invalid schema got: " + schema;
      return false;
    }

    let _operators, fields;

    if (util.type.string(schema)) {

      if (util.type[schema])
        _operators = { $type: schema };
      else
        _operators = { $equals: schema };

      fields = {};
    } else if (!util.type.object(schema)) {
      _operators = { $equals: schema };
      fields = {};
    } else if (Array.isArray(schema)) {
      _operators.$type = "any[]";
      _operators.$each = schema;
      fields = {};
    } else {
      let tmp = separateSchema(schema);
      _operators = Object.assign(tmp._operators, _operators);
      fields = tmp.fields;
    }

    if (Object.keys(fields).length)
      _operators.$type = 'object';

    if (Object.keys(_operators).length) {
      let state = test(src, _operators, fieldPath || 'root');

      if (!state)
        return false;
    }

    if (Object.keys(fields).length) {
      for (let prop in fields) {
        let field = fieldPath ? fieldPath + "." + prop : prop;
        let state = pretest(src[prop], fields[prop], field);

        if (!state)
          return false;
      }
    }

    return true;
  }

  /**
   * Validall
   * @param {*} src 
   * @param {*} schema
   * @param {string} rootName
   * @return {boolean}
   */
  function validall(src, schema, rootName) {
    currentSrc = src;
    validall.message = "";
    validall.errorMap = "";
    pendingLevel = 0;
    pendingOperator = "";
    pendingIterator = [];
    oppositeState = false;
    currentMessage = "";
    logs = [];

    try {
      pretest(src, schema, rootName || 'root');
    } catch (e) {

      if (typeof e === 'object' && !(e instanceof ValidallError)) {
        validall.message = e;
      } else if (e instanceof ValidallError) {
        validall.message = e.message;
        validall.errorMap = e.map;
      } else {
        validall.message = e;
      }

      return false;
    }

    return true;
  }

  /**
   * Extends validall with a new custorm operator.
   * @param {string} name
   * @param {string} message
   * @param {function} [operator]
   * @return {boolean}
   */
  validall.extend = function (name, message, operator) {
    if (!util.type.string(name))
      throw "operator name is invalid: " + name;

    if (name.charAt(0) !== '$')
      name = '$' + name;

    if (operators[name])
      throw "'" + name + "' already in use!";



    if (message)
      messages[name] = message;

    if (operator)
      if (!util.type.function(operator))
        throw "operator must be a function: " + operator;
      else
        operators[name] = operator;
  };

  validall.Error = ValidallError;
  validall.util = util;
  validall.expect = expect;
  validall.message = "";
  validall.errorMap = "";

  return validall;
});