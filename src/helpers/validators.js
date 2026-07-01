/**
 * validators.js
 * Input validation helpers for authentication and feedback forms.
 */

/**
 * Validate the secret birthday question answer.
 * Case-insensitive, trims whitespace, strips punctuation for flexible matching.
 * @param {string} input     - User's answer
 * @param {string} expected  - Correct answer
 * @returns {boolean}
 */
export function validateSecretAnswer(input, expected) {
  const normalize = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  return normalize(input) === normalize(expected);
}

/**
 * Validate that a name field is non-empty and within length limits.
 * @param {string} name
 * @param {number} [maxLength=50]
 * @returns {{ valid: boolean, message: string }}
 */
export function validateName(name, maxLength = 50) {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) return { valid: false, message: 'Name cannot be empty.' };
  if (trimmed.length > maxLength) return { valid: false, message: `Name must be under ${maxLength} characters.` };
  return { valid: true, message: '' };
}

/**
 * Validate feedback form text.
 * @param {string} text
 * @param {number} [minLength=5]
 * @param {number} [maxLength=500]
 * @returns {{ valid: boolean, message: string }}
 */
export function validateFeedback(text, minLength = 5, maxLength = 500) {
  const trimmed = text?.trim() ?? '';
  if (trimmed.length < minLength) return { valid: false, message: `Please write at least ${minLength} characters.` };
  if (trimmed.length > maxLength) return { valid: false, message: `Message must be under ${maxLength} characters.` };
  return { valid: true, message: '' };
}

/**
 * Validate a star rating (1–5).
 * @param {number} rating
 * @returns {boolean}
 */
export function validateRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
