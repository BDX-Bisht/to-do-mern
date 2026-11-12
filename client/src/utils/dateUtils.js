const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Formats a Date in local time as YYYY-MM-DD.
 */
export function toLocalDateKey(input) {
  const date = input instanceof Date ? input : new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a local midnight Date.
 */
export function fromLocalDateKey(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns the Monday Date (local midnight) for the week containing `input` (Monday–Sunday).
 */
export function getMondayOfWeek(input = new Date()) {
  const date = input instanceof Date ? new Date(input) : new Date(input);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0=Sun..6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return date;
}

/**
 * Returns 7 day objects starting on Monday and ending on Sunday.
 */
export function getWeekDays(mondayDate) {
  const todayKey = toLocalDateKey(new Date());
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    const dateKey = toLocalDateKey(d);
    days.push({
      date: d,
      dateKey,
      dayShort: DAY_LABELS[d.getDay()],
      dayNum: String(d.getDate()).padStart(2, '0'),
      isToday: dateKey === todayKey,
    });
  }
  return days;
}

/**
 * Shifts a Monday Date by `deltaWeeks` (+1 or -1).
 */
export function shiftWeek(mondayDate, deltaWeeks) {
  const next = new Date(mondayDate);
  next.setDate(mondayDate.getDate() + deltaWeeks * 7);
  return next;
}

/**
 * Formats a Monday-Sunday week range, e.g. "Nov 09 – Nov 15, 2026".
 */
export function formatWeekRange(weekStartStr, weekEndStr) {
  const start = fromLocalDateKey(weekStartStr);
  const end = fromLocalDateKey(weekEndStr);
  const startLabel = `${SHORT_MONTH_NAMES[start.getMonth()]} ${String(start.getDate()).padStart(2, '0')}`;
  const endLabel = `${SHORT_MONTH_NAMES[end.getMonth()]} ${String(end.getDate()).padStart(2, '0')}, ${end.getFullYear()}`;
  return `${startLabel} – ${endLabel}`;
}

/**
 * Formats a date string matching Figma's "Friday 14, January" pattern.
 */
export function formatPrettyDate(input) {
  const date = typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)
    ? fromLocalDateKey(input)
    : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  const dayName = FULL_DAY_LABELS[date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthName = MONTH_NAMES[date.getMonth()];
  return `${dayName} ${dayNum}, ${monthName}`;
}

/**
 * Extracts HH:mm in local time from a Date or ISO string.
 */
export function toLocalTimeValue(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '09:00';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Combines YYYY-MM-DD and HH:mm local values into an ISO UTC timestamp.
 */
export function combineLocalDateAndTime(dateKey, timeStr) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
}

/**
 * Formats 24h "HH:mm" or Date into readable 12h time like "09:30 AM".
 */
export function formatTime12h(timeOrDate) {
  if (!timeOrDate) return '';
  let hours;
  let minutes;

  if (typeof timeOrDate === 'string' && /^\d{2}:\d{2}$/.test(timeOrDate)) {
    [hours, minutes] = timeOrDate.split(':').map(Number);
  } else {
    const date = new Date(timeOrDate);
    if (Number.isNaN(date.getTime())) return '';
    hours = date.getHours();
    minutes = date.getMinutes();
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

