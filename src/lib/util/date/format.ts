export function parseDate(date: string, format?: string): Date | string | null {
  if (!format) {
    const parsed = new Date(date);

    return date.toString() === 'Invalid Date'
      ? null
      : parsed;
  }

  format = format
    .replace(/%Y/g, "YYYY")
    .replace(/%m/g, "mm")
    .replace(/%d/g, "dd")
    .replace(/%H/g, "HH")
    .replace(/%M/g, "MM")
    .replace(/%S/g, "SS")
    .replace(/%L/g, "LLL");

  const yearsIndex = format.indexOf('YYYY');
  const monthsIndex = format.indexOf('mm');
  const daysIndex = format.indexOf('dd');
  const hoursIndex = format.indexOf('HH');
  const minutesIndex = format.indexOf('MM');
  const secondsIndex = format.indexOf('SS');
  const milliIndex = format.indexOf('LLL');

  const parts: number[] = [];

  parts.push(yearsIndex > -1 ? +date.slice(yearsIndex, yearsIndex + 4) || 1970 : 1970);
  parts.push(monthsIndex > -1 ? (+date.slice(monthsIndex, monthsIndex + 2) - 1) : 0);
  parts.push(daysIndex > -1 ? +date.slice(daysIndex, daysIndex + 2) || 0 : 0);
  parts.push(hoursIndex > -1 ? +date.slice(hoursIndex, hoursIndex + 2) || 0 : 0);
  parts.push(minutesIndex > -1 ? +date.slice(minutesIndex, minutesIndex + 2) || 0 : 0);
  parts.push(secondsIndex > -1 ? +date.slice(secondsIndex, secondsIndex + 2) || 0 : 0);
  parts.push(milliIndex > -1 ? +date.slice(milliIndex, milliIndex + 3) || 0 : 0);

  const output = new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]);

  return output.toString() === 'Invalid Date' ? null : output;
}