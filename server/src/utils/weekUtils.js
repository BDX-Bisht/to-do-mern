const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

/**
 * Formats a UTC-shifted Date into YYYY-MM-DD.
 */
function formatUtcDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into [year, monthIndex, day] or returns null if invalid.
 */
function parseDateString(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  return [year, month - 1, day];
}

/**
 * Normalizes a timezone offset (in minutes from Date.prototype.getTimezoneOffset).
 */
export function parseTzOffset(rawOffset) {
  const parsed = Number(rawOffset);
  if (!Number.isFinite(parsed) || parsed < -840 || parsed > 840) {
    return 0;
  }
  return Math.trunc(parsed);
}

/**
 * Returns Monday–Sunday week metadata (`weekStart`, `weekEnd`) for a given Date.
 */
export function getWeekBoundsForDate(date, tzOffsetMinutes = 0) {
  const shifted = new Date(date.getTime() - tzOffsetMinutes * MS_PER_MINUTE);
  const utcMidnightMs = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate()
  );

  const dayOfWeek = shifted.getUTCDay(); // 0 (Sun) .. 6 (Sat)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mondayMs = utcMidnightMs + diffToMonday * MS_PER_DAY;
  const sundayMs = mondayMs + 6 * MS_PER_DAY;

  return {
    weekStart: formatUtcDate(new Date(mondayMs)),
    weekEnd: formatUtcDate(new Date(sundayMs)),
  };
}

/**
 * Converts a local Monday YYYY-MM-DD string into exact UTC start/end Date bounds (Mon 00:00 -> Sun 23:59:59.999).
 */
export function getUtcRangeForLocalWeek(weekStartStr, tzOffsetMinutes = 0) {
  const parts = parseDateString(weekStartStr);
  if (!parts) return null;

  const [year, monthIndex, day] = parts;
  const localMondayStartMs = Date.UTC(year, monthIndex, day, 0, 0, 0, 0);
  const localSundayEndMs = localMondayStartMs + 7 * MS_PER_DAY - 1;

  return {
    startUtc: new Date(localMondayStartMs + tzOffsetMinutes * MS_PER_MINUTE),
    endUtc: new Date(localSundayEndMs + tzOffsetMinutes * MS_PER_MINUTE),
  };
}

/**
 * Converts a local YYYY-MM-DD string into exact UTC start/end Date bounds for that calendar day.
 */
export function getUtcRangeForLocalDate(dateStr, tzOffsetMinutes = 0) {
  const parts = parseDateString(dateStr);
  if (!parts) return null;

  const [year, monthIndex, day] = parts;
  const localStartMs = Date.UTC(year, monthIndex, day, 0, 0, 0, 0);
  const localEndMs = localStartMs + MS_PER_DAY - 1;

  return {
    startUtc: new Date(localStartMs + tzOffsetMinutes * MS_PER_MINUTE),
    endUtc: new Date(localEndMs + tzOffsetMinutes * MS_PER_MINUTE),
  };
}

