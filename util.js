export function generateMessage(args, msg) {
    if (!msg)
        return null;
    if (typeof msg === 'string')
        return msg;
    return msg(args);
}
