// src/utils/dates.js
// Date and time formatting helpers.
// All user-facing times are formatted for en-KE (Kenya) locale.

/**
 * Format a timestamp as a full date and time.
 * Example: "3 Oct 2026, 14:32"
 */
export function formatDateTime(input = Date.now()) {
  const d = toDate(input);
  if (!d) return "—";
  return d.toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a timestamp as just the date.
 * Example: "3 Oct 2026"
 */
export function formatDate(input = Date.now()) {
  const d = toDate(input);
  if (!d) return "—";
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a timestamp as just the time.
 * Example: "14:32"
 */
export function formatTime(input = Date.now()) {
  const d = toDate(input);
  if (!d) return "—";
  return d.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Relative time in a compact form.
 * Example: "just now", "5m ago", "3h ago", "2d ago"
 */
export function formatRelative(input) {
  const d = toDate(input);
  if (!d) return "—";
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 30) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

/**
 * True if the given timestamp falls on today's date (local time).
 */
export function isToday(input) {
  const d = toDate(input);
  if (!d) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/**
 * True if the timestamp is within the last N days (inclusive of today).
 */
export function isWithinDays(input, days) {
  const d = toDate(input);
  if (!d) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return d.getTime() >= cutoff;
}

/**
 * Return the ISO date string "YYYY-MM-DD" for a timestamp.
 * Useful for grouping sales by day.
 */
export function toDateKey(input = Date.now()) {
  const d = toDate(input);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Internal: accept Date, number (ms epoch), or ISO string.
function toDate(input) {
  if (input instanceof Date) return isNaN(input) ? null : input;
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d) ? null : d;
  }
  if (typeof input === "string") {
    const d = new Date(input);
    return isNaN(d) ? null : d;
  }
  return null;
}
