/**
 * Pushes an event onto the Google Tag Manager data layer.
 *
 * The array is created on first use, so events recorded before a tag manager
 * loads are still picked up when it does. Never pass personal data (name,
 * email, phone, free text) — only ids, steps and categorical values.
 */
export function pushDataLayer(event, payload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}
