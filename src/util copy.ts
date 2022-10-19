// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Types } from './types';
import { castOptions, isOptions } from './interfaces';

export function cleanPath(path: string) {
  if (!path)

    return "";

  path = path.trim()
    .replace(/^\/|\/$/g, "")
    .replace(/:\/\//, '%')
    .replace(/\/{2,}/g, "/")
    .replace(/(\w+)\/\.+/g, "$1")
    .replace('%', '://');

  return path;
}

export const ValidallRepo = new Map<string, any>();

export function isSchema(input: { [key: string]: any }) {
  return Object.keys(input).every(key => key.charAt(0) === '$');
}

export class ReferenceState {
  private static state: { [key: string]: Set<string> } = {};

  static HasReference(vName: string, reference: string) {
    return ReferenceState.state[vName] && ReferenceState.state[vName].has(reference);
  }

  static SetReference(vName: string, reference: string) {
    if (ReferenceState.state[vName])
      ReferenceState.state[vName].add(reference);
  }
};

export function cast(to: castOptions, value: any, expected?: isOptions) {

  if (to === 'boolean')
    return !!value;

  if (to === 'number') {
    if (expected === 'date')
      return new Date(value).getTime();

    if (Types.primitive(value)) {
      let casted = +value;

      if (isNaN(casted))
        throw `casting value: ${value} produces NaN!`;

      return casted;
    }

    throw `can't cast non primitive value to number!`;
  }

  if (to === 'string') {
    if (expected === 'date')
      return new Date(value).toLocaleDateString();

    if (Types.object(value) || Array.isArray(value))
      return JSON.stringify(value);

    return "" + value;
  }

  if (to === 'date') {
    if (Types.number(value) || Types.string(value)) {
      let d = new Date(value);

      if (d.toString() === "Invalid Date")
        throw `can't cast value: ${value} to a date`;

      return d;
    }

    if (Types.date(value))
      return value;

    throw `"can't cast ${typeof value} type value to a Date!"`;
  }

  if (to === 'regexp') {
    if (Types.primitive(value))
      return new RegExp(value);

    if (Types.regexp(value))
      return value;

    throw `"can't cast ${typeof value} type value to a Regexp!"`;
  }

  if (to === 'array')
    return Array.isArray(value) ? value : [value];

    throw `unsupported cast type ${to}`;
}

export function cleanPropPath(path: string = ""): string {
  return path
    .replace(/\[|\]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .replace(/\.{2,}/g, ".");
}

export function getValue(src: any, path = ""): any { 
  let parts = cleanPropPath(path).split('.');
  let currentField = parts.shift();

  if (!currentField) return src;
  if (!src || typeof src !== "object") return;

  if (currentField === '$') {
    if (!Array.isArray(src)) return;
    return src.map(item => getValue(item, parts.join('.')));
  }

  if (Array.isArray(src)) {
    if (!isNaN(Number(currentField))) return getValue(src[+currentField], parts.join('.'));
    else return src[currentField as 'length'];
  }

  if (parts.length === 0) return src[currentField];
  else return getValue(src[currentField], parts.join('.'));
}

export function setValue(src: any, path: string, value: any, inject?: boolean): void
export function setValue(src: any, path: string, value: (curr: any) => any, inject?: boolean): void
export function setValue(src: any, path: string, value: any | ((curr: any) => any), inject = false): void {
  let parts = cleanPropPath(path).split('.');
  let currentField = parts.shift();

  if (!src || typeof src !== "object") return undefined;

  if (currentField === '$') {
    if (!Array.isArray(src)) return;
    for (let i = 0; i < src.length; i++)
      if (parts.length === 0) {
        if (typeof value === 'function') src[i] = value(src[i]);
        else src[i] = value;
      } else setValue(src[i], parts.join('.'), value, inject);
    return;
  }

  if (parts.length === 0) {
    if (inject || src.hasOwnProperty(path)) {
      if (typeof value === 'function') src[currentField] = value(src[currentField])
      else src[currentField] = value;
      return;
    }
  }

  if (src[currentField] === undefined)
    if (inject && parts[0] !== '$') src[currentField] = !isNaN(Number(parts[0])) ? [] : {};
    else return;

  if (Array.isArray(src[currentField])) {
    if (parts[0] === '$') {
      parts.shift();
      for (let i = 0; i < src[currentField].length; i++)
        if (parts.length === 0) src[currentField][i] = value;
        else setValue(src[currentField][i], parts.join('.'), value, inject);
      return;
    }

    if (src[currentField].length === 0 && inject && parts.length > 1) src[currentField][0] = {};
    if (parts.length === 1) return setValue(src[currentField], parts[0], value, inject);
    if (!isNaN(Number(parts[0]))) return setValue(src[currentField][Number(parts[0])], parts.slice(1).join('.'), value, inject);
  }

  return setValue(src[currentField], parts.join('.'), value, inject);
} 

export function injectValue(obj: any, path: string, value: any) { return setValue(obj, path, value, true); }

export function omit(obj: any, props: string[]): any {
  for (let i = 0; i < props.length; i++) {
    let path = cleanPropPath(props[i]).split('.');

    if (path.length === 1) {
      delete obj[props[i]];
      continue;
    }

    let temp = obj;
    for (let j = 0; j < path.length; j++) {
      temp = temp[path[j]];

      if (!temp)
        break;
        
      if (j === path.length - 2) {
        delete temp[path[j + 1]];
        break;
      }
    }
  }

  return obj;
}

export function extend(dest: any, src: any, overwrite: boolean = true): any {
  if (Array.isArray(src)) {
    dest = dest || [];
    for (let i = 0; i < src.length; i++) {
      if (Object.prototype.toString.call(src[i]) === "[object Object]") {
        if ((Object.prototype.toString.call(dest[i]) !== "[object Object]" && overwrite) || dest[i] === undefined) {
          dest[i] = {};
          extend(dest[i], src[i], overwrite);
        } else if (Object.prototype.toString.call(dest[i]) === "[object Object]") {
          extend(dest[i], src[i], overwrite);
        }

      } else if (Array.isArray(src[i])) {
        if ((!Array.isArray(src[i]) && overwrite) || dest[i] === undefined) {
          dest[i] = [];
          extend(dest[i], src[i], overwrite);
        } else if (Array.isArray(src[i])) {
          extend(dest[i], src[i], overwrite);
        }

      } else if (dest[i] === undefined || overwrite) {
        dest[i] = src[i];
      }
    }
  } else {
    dest = dest || {};
    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        if (Object.prototype.toString.call(src[prop]) === "[object Object]") {
          if ((Object.prototype.toString.call(dest[prop]) !== "[object Object]" && overwrite) || dest[prop] === undefined) {
            dest[prop] = <any>{};
            extend(dest[prop], src[prop], overwrite);

          } else if (Object.prototype.toString.call(dest[prop]) === "[object Object]") {
            extend(dest[prop], src[prop], overwrite);
          }

        } else if (Array.isArray(src[prop])) {
          if ((!Array.isArray(src[prop]) && overwrite) || dest[prop] === undefined) {
            dest[prop] = <any>[];
            extend(dest[prop], src[prop], overwrite);

          } else if (Array.isArray(src[prop])) {
            extend(dest[prop], src[prop], overwrite);
          }

        } else if (dest[prop] === undefined || overwrite) {
          dest[prop] = src[prop];
        }
      }
    }
  }

  return dest;
}

export const To = {
  lowercase: (value: string) => value.toLowerCase(),
  uppercase: (value: string) => value.toUpperCase(),
  capitalizeFirst: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
  capitalizeFirstAll: (value: string) => value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  trim: (value: string) => value.trim().replace(/\s{2,}/g, ' '),
  path: (value: string) => cleanPath(value)
}

export function setOwnDeepBulkProps(src: any | any[], props: string[], value: any | ((val: any, prop: string) => any)) {

  if (typeof src !== "object" || src === null)
    return;

  for (let key in src) {
    let index = props.indexOf(key);
    
    if (index > -1) {
      (<any>src)[key] = typeof value === "function" ? value((<any>src)[key], props[index]) : value;
    } else {
      setOwnDeepBulkProps((<any>src)[key], props, value);
    }
  }
}

export function compile(template: string, ...data: { [key: string]: any }[]): string {
  let reg = /\{\{\s*([\w\.]+)\s*\}\}/g;
  let skip = data.length > 1;

  for (let i = 0; i < data.length; i++) {
    let source = data[i];
    skip = i < data.length - 1;

    template = template.replace(reg, (match: string, $1: string): string => {
      let parts = $1.split("."), temp: any;
      match = match;
  
      if (parts.length == 1) {
        let value = source[parts[0]];
        return value === undefined ? (skip ? `{{${$1}}}` : "") : value;
      }
  
      temp = source[parts[0]];
  
      for (let i = 1; i < parts.length; i++) {
        temp = temp[parts[i]];
      }
  
      return temp === undefined ? (skip ? `{{${$1}}}` : "") : temp;
    });
  }

  return template;
}