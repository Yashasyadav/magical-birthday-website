import rateLimit from 'express-rate-limit';

/**
 * Global API Rate Limiter
 * Restricts overall request counts from a single IP to protect server resources.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // limit each IP to 60 requests per window
  message: { error: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict Feedback Submission Limiter
 * Enforces a 30-second window between consecutive submissions from the same IP.
 */
export const feedbackSubmissionLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1, // Max 1 submission every 30 seconds
  message: { error: 'Spam Protection: Please wait 30 seconds between submissions.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true, // Only count successful or valid submission requests
});

export default { apiLimiter, feedbackSubmissionLimiter };
