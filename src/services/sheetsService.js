/**
 * sheetsService.js
 * Google Sheets API integration stub.
 * Phase N (Feedback scene) fills in the implementation.
 * All callers already use this interface — no changes needed later.
 */

/** Google Sheets Web App URL — set in environment variable */
const SHEETS_URL = import.meta.env.VITE_SHEETS_URL ?? null;

/**
 * Submit feedback data to the Google Sheets backend.
 * @param {object} data
 * @param {string} data.name
 * @param {number} data.rating  - 1–5
 * @param {string} data.message
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function submitFeedback(data) {
  if (!SHEETS_URL) {
    console.warn('[SheetsService] VITE_SHEETS_URL not configured — feedback not submitted.');
    // Return success in development so the UI flow continues
    return { success: true };
  }

  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[SheetsService] Submission failed:', error);
    return { success: false, error: error.message };
  }
}
