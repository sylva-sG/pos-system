// src/utils/formatPrice.js
// USD → KSh conversion and KSh formatting helpers.
// All prices from the API are in USD; the store displays KSh.

export const USD_TO_KSH = 130;

/**
 * Convert a USD amount to KSh, rounded to the nearest shilling.
 * Returns 0 for null, undefined, or non-numeric input.
 */
export function toKsh(usd) {
  const n = Number(usd);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * USD_TO_KSH);
}

/**
 * Format a KSh amount for display.
 * Example: 1500 → "KSh 1,500"
 */
export function formatKsh(ksh) {
  const n = Number(ksh);
  if (!Number.isFinite(n)) return "KSh 0";
  return `KSh ${n.toLocaleString("en-KE")}`;
}

/**
 * Convert a USD price and format it as KSh in one step.
 * Example: 10 → "KSh 1,300"
 */
export function formatPrice(usd) {
  return formatKsh(toKsh(usd));
}

/**
 * Parse a KSh display string back to a number.
 * Example: "KSh 1,500" → 1500
 * Returns 0 for invalid input.
 */
export function parseKsh(str) {
  if (typeof str === "number") return str;
  if (typeof str !== "string") return 0;
  const digits = str.replace(/[^\d.-]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Multiply a KSh unit price by a quantity and format the result.
 * Example: (1500, 3) → "KSh 4,500"
 */
export function lineTotal(kshUnitPrice, quantity) {
  const unit = Number(kshUnitPrice) || 0;
  const qty = Number(quantity) || 0;
  return formatKsh(unit * qty);
}