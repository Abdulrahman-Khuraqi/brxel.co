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

/** Groups thousands with a comma: 14000 -> "14,000". */
export function formatAmount(value) {
  return Number(value).toLocaleString("en-US");
}
