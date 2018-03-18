"use strict";

const Types = require('./util/types');

class ValidallError {

  /**
   * Validall Error
   * @param {string} operator 
   * @param {string} path 
   * @param {string} message 
   * @param {any} got 
   */
  constructor(operator, path, message, got) {
    this.operator = operator;
    this.path = path;
    this.message = message;
    this.got;
    
    if (Types.object(got)) {
      this.got = JSON.stringify(got, null, 4);
    } else if (Types.array(got)) {
      this.got = got.map(item => {
        return Types.object(item) ? JSON.stringify(item, null, 4) : item;
      });
    } else if (Types.string(got)) {
      this.got = `${got}`
    } else {
      this.got = got;
    }
  }

  toString() {
    let output = `
      Validall Error:-`;

    if (this.operator)
      output += `
        operator: '${this.operator}'`;

    if (this.path)
      output += `
        path: '${this.path}'`;

    if (this.message)
      output += `
        message: '${this.message}'`;

    if (this.got)
      output += `
        got: ${this.got}`;

    return output;
  }
}

module.exports = ValidallError;