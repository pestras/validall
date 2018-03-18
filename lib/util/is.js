const Types = require('./types');

const is = {
  value: (value) => (typeof value === 'string' && value.trim() && value != "0") || (value !== undefined && value !== null && value !== 0),
  notEmpty: (value) => (Array.isArray(value) && value.length) || (typeof value === 'string' && value.trim().length) || (Types.object(value) && Object.keys(value).length),
  number: (value) => !isNaN(+value),
  name: (value) => /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/g.test(value),
  email: (value) => /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value),
  url: (value) => /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm.test(value),
  date: (value) => {
    if (Types.date(value))
      return true;

    if (Types.string(value) || Types.number(value)) {
      let d = new Date(value);
      if (d.toString() === "Invalid Date")
        return false;
      else
        return true;
    }

    return false;
  }
}

module.exports = is;