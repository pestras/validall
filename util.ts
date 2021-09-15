// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Types } from '@pestras/toolbox/types';
import { URL } from '@pestras/toolbox/url';
import { castOptions, isOptions } from './interfaces';

export const To = {
  lowercase: (value: string) => value.toLowerCase(),
  uppercase: (value: string) => value.toUpperCase(),
  capitalizeFirst: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
  capitalizeFirstAll: (value: string) => value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  trim: (value: string) => value.trim().replace(/\s{2,}/g, ' '),
  path: (value: string) => URL.Clean(value)
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