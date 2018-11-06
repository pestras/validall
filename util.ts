export  function generateMessage(args: any, msg: string | ((args: any) => string)): string {
  if (!msg)
    return null;

  if (typeof msg === 'string')
    return msg;

  return msg(args);
}