export const APP_TIME_ZONE = "Asia/Jakarta";

const JAKARTA_OFFSET = "+07:00";
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] as const;

export const JAKARTA_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

type JakartaParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

export function now(): Date {
  return new Date();
}

function toJakartaParts(date: Date): JakartaParts {
  const shifted = new Date(date.getTime() + JAKARTA_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toJakartaDateKey(date: Date): string {
  const parts = toJakartaParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function toJakartaInputValue(date: Date): string {
  const parts = toJakartaParts(date);
  return `${toJakartaDateKey(date)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function parseJakartaInputValue(value: string): Date {
  return new Date(`${value}:00${JAKARTA_OFFSET}`);
}

export function formatJakartaDateTime(date: Date): string {
  const parts = toJakartaParts(date);
  const weekday = WEEKDAY_NAMES[parts.weekday];
  const month = MONTH_NAMES[parts.month - 1];
  return `${weekday}, ${parts.day} ${month} ${parts.year} ${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function countJakartaDaysBetween(from: Date, to: Date): number {
  const fromMidnight = Date.parse(`${toJakartaDateKey(from)}T00:00:00Z`);
  const toMidnight = Date.parse(`${toJakartaDateKey(to)}T00:00:00Z`);
  return Math.round((toMidnight - fromMidnight) / DAY_MS);
}

const LONG_WEEKDAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;
const LONG_MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;
const RELATIVE_DAY_LABELS = new Map<number, string>([
  [-1, "Kemarin"],
  [0, "Hari ini"],
  [1, "Besok"],
  [2, "Lusa"],
]);

export function formatJakartaLongDate(date: Date, reference: Date): string {
  const parts = toJakartaParts(date);
  const longDate = `${LONG_WEEKDAY_NAMES[parts.weekday]} ${parts.day} ${LONG_MONTH_NAMES[parts.month - 1]} ${parts.year}`;
  const relative = RELATIVE_DAY_LABELS.get(countJakartaDaysBetween(reference, date));
  return relative === undefined ? longDate : `${relative}, ${longDate}`;
}
