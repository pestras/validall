import { StringType } from "../types/string";

export const stringTypeMethods: Record<StringType, (value: string) => boolean> = {
  notEmpty: v => v.trim().length > 0,
  boolean: v => v === 'true' || v === 'false',
  date: v => new Date(v).toString() !== "Invalid Date",
  email: v => /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(v),
  number: v => !isNaN(+v),
  URL: v => /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$])/igm.test(v)
};