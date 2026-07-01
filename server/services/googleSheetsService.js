import { google } from 'googleapis';
import { auth, isConfigured } from '../config/googleAuth.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ensures the Google Sheet is initialized with headers and correct styling
 * if it is empty.
 */
const initializeSheetIfEmpty = async (sheets) => {
  try {
    // 1. Get first sheet metadata dynamically to prevent hardcoding sheet names
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    
    const firstSheet = spreadsheet.data.sheets[0];
    const sheetName = firstSheet.properties.title;
    const sheetId = firstSheet.properties.sheetId;

    // 2. Check if sheet is empty
    const checkRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:A2`,
    });

    const hasData = checkRes.data.values && checkRes.data.values.length > 0;
    if (hasData) {
      return { sheetName, sheetId }; // Already setup
    }

    console.log(`[Google Sheets] Empty sheet detected. Initializing tab "${sheetName}" with headers and styling...`);

    const headers = [
      'Timestamp (UTC)',
      'Session ID',
      'Feedback',
      'Browser',
      'Browser Version',
      'OS',
      'Device',
      'Resolution',
      'Language',
      'Timezone',
      'UTC Timestamp',
      'Local Timestamp',
      'Page URL',
      'Referrer'
    ];

    // 3. Write Headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:N1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] }
    });

    // 4. Batch format styling (Freeze first row, bold text, cream theme background, columns auto-size)
    const requests = [
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetId,
            gridProperties: { frozenRowCount: 1 }
          },
          fields: 'gridProperties.frozenRowCount'
        }
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: headers.length
          },
          cell: {
            userEnteredFormat: {
              textFormat: { bold: true, fontSize: 11 },
              backgroundColor: { red: 0.95, green: 0.91, blue: 0.82 }, // Pale gold/cream header background
              horizontalAlignment: 'CENTER'
            }
          },
          fields: 'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)'
        }
      },
      {
        addBanding: {
          bandedRange: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1000,
              startColumnIndex: 0,
              endColumnIndex: headers.length
            },
            rowProperties: {
              headerColor: { red: 0.91, green: 0.85, blue: 0.72 }, // Soft gold
              firstBandColor: { red: 1.0, green: 1.0, blue: 1.0 }, // White
              secondBandColor: { red: 0.98, green: 0.97, blue: 0.95 } // Soft cream alternating
            }
          }
        }
      },
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: headers.length
          }
        }
      }
    ];

    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: { requests }
      });
    } catch (formatErr) {
      console.warn('[Warning] Google Sheets formatting batchUpdate partial failure:', formatErr.message);
    }

    return { sheetName, sheetId };
  } catch (error) {
    console.error('[Error] Google Sheets initialization failed:', error.message);
    throw error;
  }
};

/**
 * Appends a row of feedback values to the spreadsheet with automatic retry & exponential backoff.
 */
export const appendFeedbackRow = async (rowData) => {
  if (!isConfigured || !auth) {
    console.log('[Google Sheets] [Mock] Mocking row append:', rowData);
    return { mock: true };
  }

  const sheets = google.sheets({ version: 'v4', auth });
  
  // Resolve target sheet name and format if empty
  const { sheetName } = await initializeSheetIfEmpty(sheets);

  const retries = 3;
  const initialDelay = 1000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${sheetName}!A:N`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] }
      });

      // Auto-resize columns on successful append to keep text legible
      try {
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
        });
        const sheetId = spreadsheet.data.sheets[0].properties.sheetId;
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          requestBody: {
            requests: [{
              autoResizeDimensions: {
                dimensions: {
                  sheetId: sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: rowData.length
                }
              }
            }]
          }
        });
      } catch {
        // Suppress secondary formatting errors to guarantee response speed
      }

      return { success: true };
    } catch (error) {
      console.warn(`[Google Sheets] Append failed (Attempt ${attempt}/${retries}):`, error.message);
      if (attempt === retries) {
        throw error; // Propagate after exhausting retries
      }
      // Exponential backoff
      await wait(initialDelay * Math.pow(2, attempt - 1));
    }
  }
};

export default { appendFeedbackRow };
