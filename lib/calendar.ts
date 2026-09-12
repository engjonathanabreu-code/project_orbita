export const START_DATE = '2026-09-14';
export const TOTAL_SESSIONS = 130;
export const dayLabels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
export const localDate = (d = new Date()) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(d);
export const isRest = (day: number) => day === 6 || day === 7;
export const slotKey = (week: number, day: number) =>
  `office-cw${week}-d${day}`;
const ordinal = (week: number, day: number) => (week - 1) * 5 + day;
export function plannedCoords(week: number, day: number, skipped: string[]) {
  if (
    day < 1 ||
    day > 7 ||
    week < 1 ||
    isRest(day) ||
    skipped.includes(slotKey(week, day))
  )
    return null;
  const before = new Set(
    skipped.filter((k) => {
      const m = k.match(/^office-cw(\d+)-d([1-5])$/);
      return m && ordinal(+m[1], +m[2]) < ordinal(week, day);
    }),
  );
  const n = ordinal(week, day) - before.size;
  if (n < 1 || n > TOTAL_SESSIONS) return null;
  return {
    ordinal: n,
    week: Math.floor((n - 1) / 5) + 1,
    day: ((n - 1) % 5) + 1,
  };
}
export const missionKey = (ordinal: number) => `s1-office-p${ordinal}`;
export function coords(today = localDate()) {
  const n = Math.floor(
    (Date.parse(today + 'T12:00:00-03:00') -
      Date.parse(START_DATE + 'T12:00:00-03:00')) /
      86400000,
  );
  return n < 0
    ? { week: 1, day: 1 }
    : { week: Math.floor(n / 7) + 1, day: (n % 7) + 1 };
}
export function calendarDate(week: number, day: number) {
  return new Date(
    Date.parse(START_DATE + 'T12:00:00-03:00') +
      ((week - 1) * 7 + day - 1) * 86400000,
  );
}
