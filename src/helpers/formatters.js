/**
 * formatters.js
 * Date, string, and number formatting utilities.
 */

/**
 * Format a Date object as a human-readable birthday string.
 * @param {Date} date
 * @returns {string} e.g., "June 29, 2026"
 */
export function formatBirthday(date) {
  return new Intl.DateTimeFormat('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(date);
}

/**
 * Capitalize the first letter of each word.
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/**
 * Truncate a string to maxLength, adding ellipsis if needed.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format a number as an ordinal (1st, 2nd, 3rd...).
 * @param {number} n
 * @returns {string}
 */
export function toOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Build a personalized birthday greeting.
 * @param {string} name
 * @param {number} age
 * @returns {string}
 */
export function buildBirthdayGreeting(name, age) {
  return `Happy ${toOrdinal(age)} Birthday, ${titleCase(name)}! 🎂✨`;
}
