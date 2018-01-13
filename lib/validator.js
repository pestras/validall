"use stricr";

const next = require("./privates/next");
const privates = {};

function assignInstance() {
  let id, min = 1000000, max = 9999999;

  while (true) {
    id = 1000000 + (Math.random() * (9999999 - 1000000));

    if (!privates.hasOwnProperty("" + id))
      break;
  }

  id = "" + id;
  privates[id];
  return id;
}

class Validator {

  constructor(schema, options) {
    this.id = assignInstance();
    this.schema = schema || null;
    this.src = null;
    this.error = null;

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
  }

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