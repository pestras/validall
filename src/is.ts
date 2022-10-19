import { Types } from "./types";

export const Is = {
  value(val: any): boolean { return (typeof val === 'string' && !!val.trim()) && val !== undefined && val !== null; },
  notEmpty(val: any): boolean { return (Array.isArray(val) && !!val.length) || (typeof val === 'string' && !!val.trim().length) || (Types.object(val) && !!Object.keys(val).length); },
  number(val: any): boolean { return !isNaN(+val); },
  name(val: string): boolean { return /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/g.test(val); },
  email(val: string): boolean { return /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(val); },
  url(val: string): boolean { return /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$])/igm.test(val); },
  date(val: any): boolean {
    if (Types.date(val))
      return true;

    if (Types.string(val) || Types.number(val)) {
      let d = new Date(val);

      if (d.toString() === "Invalid Date")
        return false;
      
      return true;
    }

    return false;
  }
}