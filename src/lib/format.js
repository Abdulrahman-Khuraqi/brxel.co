const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

/**
 * Formats an ISO date without Intl.
 *
 * `toLocaleDateString("ar-SA")` resolves to the Umm al-Qura calendar under Node
 * but to Gregorian in the browser, which desynchronises the server and client
 * renders. Formatting by hand keeps both sides identical.
 */
export function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_AR[month - 1]} ${year}`;
}


/** Formats a Date (or anything Date accepts) by its UTC calendar day, the same on server and client. */
export function formatDay(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDate(date.toISOString().slice(0, 10));
}
