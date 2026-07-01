import { isValidSessionId } from '../utils/session.js';

// Cache to prevent duplicate messages (key: trimmed feedback -> value: timestamp)
const recentFeedbackCache = new Map();

// Periodic cleanup of duplicate feedback cache (older than 2 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [text, time] of recentFeedbackCache.entries()) {
    if (now - time > 120000) {
      recentFeedbackCache.delete(text);
    }
  }
}, 60000);

/**
 * Escapes HTML characters to prevent XSS injection.
 */
export const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates the feedback request body for spam, duplicates, emoji-only, session IDs, and size.
 */
export const validateFeedback = (req, res, next) => {
  const { feedback, name, sessionId, resolution } = req.body;

  // 1. Session ID validation
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: 'Invalid or missing session signature.' });
  }

  // 2. Feedback presence check
  if (typeof feedback !== 'string') {
    return res.status(400).json({ error: 'Feedback must be a text message.' });
  }

  // 3. Trim whitespace
  const trimmedFeedback = feedback.trim();
  if (trimmedFeedback.length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  // 4. Character length validation
  if (trimmedFeedback.length > 500) {
    return res.status(400).json({ error: 'Feedback cannot exceed 500 characters.' });
  }

  // 5. Reject messages containing only emojis, whitespace, or punctuation
  // Unicode properties logic: matching punctuation, spaces, and emoji ranges
  const emojiOnlyRegex = /^[\s\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}\p{Punctuation}]+$/u;
  if (emojiOnlyRegex.test(trimmedFeedback)) {
    return res.status(400).json({ error: 'Feedback must contain letters or numbers, not just emojis or spaces.' });
  }

  // 6. Reject identical duplicate messages
  const lowerFeedback = trimmedFeedback.toLowerCase();
  if (recentFeedbackCache.has(lowerFeedback)) {
    return res.status(400).json({ error: 'Spam Protection: This exact message was already submitted recently.' });
  }

  // 7. Sanitize strings
  req.body.feedback = escapeHtml(trimmedFeedback);
  req.body.name = typeof name === 'string' ? escapeHtml(name.trim()).substring(0, 80) : 'Anonymous';
  req.body.resolution = typeof resolution === 'string' ? escapeHtml(resolution.trim()).substring(0, 30) : 'Unknown';

  // Cache normalized submission text
  recentFeedbackCache.set(lowerFeedback, Date.now());

  next();
};

export default { validateFeedback, escapeHtml };
