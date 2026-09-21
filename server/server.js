import express from 'express';
import compression from 'compression';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { helmetMiddleware, corsMiddleware } from './middleware/security.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// ── Security Headers & Compression ──────────────────────────────────────────
app.use(helmetMiddleware);
app.use(compression());
app.use(corsMiddleware);

// ── Rate Limiting ───────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Body Parsers with Safe Payload Size Limits ──────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── 404 Handler for Unknown Routes ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
});

// ── Centralized Error Handling ──────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server (only if not running under test runner) ─────────────────────
let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, () => {
    console.log(`[NyayaSaar Server] Running on http://localhost:${config.port}`);
    console.log(`[NyayaSaar Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export { app, server };
