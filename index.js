(function (global, factory) {
  if (typeof define === 'function' && define.amd) { // AMD
    define([], function () { return factory(); });
  } else if (typeof module !== 'undefined' && typeof exports === 'object') { // Node.js
    module.exports = factory();
  } else if (global !== undefined) { // Global variable
    global.validall = factory();
  }
})(this || window, function () {

  function compile(template, data) {
    var reg = /\{\{([\w\.]+)\}\}/g;

    return template.replace(reg, function (match, $1) {
      var parts = $1.split("."), temp;
      if (parts.length == 1) return data[parts[0]];
      temp = data[parts[0]];
      for (var i = 1; i < parts.length; i++) {
        temp = temp[parts[i]];
      }
      return temp;
    });
  }

  function fromPath(obj, path, value) {
    path = path.split('.');
    if (path.length === 1) return obj[path[0]];

    var temp = obj;
    for (var j = 0; j < path.length; j++) {
      if (!(temp = temp[path[j]])) return undefined;
      if (j === path.length - 2 && value) {
        if (temp && temp[path[j + 1]]) {
          temp[path[j + 1]] = value;
          return true;
        } else return false;
      }
      if (j === path.length - 1) return temp;
    }
  }

  function equals(arg1, arg2, deep) {
    if (arg1 instanceof Array && arg2 instanceof Array) {
      if (arg1.length !== arg2.length) return false;
      for (var i = 0; i < arg1.length; i++) {
        var pass = false;
        for (var j = 0; j < arg2.length; j++) {
          if ((deep && equals(arg1[i], arg2[j])) || (!deep && arg1[i] === arg2[j])) {
            if (equals(arg1[i], arg2[j])) {
              pass = true;
              break;
            }
          }
        }
        if (!pass) return false;
      }
      return true;
    } else if (arg1 instanceof Date && arg2 instanceof Date) {
      return arg1.toDateString() === arg2.toDateString();
    } else if (arg1 instanceof RegExp && arg2 instanceof RegExp) {
      return arg1.toString() === arg2.toString();
    } else if (arg1 instanceof Object && arg2 instanceof Object) {
      if (Object.keys(arg1).length !== Object.keys(arg2).length) return false;
      for (var prop1 in arg1) {
        if (arg1.hasOwnProperty(prop1)) {
          var pass = false;
          for (var prop2 in arg2) {
            if (arg2.hasOwnProperty(prop1)) {
              if ((deep && equals(arg1[prop1], arg2[prop2])) || (!deep && arg1[prop1] === arg2[prop2])) {
                pass = true;
                break;
              }
            }
          }
          if (!pass) return false;
        }
      }
      return true;
    } else {
      return arg1 === arg2;
    }
  }

  var messages = {
    $is: "'{{key}}' must be {{value}}",
    $equals: "'{{key}}' must equals '{{value}}'",
    $identical: "'{{key}}' must equals '{{value}}'",
    $gt: "'{{key}}' must be greater than {{value}}",
    $gte: "'{{key}}' must be greater than or equals to {{value}}",
    $lt: "'{{key}}' must be less than {{value}}",
    $lte: "'{{key}}' must be less than or equals to {{value}}",
    $inRange: "'{{key}}' must be in between {{min}} and {{max}}",
    $outOfRange: "'{{key}}' must be less than {{min}} or greater than {{max}}",
    $len: "'{{key}}' length must equals {{value}}",
    $gtLen: "'{{key}}' length must be greater than {{value}}",
    $gteLen: "'{{key}}' length must be greater than or equals to {{value}}",
    $ltLen: "'{{key}}' length must be less than {{value}}",
    $lteLen: "'{{key}}' length must be less than or equals to {{value}}",
    $inRangeLen: "'{{key}}' length must be in between {{min}} and {{max}}",
    $outOfRangeLen: "'{{key}}' length must be less than {{min}} or greater than {{max}}",
    $size: "'{{key}}' object size must equals {{value}}",
    $gtSize: "'{{key}}' object size must be greater than {{value}}",
    $gteSize: "'{{key}}' object size must be greater than or equals to {{value}}",
    $ltSize: "'{{key}}' object size must be less than {{value}}",
    $lteSize: "'{{key}}' object size must be less than or equals to {{value}}",
    $inRangeSize: "'{{key}}' object size must be in between {{min}} and {{max}}",
    $outOfRangeSize: "'{{key}}' object size must be less than {{min}} or greater than {{max}}",
    $match: "'{{key}}' must match pattern {{value}}",
    $has: "'{{key}}' must include [{{value}}]",
    $hasSome: "'{{key}}' must include at least on of the items: [{{value}}]",
    $hasNot: "'{{key}}' must not include [{{value}}]",
    $hasNotSome: "'{{key}}' must not include at least on of the items: [{{value}}]",
    $hasKeys: "'{{key}}' must include keys: [{{value}}]",
    $hasSomeKeys: "'{{key}}' must include at least on of the keys: [{{value}}]",
    $hasNotKeys: "'{{key}}' must not include keys [{{value}}]",
    $hasNotSomeKeys: "'{{key}}' must not include at least on of the keys: [{{value}}]",
    $in: "'{{key}}' all items must be included in: [{{value}}]",
    $someIn: "'{{key}}' must have at least one item included in: [{{value}}]",
    $notIn: "'{{key}}' must not have any item included in: [{{value}}]",
    $someNotIn: "'{{key}}' must have at least one item not included in: [{{value}}]",
    $onDate: "'{{key}}' must be on date: {{value}}",
    $beforeDate: "'{{key}}' must be before date: {{value}}",
    $afterDate: "'{{key}}' must be after date: {{value}}",
    none: "unhandled error!"
  };

  
  var errors = [],
    rootKey = '',
    forceAll = false,
    level = 0;

  var operators = {
    $is: function (src, type) {
      var state;
      switch (type.toLowerCase()) {
        case 'number':
          state = /^\d+$/.test(src);
          break;
        case 'string':
          state = typeof src === 'string';
          break;
        case 'boolean':
          state = typeof src === 'boolean';
          break;
        case 'date':
          state = src instanceof Date;
          break;
        case 'regexp':
          state = src instanceof RegExp;
          break;
        case 'array':
          state = Array.isArray(src);
          break;
        case 'object':
          state = typeof src === "object" && src.toString() === "[object Object]";
          break;
        case 'email':
          state = /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(src);
          break;
        case 'url':
          state = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm.test(src);
          break;
        default:
          state = false;
      }

      return state;
    },
    $fn: function (src, fn) { return fn(src); },
    $equals: function (src, value, msg) { return equals(src, value); },
    $identical: function (src, value, msg) { return equals(src, value, true); },
    $gt: function (src, value, msg) { return src > value; },
    $gte: function (src, value, msg) { return src >= value; },
    $lt: function (src, value, msg) { return src < value; },
    $lte: function (src, value, msg) { return src <= value; },
    $inRange: function (src, value, msg) { return src >= value[0] && src <= value[1]; },
    $outOfRange: function (src, value, msg) { return src < value[0] || src > value[1]; },
    $len: function (src, value, msg) { return src.length === value; },
    $gtLen: function (src, value, msg) { return src.length > value; },
    $gteLen: function (src, value, msg) { return src.length >= value; },
    $ltLen: function (src, value, msg) { return src.length < value; },
    $lteLen: function (src, value, msg) { return src.length <= value; },
    $inRangeLen: function (src, value, msg) { return src.length >= value[0] && src.length <= value[1]; },
    $outOfRangeLen: function (src, value, msg) { return src.length < value[0] || src.length > value[1]; },
    $size: function (src, value, msg) { return Object.keys(src).length === value; },
    $gtSize: function (src, value, msg) { return Object.keys(src).length > value; },
    $gteSize: function (src, value, msg) { return Object.keys(src).length >= value; },
    $ltSize: function (src, value, msg) { return Object.keys(src).length < value; },
    $lteSize: function (src, value, msg) { return Object.keys(src).length <= value; },
    $inRangeSize: function (src, value, msg) { return Object.keys(src).length >= value[0] && Object.keys(src).length <= value[1]; },
    $outOfRangeSize: function (src, value, msg) { return Object.keys(src).length < value[0] || Object.keys(src).length > value[1]; },
    $match: function (src, value, msg) { return value.test(src); },
    $has: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (Array.isArray(src)) {
        for (var i = 0; i < value.length; i++)
          if (src.indexOf(value[i]) === -1) return false;
        return true;
      }
      return false;
    },
    $hasSome: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (Array.isArray(src)) {
        for (var i = 0; i < value.length; i++)
          if (src.indexOf(value[i]) > -1) return true;
        return false;
      }

      return false;
    },
    $hasNot: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (Array.isArray(src)) {
        for (var i = 0; i < value.length; i++)
          if (src.indexOf(value[i]) > -1) return false

        return true;
      }
      return false;
    },
    $hasNotSome: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (Array.isArray(src)) {
        for (var i = 0; i < value.length; i++)
          if (src.indexOf(value[i]) === -1) return true
        return false;
      }
      return false;
    },
    $hasKeys: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (!this.$is(src, 'object')) return false;
      for (var j = 0; j < value.length; j++) {
        var path = value[j].split('.'),
          temp = src;
        for (var i = 0; i < path.length; i++) {
          if (!temp.hasOwnProperty(path[i])) return false;
          temp = temp[path[i]];
        }
      }
      return true;
    },
    $hasSomeKeys: function s(src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (!this.$is(src, 'object')) return false;
      for (var j = 0; j < value.length; j++) {
        var path = value[j].split('.'),
          temp = src;
        for (var i = 0; i < path.length; i++) {
          if (temp.hasOwnProperty(path[i])) return true;
          temp = temp[path[i]];
        }
      }
      return false;
    },
    $hasNotKeys: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (!this.$is(src, 'object')) return false;
      for (var j = 0; j < value.length; j++) {
        var path = value[j].split('.'),
          temp = src;
        for (var i = 0; i < path.length; i++) {
          if (temp.hasOwnProperty(path[i])) return false;
          temp = temp[path[i]];
        }
      }
      return true;
    },
    $hasNotSomeKeys: function (src, value, msg) {
      value = Array.isArray(value) ? value : [value];
      if (!this.$is(src, 'object')) return false;
      for (var j = 0; j < value.length; j++) {
        var path = value[j].split('.'),
          temp = src;
        for (var i = 0; i < path.length; i++) {
          if (!temp.hasOwnProperty(path[i])) return true;
          temp = temp[path[i]];
        }
      }
      return false;
    },
    $in: function (src, value, msg) {
      src = Array.isArray(src) ? src : [src];
      if (Array.isArray(value)) {
        for (var i = 0; i < src.length; i++)
          if (value.indexOf(src[i]) === -1) return false;
        return true;
      }
      return false;
    },
    $someIn: function (src, value, msg) {
      src = Array.isArray(src) ? src : [src];
      if (Array.isArray(value)) {
        for (var i = 0; i < src.length; i++)
          if (value.indexOf(src[i]) > -1) return true;
        return false;
      }
      return false;
    },
    $notIn: function (src, value, msg) {
      src = Array.isArray(src) ? src : [src];
      if (Array.isArray(value)) {
        for (var i = 0; i < src.length; i++)
          if (value.indexOf(src[i]) > -1) return false;
        return true;
      }
      return false;
    },
    $someNotIn: function (src, value, msg) {
      src = Array.isArray(src) ? src : [src];
      if (Array.isArray(value)) {
        for (var i = 0; i < src.length; i++)
          if (value.indexOf(src[i]) === -1) return true;
        return false;
      }
      return false;
    },
    $onDate: function (src, value) {
      if (isNaN(Date.parse(src)) || isNaN(Date.parse(value))) return false;
      return Date.parse(src) === Date.parse(value);
    },
    $beforeDate: function (src, value) {
      if (isNaN(Date.parse(src)) || isNaN(Date.parse(value))) return false;
      return Date.parse(src) < Date.parse(value);
    },
    $afterDate: function (src, value) {
      if (isNaN(Date.parse(src)) || isNaN(Date.parse(value))) return false;
      return Date.parse(src) > Date.parse(value);
    },
    $or: function (src, arr, key) {
      for (var i = 0; i < arr.length; i++) {
        if (exec(src, arr[i], key)) return true;
      }
      return false;
    },
    $each: function (src, options, key) {
      if (Array.isArray(src)) {
        var state = [],
            currentState;
        
        rootKey = key;
        
        for (var i = 0; i < src.length; i++) {
          rootKey = key + '[' + i + '].';
          currentState = validall.test(src[i], options);
          if (!currentState && !forceAll) return false;
          state.push(currentState);
          
        }
        
        rootKey = "";
        return state.every(function (item) { return item === true; });
      } else {
        errors.push("'" + key + "' is not an array");
        return false;
      }
    }
  };

  function exec(src, options, key) {
    var results = [];

    key = rootKey + key;

    for (var option in options) {
      if (option === '$message') continue;

      if (operators[option]) {
        var state = operators[option](src, options[option], key);
        if (!state) {
          if (options.$message) errors.push(options.$message);
          else if (options.$message === undefined && option !== '$or' && option !== '$each') {
            var message = messages[option],
              data = {};

            if (option.toLowerCase().indexOf('range') > -1) data = { key: key, min: options[option][0], max: options[option][1] };
            else if (Array.isArray(options[option]) || options[option] instanceof RegExp) data = { key: key, value: options[option].toString() };
            else if (typeof options[option] === 'object') data = { key: key, value: JSON.stringify(options[option], null, 2) };
            else data = { key: key, value: options[option] };

            if (typeof options[option] === 'function') errors.push(messages.none);
            else errors.push(compile(message, data));
          }
          if (!forceAll) return false;
        }
        
        results.push(state);
      } else return false;
    }

    return results.every(function (state) { return state; });
  }

  var validall = {    
    reset: function () {
      errors = [];
      forceAll = false;
      rootKey = '';
    },

    errors: function () {
      return errors;
    },

    test: function test(src, obj, forceAll) {
      if (!level) {
        this.reset();
        forceAll = !!forceAll;
      }
      
      level++;
      
      if (!obj || typeof obj !== 'object') return ['Invalid options'];
      var results = [];

      for (var prop in obj) {
        if (prop === '$or') {
          for (var i = 0; i < obj[prop].length; i++)
            if (test.call(this, src, obj[prop][i])) return true;

          return false;
        }

        var currentValue;

        if (prop === '$root') currentValue = src;
        else currentValue = fromPath(src, prop);

        if (currentValue === undefined) return false;
        if (typeof obj[prop] === 'object') {
          var options = obj[prop];
          results.push(exec(currentValue, options, prop));
        } else {
          var state = currentValue === obj[prop];
          results.push(state);
          if (!state) errors.push("'" + prop + "' must equals " + obj[prop]);
        }
      }
      
      level--;
      
      if (results.every(function (state) { return state; })) return true;
      else return false;
    }
  };

  return validall;
});