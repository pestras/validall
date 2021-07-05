import { URL } from '@pestras/toolbox/url';

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