export const Types = {
  get typesList() { 
    return ['number', 'int', 'float', 'string', 'boolean', 'primitive', 'date', 'regexp', 'function', 'object', 'array', 'any'];
  },

  isValidType(type: string): boolean {
    return this.typesList.indexOf(type) > -1;
  },

  number(value: any): boolean {
    return typeof value === 'number';
  },

  int(value: any): boolean {
    return (typeof value === 'number' && ("" + value).indexOf('.') === -1);
  },

  float(value: any): boolean {
    return (typeof value === 'number' && ("" + value).indexOf('.') > -1);
  },

  string(value: any): boolean {
    return typeof value === 'string';
  },

  boolean(value: any): boolean {
    return typeof value === 'boolean';
  },

  primitive(value: any): boolean {
    return (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');
  },

  date(value: any): boolean {
    return value instanceof Date;
  },

  regexp(value: any): boolean {
    return value instanceof RegExp;
  },

  function(value: any): boolean {
    return typeof value === 'function';
  },

  object(value: any): boolean {
    return value && typeof value === "object" && Object.prototype.toString.call(value) === "[object Object]";
  },

  array(value: any): boolean {
    return Array.isArray(value);
  },

  any(): boolean { return true; },

  arrayOf(type: string, value: any[]): boolean {
    let lng = type.length;

    if (type.charAt(lng - 1) === 's')
      type = type.slice(0, lng - 1);

    if (this.isValidType(type) && Array.isArray(value))
      return value.every((entry: any) => (<any>this)[type](entry));

    return false;
  },

  getTypesOf(value: any): string[] {
    let types = [];
    if (!Array.isArray(value)) {
      for (let i = 0; i < this.typesList.length; i++)
        if ((<any>this)[this.typesList[i]](value))
          types.push(this.typesList[i]);
    } else {
      types.push('array', 'any[]');
      for (let i = 0; i < this.typesList.length; i++)
        if (this.arrayOf(this.typesList[i], value))
          types.push(this.typesList[i] + '[]');

      if (this.object(value[0])) {
        types.push((value[0].constructor?.name) || 'object' + '[]');
        types.push('object[]');
      }
    }

    if (types.indexOf("object") > -1) {
      if (value.constructor) {
        types.push(value.constructor);
        types.push(value.constructor.name);

      } else {
        types.push('object');
      }
    }

    return types;
  }
}