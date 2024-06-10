export const dateUnits = ['years', 'months', 'days'] as const;
export type DateUnit = typeof dateUnits[number];

export const getDateUnit: Record<DateUnit, (date: Date) => number> = {
  years: d => d.getFullYear(),
  months: d => d.getMonth() + 1,
  days: d => d.getDate()
};