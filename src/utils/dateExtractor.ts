// Extract an expiration date from raw OCR text.
// Strategy: search near expiration keywords first, else return the latest future date found.

const MONTHS_FR: Record<string, number> = {
  janvier: 1, jan: 1, "janv": 1,
  fevrier: 2, "février": 2, fev: 2, "févr": 2,
  mars: 3,
  avril: 4, avr: 4,
  mai: 5,
  juin: 6,
  juillet: 7, juil: 7,
  aout: 8, "août": 8,
  septembre: 9, sept: 9, sep: 9,
  octobre: 10, oct: 10,
  novembre: 11, nov: 11,
  decembre: 12, "décembre": 12, dec: 12, "déc": 12,
};

const EXP_HINTS = [
  "expire le", "expire", "date d'expiration", "expiration",
  "valable jusqu", "valide jusqu", "valid until", "expiry",
  "date de fin", "échéance", "echeance", "jusqu'au",
];

const DATE_REGEX = /\b(\d{1,2})[\/\-.\s](\d{1,2}|[a-zéèêûîôàA-Z]+)[\/\-.\s](\d{2,4})\b/g;
const ISO_REGEX = /\b(20\d{2})[-\/](\d{1,2})[-\/](\d{1,2})\b/g;

function toDate(day: number, month: number | string, year: number): Date | null {
  let m: number;
  if (typeof month === "string") {
    const key = month.toLowerCase().replace(/\.$/, "");
    m = MONTHS_FR[key] ?? NaN;
  } else {
    m = month;
  }
  if (!m || m < 1 || m > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 100) year += 2000;
  const d = new Date(year, m - 1, day);
  return isNaN(d.getTime()) ? null : d;
}

function collectDates(text: string): Date[] {
  const dates: Date[] = [];
  let m: RegExpExecArray | null;
  const t = text.toLowerCase();
  DATE_REGEX.lastIndex = 0;
  while ((m = DATE_REGEX.exec(t))) {
    const d = toDate(parseInt(m[1], 10), isNaN(parseInt(m[2], 10)) ? m[2] : parseInt(m[2], 10), parseInt(m[3], 10));
    if (d) dates.push(d);
  }
  ISO_REGEX.lastIndex = 0;
  while ((m = ISO_REGEX.exec(t))) {
    const d = toDate(parseInt(m[3], 10), parseInt(m[2], 10), parseInt(m[1], 10));
    if (d) dates.push(d);
  }
  return dates;
}

export function extractExpirationDate(text: string): string | undefined {
  if (!text) return undefined;
  const lower = text.toLowerCase();

  // 1. Look for a date within 60 chars of an expiration hint
  for (const hint of EXP_HINTS) {
    const idx = lower.indexOf(hint);
    if (idx === -1) continue;
    const slice = text.slice(idx, idx + hint.length + 60);
    const dates = collectDates(slice);
    if (dates.length) return dates[0].toISOString();
  }

  // 2. Fallback: latest future date in the document
  const now = new Date();
  const future = collectDates(text).filter((d) => d > now).sort((a, b) => a.getTime() - b.getTime());
  if (future.length) return future[0].toISOString();

  return undefined;
}
