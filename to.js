import { URL } from '@pestras/toolbox/url';
export const To = {
    lowercase(value) { return value.toLowerCase(); },
    uppercase(value) { return value.toUpperCase(); },
    capitalizeFirst(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
    capitalizeFirstAll(value) { return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); },
    trim(value) { return value.trim().replace(/\s{2,}/g, ' '); },
    path(value) { return URL.Clean(value); }
};
