/**
 * config/authentication.js
 * Configuration for the Royal Gate Authentication Experience.
 * Supports multiple questions in the future.
 */

/** The birthday girl's name — used in auth + princess entrance title */
export const BIRTHDAY_GIRL_NAME = 'Bhavani';

export const AUTH_CONFIG = {
  // Current active question ID
  activeQuestion: 'who_are_you',

  // Configured questions
  questions: {
    'who_are_you': {
      dialogueSequence: [
        '✨ "Before entering the royal celebration..."',
        '✨ "The castle wishes to know..."',
        '✨ "Who are you?"'
      ],
      acceptedAnswers: ['Bhavani', 'bhavani', 'BHAVANI'],
      validationRules: {
        caseSensitive: false,
        ignoreExtraSpaces: true,
        allowPartialMatch: true,
        normalizeAnd: true,
      },
      security: {
        maximumAttempts: 5,
        lockDelayMs: 3000,
      }
    }
  }
};
