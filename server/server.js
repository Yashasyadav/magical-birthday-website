import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import feedbackRoutes from './routes/feedbackRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...parseOrigins(process.env.ALLOWED_ORIGINS),
  ...parseOrigins(process.env.FRONTEND_URL),
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean));

const isAllowedOrigin = (origin) =>
  allowedOrigins.has(origin) ||
  (process.env.NODE_ENV === 'production' && origin.endsWith('.onrender.com'));

// 1. Helmet Security Headers (including customized CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "http://localhost:3000", "http://127.0.0.1:3000"]
    }
  }
}));

// 2. CORS configurations with client whitelist
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// 3. Request size protection (Max 10 KB JSON payloads)
app.use(express.json({ limit: '10kb' }));

// 4. Rate Limiter for general endpoints
app.use('/api', apiLimiter);

// 5. Connect router
app.use('/api', feedbackRoutes);

// 6. Production Static File Server
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to React app index.html for client-side routing, excluding APIs
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // In development or if build is missing, return fallback message
      res.status(200).send("Vite App Client Dev Mode active. Navigate to http://localhost:3000/ to view.");
    }
  });
});

// 7. Error Middleware Hook
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 Express Backend Server active on port ${PORT}`);
  console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===========================================\n`);
});
