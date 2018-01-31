"use stricr";

/**
 * types definitions
 * @typedef {{root?: string, throwMode?: boolean, strict?: boolean, filter?: boolean, required?: boolean, traceError?: boolean}} ValidatorOptions
 * @typedef {{ test: function }} Validator
 */

const next = require("./privates/next");
const Types = require('./util/types');
const privates = {};

function assignInstance() {
  let id, min = 1000000, max = 9999999;

  while (true) {
    id = 1000000 + (Math.random() * (9999999 - 1000000));

    if (!privates.hasOwnProperty("" + id))
      break;
  }

  id = "" + id;
  privates[id] = {};
  return id;
}

function saveProps(schema, path) {
  console.log(schema);

  for (let prop in schema) {
    if (prop.charAt(0) === '$')
      continue;

    if (Types.array(schema[prop]) && Types.object(schema[prop][0])) {
      let newPath = path ? `${path}.${prop}.$` : `${prop}.$`;
      saveProps.call(this, schema[prop][0], newPath);
    } else if (Types.object(schema[prop])) {
      let newPath = path ? `${path}.${prop}` : prop;
      if (schema[prop].hasOwnProperty('$props'))
        this.properties[newPath] = schema[prop].$props;
      else
        saveProps.call(this, schema[prop], newPath);

    }
  }
}

class Validator {

  /**
   * Validall Schema constructor
   * @param {*} schema 
   * @param {ValidatorOptions} options 
   */
  constructor(schema, options) {
    this.id = assignInstance();
    this.schema = schema || null;
    this.src = null;
    this.error = null;
    this.properties = {};

    options = options || {};

    this.config = {
      root: options.root || 'root',
      strict: !!options.strict,
      filter: !!options.filter,
      required: !!options.required,
      throwMode: !!options.throwMode,
      traceError: !!options.traceError
    };

    this.currentPath = this.config.root;
    this.negateMode = false;

    saveProps.call(this, this.schema);
  }

  /**
   * gets field properties or all properties if no field name provided
   * @param {string} [field]
   * @return {any} 
   */
  getProps(field) {
    if (field)
      return this.properties[field];

    return this.properties;
  }

  /**
   * validates src
   * @param {*} src 
   */
  test(src) {
    this.src = src;
    this.currentPath = this.config.root;
    this.negateMode = false;
    this.error = null;

    if (src === undefined) {
      let error = `
        Validall Error:-
          message: undefined source!
      `;

      if (this.config.throwMode) {
        if (this.config.traceError)
          console.trace(error);

        throw error;
      }

      this.error = error;

      return false;
    }

    this.src = src;

    let self = this;

    try {
      next.call(self, self.src, self.schema, self.currentPath);
    } catch (e) {
      if (this.config.throwMode) {
        if (this.config.traceError)
          console.trace(e);

        throw e;
      }

      this.error = e;
      return false;
    }

    return true;
  }
}

module.exports = Validator;