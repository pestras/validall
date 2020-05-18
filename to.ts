import {URL} from '@pestras/toolbox/url';

export const To = {
  lowercase(value: string): string { return value.toLowerCase(); },
  uppercase(value: string): string { return value.toUpperCase(); },
  capitalizeFirst(value: string): string { return value.charAt(0).toUpperCase() + value.slice(1); },
  capitalizeFirstAll(value: string): string { return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); },
  trim(value: string): string { return value.trim().replace(/\s{2,}/g, ' '); },
  path(value: string): string { return URL.Clean(value); }
}