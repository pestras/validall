import * as net from 'net';

export const stringTypes = ['email', 'URL', 'date', 'number', 'boolean', 'ip', 'ip4', 'ip6'] as const;
export type StringType = typeof stringTypes[number]


export const stringTypeMethods: Record<StringType, (value: string) => boolean> = {
  boolean: v => v === 'true' || v === 'false',
  date: v => new Date(v).toString() !== "Invalid Date",
  email: v => /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(v),
  number: v => !isNaN(+v),
  URL: v => /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$])/igm.test(v),
  ip: v => !!net.isIP(v),
  ip4: v => net.isIPv4(v),
  ip6: v => net.isIPv6(v),
};