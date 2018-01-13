"use strict";

const Validator = require('./lib/validator');
const Types = require('./lib/util/types');

/**
 * types definitions
 * @typedef {{root?: string, throwMode?: boolean, strict?: boolean, required?: boolean, traceError?: boolean}} ValidatorOptions
 * @typedef {{ test: function }} Validator
 */

/** Main instance attached to Validall function */
let instance = null;

/**
 * Validall
 * @param {*} src 
 * @param {*} schema
 * @param {ValidatorOptions} [options]
 * @return {boolean | never}
 */
function Validall(src, schema, options) {
  if (!instance) {
    instance = new Validator(schema, options);
    Object.defineProperty(Validall, 'error', {
      get: () => instance.error
    });
    return instance.test(src);
  } else {
    instance.schema = schema;
    Object.assign(instance.options, options || {});

    return instatnce.test(src);
  }
}

Validall.Schema = Validator;
Validall.Types = Types;

/** exporting Validall */
module.exports = Validall;