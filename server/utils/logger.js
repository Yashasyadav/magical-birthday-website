/**
 * logger.js
 * Formatted server request logger utility.
 */

export const logApi = (info) => {
  // Local timestamp string in format: YYYY-MM-DD HH:MM:SS
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  console.log(`\n[${timestamp}]`);
  console.log(`Feedback Received`);
  console.log(`IP: ${info.ip}`);
  console.log(`Browser: ${info.browser} (v${info.browserVersion})`);
  console.log(`Status: ${info.status}`);
  if (info.reason) {
    console.log(`Reason: ${info.reason}`);
  }
  console.log('-------------------------------------------');
};

export default { logApi };
