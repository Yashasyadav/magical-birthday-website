import { appendFeedbackRow } from '../services/googleSheetsService.js';
import { logApi } from '../utils/logger.js';

/**
 * Lightweight helper to parse browser, OS, and device type from user-agent string.
 */
const parseUserAgent = (ua) => {
  let browser = 'Unknown';
  let version = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  if (!ua) return { browser, version, os, device };

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  // Device type detection
  if (/mobi|android|iphone|ipad|ipod/i.test(ua)) {
    device = ua.includes('iPad') || ua.includes('tablet') ? 'Tablet' : 'Mobile';
  }

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Chromium') && !ua.includes('Edg')) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/([0-9.]+)/);
    if (match) version = match[1];
  } else if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Safari';
    const match = ua.match(/Version\/([0-9.]+)/);
    if (match) version = match[1];
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/([0-9.]+)/);
    if (match) version = match[1];
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    const match = ua.match(/Edg\/([0-9.]+)/);
    if (match) version = match[1];
  }

  return { browser, version, os, device };
};

/**
 * Controller endpoint to process feedback submissions.
 */
export const submitFeedback = async (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const clientIp = ip.split(',')[0].trim();
  const userAgent = req.headers['user-agent'] || '';

  const { browser, version: browserVersion, os, device } = parseUserAgent(userAgent);

  const {
    feedback,
    sessionId,
    resolution,
    language,
    timezone,
    utcTimestamp,
    localTimestamp,
    pageUrl,
    referrer
  } = req.body;

  const utcNow = new Date();
  const timestampStr = utcNow.toISOString().replace('T', ' ').substring(0, 19);

  // Package spreadsheet columns matching googleSheetsService schema exactly
  const rowData = [
    timestampStr,
    sessionId,
    feedback,
    browser,
    browserVersion,
    os,
    device,
    resolution || 'Unknown',
    language || 'Unknown',
    timezone || 'Unknown',
    utcTimestamp || utcNow.toISOString(),
    localTimestamp || 'Unknown',
    pageUrl || 'Unknown',
    referrer || 'Unknown'
  ];

  try {
    const result = await appendFeedbackRow(rowData);

    // Formatted server terminal logging output
    logApi({
      ip: clientIp,
      browser,
      browserVersion,
      status: 'SUCCESS'
    });

    res.status(201).json({
      success: true,
      message: 'Memory saved successfully!',
      mock: !!result.mock
    });
  } catch (error) {
    // Log failure reason to console
    logApi({
      ip: clientIp,
      browser,
      browserVersion,
      status: 'FAILED',
      reason: error.message || 'Google API Authentication Error'
    });

    next(error);
  }
};

export default { submitFeedback };
