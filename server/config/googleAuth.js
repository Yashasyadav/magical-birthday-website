import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const validateEnv = () => {
  const missing = [];
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missing.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  if (!process.env.GOOGLE_PRIVATE_KEY) missing.push('GOOGLE_PRIVATE_KEY');
  if (!process.env.GOOGLE_SHEET_ID) missing.push('GOOGLE_SHEET_ID');

  if (missing.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`\n[Warning] Google Sheets credentials missing: ${missing.join(', ')}. Running in MOCK MODE for local testing.\n`);
      return false;
    } else {
      console.error(`\n[Error] Required environment variables missing in production: ${missing.join(', ')}\n`);
      process.exit(1);
    }
  }
  return true;
};

export const isConfigured = validateEnv();

let authClient = null;
if (isConfigured) {
  try {
    // Correctly handle JSON escaped newlines in env key
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('[Error] Google Auth initialization failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

export const auth = authClient;
export default { auth, isConfigured };
